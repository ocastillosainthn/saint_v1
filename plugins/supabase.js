import supabase from '~/db/supabaseClient';
import { store } from '~/store'; // Importa la instancia del store Vuex

export default ({ $router }) => {
  supabase.auth.onAuthStateChange((event, session) => {
    const isAuthenticated = session !== null;
    store.commit('setAuth', isAuthenticated);

    const currentPath = $router.currentRoute.value.path;

    // Si el usuario está autenticado y actualmente se encuentra en la página de login
    if (isAuthenticated && currentPath === '/login') {
      $router.push('/'); // Redirige a la página principal
    }

    // Si el usuario no está autenticado y no está en la página de login ni en la de recuperación
    if (!isAuthenticated && currentPath !== '/login' && currentPath !== '/recovery' && currentPath !== '/code') {
      $router.push('/login'); // Redirige a la página de login
    }
  });
};
