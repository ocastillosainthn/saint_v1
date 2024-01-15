// store/index.js
import { createStore } from 'vuex';

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
    setAuthenticatedUser({ commit }, { isAuthenticated, user }) {
      commit('setAuth', isAuthenticated);
      commit('setUser', user);
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
