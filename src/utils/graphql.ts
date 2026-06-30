const CART_FRAGMENT = `#graphql
fragment cartFragment on Cart {
  id
  totalQuantity
  checkoutUrl
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 100) {
    nodes {
      id
      quantity
      merchandise {
        ...on ProductVariant {
          id
          title
          image {
            url
            altText
            width
            height
          }
          product {
            handle
            title
          }
        }
      }
      cost {
        amountPerQuantity{
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
      }
    }
  }
}
`;

const PRODUCT_FRAGMENT = `#graphql
fragment productFragment on Product {
  id
  title
  handle
  images (first: 10) {
    nodes {
      url
      width
      height
      altText
    }
  }
  variants(first: 10) {
    nodes {
      id
      title
      availableForSale
      quantityAvailable
      price {
        amount
        currencyCode
      }
    }
  }
  featuredImage {
    url
    width
    height
    altText
  }
}
`;

const PAGE_FRAGMENT = `#graphql
fragment pageFragment on Page {
  id
  title
  handle
  body
  bodySummary
  seo {
    title
    description
  }
}
`;

const ARTICLE_FRAGMENT = `#graphql
fragment articleFragment on Article {
  id
  title
  handle
  excerpt
  excerptHtml
  contentHtml
  publishedAt
  image {
    url
    width
    height
    altText
  }
  seo {
    title
    description
  }
}
`;

export const ProductsQuery = `#graphql
query ($first: Int!) {
    products(first: $first) {
      edges {
        node {
          ...productFragment
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const ProductByHandleQuery = `#graphql
  query ($handle: String!) {
    product(handle: $handle) {
      ...productFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const ProductRecommendationsQuery = `#graphql
  query ($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...productFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const CollectionByHandleQuery = `#graphql
  query ($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        width
        height
        altText
      }
      products(first: $first) {
        nodes {
          ...productFragment
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const PageByHandleQuery = `#graphql
  query ($handle: String!) {
    page(handle: $handle) {
      ...pageFragment
    }
  }
  ${PAGE_FRAGMENT}
`;

export const ShopPoliciesQuery = `#graphql
  query {
    shop {
      privacyPolicy {
        title
        handle
        body
      }
      refundPolicy {
        title
        handle
        body
      }
      shippingPolicy {
        title
        handle
        body
      }
      termsOfService {
        title
        handle
        body
      }
      subscriptionPolicy {
        title
        handle
        body
      }
    }
  }
`;

export const BlogByHandleQuery = `#graphql
  query ($handle: String!, $first: Int!) {
    blog(handle: $handle) {
      title
      handle
      seo {
        title
        description
      }
      articles(first: $first, reverse: true) {
        nodes {
          ...articleFragment
        }
      }
    }
  }
  ${ARTICLE_FRAGMENT}
`;

export const ArticleByHandleQuery = `#graphql
  query ($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      title
      handle
      articleByHandle(handle: $articleHandle) {
        ...articleFragment
      }
    }
  }
  ${ARTICLE_FRAGMENT}
`;

export const GetCartQuery = `#graphql
  query ($id: ID!) {
    cart(id: $id) {
      ...cartFragment
    }
  }
  ${CART_FRAGMENT}
`;

export const CreateCartMutation = `#graphql
  mutation ($id: ID!, $quantity: Int!) {
    cartCreate (input: { lines: [{ merchandiseId: $id, quantity: $quantity }] }) {
      cart {
        ...cartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const AddCartLinesMutation = `#graphql
  mutation ($cartId: ID!, $merchandiseId: ID!, $quantity: Int) {
    cartLinesAdd (cartId: $cartId, lines: [{ merchandiseId: $merchandiseId, quantity: $quantity }]) {
      cart {
        ...cartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const RemoveCartLinesMutation = `#graphql
  mutation ($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove (cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...cartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const CustomerCreateMutation = `#graphql
  mutation ($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        acceptsMarketing
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
