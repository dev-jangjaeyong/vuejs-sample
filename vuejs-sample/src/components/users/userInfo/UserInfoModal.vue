<template>
  <div>
    <b-form>
      <div class="row">
        <div class="col-md-4">
          <b-form-group label="사용자번호">
            <b-input type="text" :disabled="true" placeholder="사용자번호" v-model="userInfoModalInfo.userNo"></b-input>
          </b-form-group>
        </div>
        <div class="col-md-4">
          <b-form-group label="회원 아이디">
            <b-input type="text" :disabled="true" placeholder="회원 아이디" v-model="userInfoModalInfo.userId"></b-input>
          </b-form-group>
        </div>
        <div class="col-md-4">
          <b-form-group label="회원명">
            <b-input type="text" :disabled="true" placeholder="회원명" v-model="userInfoModalInfo.userName"></b-input>
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
          <b-form-group label="회원구분">
            <b-input type="text" :disabled="true" placeholder="회원구분" v-model="userInfoModalInfo.userTyCdName"></b-input>
            <!--<b-form-select v-model="userInfoModalInfo.userTyCd" :options="userTypeOptions"></b-form-select>-->
          </b-form-group>
        </div>
        <div class="col-md-4">
          <b-form-group label="SNS 연동">
            <b-input type="text" :disabled="true" placeholder="SNS 연동" v-model="userInfoModalInfo.snsTyCdName"></b-input>
            <!--<b-form-select v-model="userInfoModalInfo.userTyCd" :options="userTypeOptions"></b-form-select>-->
          </b-form-group>
        </div>
        <div class="col-md-4">
          <b-form-group label="성별">
            <b-form-select v-model="userInfoModalInfo.genderCode" :options="genderCodeOptions" :disabled="true"></b-form-select>
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <b-form-group label="주소">
            <b-input type="text" placeholder="주소" v-model="userInfoModalInfo.addr" :readonly="true"></b-input>
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
        <div class="col-md-4">

          <!--<b-form-group label="문자 수신여부">-->
            문자 수신여부&nbsp;<b-checkbox placeholder="문자 수신여부" v-if="userInfoModalInfo.rcivSmsUseYn === 'Y'" :checked="true" :disabled="true"></b-checkbox>
          <b-checkbox placeholder="문자 수신여부" v-else :checked="false" :disabled="true"></b-checkbox>
          <!--<b-checkbox placeholder="문자 수신여부" v-model="userInfoModalInfo.rcivSmsUseYn === 'Y' ? 'true' : 'false'" :disabled="true"></b-checkbox>-->
          <!--</b-form-group>-->
        </div>
        <div class="col-md-4">
          <!--<b-form-group label="이메일 수신여부">-->
          이메일 수신여부&nbsp;<b-checkbox placeholder="이메일 수신여부" v-if="userInfoModalInfo.rcivEmailUseYn === 'Y'" :checked="true" :disabled="true"></b-checkbox>
          <b-checkbox placeholder="이메일 수신여부" v-else :checked="false" :disabled="true"></b-checkbox>
          <!--<b-checkbox placeholder="이메일 수신여부" v-model="userInfoModalInfo.rcivEmailUseYn === 'Y' ? 'true' : 'false'" :disabled="true"></b-checkbox>-->
          <!--</b-form-group>-->
        </div>
        <div class="col-md-4">
          <!--<b-form-group label="푸시 수신여부">-->
          푸시 수신여부&nbsp;<b-checkbox placeholder="푸시 수신여부" v-if="userInfoModalInfo.rcivPushUseYn === 'Y'" :checked="true" :disabled="true"></b-checkbox>
          <b-checkbox placeholder="푸시 수신여부" v-else :checked="false" :disabled="true"></b-checkbox>
          <!--<b-checkbox placeholder="푸시 수신여부" v-model="userInfoModalInfo.rcivPushUseYn === 'Y' ? 'true' : 'false'" :disabled="true"></b-checkbox>-->
          <!--</b-form-group>-->
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <b-form-group label="임직원 여부">
            <b-input type="text" placeholder="임직원 여부" v-model="userInfoModalInfo.empYn" :readonly="true"></b-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="임직원 ID">
            <b-input type="text" placeholder="임직원 ID" v-model="userInfoModalInfo.empNo" :readonly="true"></b-input>
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <b-form-group label="추천인">
            <b-input type="text" placeholder="추천인" v-model="userInfoModalInfo.recomendEmp" :readonly="true"></b-input>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="관계사">
            <b-input type="text" placeholder="관계사" v-model="userInfoModalInfo.recomendAffiliateEmpName" :readonly="true"></b-input>
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <b-form-group label="가입 일자">
            <b-input type="text" placeholder="가입 일자" v-model="userInfoModalInfo.createDt" :readonly="true"></b-input>
            <!--<flat-pickr disabled="true" v-model="userInfoModalInfo.lastLoginDt" ref="lastLoginDt" :config="flatConfig" :placeholder="!isIE ? '최종 로그인일시' : null" />-->
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="최종 로그인일시">
            <b-input type="text" placeholder="최종 로그인일시" v-model="userInfoModalInfo.lastLoginDt" :readonly="true"></b-input>
            <!--<flat-pickr disabled="true" v-model="userInfoModalInfo.lastLoginDt" ref="lastLoginDt" :config="flatConfig" :placeholder="!isIE ? '최종 로그인일시' : null" />-->
          </b-form-group>
        </div>
      </div>

    </b-form>

    <div class="w-100">
      <!--<span class="float-left">
        <b-btn variant="default" v-if="userInfoModalInfo.userNo !== undefined" @click="removeModal">삭제</b-btn>
      </span>-->
      <span class="float-right">
          <!--<b-btn variant="primary" @click="saveModal">저장</b-btn>-->
        <b-btn variant="secondary" @click="secessionModal" v-if="userInfoModalInfo.userStatus === '100' || userInfoModalInfo.userStatus === '110'">탈퇴</b-btn>
        <b-btn variant="secondary" @click="closeModal">닫기</b-btn>
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
  name: 'UserInfoModal',
  metaInfo: {
    title: 'User 정보 관리'
  },
  components: {
    'flat-pickr': flatPickr
  },
  props: [
    'userInfoModalInfo',
    'userTypeOptions',
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
    },

    secessionModal () {
      if (confirm('탈퇴처리를 하시겠습니까?')) {
        this.$parent.$parent.$emit('secessionModal')
      }
    }
  }

}
</script>
