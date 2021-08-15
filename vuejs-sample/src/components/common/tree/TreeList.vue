<template>
  <div>
    <slot></slot>

    <b-table head-variant="dark"
             hover
             fixed
             small
             class="text-center"
             :fields="fields"
             :items="items"
             :per-page="perPage "
             v-if="clickedChildrenInfo.children != undefined"
             @row-clicked="rowClicked">
      <template slot="table-colgroup">
        <col span="1" width="3%" />
      </template>
      <template slot="selected" slot-scope="data">
        <b-form-checkbox disabled=disabled v-model="data.item.selected"></b-form-checkbox>
      </template>
    </b-table>

    <!-- Pagination -->
    <pagination :total-size="getTotalSize" :current-page="currentPage" :per-page="perPage"></pagination>
    <!--<pagination-->
      <!--:totalSize="getTotalSize"-->
      <!--:perPage="perPage">-->
    <!--</pagination>-->
  </div>
</template>

<script>
import Pagination from '@/components/common/pagination/Pagination'

export default {
  name: 'TreeList',

  props: [
    'currentPage',
    'fields',
    'clickedChildrenInfo'
  ],

  components: {
    'pagination': Pagination
  },

  data: () => {
    return {
      items: [],
      offset: 0,
      perPage: 5
    }
  },

  created () {
    this.$on('changePaging', this.changePaging)
    this.totalSize = 0
  },

  computed: {
    getTotalSize () {
      this.getItems()
      return this.totalSize
    },

    totalSize: {
      get () { return (this.clickedChildrenInfo.children ? this.clickedChildrenInfo.children.length : 0) },
      set (value) {
      }
    }
  },

  methods: {
    rowClicked (row) {
      row.selected = !row.selected
      this.clickedChildrenInfo.openChildren()
      for (let index in this.clickedChildrenInfo.children) {
        const child = this.clickedChildrenInfo.children[index]
        if (row.nodeNo === child.nodeNo) {
          child._rowVariant = 'success'
        } else {
          child.closeChildren()
          child._rowVariant = ''
          child.selected = false
        }
      }

      this.$forceUpdate()

      this.$parent.$emit('rowClicked', row)
    },

    getItems () {
      this.setOffset()
      if (this.clickedChildrenInfo.children) {
        if (this.clickedChildrenInfo.children.length > 0) {
          this.items = this.clickedChildrenInfo.children.filter((value, index) => this.offset <= index).filter((value, index) => index <= this.offset + this.perPage)
        }
      }
    },

    setOffset () {
      this.offset = (this.currentPage * this.perPage) - this.perPage
    },

    changePaging (page) {
      this.$parent.currentPage = page
    }
  }
}
</script>

<style scoped>

</style>
