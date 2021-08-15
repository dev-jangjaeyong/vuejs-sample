<template>
  <div>
    <div style="height: 416px; max-height: 416px; overflow: auto;">
      <v-jstree
        :data="menuTreeData"
        :text-field-name="'menuName'"
        :class="{ 'tree-rtl': isRTL }"
        @item-click="nodeClick" ref="tree" />
    </div>
    <b-card-footer>
      <b-btn id="btnDelete" variant="danger" :disabled="clickedMenuInfo.menuNo === undefined" @click="remove">삭제</b-btn>
      <b-btn id="btnRegister" variant="primary" :disabled="clickedMenuInfo.menuNo === undefined || clickedMenuInfo.menuTyCd === '200'" @click="openModal" class="float-right">등록하기</b-btn>
      <b-tooltip :show.sync="clickedMenuInfo.menuNo === undefined" target="btnRegister" placement="left" title="메뉴를 선택하세요."></b-tooltip>
      <b-tooltip :show.sync="clickedMenuInfo.menuTyCd === '200'" target="btnRegister" placement="left" title="하위 메뉴를 등록할 수 없습니다."></b-tooltip>
    </b-card-footer>
  </div>
</template>

<style src="@/vendor/libs/vue-jstree/vue-jstree.scss" lang="scss"></style>

<script>
import VJstree from 'vue-jstree'

export default {
  name: 'MenuTree',
  props: ['menuTreeData', 'clickedMenuInfo'],
  components: {
    VJstree
  },
  created () {
  },
  watch: {
    menuTreeData () {
      this.$refs.tree.initializeData(this.menuTreeData)
    }
  },
  methods: {
    nodeClick (node) {
      this.$parent.$emit('treeNodeClick', node.model.menuNo, node)
    },
    openModal () {
      console.log(this)
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
