// store/index.js
import { createStore } from 'vuex';
import  supabase  from '../db/supabaseClient';

export const store = createStore({
  state: {
    isAuthenticated: false,
    user: { uuid: null }, // Establece un valor predeterminado con 'uuid' a null
  },
  mutations: {
    setAuth(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated;
      
      console.log('isAuthenticated:', isAuthenticated); // Agregar este console.log
    },
    setUser(state, user) {
      console.log('user iniciado')
      state.user = user;
      console.log('user:', user); // Agregar este console.log
    },
  },
  actions: {
    async setAuthenticatedUser({ commit }, { isAuthenticated, user }) {
      commit('setAuth', isAuthenticated);
      commit('setUser', user);

      if (isAuthenticated) {
        try {
          // Consultar la tabla userData para obtener los datos basados en user.uuid
          const { data, error } = await supabase
            .from('userData')
            .select('*')
            .eq('user_id', user.uuid)
            .single(); 

          if (error) throw error;

          // Guardar el objeto obtenido de userData en el estado de Vuex
          commit('setUserData', data);
          console.log(data)
          localStorage.setItem('userData', JSON.stringify(data));
        } catch (error) {
          console.error('Error al obtener userData:', error.message);
        }
      }
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
    getUser(state) {
      return state.user;
    },
  },
});
