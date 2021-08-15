<template>
  <div>
    <div v-if="clickedMenuInfo.menuNo === undefined" class="card text-center bg-transparent border-primary text-primary mt-4">
      <div class="card-body">
        메뉴를 선택하세요.
      </div>
    </div>
    <b-card-body>
      <b-form v-if="clickedMenuInfo.menuNo !== undefined">
        <b-form-group label="상위메뉴명" horizontal :label-cols="3">
          <b-input type="text" :disabled="disabled" v-model="clickedMenuInfo.parentMenuName"></b-input>
        </b-form-group>
        <b-form-group label="메뉴명" horizontal :label-cols="3">
          <b-input type="text" placeholder="메뉴명" :disabled="disabled" v-model="clickedMenuInfo.menuName"></b-input>
        </b-form-group>
        <b-form-group label="메뉴URL" horizontal :label-cols="3">
          <b-input type="text" placeholder="메뉴URL" :disabled="disabled" v-model="clickedMenuInfo.menuUrl"></b-input>
        </b-form-group>
        <b-form-group label="메뉴타입" horizontal :label-cols="3">
          <b-input type="text" placeholder="메뉴타입" :disabled="disabled" v-model="clickedMenuInfo.menuTyCdName"></b-input>
        </b-form-group>
        <b-form-group label="설명" horizontal :label-cols="3">
          <b-input type="text" placeholder="설명" :disabled="disabled" v-model="clickedMenuInfo.dscrp"></b-input>
        </b-form-group>
        <b-form-group label="정렬번호" horizontal :label-cols="3">
          <b-input type="text" placeholder="정렬번호" :disabled="disabled" v-model="clickedMenuInfo.sortNo"></b-input>
        </b-form-group>
        <b-form-group label="사용시작일자" horizontal :label-cols="3">
          <b-input type="text" placeholder="사용시작일자" :disabled="disabled" v-model="clickedMenuInfo.useStDt"></b-input>
        </b-form-group>
        <b-form-group label="사용종료일자" horizontal :label-cols="3">
          <b-input type="text" placeholder="사용종료일자" :disabled="disabled" v-model="clickedMenuInfo.useEdDt"></b-input>
        </b-form-group>
      </b-form>
    </b-card-body>
    <b-card-footer>
      <div class="text-right">
        <b-btn id="btnUpdate" variant="primary" v-if="clickedMenuInfo.menuNo !== undefined" @click="openModal">수정하기</b-btn>
        <!--<b-tooltip :show.sync="clickedMenuInfo.menuNo === undefined" target="btnUpdate" placement="left" title="메뉴를 선택하세요."></b-tooltip>-->
      </div>
    </b-card-footer>
  </div>
</template>

<script>
export default {
  name: 'MenuInfo',
  props: ['clickedMenuInfo'],
  data: () => {
    return {
      disabled: true
    }
  },
  methods: {
    empty () {
      this.disabled = true
    },

    openModal () {
      if (this.clickedMenuInfo.menuNo) {
        this.$parent.$emit('openModal', this.clickedMenuInfo.menuNo)
      }
    }
  }
}
</script>

<style scoped>

</style>
