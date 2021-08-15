<template>
  <div>
    <b-form>
      <b-form-group label="사용자번호" horizontal :label-cols="2" v-if="mode === 'PUT'">
        <b-input type="text" :disabled="true" placeholder="사용자번호" v-model="userInfoModalInfo.userNo"></b-input>
      </b-form-group>
      <b-form-group label="아이디" horizontal :label-cols="2" v-if="mode === 'PUT'">
        <b-input type="text" :disabled="true" placeholder="회원 아이디" v-model="userInfoModalInfo.userId"></b-input>
      </b-form-group>
      <b-form-group label="아이디" horizontal :label-cols="2" v-else>
        <b-input type="text"  placeholder="아이디를 입력해주세요." v-model="userInfoModalInfo.userId"></b-input>
        <b-button type ="button" @click="dupchk">중복체크</b-button>
      </b-form-group>
      <b-form-group label="관리자명" horizontal :label-cols="2" v-if="mode === 'PUT'">
        <b-input type="text" :disabled="true" placeholder="관리자명" v-model="userInfoModalInfo.userName"></b-input>
      </b-form-group>
      <b-form-group label="관리자명" horizontal :label-cols="2" v-else>
        <b-input type="text" placeholder="이름을 입력해주세요." v-model="userInfoModalInfo.userName"></b-input>
      </b-form-group>
      <b-form-group label="비밀번호" horizontal :label-cols="2" v-if="mode === 'POST'">
        <b-input type="password" placeholder="비밀번호를 입력해주세요." v-model="userInfoModalInfo.userPassword"></b-input>
      </b-form-group>
      <b-form-group label="비밀번호 확인" horizontal :label-cols="2" v-if="mode === 'POST'">
        <b-input type="password" placeholder="비밀번호를 동일하게 입력해주세요." v-model="userInfoModalInfo.password2"></b-input>
      </b-form-group>
      <b-form-group label="회원구분" horizontal :label-cols="2" v-if="mode === 'PUT'">
        <b-input type="text" :disabled="true" placeholder="회원구분" v-model="userInfoModalInfo.userTyCdName"></b-input>
      </b-form-group>
      <b-form-group label="성별" horizontal :label-cols="2">
        <b-form-select v-if="userInfoModalInfo.genderCode === ''" v-model="genderCodeOptions[0].value" :options="genderCodeOptions"></b-form-select>
        <b-form-select v-else v-model="userInfoModalInfo.genderCode" :options="genderCodeOptions"></b-form-select>
        <!--<b-form-select v-model="userInfoModalInfo.genderCode === '' ? userInfoModalInfo.genderCode=genderCodeOptions[0].value : userInfoModalInfo.genderCode" :options="genderCodeOptions"></b-form-select>-->
      </b-form-group>
      <b-form-group label="휴대폰번호" horizontal :label-cols="2">
        <b-input type="text" placeholder="휴대폰번호를 입력해주세요." v-model="userInfoModalInfo.cellPhoneNo" maxlength="13"></b-input>
      </b-form-group>
      <b-form-group label="이메일" horizontal :label-cols="2">
        <b-input type="text" placeholder="이메일을 입력해주세요." v-model="userInfoModalInfo.email"></b-input>
      </b-form-group>
      <b-form-group label="회원상태" horizontal :label-cols="2" v-if="mode === 'PUT'">
        <b-form-select v-if="userInfoModalInfo.userStatus === ''" v-model="userStatusCodeOptions[0].value" :options="userStatusCodeOptions"></b-form-select>
        <b-form-select v-else v-model="userInfoModalInfo.userStatus" :options="userStatusCodeOptions"></b-form-select>
        <!--<b-form-select v-model="userInfoModalInfo.userStatus === '' ? userInfoModalInfo.userStatus=userStatusCodeOptions[0].value : userInfoModalInfo.userStatus" :options="userStatusCodeOptions"></b-form-select>-->
      </b-form-group>
      <b-form-group label="최종 로그인" horizontal :label-cols="2" v-if="mode === 'PUT'">
        <b-input type="text" :disabled="true" v-model="userInfoModalInfo.lastLoginDt"></b-input>
      </b-form-group>
    </b-form>

    <div class="w-100">
      <span class="float-left">
        <b-btn variant="default" v-if="userInfoModalInfo.userNo !== undefined" @click="removeModal">삭제</b-btn>
      </span>
      <span class="float-right">
          <b-btn variant="secondary" @click="closeModal">취소</b-btn>
          <b-btn variant="primary" v-if="mode === 'PUT'" @click="saveModal">수정</b-btn>
          <b-btn variant="primary" v-else @click="saveModal">저장</b-btn>
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
  name: 'AdminModal',
  metaInfo: {
    title: '관리자 정보 관리'
  },
  components: {
    'flat-pickr': flatPickr
  },
  props: [
    'userInfoModalInfo',
    'userStatusCodeOptions',
    'genderCodeOptions',
    'mode'
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
      this.$parent.$parent.$emit('removeModal', this.userInfoModalInfo.userNo)
    },

    closeModal () {
      this.$parent.hide()
    },

    dupchk () {
      this.$parent.$parent.$emit('dupchk', this.userInfoModalInfo.userId)
    }
  }
}
</script>
