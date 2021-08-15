// import Vue from 'vue'
import {Validator} from 'vee-validate'

const VeeValidatePlugin = {
  install (Vue) {
    const validator = new Validator()
    Object.defineProperties(Vue.prototype, {
      $validator: {
        get () {
          return validator
        }
      }
    })
    // errors를 computed로 했을 경우
    // 캐싱되어서 그런지 에러 검사 후 표시가 되지 않음
    Vue.mixin({
      data () {
        return {
          errors: validator.errorBag
        }
      }
    })
  }
}
export default VeeValidatePlugin
