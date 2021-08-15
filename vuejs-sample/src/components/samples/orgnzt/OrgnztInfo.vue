<template>
  <div>
  <b-form style="height: 416px; max-height: 416px; overflow-x: hidden; overflow-y: scroll">
    <b-form-group label="조직명" horizontal :label-cols="3">
      <b-input type="text" placeholder="조직명" :disabled="disabled" v-model="clickedInfo.name"></b-input>
    </b-form-group>
    <b-form-group label="조직 전체명" horizontal :label-cols="3">
      <b-input type="text" placeholder="조직 전체명" :disabled="disabled" v-model="clickedInfo.fullName"></b-input>
    </b-form-group>
    <b-form-group label="지역코드" horizontal :label-cols="3">
      <b-input type="text" placeholder="지역코드" :disabled="disabled" v-model="clickedInfo.areaCode"></b-input>
    </b-form-group>
    <b-form-group label="우편번호" horizontal :label-cols="3">
      <b-input type="text" placeholder="우편번호" :disabled="disabled" v-model="clickedInfo.zipCode"></b-input>
    </b-form-group>
    <b-form-group label="주소" horizontal :label-cols="3">
      <b-input type="text" placeholder="주소" :disabled="disabled" v-model="clickedInfo.addr"></b-input>
    </b-form-group>
    <b-form-group label="주소 상세" horizontal :label-cols="3">
      <b-input type="text" placeholder="주소 상세" :disabled="disabled" v-model="clickedInfo.addrDetail"></b-input>
    </b-form-group>
    <b-form-group label="전화" horizontal :label-cols="3">
      <b-input type="text" placeholder="전화" :disabled="disabled" v-model="clickedInfo.phoneNo"></b-input>
    </b-form-group>
    <b-form-group label="전화 내선" horizontal :label-cols="3">
      <b-input type="text" placeholder="전화 내선" :disabled="disabled" v-model="clickedInfo.extensionPhoneNo"></b-input>
    </b-form-group>
    <b-form-group label="팩스" horizontal :label-cols="3">
      <b-input type="text" placeholder="팩스" :disabled="disabled" v-model="clickedInfo.faxNo"></b-input>
    </b-form-group>
    <b-form-group label="웹사이트 주소" horizontal :label-cols="3">
      <b-input type="text" placeholder="웹사이트 주소" :disabled="disabled" v-model="clickedInfo.webUrl"></b-input>
    </b-form-group>
    <b-form-group label="설명" horizontal :label-cols="3">
      <b-input type="text" placeholder="설명" :disabled="disabled" v-model="clickedInfo.dscrp"></b-input>
    </b-form-group>
    <b-form-group label="사용여부" horizontal :label-cols="3">
      <b-form-select :options="useYnOptions" :disabled="disabled" v-model="clickedInfo.useYn" class="mb-3" size="sm"></b-form-select>
    </b-form-group>
  </b-form>
    <span class="float-left mt-4">
        <b-btn variant="default" :disabled="clickedInfo.orgnztUnitNo === undefined" @click="remove">삭제</b-btn>
    </span>
    <span class="float-right mt-4">
      <b-btn variant="primary" :disabled="clickedInfo.orgnztUnitNo === undefined" @click="openModal" data-type="register">하위조직 등록</b-btn>
      <b-btn variant="default" :disabled="clickedInfo.orgnztUnitNo === undefined" @click="openModal" data-type="update">수정</b-btn>
      <b-tooltip :show.sync="clickedInfo.orgnztUnitNo === undefined" target="btnUpdate" placement="left" title="조직를 선택하세요."></b-tooltip>
    </span>
  </div>
</template>

<script>
export default {
  name: 'OrgnztInfo',
  props: ['clickedInfo'],
  data: () => {
    return {
      disabled: true,
      useYnOptions: [
        { value: '', text: '(선택)' },
        { value: 'Y', text: '예' },
        { value: 'N', text: '아니오' }
      ]
    }
  },
  methods: {
    remove () {
      this.$parent.$emit('delete')
    },

    openModal (event) {
      if (event.target.getAttribute('data-type') === 'register') {
        this.$parent.$emit('openModal', this.clickedInfo.orgnztUnitNo)
      } else if (event.target.getAttribute('data-type') === 'update') {
        this.$parent.$emit('openModal', this.clickedInfo)
      }
    }
  }
}
</script>

<style scoped>

</style>
