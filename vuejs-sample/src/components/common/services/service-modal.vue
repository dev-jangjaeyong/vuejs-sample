<template>
    <b-form>
      <div class="row">
        <div class="col-md-6" v-if="modalRowInfo.svcReqstNo !== undefined">
          <b-form-group label="요청서비스번호">
            <b-input type="text" placeholder="요청서비스번호" v-model="modalRowInfo.svcReqstNo" :readonly="true"></b-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="신청일">
            <flat-pickr v-model="modalRowInfo.svcReqstDt" ref="svcReqstDt" :config="flatConfig" :placeholder="!isIE ? '신청일' : null" />
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <b-form-group label="서비스종류">
            <!--<b-form-select v-model="modalRowInfo.svcItemCode" :options="svcItemCodeOptions" :readonly="true"></b-form-select>-->
            <b-input type="text" placeholder="서비스종류" :readonly="true" v-model="modalRowInfo.svcItemCodeName"></b-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="서비스상태">
            <b-form-select v-if="modalRowInfo.svcItemCode != 500" v-model="modalRowInfo.svcReqstStatus" :options="reqstOptions"></b-form-select>
            <b-form-select v-else v-model="modalRowInfo.svcReqstStatus" :options="consignOptions"></b-form-select>
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <b-form-group label="차량번호">
            <b-input type="text" placeholder="차량번호" v-model="modalRowInfo.carPlateNumber"></b-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="신청고객명">
            <b-input type="text" placeholder="신청고객명" v-model="modalRowInfo.svcReqstUserName"></b-input>
          </b-form-group>
        </div>
      </div>
      <b-form-group label="설명">
        <b-input type="text" placeholder="설명" v-model="modalRowInfo.dscrp"></b-input>
      </b-form-group>
      <b-form-group label="출발지 정보">
        <div class="row">
          <div class="col-md-3">
            <b-input type="text" placeholder="우편번호" v-model="modalRowInfo.frmZipCode"></b-input>
          </div>
          <div class="col-md-9">
            <b-input class="mb-2" type="text" placeholder="주소" v-model="modalRowInfo.frmAddr"></b-input>
          </div>
        </div>
        <b-input class="mb-2" type="text" placeholder="상세주소" v-model="modalRowInfo.frmAddrDetail"></b-input>
      </b-form-group>
      <b-form-group label="도착지 정보">
        <div class="row">
          <div class="col-md-3">
            <b-input type="text" placeholder="우편번호" v-model="modalRowInfo.toZipCode"></b-input>
          </div>
          <div class="col-md-9">
            <b-input class="mb-2" type="text" placeholder="주소" v-model="modalRowInfo.toAddr"></b-input>
          </div>
        </div>
        <b-input class="mb-2" type="text" placeholder="상세주소" v-model="modalRowInfo.toAddrDetail"></b-input>
      </b-form-group>
      <div class="w-100">
      <span class="float-left">
        <b-btn variant="danger" v-if="modalRowInfo.svcReqstNo" @click="deleteModal">삭제</b-btn>
      </span>
        <span class="float-right">
          <b-btn variant="default" @click="closeModal">취소</b-btn>
          <b-btn variant="primary" @click="saveModal">저장</b-btn>
        </span>
      </div>
    </b-form>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-color/vue-color.scss" lang="scss"></style>

<style lang="scss">
  .default-style .flatpickr-calendar.open {
    z-index: 1100
  }
</style>

<script>
import Type1Modal from '@/components/common/modal/Type1Modal'
import flatPickr from 'vue-flatpickr-component'

export default {
  name: 'service-modal',
  props: ['modalRowInfo', 'reqstOptions', 'consignOptions'],
  components: {
    'type1-modal': Type1Modal,
    'flat-pickr': flatPickr
  },
  data: () => ({
    flatConfig: {
      altFormat: 'Y-m-d',
      dateFormat: 'Y-m-d',
      altInput: true,
      animate: true
    }
  }),

  methods: {
    closeModal () {
      this.$parent.$parent.$emit('closeModal')
    },

    deleteModal () {
      this.$parent.$parent.$emit('deleteModal')
    },

    saveModal () {
      this.$parent.$parent.$emit('saveModal')
    }
  }
}
</script>

<style scoped>

</style>
