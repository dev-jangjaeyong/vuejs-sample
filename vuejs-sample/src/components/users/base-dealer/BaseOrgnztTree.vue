<template>
  <div>
    <div style="height: 436px; max-height: 416px; overflow: auto;">
      <v-jstree
        :data="treeData" :async="loadData"
        text-field-name="name"
        :class="{ 'tree-rtl': isRTL }"
        @item-click="nodeClicked" ref="tree" />
    </div>
  </div>
</template>

<style src="@/vendor/libs/vue-jstree/vue-jstree.scss" lang="scss"></style>

<script>
import VJstree from 'vue-jstree'

export default {
  name: 'BaseOrgnztTree',
  props: ['treeData'],
  components: {
    VJstree
  },
  created () {
  },
  watch: {
    treeData () {
      this.$refs.tree.initializeData(this.treeData)
    }
  },
  methods: {
    loadData (originNode, resolve) {
      let upOrgnztUnitNo = null

      if (originNode.data.orgnztUnitNo !== undefined) {
        upOrgnztUnitNo = originNode.data.orgnztUnitNo
      }

      let params = {
        params: {
          upOrgnztUnitNo: upOrgnztUnitNo
        }
      }

      this.$http.get('/orgnzt/allshop', params)
        .then(
          (result) => {
            let resultList = result.data.resultList

            setTimeout(() => {
              resolve(resultList)
            }, 500)
          }
        )
    },
    nodeClicked (node) {
      this.$parent.$emit('getInfo', node.model.orgnztUnitNo)
    },
    openModal () {
      this.$parent.$emit('openModal')
    },
    remove () {
      this.$parent.$emit('remove')
    }
  }
}
</script>

<style scoped>

</style>
