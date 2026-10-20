/** Resolve localized API fields without losing compatibility with older API responses. */
export const localizedName = (entity, language = 'en', fallback = 'Product') => {
  if (!entity) return fallback;
  const value = language?.startsWith('ar')
    ? (entity.ar?.name || entity.name || entity.en?.name || entity.title)
    : (entity.en?.name || entity.name || entity.ar?.name || entity.title);
  return value || fallback;
};

export const localizedDescription = (entity, language = 'en', fallback = '') => {
  if (!entity) return fallback;
  const value = language?.startsWith('ar')
    ? (entity.ar?.description || entity.description || entity.en?.description)
    : (entity.en?.description || entity.description || entity.ar?.description);
  return value || fallback;
};
