export type ProductMediaImage = {
  url: string;
  width: number;
  height: number;
  altText: string;
  display?: "contain" | "cover";
};

export const PRODUCT_LIFESTYLE_IMAGES: Record<string, ProductMediaImage[]> = {
  "children-of-the-sea-tee-black": [
    {
      url: "/images/product-lifestyle/children-of-the-sea-tre06140.jpg",
      width: 1080,
      height: 1350,
      altText: "Model wearing the Children of the Sea Tee back graphic",
      display: "cover",
    },
    {
      url: "/images/product-lifestyle/children-of-the-sea-tre06183.jpg",
      width: 1080,
      height: 1350,
      altText: "Model wearing the Children of the Sea Tee front graphic",
      display: "cover",
    },
  ],
  "drums-of-liberation-tee-black": [
    {
      url: "/images/product-lifestyle/drums-of-liberation-tre06097.jpg",
      width: 1080,
      height: 1350,
      altText: "Model wearing the Drums of Liberation Tee back graphic",
      display: "cover",
    },
    {
      url: "/images/product-lifestyle/drums-of-liberation-tre06052.jpg",
      width: 1080,
      height: 1350,
      altText: "Close view of the Drums of Liberation Tee back graphic worn by a model",
      display: "cover",
    },
  ],
  "empty-throne-tee-black": [
    {
      url: "/images/product-lifestyle/empty-throne-tre06000.jpg",
      width: 1080,
      height: 1350,
      altText: "Model wearing the Empty Throne Tee back graphic",
      display: "cover",
    },
  ],
  "king-of-hell-tee-black": [
    {
      url: "/images/product-lifestyle/king-of-hell-img-8942.jpg",
      width: 1024,
      height: 1536,
      altText: "Model wearing the King of Hell Tee back graphic",
      display: "cover",
    },
  ],
  "no-regrets-tee-black": [
    {
      url: "/images/product-lifestyle/no-regrets-tre05712.jpg",
      width: 1080,
      height: 1350,
      altText: "Model wearing the No Regrets Tee back graphic",
      display: "cover",
    },
    {
      url: "/images/product-lifestyle/no-regrets-tre05635.jpg",
      width: 1023,
      height: 1279,
      altText: "Close view of the No Regrets Tee front graphic worn by a model",
      display: "cover",
    },
  ],
};

export function productLifestyleImages(handle?: string | null) {
  if (!handle) return [];
  return PRODUCT_LIFESTYLE_IMAGES[handle] ?? [];
}

export function getProductCardHoverImage(handle?: string | null) {
  return productLifestyleImages(handle)[0] ?? null;
}

export function isLifestyleImage(image?: { url?: string | null; display?: string | null } | null) {
  return Boolean(
    image?.display === "cover" ||
      image?.url?.startsWith("/images/product-lifestyle/")
  );
}
