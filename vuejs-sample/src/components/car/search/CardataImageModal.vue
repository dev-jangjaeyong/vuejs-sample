<template>
  <div style="width:900px !important;">
    <slot></slot>
    <hr class="border-light container-m--x mt-auto">
    <div>
    <span class="float-right">
          <b-btn variant="secondary" @click="photoDownload">사진다운로드</b-btn>
          <b-btn variant="danger" @click="photoAllDelete">사진전체삭제</b-btn>
          <b-btn variant="primary" @click="closeModal">확인</b-btn>
    </span>
    </div>
  </div>
</template>

<script>
    export default {
        name: "AlertModal",
        methods: {
            photoDownload(){
                this.$parent.$parent.$emit('photoDownload')
            },
            photoAllDelete(){
                this.$parent.$parent.$emit('photoAllDelete')
            },
            closeModal() {
                this.$parent.hide()
            }
        }
    }

</script>

<style scoped>

</style>
