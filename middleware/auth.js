// middleware/auth.js
export default function ({ store, redirect, route }) {
  const requiresAuth = route.meta.requiresAuth;

  if (requiresAuth && !store.state.isAuthenticated) {
    return redirect('/login'); // Redirige a la página de login si no está autenticado y se requiere autenticación
  }
}
