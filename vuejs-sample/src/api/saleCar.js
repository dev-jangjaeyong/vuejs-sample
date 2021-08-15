import $http from './../utils/http';
// function getCarlistCount(parameters){
//   return $http.get('/oncar/count', '');
// }
// function getCarlist(parameters) {
//   return $http.get('/oncar','')
// }
// export {
//   getCarlistCount,
//   getCarlist,
// }
function getCarlistCount(parameters) {
	return $http.get('/oncar/count', parameters);
}
function getCarlist(parameters) {
	return $http.get('/oncar', parameters);
}
export {getCarlistCount, getCarlist};
