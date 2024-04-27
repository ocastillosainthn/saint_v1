import supabase from '~/db/supabaseClient';
import { store } from '~/store'; // Importa la instancia del store Vuex

export default ({ $router }) => {
  supabase.auth.onAuthStateChange((event, session) => {
    const isAuthenticated = session !== null;
    store.commit('setAuth', isAuthenticated);

    // Si el usuario está autenticado y actualmente se encuentra en la página de login
    if (isAuthenticated && $router.currentRoute.value.path === '/login') {
      $router.push('/'); // Redirige a la página principal
    }

    // Si el usuario no está autenticado y no está en la página de login
    if (!isAuthenticated && $router.currentRoute.value.path !== '/login') {
      $router.push('/login'); // Redirige a la página de login
    }
  });
};
