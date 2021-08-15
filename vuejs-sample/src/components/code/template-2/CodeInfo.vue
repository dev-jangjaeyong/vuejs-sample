<template>
  <div>
    <b-form>
      <b-form-group label="코드명" horizontal :label-cols="3">
        <b-input type="text" placeholder="코드명" :disabled="disabled" v-model="clickedCodeInfo.codeName"></b-input>
      </b-form-group>
      <b-form-group label="코드값" horizontal :label-cols="3">
        <b-input type="text" placeholder="코드값" :disabled="disabled" v-model="clickedCodeInfo.codeValue"></b-input>
      </b-form-group>
      <b-form-group label="설명" horizontal :label-cols="3">
        <b-input type="text" placeholder="설명" :disabled="disabled" v-model="clickedCodeInfo.dscrp"></b-input>
      </b-form-group>
      <b-form-group label="추가속성1" horizontal :label-cols="3">
        <b-input type="text" placeholder="추가속성1" :disabled="disabled" v-model="clickedCodeInfo.attr1"></b-input>
      </b-form-group>
      <b-form-group label="추가속성2" horizontal :label-cols="3">
        <b-input type="text" placeholder="추가속성2" :disabled="disabled" v-model="clickedCodeInfo.attr2"></b-input>
      </b-form-group>
      <b-form-group label="추가속성3" horizontal :label-cols="3">
        <b-input type="text" placeholder="추가속성3" :disabled="disabled" v-model="clickedCodeInfo.attr3"></b-input>
      </b-form-group>
      <b-form-group label="추가속성4" horizontal :label-cols="3">
        <b-input type="text" placeholder="추가속성4" :disabled="disabled" v-model="clickedCodeInfo.attr4"></b-input>
      </b-form-group>
      <b-form-group label="정렬순서" horizontal :label-cols="3">
        <b-input type="number" placeholder="정렬순서" :disabled="disabled" v-model="clickedCodeInfo.sortNo"></b-input>
      </b-form-group>
    </b-form>
    <div class="text-right mt-4">
      <b-btn variant="primary" :disabled="clickedCodeInfo.codeNo === undefined" @click="update">수정하기</b-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CodeInfo',
  props: ['clickedCodeInfo'],
  data: () => {
    return {
      disabled: true
    }
  },
  methods: {
    empty () {
      this.disabled = true
    },

    update () {
    }
  }
}
</script>
