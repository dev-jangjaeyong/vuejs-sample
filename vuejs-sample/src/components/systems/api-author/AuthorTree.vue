<template>
  <div>
    <div style="height: 416px; max-height: 416px; overflow: auto;">
      <v-jstree
        :data="authTreeData"
        :class="{ 'tree-rtl': isRTL }"
        @item-click="nodeClick" ref="tree" />
    </div>
  </div>
</template>

<style src="@/vendor/libs/vue-jstree/vue-jstree.scss" lang="scss"></style>

<script>
import VJstree from 'vue-jstree'

export default {
  name: 'AuthTree',
  props: ['authTreeData'],
  components: {
    VJstree
  },
  watch: {
    authTreeData () {
      this.$refs.tree.initializeData(this.authTreeData)
    }
  },
  methods: {
    nodeClick (node) {
      // console.log(node.model)
      this.$parent.authorNo = node.model.authorNo
      this.$parent.prmisnAuthorTyCd = node.model.prmisnAuthorTyCd

      if (node.model.prmisnAuthorTyCd === '200') {
        this.$parent.$emit('authorNodeClick', node.model.authorNo)
      } else {
        this.$parent.$emit('clearApiList', node.model.authorNo)
      }
    }
  }
}
</script>

<style scoped>

</style>
