<template>
  <div>
    <div style="height: 416px; max-height: 416px; overflow: auto;">
      <v-jstree
        ref="tree"
        :data="treeData"
        :class="{ 'tree-rtl': isRTL }"
        draggable
        @item-click="nodeClick"
        @item-drop="nodeDrop"/>
    </div>
    <b-card-footer>
      <b-btn id="btnDelete" variant="danger" :disabled="clickedNodeInfo.nodeNo === undefined || clickedNodeInfo.nodeNo === null" @click="remove">삭제</b-btn>
      <b-btn id="btnRegister" variant="primary" :disabled="clickedNodeInfo.nodeNo === undefined" @click="openModal" class="float-right">등록하기</b-btn>
      <b-tooltip :show.sync="clickedNodeInfo.nodeNo === undefined" target="btnRegister" placement="left" title="코드를 선택하세요."></b-tooltip>
    </b-card-footer>
  </div>
</template>

<style src="@/vendor/libs/vue-jstree/vue-jstree.scss" lang="scss"></style>

<script>
import VJstree from 'vue-jstree'

export default {
  name: 'TreeView',
  props: ['treeData', 'clickedNodeInfo'],
  data: () => {
    return {
      modalOpenMode: '',
      modalNodeInfo: {}
    }
  },
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
    nodeClick (node) {
      this.$parent.$emit('treeNodeClick', node.model.nodeNo, node)
    },
    nodeDrop (node, item, draggedItem, e) {
      this.$parent.$emit('treeNodeDragged', node.model.nodeNo, item, draggedItem)
    },
    openModal () {
      this.modalOpenMode = 'POST'
      this.modalNodeInfo.upNodeNo = this.clickedNodeInfo.nodeNo
      this.modalNodeInfo.upNodeText = this.clickedNodeInfo.text

      this.$parent.$emit('openModal', this.modalOpenMode, this.modalNodeInfo)
    },
    remove () {
      this.$parent.$emit('treeNodeRemove')
    }
  }
}
</script>

<style scoped>

</style>
