export const useNavigation = () => {
  const route = useRoute()

  /**
   * Check if current route matches the given path exactly
   */
  const isActiveRoute = (path: string): boolean => route.path === path

  return {
    isActiveRoute,
  }
}
