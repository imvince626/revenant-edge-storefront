const COLLECTION_2_PRODUCT_HANDLE_RE =
  /breathe-fight-rise|fear-nothing|light-within-the-dark|no-regrets|set-your-heart-ablaze|the-fear-that-strikes-back/i;

export function isCollection2ProductHandle(handle = "") {
  return COLLECTION_2_PRODUCT_HANDLE_RE.test(handle);
}
