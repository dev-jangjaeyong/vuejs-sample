<template>
  <div style="height: 300px; max-height: 300px; overflow: auto;">
    <b-table
      hover
      :fields="fields"
      :items="orgnztLevelOneList"
      @row-clicked="rowClicked"></b-table>
    <div class="text-right mt-4">
      <!--<b-btn id="btnUpdate" variant="primary" :disabled="clickedInfo.menuNo === undefined" @click="openModal">등록하기</b-btn>-->
      <!--<b-btn id="btnUpdate" variant="primary" :disabled="clickedInfo.menuNo === undefined" @click="">삭제하기</b-btn>-->
      <!--<b-tooltip :show.sync="clickedInfo.orgnztNo === undefined" target="btnUpdate" placement="left" title="조직를 선택하세요."></b-tooltip>-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrgnztLevelOne',
  props: ['orgnztLevelOneList'],
  data: () => {
    return {
      fields: [{
        key: 'name',
        label: '조직명'
      }, {
        key: 'fullName',
        label: '조직 전체명'
      }]
    }
  },
  methods: {
    rowClicked (record, index) {
      this.$parent.$emit('getInfo', record.orgnztUnitNo, 2)
    }
  }
}
</script>

<style scoped>

</style>
