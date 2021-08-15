<template>
  <div>
    <b-form>
      <b-form-group class="d-none">
        <b-input type="text" v-model="modalInfo.upOrgnztUnitNo"></b-input>
      </b-form-group>
      <b-form-group label="상위 조직명" horizontal :label-cols="3" v-if="modalOpenMode === 'POST'">
        <b-input type="text" placeholder="상위 조직명" readonly v-model="modalInfo.upOrgnztUnitName"></b-input>
      </b-form-group>
      <b-form-group label="조직명" horizontal :label-cols="3">
        <b-input type="text" placeholder="조직명" v-model="modalInfo.name"></b-input>
      </b-form-group>
      <b-form-group label="조직 전체명" horizontal :label-cols="3">
        <b-input type="text" placeholder="조직 전체명" v-model="modalInfo.fullName"></b-input>
      </b-form-group>
      <b-form-group label="지역코드" horizontal :label-cols="3">
        <b-input type="text" placeholder="지역코드" v-model="modalInfo.areaCode"></b-input>
      </b-form-group>
      <b-form-group label="우편번호" horizontal :label-cols="3">
        <b-input type="text" placeholder="우편번호" v-model="modalInfo.zipCode"></b-input>
      </b-form-group>
      <b-form-group label="주소" horizontal :label-cols="3">
        <b-input type="text" placeholder="주소" v-model="modalInfo.addr"></b-input>
      </b-form-group>
      <b-form-group label="주소 상세" horizontal :label-cols="3">
        <b-input type="text" placeholder="주소 상세" v-model="modalInfo.addrDetail"></b-input>
      </b-form-group>
      <b-form-group label="전화" horizontal :label-cols="3">
        <b-input type="text" placeholder="전화" v-model="modalInfo.phoneNo"></b-input>
      </b-form-group>
      <b-form-group label="전화 내선" horizontal :label-cols="3">
        <b-input type="text" placeholder="전화 내선" v-model="modalInfo.extensionPhoneNo"></b-input>
      </b-form-group>
      <b-form-group label="팩스" horizontal :label-cols="3">
        <b-input type="text" placeholder="팩스" v-model="modalInfo.faxNo"></b-input>
      </b-form-group>
      <b-form-group label="웹사이트 주소" horizontal :label-cols="3">
        <b-input type="text" placeholder="웹사이트 주소" v-model="modalInfo.webUrl"></b-input>
      </b-form-group>
      <b-form-group label="설명" horizontal :label-cols="3">
        <b-input type="text" placeholder="설명" v-model="modalInfo.dscrp"></b-input>
      </b-form-group>
      <b-form-group label="사용여부" horizontal :label-cols="3">
        <b-form-select :options="useYnOptions" v-model="modalInfo.useYn"></b-form-select>
      </b-form-group>
    </b-form>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>

<script>
import flatPickr from 'vue-flatpickr-component'

export default {
  name: 'OrgnztModal',
  components: {
    flatPickr
  },
  props: ['modalInfo', 'modalOpenMode'],
  data () {
    return {
      useYnOptions: [
        { value: '', text: '(선택)' },
        { value: 'Y', text: '예' },
        { value: 'N', text: '아니오' }
      ]
    }
  }
}
</script>
