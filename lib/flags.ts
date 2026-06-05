/**
 * Temporary feature flags.
 *
 * `garden` controls the private personal space ("Garden") in the navigation.
 * It's shown to everyone while the route is being built. Once auth is wired up,
 * replace this flag check with a real "is the user signed in?" check so the
 * section only appears for logged-in users.
 */
export const FEATURES = {
  garden: true,
} as const;
