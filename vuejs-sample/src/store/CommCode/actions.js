import {

} from '../../api/';

export default {
  FETCH_SIDO_SETTING({commit}){
    return commit('SIDO_SETTING');
  },
  FETCH_CHANGE_SIDO({commit}, no){
    return commit('CHANGE_SIDO', no);
  },
  FETCH_CHANGE_CITY({commit}, no){
    return commit('CHANGE_CITY', no);
  },
  FETCH_CHANGE_DANJI({commit}, no){
    return commit('CHANGE_DANJI', no);
  },
  FETCH_CHANGE_JOHAP({commit}, no){
    return commit('CHANGE_JOHAP', no);
  },
  FETCH_CHANGE_SHOP({commit}, no){
    return commit('CHANGE_SHOP', no);
  },
}
