<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">시스템 /</span> 코드관리
    </h4>

    <hr class="border-light container-m--x mt-0">

    <div class="row">
      <div class="col-md-6">
        <b-card header-tag="header" class="mb-4">
          <h4 slot="header" class="mb-0">코드 목록</h4>
          <code-tree :code-tree-data="codeTreeData" :clicked-info="clickedInfo" ref="codeTree"></code-tree>
        </b-card>
      </div>
      <div class="col-md-6">
        <b-card header-tag="header" class="mb-4">
          <h4 slot="header" class="mb-0">코드 정보</h4>
          <code-info :clicked-info="clickedInfo" ref="codeInfo"></code-info>
        </b-card>
      </div>
    </div>

    <b-modal ref="codeModal" size="md" cancel-title="취소하기" ok-title="저장하기" @ok="saveModal">
      <div slot="modal-title">
        코드 정보
        <!--<small class="text-muted">We need payment information to process your order.</small>-->
      </div>
      <code-modal :code-info="modalCodeInfo"/>
    </b-modal>
  </div>
</template>

<style src="@/vendor/libs/vue-jstree/vue-jstree.scss" lang="scss"></style>

<script>
import CodeTree from './CodeTree'
import CodeInfo from './CodeInfo'
import CodeModal from './CodeModal'

export default {
  metaInfo: {
    title: '코드관리'
  },
  components: {
    'code-tree': CodeTree,
    'code-info': CodeInfo,
    'code-modal': CodeModal
  },
  data () {
    return {
      codeTreeData: [],
      clickedNode: {}, // 현재 클릭된 노드.
      clickedInfo: {},
      modalCodeInfo: {},
      modalOpenMode: ''
    }
  },
  created () {
    this.loadCodeTree()

    this.$on('treeNodeClick', this.treeNodeClick) // CodeTree 노드 클릭 이벤트 발생.
    this.$on('openModal', this.openModal) // CodeInfo 저장 버튼 클릭 이벤트 발생
    this.$on('remove', this.remove)
  },
  methods: {
    loadCodeTree () {
      this.$http.get('/code/tree?upCode=1')
        .then(
          (result) => {
            this.codeTreeData = this.$tree.init(result.data.resultList)
            this.clickedInfo = {}
            this.$refs.codeInfo.empty()
          }
        )
    },

    treeNodeClick (codeNo, clickedNode) {
      this.clickedNode = clickedNode
      this.$http.get('/code?codeNo=' + codeNo)
        .then(
          (result) => {
            this.clickedInfo = result.data.resultObject
          }
        )
    },

    openModal (codeNo) {
      if (codeNo) {
        this.modalOpenMode = 'PUT'
        this.modalCodeInfo = this.$commons.clone(this.clickedInfo)
      } else {
        this.modalOpenMode = 'POST'
        this.modalCodeInfo = {
          upCodeNo: this.clickedInfo.codeNo || null,
          pid: this.clickedInfo.pid,
          useYn: 'Y'
        }
      }

      this.$refs.codeModal.show()
    },

    saveModal (evt) {
      evt.preventDefault()

      if (!this.modalCodeInfo.codeName) {
        alert('코드명을 입력하세요.')
      } else if (!this.modalCodeInfo.code) {
        alert('코드값을 입력하세요.')
      } else {
        if (confirm('저장하시겠습니까?')) {
          this.saveProc()
        }
      }
    },

    saveProc () {
      if (this.modalOpenMode === 'PUT') {
        this.$http.put('/code', this.modalCodeInfo)
          .then(
            (result) => {
              alert('저장이 완료되었습니다.')
              this.clickedInfo = result.data.resultObject
            }
          )
          .then(
            () => {
              this.$refs.codeModal.hide()
            }
          )
      } else {
        this.$http.post('/code', this.modalCodeInfo)
          .then(
            (result) => {
              alert('저장이 완료되었습니다.')
              this.clickedInfo = result.data.resultObject
              this.clickedNode.model.icon = ''
              this.clickedNode.model.children.push(this.$tree.init(result.data.resultObject))
            }
          )
          .then(
            () => {
              this.$refs.codeModal.hide()
            }
          )
      }
    },

    remove () {
      if (confirm('삭제하시겠습니까?')) {
        this.$http.delete('/code/' + this.clickedInfo.codeNo)
          .then(
            () => {
              if (this.clickedNode.$parent.$children.length === 1) {
                this.clickedNode.$parent.data.children = []
                this.clickedNode.$parent.data.icon = 'ion ion-md-document'
              }

              this.loadCodeTree()
            }
          )
      }
    }
  }
}
</script>

<style scoped>

</style>
