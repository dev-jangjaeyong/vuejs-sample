<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">시스템 /</span> Product 관리
    </h4>

    <hr class="border-light container-m--x mt-0">

    <div class="row">
      <div class="col-md-3">
        <b-card header-tag="header" class="mb-4">
          <h5 slot="header" class="mb-0">Product 목록</h5>
          <tree-view
            ref="treeView"
            :tree-data="treeData"
            :clicked-node-info="clickedNodeInfo"></tree-view>
        </b-card>
      </div>

      <div class="col-md-9">
        <!--Tree List Component-->
        <b-card v-if="clickedNodeInfo.children !== null">
          <h5 slot="header" class="mb-0">세부 목록</h5>
          <div v-if="clickedNodeInfo.nodeNo === undefined" class="card text-center bg-transparent border-primary text-primary mt-4 mb-4">
            <div class="card-body">
              메뉴를 선택하세요.
            </div>
          </div>
          <tree-list
            :current-page="currentPage"
            :fields="fields"
            :clicked-children-info="clickedNodeInfo">
            <template slot="table-colgroup">
              <col width="40px" />
              <col />
              <col />
              <col />
            </template>
          </tree-list>
        </b-card>

        <!--Tree Info Component-->
        <b-card header-tag="header" class="mb-4">
          <h5 slot="header" class="mb-0">세부 정보</h5>
          <div v-if="clickedNodeInfo.nodeNo === undefined" class="card text-center bg-transparent border-primary text-primary mt-4 mb-4">
            <div class="card-body">
              메뉴를 선택하세요.
            </div>
          </div>
          <tree-info
            ref="treeInfo"
            v-if="clickedChildrenInfo.nodeNo !== undefined"
            :clicked-children-info="clickedChildrenInfo">
            <b-form>
              <b-form-group label="PID코드" horizontal :label-cols="3">
                <b-input type="text" placeholder="PID" :disabled="disabled" v-model="clickedChildrenInfo.pid"></b-input>
              </b-form-group>
              <b-form-group label="상위PID코드" horizontal :label-cols="3">
                <b-input type="text" placeholder="UP_PID" :disabled="disabled" v-model="clickedChildrenInfo.upPid"></b-input>
              </b-form-group>
              <b-form-group label="PID명" horizontal :label-cols="3">
                <b-input type="text" placeholder="PID_NAME" :disabled="disabled" v-model="clickedChildrenInfo.pidName"></b-input>
              </b-form-group>
            </b-form>
          </tree-info>
        </b-card>
      </div>
    </div>

    <!--Tree Info Modal Component-->
    <b-modal ref="treeInfoModal" size="md" cancel-title="취소하기" ok-title="저장하기" @ok="saveModal">
      <div slot="modal-title">
        Product 정보
        <!--<small class="text-muted">We need payment information to process your order.</small>-->
      </div>
      <tree-info-modal>
        <b-form>
          <b-form-group label="PID" horizontal :label-cols="3">
            <b-input type="text" placeholder="PID" :disabled="modalOpenMode == 'PUT'" v-model="modalNodeInfo.pid"></b-input>
          </b-form-group>
          <b-form-group label="상위PID코드" horizontal :label-cols="3">
            <b-input type="text" placeholder="UP_PID" :disabled="true" v-model="modalNodeInfo.upNodeNo"></b-input>
          </b-form-group>
          <b-form-group label="PID명" horizontal :label-cols="3">
            <b-input type="text" placeholder="PID_NAME" v-model="modalNodeInfo.pidName"></b-input>
          </b-form-group>
        </b-form>
      </tree-info-modal>
    </b-modal>
  </div>
</template>

<script>
import TreeView from '@/components/common/tree/TreeView'
import TreeList from '@/components/common/tree/TreeList'
import TreeInfo from '@/components/common/tree/TreeInfo'
import TreeInfoModal from '@/components/common/tree/TreeInfoModal'

