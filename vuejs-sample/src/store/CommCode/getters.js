export default {
  //시도지역조합단지상사
  fetchedSido(state){
    return state.sidos;
  },
  fetchedCity(state){
    return state.citys;
  },
  fetchedJohap(state){
    return state.johaps;
  },
  fetchedDanji(state){
    return state.danjis;
  },
  fetchedShop(state){
    return state.shops;
  },
  //검색조건
  fetchSearchParameters(state){
    return state.searchParameters;
  },
}
