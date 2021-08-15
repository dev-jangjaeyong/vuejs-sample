<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">시스템 /</span> Menu 관리
    </h4>

    <hr class="border-light container-m--x mt-0">

    <div class="ui-bordered px-4 pt-4 mb-4">
      <div class="form-row align-items-center">

        <div class="col-md mb-3">
          <label class="form-label">매뉴채널</label>
          <b-form-select v-model="searchParameters.menuChnnlCode" :options="optionMenuChnnlCode">
            <template slot="first">
              <option value="">전체</option>
            </template>
          </b-form-select>
        </div>
        <div class="col-md mb-3">
          <label class="form-label">메뉴번호</label>
          <b-input placeholder="메뉴번호" v-model="searchParameters.menuNo" />
        </div>
        <div class="col-md mb-3">
          <label class="form-label">메뉴명</label>
          <b-input placeholder="메뉴명" v-model="searchParameters.menuName" />
        </div>
        <div class="col-md mb-3">
          <label class="form-label">메뉴URL</label>
          <b-input placeholder="메뉴URL" v-model="searchParameters.menuUrl" />
        </div>
        <div class="col-md mb-3">
          <label class="form-label">유형</label>
          <b-form-select v-model="searchParameters.menuTyCd" :options="menuType">
            <template slot="first">
              <option value="">전체</option>
            </template>
          </b-form-select>
        </div>
        <div class="col-md mb-3">
          <label class="form-label">노출여부</label>
          <b-form-select v-model="searchParameters.menuDisplayYn" :options="optionYn">
            <template slot="first">
              <option value="">전체</option>
            </template>
          </b-form-select>
        </div>
        <div class="col-md mb-3">
          <label class="form-label">사용여부</label>
          <b-form-select v-model="searchParameters.useYn" :options="optionYn">
            <template slot="first">
              <option value="">전체</option>
            </template>
          </b-form-select>
        </div>
        <div class="col-md-1 mb-3">
          <label class="form-label d-none d-md-block">&nbsp;</label>
          <b-btn variant="secondary" :block="true" @click="filterSearch">검색</b-btn>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-3">
        <b-card header-tag="header" class="mb-4">
          <h5 slot="header" class="mb-0">Menu 목록</h5>
          <tree-view
            ref="TreeView"
            :tree-data="treeData"
            :clicked-node-info="clickedNodeInfo"></tree-view>
        </b-card>
      </div>

      <div class="col-md-9">
        <!--Tree List Component-->
        <b-card v-if="clickedNodeInfo.children !== null && clickedNodeInfo.children !== 'null'">
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

            <template v-if="clickedNodeInfo.children != undefined">
            </template>

          </tree-list>
        </b-card>

        <!--Tree Info Component-->
        <b-card header-tag="header" class="mb-4">
          <h5 slot="header" class="mb-0">세부 정보</h5>
          <!--<div v-if="clickedNodeInfo.menuLv == 1" class="card text-center bg-transparent border-primary text-primary mt-4 mb-4">
            <div class="card-body">
              메뉴를 선택하세요.
            </div>
          </div>-->
          <tree-info
            ref="treeInfo"
            v-if="clickedChildrenInfo.nodeNo !== undefined"
            :clicked-children-info="clickedChildrenInfo">
            <b-form>
              <div class="row">
                <div class="col-md-5">
                  <b-form-group label="상위메뉴명" horizontal :label-cols="3" label-text-align="right">
                    <b-input type="text" :disabled="disabled" v-model="clickedParentText"></b-input>
                  </b-form-group>
                  <b-form-group label="메뉴명" horizontal :label-cols="3" label-text-align="right">
                    <b-input type="text" placeholder="메뉴명" :disabled="disabled" v-model="clickedChildrenInfo.menuName"></b-input>
                  </b-form-group>
                  <b-form-group label="노출여부" horizontal :label-cols="3" label-text-align="right">
                    <b-form-select v-model="clickedChildrenInfo.menuDisplayYn" :disabled="disabled" :options="optionYn" ref="menuDisplayYn"></b-form-select>
                  </b-form-group>
                  <b-form-group label="메뉴URL" horizontal :label-cols="3" label-text-align="right">
                    <b-input type="text" placeholder="메뉴URL" :disabled="disabled" v-model="clickedChildrenInfo.menuUrl"></b-input>
                  </b-form-group>
                  <b-form-group label="유형" horizontal :label-cols="3" label-text-align="right">
                    <b-form-select v-model="clickedChildrenInfo.menuTyCd" :disabled="disabled" :options="menuType" ref="menuTyCd"></b-form-select>
                  </b-form-group>
                </div>
                <div class="col-md-6">
                  <b-form-group label="설명" horizontal :label-cols="3" label-text-align="right">
                    <b-input type="text" placeholder="설명" :disabled="disabled" v-model="clickedChildrenInfo.dscrp"></b-input>
                  </b-form-group>
                  <b-form-group label="사용여부" horizontal :label-cols="3" label-text-align="right">
                    <b-form-select v-model="clickedChildrenInfo.useYn" :disabled="disabled" :options="optionYn" ref="useYn"></b-form-select>
                  </b-form-group>
                  <b-form-group label="정렬번호" horizontal :label-cols="3" label-text-align="right">
                    <b-input type="text" placeholder="정렬번호" :disabled="disabled" v-model="clickedChildrenInfo.sortNo"></b-input>
                  </b-form-group>
                  <b-form-group label="사용시작일자" horizontal :label-cols="3" label-text-align="right">
                    <b-input type="text" placeholder="사용시작일자" :disabled="disabled" v-model="clickedChildrenInfo.useStDt"></b-input>
                  </b-form-group>
                  <b-form-group label="사용종료일자" horizontal :label-cols="3" label-text-align="right">
                    <b-input type="text" placeholder="사용종료일자" :disabled="disabled" v-model="clickedChildrenInfo.useEdDt"></b-input>
                  </b-form-group>
                </div>
              </div>
            </b-form>
          </tree-info>
        </b-card>

        <!--Tree Info Modal Component-->
        <b-modal ref="treeInfoModal" size="md" cancel-title="취소하기" ok-title="저장하기" @ok="saveModal">
          <div slot="modal-title">
            Menu 정보
            <!--<small class="text-muted">We need payment information to process your order.</small>-->
          </div>
          <tree-info-modal>
            <b-form>
              <b-form-group class="d-none">
                <b-input type="text" v-model="modalNodeInfo.upMenuNo"></b-input>
              </b-form-group>
              <b-form-group label="메뉴명" horizontal :label-cols="3">
                <b-input type="text" placeholder="메뉴명" ref="menuName" v-model="modalNodeInfo.menuName"></b-input>
              </b-form-group>
              <b-form-group label="노출여부" horizontal :label-cols="3">
                <b-form-select v-model="modalNodeInfo.menuDisplayYn" :options="optionYn" ref="menuDisplayYn">
                  <template slot="first">
                    <option value="undefined" disabled>메뉴노출여부를 선택하세요</option>
                  </template>
                </b-form-select>
              </b-form-group>
              <b-form-group label="메뉴URL" horizontal :label-cols="3">
                <b-input type="text" placeholder="메뉴URL" ref="menuUrl" v-model="modalNodeInfo.menuUrl"></b-input>
              </b-form-group>
              <b-form-group label="유형" horizontal :label-cols="3">
                <b-form-select v-model="modalNodeInfo.menuTyCd" :options="menuType" ref="menuTyCd">
                  <template slot="first">
                    <option value="undefined" disabled>메뉴타입을 선택하세요</option>
                  </template>
                </b-form-select>
              </b-form-group>
              <b-form-group label="설명" horizontal :label-cols="3">
                <b-input type="text" placeholder="설명" ref="dscrp" v-model="modalNodeInfo.dscrp"></b-input>
              </b-form-group>
              <b-form-group label="사용여부" horizontal :label-cols="3">
                <b-form-select v-model="modalNodeInfo.useYn" :options="optionYn" ref="useYn">
                  <template slot="first">
                    <option value="undefined" disabled>사용여부를 선택하세요</option>
                  </template>
                </b-form-select>
              </b-form-group>
              <b-form-group label="정렬번호" horizontal :label-cols="3">
                <b-input type="text" placeholder="정렬번호" ref="sortNo" v-model="modalNodeInfo.sortNo"></b-input>
              </b-form-group>
              <b-form-group label="사용시작일자" horizontal :label-cols="3">
                <flat-pickr v-model="modalNodeInfo.useStDt" ref="useStDt" :config="flatConfig" :placeholder="!isIE ? '사용시작일자' : null" />
              </b-form-group>
              <b-form-group label="사용종료일자" horizontal :label-cols="3">
                <flat-pickr v-model="modalNodeInfo.useEdDt" ref="useEdDt" :config="flatConfig" :placeholder="!isIE ? '사용종료일자' : null" />
              </b-form-group>
            </b-form>
          </tree-info-modal>
        </b-modal>
      </div>
    </div>
  </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style>
  .default-style .flatpickr-calendar.open {
    z-index: 1100
  }
