<template>
  <div style="height: 300px; max-height: 300px; overflow: auto;">
    <b-table
      hover
      :fields="fields"
      :items="orgnztLevelTwoList"
      @row-clicked="rowClicked"></b-table>
  </div>
</template>

<script>
export default {
  name: 'OrgnztLevelTwo',
  props: ['orgnztLevelTwoList'],
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
      this.$parent.$emit('getInfo', record.orgnztUnitNo, 3)
    }
  }
}
</script>

<style scoped>

</style>