export default {
  name: 'Product',

  components: {
    'tree-view': TreeView,
    'tree-list': TreeList,
    'tree-info': TreeInfo,
    'tree-info-modal': TreeInfoModal
  },

  data () {
    return {
      treeData: [], // tree 데이터
      clickedNode: {}, // 현재 클릭된 노드
      clickedNodeInfo: {}, // 현재 클릭된 노드 정보
      clickedChildrenInfo: {}, // 목록에서 클릭된 노드 자식 정보
      clickedParentInfo: {}, // 현재 클린된 노드의 부모 정보
      clickedParentText: '', // 상위 노드 Text
      modalNodeInfo: {}, // 현재 노드의 modal 정보
      modalOpenMode: '', // modal mode

      disabled: true,

      fields: [
        { key: 'selected', label: '', tdClass: 'cursor-pointer' },
        { key: 'pid', label: 'PID', tdClass: 'cursor-pointer' },
        { key: 'pidName', label: 'PID명', tdClass: 'cursor-pointer' },
        { key: 'upPid', label: '상위PID코드', tdClass: 'cursor-pointer' }
      ],

      currentPage: 1
    }
  },

  created () {
    this.loadTreeData()

    this.$on('treeNodeClick', this.treeNodeClick) // TreeView 노드 클릭 이벤트 발생
    this.$on('treeNodeDragged', this.treeNodeDragged) // TreeView 이동 이벤트 발생
    this.$on('treeNodeRemove', this.treeNodeRemove) // TreeView 삭제 버튼 클릭 이벤트 발생
    this.$on('openModal', this.openModal) // TreeView 저장 버튼 클릭 이벤트 발생
    this.$on('rowClicked', this.rowClicked) // TreeView 저장 버튼 클릭 이벤트 발생
  },

  methods: {
    // Tree Data load
    loadTreeData () {
      this.$http.get('/product')
        .then(
          (result) => {
            this.treeData = this.$tree.init(result.data['resultList'])
            this.clickedNodeInfo = {}
          }
        )
    },

    // Tree Node Click
    treeNodeClick (nodeNo, clickedNode) {
      this.clickedNode = clickedNode
      this.clickedNodeInfo = clickedNode.model
      this.clickedChildrenInfo = this.clickedNodeInfo

      this.clickedParentInfo = clickedNode.$parent.model || {text: ''}
      this.clickedParentText = this.clickedParentInfo.text
      this.currentPage = 1
    },

    // Tree Node Dragged - node 이동
    treeNodeDragged (nodeNo, parentNode, draggedNode) {
      this.clickedParentInfo = parentNode
      this.modalNodeInfo = draggedNode
      this.modalNodeInfo.upNodeNo = parentNode.pid
      this.modalOpenMode = 'PUT'

      this.beforeSaveProc()
    },

    // Tree Node Remove
    treeNodeRemove () {
      if (confirm('삭제하시겠습니까?')) {
        this.$http.delete('/product/' + this.clickedNodeInfo.pid)
          .then(
            (response) => {
              this.deleteProc(response)
            }
          )
      }
    },

    // modal Open
    openModal (modalOpenMode, modalNodeInfo) {
      this.modalOpenMode = modalOpenMode
      this.modalNodeInfo = modalNodeInfo

      this.$refs.treeInfoModal.show()
    },

    // model Save
    saveModal (evt) {
      evt.preventDefault()
      if (!this.modalNodeInfo.pid) {
        alert('PID코드를 입력하세요.')
      } else {
        if (confirm('저장하시겠습니까?')) {
          this.beforeSaveProc()
        }
      }
    },

    // Save 저장 프로세스 전처리
    beforeSaveProc () {
      // 등록시에만
      this.modalNodeInfo.requestPid = this.modalNodeInfo.pid
      this.modalNodeInfo.upPid = this.modalNodeInfo.upNodeNo

      this.saveProc()
    },

    // Save 저장 프로세스
    saveProc () {
      if (this.modalOpenMode === 'PUT') {
        this.$http.put('/product', this.modalNodeInfo)
          .then(
            (result) => {
              this.afterSaveProc(result.data['resultObject'])
            }
          )
          .then(
            () => {
              this.$refs.treeInfoModal.hide()
            }
          )
      } else {
        this.$http.post('/product', this.modalNodeInfo)
          .then(
            (result) => {
              this.afterSaveProc(result.data['resultObject'])
            }
          )
          .then(
            () => {
              this.$refs.treeInfoModal.hide()
            }
          )
      }
    },

    // Save 저장 프로세스 후처리
    afterSaveProc (resultObject) {
      resultObject.nodeNo = resultObject.pid
      resultObject.upNodeNo = resultObject.upPid
      resultObject.text = resultObject.pidName

      this.clickedChildrenInfo = resultObject

      if (this.modalOpenMode === 'POST') {
        this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>저장이 완료되었습니다.`, {theme: 'bubble', duration: 3000})
        this.$tree.addChildNode(this.clickedNode, resultObject)
      } else {
        this.$commons.copyTreeNode(this.treeData, resultObject)
      }
    },

    // Delete 프로세스 후처리
    deleteProc (response) {
      if (response.data['apiStatus'] === 'BAD_REQUEST') {
        alert(response.data.message)
      } else if (response.data['apiStatus'] === 'SUCCESS') {
        this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>삭제가 완료되었습니다.`, {theme: 'bubble', duration: 3000})

        if (this.clickedNode.$parent.$children.length === 1) {
          this.clickedNode.$parent.data.children = []
          this.clickedNode.$parent.data.icon = 'ion ion-ios-settings'
        } else {
          this.clickedNode.$parent.$children.forEach((e, i) => {
            if (e.data.pid === this.clickedChildrenInfo.pid) {
              if (e.$parent.model) {
                e.$parent.model.children.splice(i, 1)
              } else {
                e.$parent.data.splice(i, 1)
              }
            }
          })
        }
      }
    },

    // List Table Click Event
    rowClicked (row) {
      this.clickedChildrenInfo = row
      this.clickedParentText = this.clickedNodeInfo.text
    }
  }
}
</script>

<style scoped>

</style>
