<template>
  <div>
    <b-form>
      <!--<b-form-group class="d-none">-->
        <!--<b-input type="text" v-model="codeInfo.upCodeNo"></b-input>-->
      <!--</b-form-group>-->
      <b-form-group label="상위코드번호" horizontal :label-cols="2">
        <b-input type="text" placeholder="상위코드번호" v-model="codeInfo.upCodeNo"></b-input>
      </b-form-group>
      <b-form-group label="코드명" horizontal :label-cols="2">
        <b-input type="text" placeholder="코드명" v-model="codeInfo.codeName"></b-input>
      </b-form-group>
      <b-form-group label="코드값" horizontal :label-cols="2">
        <b-input type="text" placeholder="코드값" v-model="codeInfo.code"></b-input>
      </b-form-group>
      <b-form-group label="설명" horizontal :label-cols="2">
        <b-input type="text" placeholder="설명" v-model="codeInfo.dscrp"></b-input>
      </b-form-group>
      <b-form-group label="추가속성1" horizontal :label-cols="2">
        <b-input type="text" placeholder="추가속성1" v-model="codeInfo.attr1"></b-input>
      </b-form-group>
      <b-form-group label="추가속성2" horizontal :label-cols="2">
        <b-input type="text" placeholder="추가속성2" v-model="codeInfo.attr2"></b-input>
      </b-form-group>
      <b-form-group label="추가속성3" horizontal :label-cols="2">
        <b-input type="text" placeholder="추가속성3" v-model="codeInfo.attr3"></b-input>
      </b-form-group>
      <b-form-group label="추가속성4" horizontal :label-cols="2">
        <b-input type="text" placeholder="추가속성4" v-model="codeInfo.attr4"></b-input>
      </b-form-group>
      <b-form-group label="정렬순서" horizontal :label-cols="2">
        <b-input type="number" placeholder="정렬순서" v-model="codeInfo.sortNo"></b-input>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
export default {
  name: 'CodeModal',
  props: ['codeInfo']
}
</script>

<style scoped>

</style>
