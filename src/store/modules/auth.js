// import axios from 'axios';

let timer;

export default {
  state() {
    return {
      userId: null,
      token: null,
      didAutoLogout: null,
    }
  },
  mutations: {
    setUser(state, payload) {
      state.token = payload.token;
      state.userId = payload.userId;
      state.didAutoLogout = false;
    },
    setAutoLogout(state) {
      state.didAutoLogout = true;
    }
  },
  actions: {
     signup(context, payload) {
      return context.dispatch('auth', {
        ...payload,
        mode: 'signup',
      })
    },
     login(context, payload) {
      return context.dispatch('auth', {
        ...payload,
        mode: 'login',
      })
    },
    logout(context) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('tokenExpiration');

      clearTimeout(timer);

      context.commit('setUser', {
        token: null,
        userId: null,
      });
    },
    async auth(context, payload) {
      const mode = payload.mode;
      let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBdBKknIwwmjxNFem_NB_VtMqTP0pudUXA';
      
      if(mode === 'signup')
        url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBdBKknIwwmjxNFem_NB_VtMqTP0pudUXA';
      
        // Axios was not working for some reason :/
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        })
       }
      );
      
      const responseData = await response.json();
      
      if(!response.ok) {
        throw new Error(responseData.message || 'Failed to authenticate');
      }

      const expiresIn = +responseData.expiresIn * 1000;
      const expirationDate = new Date().getTime() + expiresIn;

      localStorage.setItem('token', responseData.idToken);
      localStorage.setItem('userId', responseData.localId);
      localStorage.setItem('tokenExpiration', expirationDate);

      timer = setTimeout(() => {
        context.dispatch('autoLogout');
      }, expiresIn);

      context.commit('setUser', {
        token: responseData.idToken,
        userId: responseData.localId,
      });
    },
    autoLogin(context) {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const tokenExpiration = localStorage.getItem('tokenExpiration');

      const expiresIn = +tokenExpiration - new Date().getTime();

      if(expiresIn < 0)
        return;

      timer = setTimeout(() => {
        context.dispatch('autoLogout');
      }, expiresIn);

      if(token && userId) {
        context.commit('setUser', {
          token,
          userId,
        }) 
      }
    },
    autoLogout(context) {
      context.dispatch('logout');
      context.commit('setAutoLogout');
    }
  },
  getters: {
    userId(state) {
      return state.userId;
    },
    token(state) {
      return state.token;
    },
    isAuthenticated(state) {
      return !!state.token;
    },
    didAutoLogout(state) {
      return state.didAutoLogout;
    }
  }
}