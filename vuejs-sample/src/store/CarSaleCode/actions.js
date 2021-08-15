import {
  getCarlistCount,
  getCarlist,
} from '../../api/saleCar';

export default {
  FETCH_CAR_LIST({commit}, parameters) {
    console.log("car들어옴", parameters);
    getCarlistCount(parameters).then(res => commit('CAR_TOTAL_CNT', res.data));
    return getCarlist(parameters).then(res => commit('CAR_LIST', res.data));
  },

}
