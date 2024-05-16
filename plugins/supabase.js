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

   
    if (
      !isAuthenticated &&
      currentPath !== '/login' &&
      currentPath !== '/recovery' &&
      currentPath !== '/code' &&
      !currentPath.startsWith('/qr_read')
    ) {
      $router.push('/login'); 
    }



  });
};
