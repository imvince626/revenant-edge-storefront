import { z } from "zod";

export const configSchema = z.object({
  shopifyShop: z.string(),
  publicShopifyAccessToken: z.string(),
  privateShopifyAccessToken: z.string(),
  apiVersion: z.string(),
});

export const MoneyV2Result = z.object({
  amount: z.string(),
  currencyCode: z.string(),
});

export const ImageResult = z
  .object({
    altText: z.string().nullable().optional(),
    url: z.string(),
    width: z.number().positive().int(),
    height: z.number().positive().int(),
  })
  .nullable();

export const CartItemResult = z.object({
  id: z.string(),
  cost: z.object({
    amountPerQuantity: MoneyV2Result,
    subtotalAmount: MoneyV2Result,
    totalAmount: MoneyV2Result,
  }),
  merchandise: z.object({
    id: z.string(),
    title: z.string(),
    product: z.object({
      title: z.string(),
      handle: z.string(),
    }),
    image: ImageResult.nullable(),
  }),
  quantity: z.number().positive().int(),
});

export const CartResult = z
  .object({
    id: z.string(),
    cost: z.object({
      subtotalAmount: MoneyV2Result,
    }),
    checkoutUrl: z.string(),
    totalQuantity: z.number().int(),
    lines: z.object({
      nodes: z.array(CartItemResult),
    }),
  })
  .nullable();

export const VariantResult = z.object({
  id: z.string(),
  title: z.string(),
  availableForSale: z.boolean(),
  quantityAvailable: z.number().int(),
  price: MoneyV2Result,
});

export const ProductResult = z
  .object({
    id: z.string(),
    title: z.string(),
    handle: z.string(),
    images: z.object({
      nodes: z.array(ImageResult),
    }),
    variants: z.object({
      nodes: z.array(VariantResult),
    }),
    featuredImage: ImageResult.nullable(),
  })
  .nullable();

export const CollectionResult = z
  .object({
    id: z.string(),
    title: z.string(),
    handle: z.string(),
    description: z.string().nullable().optional(),
    image: ImageResult,
    products: z.object({
      nodes: z.array(ProductResult),
    }),
  })
  .nullable();

export const SeoResult = z
  .object({
    title: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

export const PageResult = z
  .object({
    id: z.string(),
    title: z.string(),
    handle: z.string(),
    body: z.string().nullable().optional(),
    bodySummary: z.string().nullable().optional(),
    seo: SeoResult,
  })
  .nullable();

export const PolicyResult = z
  .object({
    title: z.string(),
    handle: z.string(),
    body: z.string(),
  })
  .nullable();

export const ArticleResult = z
  .object({
    id: z.string(),
    title: z.string(),
    handle: z.string(),
    excerpt: z.string().nullable().optional(),
    excerptHtml: z.string().nullable().optional(),
    contentHtml: z.string().nullable().optional(),
    publishedAt: z.string().nullable().optional(),
    image: ImageResult,
    seo: SeoResult,
  })
  .nullable();

export const BlogResult = z
  .object({
    title: z.string(),
    handle: z.string(),
    seo: SeoResult,
    articles: z.object({
      nodes: z.array(ArticleResult),
    }),
  })
  .nullable();
