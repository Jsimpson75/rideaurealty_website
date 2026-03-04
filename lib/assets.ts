/**
 * Base-relative URL for static assets. Use for all images and assets so the
 * site works at domain root (e.g. user.github.io) or any subpath (e.g. user.github.io/repo/).
 */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  return `${base}${path.startsWith('/') ? path.slice(1) : path}`
}

/** Returns the asset URL for an agent photo by name. */
export function getAgentPhoto(name: string): string {
  const nameLower = name.toLowerCase()
  if (nameLower.includes('zach shea')) return assetUrl('images/team/zach-shea.jpg')
  if (nameLower.includes('scott burns')) return assetUrl('images/team/scott-burns.jpg')
  if (nameLower.includes('steve wells')) return assetUrl('images/team/steve-wells.jpg')
  if (nameLower.includes('joe kozak')) return assetUrl('images/team/joe-kozak.jpg')
  if (nameLower.includes('neve wells')) return assetUrl('images/team/neve-wells.jpg')
  return assetUrl('images/team/scott-burns.jpg')
}
