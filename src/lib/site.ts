export const siteUrl = "https://rkali090.github.io/glasses-store";
export const siteName = "LumaLens Eyewear";
export const siteDescription = "Premium optical and sun frames with clear fit guidance, practical lens packages, and confident online checkout.";

export function absoluteUrl(path = "") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized === "/" ? "" : normalized}`;
}
