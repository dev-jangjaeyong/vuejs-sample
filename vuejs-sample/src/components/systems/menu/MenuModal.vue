<template>
  <div>
    <b-form>
      <b-form-group class="d-none">
        <b-input type="text" v-model="menuInfo.upMenuNo"></b-input>
      </b-form-group>
      <b-form-group label="메뉴명" horizontal :label-cols="2">
        <b-input type="text" placeholder="메뉴명" ref="menuName" v-model="menuInfo.menuName"></b-input>
      </b-form-group>
      <b-form-group label="메뉴URL" horizontal :label-cols="2">
        <b-input type="text" placeholder="메뉴URL" ref="menuUrl" v-model="menuInfo.menuUrl"></b-input>
      </b-form-group>
      <b-form-group label="메뉴타입" horizontal :label-cols="2">
        <b-select v-model="menuInfo.menuTyCd" :options="menuType" ref="menuTyCd">
          <option value="" disabled v-if="!menuInfo.menuTyCd">메뉴타입을 선택하세요</option>
        </b-select>
      </b-form-group>
      <b-form-group label="설명" horizontal :label-cols="2">
        <b-input type="text" placeholder="설명" ref="dscrp" v-model="menuInfo.dscrp"></b-input>
      </b-form-group>
      <b-form-group label="정렬번호" horizontal :label-cols="2">
        <b-input type="text" placeholder="정렬번호" ref="sortNo" v-model="menuInfo.sortNo"></b-input>
      </b-form-group>
      <b-form-group label="사용시작일자" horizontal :label-cols="2">
        <flat-pickr v-model="menuInfo.useStDt" ref="useStDt" :config="flatConfig" :placeholder="!isIE ? 'Range picker' : null" />
      </b-form-group>
      <b-form-group label="사용종료일자" horizontal :label-cols="2">
        <flat-pickr v-model="menuInfo.useEdDt" ref="useEdDt" :config="flatConfig" :placeholder="!isIE ? 'Range picker' : null" />
      </b-form-group>
    </b-form>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>

<style>
  .default-style .flatpickr-calendar.open {
    z-index: 1100
  }
</style>

<script>
import flatPickr from 'vue-flatpickr-component'

export default {
  name: 'MenuModal',
  props: ['menuInfo'],
  components: {
    flatPickr
  },
  data () {
    return {
      flatConfig: {
        altFormat: 'Y-m-d',
        dateFormat: 'Y-m-d',
        altInput: true,
        animate: true
      },
      menuType: {}
    }
  },
  methods: {
    loadMenuTypeCombo () {
      this.$http.get('/code/combo?codeLv2=MENU_TY_CD&lv=3')
        .then(
          (result) => {
            this.menuType = result.data.resultList
          }
        )
    }
  },
  created () {
    this.loadMenuTypeCombo()
  }
}
</script>
