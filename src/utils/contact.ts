export const normalizeTags = (tags: unknown): string[] => {
  if (Array.isArray(tags)) {
    return tags.map(String).filter(Boolean);
  }

  if (typeof tags === "string") {
    if (!tags || tags === "-") return [];
    return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
  }

  return [];
};
