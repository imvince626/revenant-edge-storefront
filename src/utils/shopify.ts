import { z } from "zod";
import {
  ArticleResult,
  BlogResult,
  CartResult,
  CollectionResult,
  PageResult,
  PolicyResult,
  ProductResult,
} from "./schemas";
import { config } from "./config";
import {
  ProductsQuery,
  ProductByHandleQuery,
  CollectionByHandleQuery,
  CreateCartMutation,
  AddCartLinesMutation,
  GetCartQuery,
  RemoveCartLinesMutation,
  ProductRecommendationsQuery,
  PageByHandleQuery,
  ShopPoliciesQuery,
  BlogByHandleQuery,
  ArticleByHandleQuery,
  CustomerCreateMutation,
} from "./graphql";

// Make a request to Shopify's GraphQL API  and return the data object from the response body as JSON data.
const makeShopifyRequest = async (
  query: string,
  variables: Record<string, unknown> = {},
  buyerIP: string = ""
) => {
  const isSSR = import.meta.env.SSR;
  const apiUrl = `https://${config.shopifyShop}/api/${config.apiVersion}/graphql.json`;

  function getOptions() {
    // If the request is made from the server, we need to pass the private access token and the buyer IP
    isSSR &&
      !buyerIP &&
      console.error(
        `🔴 No buyer IP provided => make sure to pass the buyer IP when making a server side Shopify request.`
      );

    const { publicShopifyAccessToken } = config;
    const options = {
      method: "POST",
      headers: {},
      body: JSON.stringify({ query, variables }),
    };

    // Use the public Storefront token for both SSR and client-side requests.
    // It is intended for public product/cart storefront access and avoids
    // relying on platform-specific private secret bindings during deploys.
    options.headers = {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": publicShopifyAccessToken,
    };

    return options;
  }

  const response = await fetch(apiUrl, getOptions());

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${response.status} ${body}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(json.errors.map((e: Error) => e.message).join("\n"));
  }

  return json.data;
};

// Get all products or a limited number of products (default: 10)
export const getProducts = async (options: {
  limit?: number;
  buyerIP: string;
}) => {
  const { limit = 10, buyerIP } = options;

  const data = await makeShopifyRequest(
    ProductsQuery,
    { first: limit },
    buyerIP
  );
  const { products } = data;

  if (!products) {
    throw new Error("No products found");
  }

  const productsList = products.edges.map((edge: any) => edge.node);
  const ProductsResult = z.array(ProductResult);
  const parsedProducts = ProductsResult.parse(productsList);

  return parsedProducts;
};

// Get a product by its handle (slug)
export const getProductByHandle = async (options: {
  handle: string;
  buyerIP: string;
}) => {
  const { handle, buyerIP } = options;

  const data = await makeShopifyRequest(
    ProductByHandleQuery,
    { handle },
    buyerIP
  );
  const { product } = data;

  const parsedProduct = ProductResult.parse(product);

  return parsedProduct;
};

export const getProductRecommendations = async (options: {
  productId: string;
  buyerIP: string;
}) => {
  const { productId, buyerIP } = options;
  const data = await makeShopifyRequest(
    ProductRecommendationsQuery,
    {
      productId,
    },
    buyerIP
  );
  const { productRecommendations } = data;

  const ProductsResult = z.array(ProductResult);
  const parsedProducts = ProductsResult.parse(productRecommendations);

  return parsedProducts;
};

export const getPageByHandle = async (options: {
  handle: string;
  buyerIP: string;
}) => {
  const { handle, buyerIP } = options;
  const data = await makeShopifyRequest(PageByHandleQuery, { handle }, buyerIP);
  return PageResult.parse(data.page);
};

const policyFields = {
  "privacy-policy": "privacyPolicy",
  "refund-policy": "refundPolicy",
  "shipping-policy": "shippingPolicy",
  "terms-of-service": "termsOfService",
  "subscription-policy": "subscriptionPolicy",
} as const;

export const getPolicyByHandle = async (options: {
  handle: keyof typeof policyFields;
  buyerIP: string;
}) => {
  const { handle, buyerIP } = options;
  const data = await makeShopifyRequest(ShopPoliciesQuery, {}, buyerIP);
  const policy = data.shop?.[policyFields[handle]];
  return PolicyResult.parse(policy);
};

