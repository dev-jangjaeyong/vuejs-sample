<template>
  <div>
    <slot></slot>
    <b-card-footer>
      <div class="text-right">
        <b-btn id="btnUpdate" variant="primary" :disabled="clickedChildrenInfo.nodeNo === undefined || clickedChildrenInfo.menuLv === 1  " @click="openModal">수정하기</b-btn>
        <!--<b-tooltip :show.sync="clickedNodeInfo.nodeNo === undefined" target="btnUpdate" placement="left" title="코드를 선택하세요."></b-tooltip>-->
      </div>
    </b-card-footer>
  </div>
</template>

<script>
export default {
  name: 'TreeInfo',
  props: ['clickedChildrenInfo'],
  data: () => {
    return {
      modalOpenMode: '',
      modalNodeInfo: {}
    }
  },
  methods: {
    empty () {
      this.disabled = true
    },
    openModal () {
      this.modalOpenMode = 'PUT'
      this.modalNodeInfo = this.$commons.clone(this.clickedChildrenInfo)

      this.$parent.$emit('openModal', this.modalOpenMode, this.modalNodeInfo)
    }
  }
}
</script>

<style scoped>

</style>
