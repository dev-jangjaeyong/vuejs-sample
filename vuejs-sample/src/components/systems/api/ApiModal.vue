<template>
  <div>
    <b-form>
      <b-form-group label="API ID" horizontal :label-cols="2" v-if="modalMode !== 'POST'">
        <b-input type="text" placeholder="API_ID" v-model="apiModalInfo.apiNo" maxlength="9" :readonly="true"></b-input><!--:readonly="apiModalInfo.pid !== undefined"-->
      </b-form-group>
      <b-form-group label="분류" horizontal :label-cols="2">
        <b-form-select v-model="apiModalInfo.apiClassTyCd" :options="options.apiClassTyCdOptions">
          <template slot="first">
            <option value="undefined" :disabled="true">API 분류를 선택해주세요.</option>
          </template>
        </b-form-select>
      </b-form-group>
      <b-form-group label="API명" horizontal :label-cols="2">
        <b-input type="text" placeholder="API_NAME" v-model="apiModalInfo.apiName"></b-input>
      </b-form-group>
      <b-form-group label="Method명" horizontal :label-cols="2">
        <b-form-select v-model="apiModalInfo.methodName" :options="options.methodNameOptions">
          <template slot="first">
            <option value="undefined" :disabled="true">Method명을 선택해주세요.</option>
          </template>
        </b-form-select>
      </b-form-group>
      <b-form-group label="URL" horizontal :label-cols="2">
        <b-input type="text" placeholder="URL" v-model="apiModalInfo.apiUrl"></b-input>
      </b-form-group>
      <b-form-group label="설명" horizontal :label-cols="2">
        <b-input type="text" placeholder="설명" v-model="apiModalInfo.dscrp"></b-input>
      </b-form-group>
    </b-form>

    <div class="w-100">
      <span class="float-left">
        <b-btn variant="default" v-if="apiModalInfo.apiNo !== undefined" @click="removeModal">삭제</b-btn>
      </span>
      <span class="float-right">
          <b-btn variant="secondary" @click="closeModal">취소</b-btn>
          <b-btn variant="primary" v-if="modalMode !== 'POST'" @click="saveModal">수정</b-btn>
          <b-btn variant="primary" v-else @click="saveModal">저장</b-btn>
        </span>
    </div>
  </div>
</template>

<script>
export default{
  name: 'ApiModal',
  metaInfo: {
    title: 'API관리'
  },
  props: [
    'apiModalInfo', 'options', 'modalMode'
  ],

  data () {
    return {
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
