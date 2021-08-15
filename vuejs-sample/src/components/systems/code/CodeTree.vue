<template>
  <div>
    <div style="height: 416px; max-height: 416px; overflow: auto;">
      <v-jstree
        :data="codeTreeData"
        :text-field-name="'codeName'"
        :class="{ 'tree-rtl': isRTL }"
        @item-click="nodeClick" ref="tree" />

    </div>
    <div class="mt-4">
      <b-btn id="btnDelete" variant="danger" :disabled="clickedInfo.codeNo === undefined" @click="remove">삭제</b-btn>
      <b-btn id="btnRegister" variant="primary" :disabled="clickedInfo.codeNo === undefined" @click="openModal" class="float-right">등록하기</b-btn>
      <b-tooltip :show.sync="clickedInfo.codeNo === undefined" target="btnRegister" placement="left" title="코드를 선택하세요."></b-tooltip>
    </div>
  </div>
</template>

<style src="@/vendor/libs/vue-jstree/vue-jstree.scss" lang="scss"></style>

<script>
import VJstree from 'vue-jstree'

export default {
  name: 'CodeTree',
  props: ['codeTreeData', 'clickedInfo'],
  components: {
    VJstree
  },
  watch: {
    codeTreeData () {
      this.$refs.tree.initializeData(this.codeTreeData)
    }
  },
  created () {
  },
  methods: {
    nodeClick (node) {
      this.$parent.$emit('treeNodeClick', node.model.codeNo, node)
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
