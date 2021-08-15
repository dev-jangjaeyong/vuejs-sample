<template>
  <div>
    <div style="height: 416px; max-height: 416px; overflow: auto;">
      <v-jstree
        :data="treeData"
        :text-field-name="'name'"
        :class="{ 'tree-rtl': isRTL }"
        @item-click="nodeClicked" ref="tree" />
      <div v-if="(clickedInfo.lv <= 2 || clickedInfo.lv === undefined) && clickedInfo.orgnztNo === undefined">
        <span>데이터가 존재하지 않습니다.</span>
      </div>
    </div>
  </div>
</template>

<style src="@/vendor/libs/vue-jstree/vue-jstree.scss" lang="scss"></style>

<script>
  import VJstree from 'vue-jstree'

  export default {
  name: 'OrgnztTree',
  props: ['treeData', 'clickedInfo', 'clickedNode'],
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
    nodeClicked (node) {
      this.$parent.$emit('getInfo', node.model.orgnztUnitNo, node.model.lv + 1)
      this.$parent.$emit('nodeClicked', node)
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
