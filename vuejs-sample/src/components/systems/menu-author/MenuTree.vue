<template>
  <div>
    <div v-if="$parent.prmisnAuthorTyCd !== '200'" class="card text-center bg-transparent border-primary text-primary mt-4">
      <div class="card-body">
        개별 권한유형에만 권한을 추가 할 수 있습니다.
      </div>
    </div>
    <v-jstree
      :data="menuTreeData"
      :text-field-name="'menuName'"
      :class="{ 'tree-rtl': isRTL }"
      :show-checkbox="true"
      :multiple="true"
      :allow-batch="true"
      ref="tree" />
    <b-card-footer>
      <div class="text-right">
        <b-btn variant="primary" v-if="$parent.prmisnAuthorTyCd === '200'" @click="save">저장</b-btn>
      </div>
    </b-card-footer>
  </div>
</template>

<style src="@/vendor/libs/vue-jstree/vue-jstree.scss" lang="scss"></style>

<script>
import VJstree from 'vue-jstree'

export default {
  name: 'MenuTree',
  props: ['menuTreeData'],
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
    save () {
      this.menuTreeData.forEach((e) => {
        if (e.children !== null && e.children.length > 0) {
          e.children.forEach((c) => this.check(e, c))
        }
      })

      if (confirm('메뉴권한을 저장하시겠습니까?')) {
        this.$parent.$emit('save', this.getRequestMenuAuthors())
      }
    },

    check (parent, child) {
      if (child.selected && !parent.selected) { // 하위 메뉴가 선택되어 있으나, 상위 메뉴가 선택되어 있지 않은 경우, 강제 선택 처리.
        parent.selected = true
      }
    },

    getRequestMenuAuthors () {
      let requestParams = []

      this.menuTreeData.forEach(n => {
        this.pushParams(requestParams, n)
      })

      return requestParams
    },

    pushParams (requestMenuAuthors, node) {
      requestMenuAuthors.push({
        authorNo: this.$parent.authorNo,
        menuNo: node.menuNo,
        selected: node.selected
      })

      if (node.children !== null && node.children.length > 0) {
        node.children.forEach(n => {
          this.pushParams(requestMenuAuthors, n)
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
