export default function ({ store, next }) {
  if (!store.getters.isAuthenticated) {
    return next('/auth')
  }
}
