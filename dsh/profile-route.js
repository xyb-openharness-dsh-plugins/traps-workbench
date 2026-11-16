/* Shared profile-write route adapter used by the local API server and the DSH integration. */
export function handleProfileWrite(method, pathname, payload, workbench) {
  if (method !== 'POST' || !['/subjects', '/profiles'].includes(pathname)) return null
  return workbench.createProfile(payload)
}