export const getBlogByHandle = async (options: {
  handle: string;
  limit?: number;
  buyerIP: string;
}) => {
  const { handle, limit = 12, buyerIP } = options;
  const data = await makeShopifyRequest(
    BlogByHandleQuery,
    { handle, first: limit },
    buyerIP
  );
  return BlogResult.parse(data.blog);
};

export const getArticleByHandle = async (options: {
  blogHandle: string;
  articleHandle: string;
  buyerIP: string;
}) => {
  const { blogHandle, articleHandle, buyerIP } = options;
  const data = await makeShopifyRequest(
    ArticleByHandleQuery,
    { blogHandle, articleHandle },
    buyerIP
  );
  const blog = data.blog;
  const article = ArticleResult.parse(blog?.articleByHandle ?? null);

  return blog && article
    ? {
        blog: {
          title: blog.title,
          handle: blog.handle,
        },
        article,
      }
    : null;
};

export const createNewsletterCustomer = async (options: {
  email: string;
  phone?: string;
  password: string;
  buyerIP: string;
}) => {
  const { email, phone, password, buyerIP } = options;
  const input: Record<string, unknown> = {
    email,
    password,
    acceptsMarketing: true,
  };

  if (phone) {
    input.phone = phone;
  }

  const data = await makeShopifyRequest(
    CustomerCreateMutation,
    { input },
    buyerIP
  );

  return data.customerCreate as {
    customer: { id: string; email: string; acceptsMarketing: boolean } | null;
    customerUserErrors: Array<{
      code?: string;
      field?: string[];
      message: string;
    }>;
  };
};

// Get a collection by its handle (slug) and return the collection with its products.
// Returns null only if the collection does not exist. An existing collection is
// returned even with 0 published products, so its image/links can still drive a
// banner or category tile. Carousels gate on product count separately (see hasRow).
export const getCollectionByHandle = async (options: {
  handle: string;
  limit?: number;
  buyerIP: string;
}) => {
  const { handle, limit = 12, buyerIP } = options;

  const data = await makeShopifyRequest(
    CollectionByHandleQuery,
    { handle, first: limit },
    buyerIP
  );
  const { collection } = data;

  // Collection not found — caller can use this to auto-skip the section
  if (!collection) {
    return null;
  }

  const parsedCollection = CollectionResult.parse(collection);

  if (!parsedCollection) {
    return null;
  }

  // Filter out any null product nodes returned by the API
  const cleanNodes = parsedCollection.products.nodes.filter(
    (node): node is NonNullable<typeof node> => node !== null
  );

  return {
    ...parsedCollection,
    products: { nodes: cleanNodes },
  };
};

// Create a cart and add a line item to it and return the cart object
export const createCart = async (id: string, quantity: number) => {
  const data = await makeShopifyRequest(CreateCartMutation, { id, quantity });
  const { cartCreate } = data;
  const { cart } = cartCreate;
  const parsedCart = CartResult.parse(cart);

  return parsedCart;
};

// Add a line item to an existing cart (by ID) and return the updated cart object
export const addCartLines = async (
  id: string,
  merchandiseId: string,
  quantity: number
) => {
  const data = await makeShopifyRequest(AddCartLinesMutation, {
    cartId: id,
    merchandiseId,
    quantity,
  });
  const { cartLinesAdd } = data;
  const { cart } = cartLinesAdd;

  const parsedCart = CartResult.parse(cart);

  return parsedCart;
};

// Remove line items from an existing cart (by IDs) and return the updated cart object
export const removeCartLines = async (id: string, lineIds: string[]) => {
  const data = await makeShopifyRequest(RemoveCartLinesMutation, {
    cartId: id,
    lineIds,
  });
  const { cartLinesRemove } = data;
  const { cart } = cartLinesRemove;
  const parsedCart = CartResult.parse(cart);

  return parsedCart;
};

// Get a cart by its ID and return the cart object
export const getCart = async (id: string) => {
  const data = await makeShopifyRequest(GetCartQuery, { id });

  const { cart } = data;
  const parsedCart = CartResult.parse(cart);

  return parsedCart;
};
