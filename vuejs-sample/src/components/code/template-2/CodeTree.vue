<template>
  <div>
    <div style="height: 500px; overflow: auto;">
      <v-jstree
        :data="codeTreeData"
        :class="{ 'tree-rtl': isRTL }"
        @item-click="nodeClick" />

    </div>
    <div class="mt-4">
      <b-btn variant="default" :disabled="clickedCodeInfo.codeNo === undefined" @click="remove">삭제</b-btn>
      <b-btn variant="primary" :disabled="clickedCodeInfo.codeNo === undefined" @click="openModal" class="float-right">등록하기</b-btn>
    </div>
  </div>
</template>

<style src="@/vendor/libs/vue-jstree/vue-jstree.scss" lang="scss"></style>

<script>
import VJstree from 'vue-jstree'

export default {
  name: 'CodeTree',
  metaInfo: {
    title: 'CodeTree'
  },
  props: ['codeTreeData', 'clickedCodeInfo'],
  components: {
    VJstree
  },
  created () {
  },
  methods: {
    nodeClick (node) {
      this.$parent.$emit('treeNodeClick', node.model.children)
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
