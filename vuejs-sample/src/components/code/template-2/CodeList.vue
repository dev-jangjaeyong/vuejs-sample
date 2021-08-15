<template>
  <div style="overflow-x: auto">
    <b-input class="d-none" type="text" v-model="upCodeNo"></b-input>
    <b-table ref="codeListTable" striped hover :items="codeList" :fields="fields" @row-clicked="click"></b-table>
  </div>
</template>

<style>
  tbody>tr {
    cursor: pointer
  }
</style>

<script>
export default {
  name: 'CodeList',
  props: ['upCodeNo', 'codeList'],
  data () {
    return {
      fields: [{
        key: 'codeName',
        label: '코드명'
      }, {
        key: 'codeValue',
        label: '코드값'
      }]
    }
  },
  methods: {
    click (item) {
      this.$parent.$emit('clicked', item)
    }
  }
}
</script>
