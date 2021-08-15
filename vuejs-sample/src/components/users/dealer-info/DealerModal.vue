<template>
  <div>
    <b-form>
      <div class="row">
        <b-form-group label="프로필사진">
          <b-img v-bind:src="this.$global.prefix+userInfoModalInfo.profilePhotoPath"/>
        </b-form-group>
      </div>
      <div class="row">
        <div class="col-md-6">
          <b-form-group label="사용자번호">
            <b-input type="text" :disabled="true" placeholder="사용자번호" v-model="userInfoModalInfo.userNo"></b-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="회원 아이디">
            <b-input type="text" :disabled="true" placeholder="회원 아이디" v-model="userInfoModalInfo.userId"></b-input>
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <b-form-group label="회원명">
            <b-input type="text" :disabled="true" placeholder="회원명" v-model="userInfoModalInfo.userName"></b-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="회원구분">
            <b-input type="text" placeholder="인증상태" v-if="userInfoModalInfo.crtfcYn === 'Y'" value="인증딜러" :readonly="true" ></b-input>
            <b-input type="text" placeholder="인증상태" v-else value="일반딜러" :readonly="true" ></b-input>
            <!--<b-input type="text" placeholder="인증상태" v-model="userInfoModalInfo.crtfcYn === 'Y' ? '인증딜러' : '일반딜러'" :readonly="true" ></b-input>-->
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="성별">
            <b-form-select v-model="userInfoModalInfo.genderCode" :options="genderCodeOptions" :disabled="true"></b-form-select>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="휴대폰번호">
            <b-input type="text" placeholder="휴대폰번호" v-model="userInfoModalInfo.cellPhoneNo" maxlength="11" :readonly="true"></b-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="내선번호">
            <b-input type="text" placeholder="내선번호" v-model="userInfoModalInfo.extnPhoneNo" maxlength="14" :readonly="true"></b-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="이메일">
            <b-input type="text" placeholder="이메일" v-model="userInfoModalInfo.email" :readonly="true"></b-input>
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <b-form-group label="인증시간">
            <b-input type="text" placeholder="인증시간" v-model="userInfoModalInfo.crtfcDt" :readonly="true"></b-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="인증취소시간">
            <b-input type="text" placeholder="인증취소시간" v-model="userInfoModalInfo.crtfcCancelDt" :readonly="true"></b-input>
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <b-form-group label="연합회">
            <b-input type="text" placeholder="연합회" v-model="userInfoModalInfo.nameLv1" :readonly="true"></b-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="조합명">
            <b-input type="text" placeholder="조합명" v-model="userInfoModalInfo.nameLv2" :readonly="true"></b-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="단지명">
            <b-input type="text" placeholder="단지명" v-model="userInfoModalInfo.nameLv3" :readonly="true"></b-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="상사명">
            <b-input type="text" placeholder="상사명" v-model="userInfoModalInfo.fullName" :readonly="true"></b-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="주소">
            <b-input type="text" placeholder="주소" v-model="userInfoModalInfo.addr" :readonly="true"></b-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="팩스 번호">
            <b-input type="text" placeholder="팩스 번호" v-model="userInfoModalInfo.faxNo" :readonly="true"></b-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="사원증 번호">
            <b-input type="text" placeholder="사원 번호" v-model="userInfoModalInfo.licenseNo" :readonly="true"></b-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="사원증 시작일">
            <b-input type="text" placeholder="사원증 시작일" v-model="userInfoModalInfo.licenseStDt" :readonly="true"></b-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="사원증 종료일">
            <b-input type="text" placeholder="사원증 종료일" v-model="userInfoModalInfo.licenseEdDt" :readonly="true"></b-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="최종 로그인일시">
            <b-input type="text" placeholder="최종 로그인일시" v-model="userInfoModalInfo.lastLoginDt" :readonly="true"></b-input>
          </b-form-group>
        </div>
      </div>
    </b-form>

    <div class="w-100">
      <!--<span class="float-left">
        <b-btn variant="default" v-if="userInfoModalInfo.userNo !== undefined" @click="removeModal">삭제</b-btn>
      </span>-->
      <span class="float-right">
          <b-btn variant="secondary" @click="closeModal">닫기</b-btn>
          <!--<b-btn variant="primary" @click="saveModal">저장</b-btn>-->
        </span>
    </div>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>

<style lang="scss">
  .default-style .flatpickr-calendar.open {
    z-index: 1100
  }
</style>

<script>
import flatPickr from 'vue-flatpickr-component'

export default{
  name: 'DealerModal',
  metaInfo: {
    title: '딜러 정보 관리'
  },
  components: {
    'flat-pickr': flatPickr
  },
  props: [
    'userInfoModalInfo',
    'genderCodeOptions'
  ],

  data () {
    return {
      flatConfig: {
        altFormat: 'Y-m-d',
        dateFormat: 'Y-m-d',
        altInput: true,
        animate: true
      }
    }
  },

  methods: {
    saveModal () {
      this.$parent.$parent.$emit('saveModal')
    },

    removeModal () {
      this.$parent.$parent.$emit('removeModal')
    },

    closeModal () {
      this.$parent.hide()
    }
  }
}
</script>
