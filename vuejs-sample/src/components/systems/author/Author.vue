<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">시스템 /</span> 권한관리
    </h4>

    <hr class="border-light container-m--x mt-0">

    <div class="row">
      <div class="col-md-3">
        <b-card header-tag="header" class="mb-4">
          <h5 slot="header" class="mb-0">권한 목록</h5>
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
        <b-card>
          <h5 slot="header" class="mb-0">세부 정보</h5>
          <div v-if="clickedChildrenInfo.nodeNo === undefined" class="card text-center bg-transparent border-primary text-primary mt-4 mb-4">
            <div class="card-body">
              메뉴를 선택하세요.
            </div>
          </div>
          <tree-info
            ref="treeInfo"
            v-if="clickedChildrenInfo.nodeNo !== undefined"
            :clicked-children-info="clickedChildrenInfo">
            <b-form>
              <b-form-group label="상위권한명" horizontal :label-cols="3">
                <b-input type="text" placeholder="UP_AUTHOR_NO" :disabled="disabled" v-model="clickedParentText"></b-input>
              </b-form-group>
              <b-form-group label="권한코드" horizontal :label-cols="3">
                <b-input type="text" placeholder="AUTHOR_NO" :disabled="disabled" v-model="clickedChildrenInfo.authorNo"></b-input>
              </b-form-group>
              <b-form-group label="권한명" horizontal :label-cols="3">
                <b-input type="text" placeholder="PRMISN_AUTHOR_NAME" :disabled="disabled" v-model="clickedChildrenInfo.prmisnAuthorName"></b-input>
              </b-form-group>
              <b-form-group label="권한유형" horizontal :label-cols="3">
                <b-form-select v-model="clickedChildrenInfo.prmisnAuthorTyCd" :disabled="disabled" :options="options.prmisnAuthorTypeOptions"></b-form-select>
              </b-form-group>
              <b-form-group label="권한설명" horizontal :label-cols="3">
                <b-input type="text" placeholder="DSCRP" :disabled="disabled" v-model="clickedChildrenInfo.dscrp"></b-input>
              </b-form-group>
              <b-form-group label="사용여부" horizontal :label-cols="3">
                <b-form-select v-model="clickedChildrenInfo.useYn" :disabled="disabled" :options="options.useYnOptions" class="mb-3"></b-form-select>
              </b-form-group>
            </b-form>
          </tree-info>
        </b-card>
      </div>
    </div>

    <!--Tree Info Modal Component-->
    <b-modal ref="treeInfoModal" size="md" cancel-title="취소하기" ok-title="저장하기" @ok="saveModal">
      <div slot="modal-title">
        권한 정보
        <!--<small class="text-muted">We need payment information to process your order.</small>-->
      </div>
      <tree-info-modal>
        <b-form>
          <b-form-group label="상위권한명" horizontal :label-cols="3">
            <b-input type="text" placeholder="UP_AUTHOR_NAME" :disabled="true" v-if="modalOpenMode == 'PUT'" v-model="clickedParentText"></b-input>
            <b-input type="text" placeholder="UP_AUTHOR_NAME" :disabled="true" v-else v-model="modalNodeInfo.upNodeText"></b-input>
          </b-form-group>
          <b-form-group label="권한코드" horizontal :label-cols="3">
            <b-input type="text" placeholder="AUTHOR_NO" v-model="modalNodeInfo.authorNo"></b-input>
          </b-form-group>
          <b-form-group label="권한명" horizontal :label-cols="3">
            <b-input type="text" placeholder="PRMISN_AUTHOR_NAME" v-model="modalNodeInfo.prmisnAuthorName"></b-input>
          </b-form-group>
          <b-form-group label="권한유형" horizontal :label-cols="3">
            <b-form-select v-model="modalNodeInfo.prmisnAuthorTyCd" :options="options.prmisnAuthorTypeOptions">
              <template slot="first">
                <option value="undefined" :disabled="true">권한유형을 선택해주세요.</option>
              </template>
            </b-form-select>
          </b-form-group>
          <b-form-group label="권한설명" horizontal :label-cols="3">
            <b-input type="text" placeholder="DSCRP" v-model="modalNodeInfo.dscrp"></b-input>
          </b-form-group>
          <b-form-group label="사용여부" horizontal :label-cols="3">
            <b-form-select v-model="modalNodeInfo.useYn" :options="options.useYnOptions">
              <template slot="first">
                <option value="undefined" :disabled="true">사용여부를 선택해주세요.</option>
              </template>
            </b-form-select>
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
  name: 'Author',
  metaInfo: {
    title: '권한관리'
  },
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

      options: {
        prmisnAuthorTypeOptions: [
          {value: '200', text: '개별'},
          {value: '100', text: '그룹'}
        ],
        useYnOptions: [
          {value: 'Y', text: '사용'},
          {value: 'N', text: '사용안함'}
        ]
      },

      fields: [
        { key: 'selected', label: '', tdClass: 'cursor-pointer' },
        { key: 'authorNo', label: '권한번호', tdClass: 'cursor-pointer' },
        { key: 'upAuthorNo', label: '상위권한번호', tdClass: 'cursor-pointer' },
        { key: 'prmisnAuthorName', label: '권한명', tdClass: 'cursor-pointer' },
        { key: 'prmisnAuthorTyCdName', label: '권한유형코드', tdClass: 'cursor-pointer' },
        { key: 'dscrp', label: '권한설명', tdClass: 'cursor-pointer' },
        { key: 'useYn', label: '사용여부', tdClass: 'cursor-pointer' }
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
      this.$http.get('/author')
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
      if (parentNode.prmisnAuthorTyCd === '100') {
        this.clickedParentInfo = parentNode
        this.modalNodeInfo = draggedNode
        this.modalNodeInfo.upAuthorNo = parentNode.authorNo
        this.modalOpenMode = 'PUT'

        this.saveProc()
      } else {
        alert('개별 유형의 하위로 데이터 이동할 수 없습니다.')
      }
    },

    // Tree Node Remove
    treeNodeRemove () {
      if (confirm('삭제하시겠습니까?')) {
        this.$http.delete('/author/' + this.clickedNodeInfo.authorNo)
          .then(
            (response) => {
              this.deleteProc(response)
            }
          )
      }
    },

    // modal Open
    openModal (modalOpenMode, modalNodeInfo) {
      // 유형이 있을 경우에만 유효성 검증 로직 추가
      if (modalOpenMode === 'PUT' || (modalOpenMode === 'POST' && this.clickedNodeInfo.prmisnAuthorTyCd === '100')) {
        this.modalOpenMode = modalOpenMode
        this.modalNodeInfo = modalNodeInfo
        this.$refs.treeInfoModal.show()
      } else {
        alert('개별 유형의 하위로 데이터 등록할 수 없습니다.')
      }
    },

    // model Save
    saveModal (evt) {
      evt.preventDefault()
      if (!this.modalNodeInfo['prmisnAuthorName']) {
        alert('권한명을 입력하세요.')
      } else {
        if (confirm('저장하시겠습니까?')) {
          this.saveProc()
        }
      }
    },

    // Save 저장 프로세스
    saveProc () {
      if (this.modalOpenMode === 'PUT') {
        this.$http.put('/author', this.modalNodeInfo)
          .then(
            (result) => {
              this.afterSaveProc(result.data['resultObject'])
            }
          )
          .then(
            () => {
              this.$refs['treeInfoModal'].hide()
            }
          )
      } else {
        this.$http.post('/author', this.modalNodeInfo)
          .then(
            (result) => {
              this.afterSaveProc(result.data['resultObject'])
            }
          )
          .then(
            () => {
              this.$refs['treeInfoModal'].hide()
            }
          )
      }
    },

    // Save 저장 프로세스 후처리
    afterSaveProc (resultObject) {
      resultObject.nodeNo = resultObject.authorNo
      resultObject.upNodeNo = resultObject.upAuthorNo
      resultObject.text = resultObject.prmisnAuthorName

      this.clickedChildrenInfo = resultObject

      if (this.modalOpenMode === 'POST') {
        this.$tree.addChildNode(this.clickedNode, resultObject)
      } else {
        this.$commons.copyTreeNode(this.treeData, resultObject)
      }

      this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>저장이 완료되었습니다.`, {theme: 'bubble', duration: 3000})
    },

    // Delete 프로세스 후처리
    deleteProc (response) {
      if (response.data['apiStatus'] === 'BAD_REQUEST') {
        alert(response.data.message)
      } else if (response.data['apiStatus'] === 'SUCCESS') {
        alert('삭제가 완료되었습니다.')

        if (this.clickedNode.$parent.$children.length === 1) {
          this.clickedNode.$parent.data.children = []
          this.clickedNode.$parent.data.icon = 'ion ion-ios-settings'
        } else {
          this.clickedNode.$parent.$children.forEach((e, i) => {
            if (e.data.authorNo === this.clickedChildrenInfo.authorNo) {
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
