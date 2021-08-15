<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">Template /</span> Code - Template 2
    </h4>

    <hr class="border-light container-m--x mt-0">

    <div class="row">
      <div class="col-xl-6 col-lg-12">
        <b-card header-tag="header" class="mb-4">
          <h4 slot="header" class="mb-0">코드 트리</h4>
          <code-tree :code-tree-data="codeTreeData" :clicked-code-info="clickedCodeInfo" ref="codeTree"></code-tree>
        </b-card>
      </div>
      <div class="col-xl-6 col-lg-12">
        <div class="row">
          <div class="col-lg-12">
            <b-card header-tag="header" class="mb-4">
              <h4 slot="header" class="mb-0">코드 목록</h4>
              <code-list :code-list="codeChildren" ref="codeList"></code-list>
            </b-card>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <b-card header-tag="header" class="mb-4">
              <h4 slot="header" class="mb-0">코드 정보</h4>
              <code-info :clicked-code-info="clickedCodeInfo" ref="codeInfo"></code-info>
            </b-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@/vendor/libs/vue-jstree/vue-jstree.scss" lang="scss"></style>

<script>

import CodeTree from './CodeTree'
import CodeList from './CodeList'
import CodeInfo from './CodeInfo'

export default {
  components: {
    'code-tree': CodeTree,
    'code-list': CodeList,
    'code-info': CodeInfo
  },
  data () {
    return {
      codeTreeData: [],
      clickedNode: {}, // 현재 클릭된 노드.
      clickedCodeInfo: {},
      codeChildren: [],
      modalCodeInfo: {},
      modalOpenMode: ''
    }
  },
  created () {
    this.loadCodeTree()

    this.$on('treeNodeClick', this.treeNodeClick) // CodeTree 노드 클릭 이벤트 발생.
    this.$on('clicked', this.clicked)
    this.$on('remove', this.remove)
  },
  methods: {
    loadCodeTree () {
      this.$http.get('/code?upCode=1')
        .then(
          (result) => {
            this.codeTreeData = this.$tree.init(result.data.resultList)
            this.clickedCodeInfo = {}
            this.$refs.codeInfo.empty()
          }
        )
    },

    treeNodeClick (codeChildren) {
      this.codeChildren = codeChildren
    },

    clicked (code) {
      // console.log(code)
      this.clickedCodeInfo = code
    },

    saveProc () {
      if (this.modalOpenMode === 'PUT') {
        this.$http.put('/code', this.modalCodeInfo)
          .then(
            (result) => {
              alert('저장이 완료되었습니다.')
              this.clickedCodeInfo = result.data.resultObject
            }
          )
          .then(
            () => {
            }
          )
      } else {
        this.$http.post('/code', this.modalCodeInfo)
          .then(
            (result) => {
              alert('저장이 완료되었습니다.')
              this.clickedCodeInfo = result.data.resultObject
              this.clickedNode.model.icon = ''
              this.clickedNode.model.children.push(this.$tree.init(result.data.resultObject))
            }
          )
          .then(
            () => {
            }
          )
      }
    },

    remove () {
      if (confirm('삭제하시겠습니까?')) {
        this.$http.delete('/code/' + this.clickedCodeInfo.codeNo)
          .then(
            () => {
              if (this.clickedNode.$parent.$children.length === 1) {
                this.clickedNode.$parent.data.children = []
                this.clickedNode.$parent.data.icon = 'ion ion-md-document'
              }
            }
          )
      }
    }
  }
}
</script>