</style>
<script>
import TreeView from '@/components/common/tree/TreeView'
import TreeList from '@/components/common/tree/TreeList'
import TreeInfo from '@/components/common/tree/TreeInfo'
import TreeInfoModal from '@/components/common/tree/TreeInfoModal'
import flatPickr from 'vue-flatpickr-component'

export default {
  name: 'Menu',

  components: {
    'tree-view': TreeView,
    'tree-list': TreeList,
    'tree-info': TreeInfo,
    'tree-info-modal': TreeInfoModal,
    'flat-pickr': flatPickr
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

      optionMenuChnnlCode: [],

      disabled: true,

      fields: [
        { key: 'selected', label: '', tdClass: 'cursor-pointer' },
        { key: 'menuNo', label: '메뉴번호', tdClass: 'cursor-pointer' },
        { key: 'upMenuNo', label: '상위메뉴번호', tdClass: 'cursor-pointer' },
        { key: 'menuName', label: '메뉴명', tdClass: 'cursor-pointer' },
        { key: 'menuTyCdName', label: '유형', tdClass: 'cursor-pointer' },
        { key: 'menuDisplayYn', label: '노출여부', tdClass: 'cursor-pointer' },
        { key: 'menuUrl', label: '메뉴URL', tdClass: 'cursor-pointer' },
        { key: 'useYn', label: '사용여부', tdClass: 'cursor-pointer' }
      ],

      menuType: {},
      optionYn: {
        Y: '사용',
        N: '미사용'
      },
      flatConfig: {
        altFormat: 'Y-m-d',
        dateFormat: 'Y-m-d',
        altInput: true,
        animate: true
      },
      currentPage: 1,

      searchParameters: {
        menuChnnlCode: '',
        menuTyCd: '',
        menuDisplayYn: '',
        useYn: ''
      }
    }
  },

  created () {
    this.loadTreeData()
    this.loadMenuTypeCombo()
    this.loadMenuChnnlCombo()

    this.$on('treeNodeClick', this.treeNodeClick) // TreeView 노드 클릭 이벤트 발생
    this.$on('treeNodeDragged', this.treeNodeDragged) // TreeView 이동 이벤트 발생
    this.$on('treeNodeRemove', this.treeNodeRemove) // TreeView 삭제 버튼 클릭 이벤트 발생
    this.$on('openModal', this.openModal) // TreeView 저장 버튼 클릭 이벤트 발생
    this.$on('rowClicked', this.rowClicked) // TreeList 체크 박스 선택 시 이벤트 발생
  },

  methods: {
    // Tree Data load
    loadTreeData () {
      const parameters = {
        params: this.searchParameters
      }
      this.$http.get('/menu/treeMenu', parameters)
      // this.$http.get('/menu/tree', parameters)
        .then(
          (result) => {
            let data = result.data['resultList']
            data.forEach((value) => {
              if (value.menuLv === 1) {
                value.menuNo = null
                value.nodeNo = null
              }
            })
            // this.treeData = this.$tree.init(result.data['resultList'])
            this.treeData = this.$tree.init(data)
            this.clickedNodeInfo = {}
          }
        )
    },

    // Tree Node Click
    treeNodeClick (nodeNo, clickedNode) {
      this.clickedNode = clickedNode
      this.clickedNodeInfo = clickedNode.model
      this.clickedChildrenInfo = this.clickedNodeInfo
      if (this.clickedChildrenInfo.nodeNo === null) {
        this.clickedChildrenInfo.children.forEach((value) => {
          value.upNodeNo = null
          value.upMenuNo = null
        })
      }
      this.clickedParentInfo = clickedNode.$parent.model || {text: ''}
      this.clickedParentText = this.clickedParentInfo.text
      this.currentPage = 1
    },

    // Tree Node Dragged - node 이동
    treeNodeDragged (nodeNo, parentNode, draggedNode) {
      this.clickedParentInfo = parentNode
      this.modalNodeInfo = draggedNode
      this.modalNodeInfo.upNodeNo = parentNode.menuNo
      this.modalOpenMode = 'PUT'

      this.beforeSaveProc()
    },

    // Tree Node Remove
    treeNodeRemove () {
      if (confirm('삭제하시겠습니까?')) {
        this.$http.delete('/menu/' + this.clickedNodeInfo.menuNo)
          .then(
            (response) => {
              this.deleteProc(response)
            }
          )
      }
    },

    // List Table Click Event
    rowClicked (row) {
      this.clickedChildrenInfo = row
      this.clickedParentText = this.clickedNodeInfo.text
    },

    // Menu Type Combo
    loadMenuTypeCombo () {
      this.$http.get('/code/combo?codeLv2=MENU_TY_CD&lv=3')
        .then(
          (result) => {
            this.menuType = result.data['resultList']
          }
        )
    },

    loadMenuChnnlCombo () {
      this.$http.get('/code/combo?codeLv2=CHNNL_CODE&lv=3')
        .then(
          (result) => {
            this.optionMenuChnnlCode = result.data['resultList']
          }
        )
    },

    // modal Open
    openModal (modalOpenMode, modalNodeInfo) {
      this.modalOpenMode = modalOpenMode
      if (modalOpenMode === 'POST') {
        this.modalNodeInfo = {}
      } else {
        this.modalNodeInfo = modalNodeInfo
      }
      this.$refs.treeInfoModal.show()
    },

    // model Save
    saveModal (evt) {
      evt.preventDefault()
      if (!this.modalNodeInfo['menuName']) {
        alert('메뉴명를 입력하세요.')
      } else {
        if (confirm('저장하시겠습니까?')) {
          this.beforeSaveProc()
        }
      }
    },

    // Save 저장 프로세스 전처리
    beforeSaveProc () {
      // 등록시에만
      if (this.modalOpenMode === 'POST') {
        this.modalNodeInfo.upMenuNo = this.clickedNodeInfo.menuNo
      } else {
        this.modalNodeInfo.upMenuNo = this.modalNodeInfo.upNodeNo
      }

      this.modalNodeInfo.menuChnnlCode = this.clickedNodeInfo.chnnlCode
      this.modalNodeInfo.pid = this.$global.PID

      this.saveProc()
    },

    // Save 저장 프로세스
    saveProc () {
      if (this.modalOpenMode === 'PUT') {
        this.$http.put('/menu', this.modalNodeInfo)
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
        this.$http.post('/menu', this.modalNodeInfo)
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
      resultObject.nodeNo = resultObject.menuNo
      resultObject.upNodeNo = resultObject.upMenuNo
      resultObject.text = resultObject.menuName

      this.clickedChildrenInfo = resultObject

      if (this.modalOpenMode === 'POST') {
        this.$tree.addChildNode(this.clickedNode, resultObject)
        this.afterProc()
      } else {
        this.$commons.copyTreeNode(this.treeData, resultObject)
      }

      this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>저장 완료되었습니다.`, {theme: 'bubble', duration: 3000})
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
            if (e.data.menuNo === this.clickedChildrenInfo.menuNo) {
              if (e.$parent.model) {
                e.$parent.model.children.splice(i, 1)
              } else {
                e.$parent.data.splice(i, 1)
              }
            }
          })
        }
        this.afterProc()
      }
    },

    afterProc () {
      this.clickedNodeInfo = {}
      this.clickedChildrenInfo = {}
    },

    filterSearch () {
      this.clickedNodeInfo = {}
      this.clickedChildrenInfo = {}
      this.loadTreeData()
    }
  }
}
</script>

<style scoped>

</style>
