<template>
  <div>
    <slot></slot>

    <hr class="border-light container-m--x mt-0">

    <div class="w-100">
      <span class="float-left">
        <b-btn variant="default" @click="removeModal">{{ removeName }}</b-btn>
      </span>
      <span class="float-right">
          <b-btn variant="secondary" @click="closeModal">취소</b-btn>
          <b-btn variant="primary" @click="saveModal">{{ saveName }}</b-btn>
        </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Type1Modal',
  created () {
    this.$EventBus.$on('mod-removeBtn-name', (modItem) => {
      this.modifyRemoveButtonName(modItem)
    })
    this.$EventBus.$on('mod-saveBtn-name', (modItem) => {
      this.modifySaveButtonName(modItem)
    })
    this.$on('saveModal', this.saveModal) // 저장 이벤트
  },
  data () {
    return {
      removeName: '삭제',
      saveName: '저장'
    }
  },

  methods: {
    saveModal () {
      this.$parent.$parent.$emit('saveModal')
    },

    removeModal () {
      this.$parent.$parent.$emit('removeModal')
    },

    closeModal () {
      this.$parent.hide()
    },

    modifyRemoveButtonName (modItem) {
      this.removeName = modItem.name
    },

    modifySaveButtonName (modItem) {
      this.saveName = modItem.name
    }
  }
}
</script>

<style scoped>

</style>
