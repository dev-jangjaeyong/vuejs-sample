<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">회원관리 /</span> 조직관리
    </h4>

    <hr class="border-light container-m--x mt-0">

    <div class="row">
      <div class="col-md-4">
        <b-card header-tag="header" class="mb-4">
          <h5 slot="header" class="mb-0">조직 목록</h5>
          <orgnzt-tree :tree-data="treeData" :clicked-info="clickedInfo" ref="tree"></orgnzt-tree>
        </b-card>
      </div>
      <div class="col-md-8">
        <!--Tree List Component-->
        <b-card v-if="clickedChildrenInfo !== null && clickedChildrenInfo !== 'null'">
          <h5 slot="header" class="mb-0">세부 목록</h5>
          <div v-if="clickedInfo.nodeNo === undefined" class="card text-center bg-transparent border-primary text-primary mt-4 mb-4">
            <div class="card-body">
              조직을 선택하세요.
            </div>
          </div>
          <tree-list
            :current-page="currentPage"
            :fields="fields"
            :clicked-children-info="clickedChildrenInfo">
          </tree-list>
        </b-card>

        <b-card header-tag="header" class="mb-4">
          <h5 slot="header" class="mb-0">세부 정보</h5>
          <orgnzt-info :clicked-info="clickedInfo" ref="info"></orgnzt-info>
        </b-card>
      </div>
    </div>

    <b-modal ref="bModal" size="md" cancel-title="취소하기" ok-title="저장하기" @ok="saveModal">
      <div slot="modal-title">
        조직 정보
        <!--<small class="text-muted">We need payment information to process your order.</small>-->
      </div>
      <orgnzt-modal ref="modal" :modal-info="modalInfo" :modal-open-mode="modalOpenMode"/>
    </b-modal>
  </div>
</template>

<script>
import OrgnztTree from './OrgnztTree'
import OrgnztInfo from './OrgnztInfo'
import OrgnztModal from './OrgnztModal'
import TreeList from '@/components/common/tree/TreeOrgnztList'

export default {
  metaInfo: {
    title: '조직관리'
  },
  components: {
    'orgnzt-tree': OrgnztTree,
    'orgnzt-info': OrgnztInfo,
    'orgnzt-modal': OrgnztModal,
    'tree-list': TreeList
  },
  data () {
    return {
      treeData: [],
      clickedInfo: {
        useYn: ''
      },
      clickedChildrenInfo: {},
      modalInfo: {},
      modalOpenMode: '',

      fields: [
        { key: 'selected', label: '', tdClass: 'cursor-pointer' },
        { key: 'orgnztUnitNo', label: '조직단위번호', tdClass: 'cursor-pointer' },
        { key: 'upOrgnztUnitNo', label: '상위조직단번호', tdClass: 'cursor-pointer' },
        { key: 'name', label: '조직명', tdClass: 'cursor-pointer' },
        { key: 'fullName', label: '조직 전체명', tdClass: 'cursor-pointer' },
        { key: 'webUrl', label: '웹 사이트 주소', tdClass: 'cursor-pointer' }
      ],

      currentPage: 1
    }
  },
  created () {
    this.$on('getInfo', this.getInfo)
    this.$on('openModal', this.openModal) // OrgnztInfo 저장 버튼 클릭 이벤트 발생
    this.$on('delete', this.delete)
    this.$on('rowClicked', this.rowClicked) // TreeView 저장 버튼 클릭 이벤트 발생
  },
  methods: {
    getInfo (orgnztUnitNo) {
      this.$http.get('/orgnzt/' + orgnztUnitNo)
        .then(
          (result) => {
            this.clickedInfo = result.data['resultObject']
            this.clickedChildrenInfo = this.clickedInfo['orgnztChildren']
          }
        )
      this.currentPage = 1
    },

    openModal (passedValue) {
      if (typeof passedValue === 'object') { // 수정
        this.modalOpenMode = 'PUT'
        this.modalInfo = this.$commons.cloneProp(passedValue)
      } else if (typeof passedValue === 'number') { // 등록
        this.modalOpenMode = 'POST'
        this.modalInfo = {
          upOrgnztUnitNo: passedValue,
          upOrgnztUnitName: this.clickedInfo.name
        }
      }

      this.$refs.bModal.show()
    },

    saveModal (evt) {
      evt.preventDefault()

      if (!this.modalInfo.name) {
        alert('조직명을 입력하세요.')
      } else if (!this.modalInfo.useYn) {
        alert('사용여부를 선택하세요.')
      } else {
        if (confirm('저장하시겠습니까?')) {
          this.saveProc()
        }
      }
    },

    saveProc () {
      if (this.modalOpenMode === 'PUT') {
        this.modalInfo.orgnztChildren = null // 수정시 하위메뉴 있을때, List로 받지못하여 오류 > null처리. 수정시 사용하지도 않음 sjkim
        this.$http.put('/orgnzt', this.modalInfo)
          .then(
            (result) => {
              this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>저장이 완료되었습니다.`, {theme: 'bubble', duration: 3000})
              this.clickedInfo = result.data.resultObject
            }
          )
          .then(
            () => {
              this.$refs.bModal.hide()
            }
          )
      } else {
        this.$http.post('/orgnzt', this.modalInfo)
          .then(
            (result) => {
              this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>저장이 완료되었습니다.`, {theme: 'bubble', duration: 3000})
              this.clickedNode.model.icon = ''
              if (this.clickedNode.model.children === null) this.clickedNode.model.children = []
              this.clickedNode.model.addChild(this.$tree.init(result.data.resultObject))
            }
          )
          .then(
            () => {
              this.$refs.bModal.hide()
            }
          )
      }
    },

    delete () {
      if (confirm(`'${this.clickedInfo.name}' 조직을 삭제하시겠습니까?`)) {
        this.$http.delete('/orgnzt/' + this.clickedInfo.orgnztUnitNo)
          .then(
            (response) => {
              if (response.data.apiStatus === 'BAD_REQUEST') {
                alert(response.data.message)
              } else if (response.data.apiStatus === 'SUCCESS') {
                this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>삭제가 완료되었습니다.`, {theme: 'bubble', duration: 3000})

                if (this.clickedNode.$parent.$children.length === 1) {
                  this.clickedNode.$parent.data.children = []
                  this.clickedNode.$parent.data.icon = 'ion ion-md-document'
                } else {
                  this.clickedNode.$parent.$children.forEach((e, i) => {
                    if (e.data.orgnztUnitNo === this.clickedInfo.orgnztUnitNo) {
                      e.$parent.model.children.splice(i, 1)
                    }
                  })
                }
              }
            }
          )
      }
    },

    // List Table Click Event
    rowClicked (row) {
      this.clickedInfo = row
      // this.clickedParentText = this.clickedNodeInfo.text
    }
  }
}
</script>

<style scoped>

</style>
