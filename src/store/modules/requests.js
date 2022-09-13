import axios from 'axios';

export default {
  state() {
    return {
      requests: []
    }
  },
  mutations: {
    addRequest(state, payload) {
      state.requests.push(payload);
    }, 
    setRequests(state, payload) {
      state.requests = payload;
    } 
  },
  actions: {
    async contactCoach(context, payload) {
      const newRequest = {
        coachId: payload.coachId,
        userEmail: payload.email,
        message: payload.message,
      };

      await axios.post(`https://vue-course-http-82d72-default-rtdb.firebaseio.com/requests/${payload.coachId}.json`,
        newRequest)
        .then(data=> {
          newRequest.id = data.name;
          newRequest.coachId = payload.coachId;

          context.commit('addRequest', newRequest);
        })
        .catch(err => {
          throw new Error(err.message);
        });
    },
    async fetchRequests(context) {
      const coachId = context.rootGetters.userId;
      const token = context.rootGetters.token;
      await axios.get(`https://vue-course-http-82d72-default-rtdb.firebaseio.com/requests/${coachId}.json?auth=${token}`)
        .then(res => {
          let reqs;
          if(res.data)
            reqs = Object.values(res.data);
          else
            reqs = [];

          context.commit('setRequests', reqs)
        })
        .catch(err => {
          throw new Error(err.message);
        });
    }
  },
  getters: {
    requests(state, _getters, _rootState, rootGetters) {
      const filteredReqs = [];
      for(const req of state.requests) {
        if(req.coachId === rootGetters.userId)
          filteredReqs.push(req);
      }

      return filteredReqs;
    },
    hasRequests(_state, getters) {
      return getters.requests && getters.requests.length > 0;
    }
  }
}