<template>
  <div>
    <slot></slot>

    <hr class="border-light container-m--x mt-auto">

    <div >
      <span class="float-right">
          <b-btn variant="secondary" @click="closeModal">취소</b-btn>
          <b-btn variant="primary" @click="saveModal">저장</b-btn>
        </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Type2Modal',

  methods: {
    saveModal () {
      this.$parent.$parent.$emit('saveModal')
      this.$parent.hide()
    },

    closeModal () {
      this.$parent.hide()
    }
  }
}
</script>

<style scoped>

</style>
