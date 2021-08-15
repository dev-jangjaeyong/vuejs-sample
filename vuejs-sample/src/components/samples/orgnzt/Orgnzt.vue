<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">공통 /</span> 조직
    </h4>

    <hr class="border-light container-m--x mt-0">

    <div class="row">
      <div class="col-md-6">
        <b-card header-tag="header" class="mb-4">
          <h4 slot="header" class="mb-0">조직 목록</h4>
          <orgnzt-level-one :orgnzt-level-one-list="orgnztLevelOneList"></orgnzt-level-one>
        </b-card>
      </div>
      <div class="col-md-6">
        <b-card header-tag="header" class="mb-4">
          <h4 slot="header" class="mb-0">조직 목록</h4>
          <orgnzt-level-two :orgnzt-level-two-list="orgnztLevelTwoList"></orgnzt-level-two>
        </b-card>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <b-card header-tag="header" class="mb-4">
          <h4 slot="header" class="mb-0">조직 목록</h4>
          <orgnzt-tree :tree-data="treeData" :clicked-info="clickedInfo" ref="tree"></orgnzt-tree>
        </b-card>
      </div>
      <div class="col-md-6">
        <b-card header-tag="header" class="mb-4">
          <h4 slot="header" class="mb-0">조직 정보</h4>
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
  import OrgnztLevelOne from './OrgnztLevelOne'
  import OrgnztLevelTwo from './OrgnztLevelTwo'
  import OrgnztTree from './OrgnztTree'
  import OrgnztInfo from './OrgnztInfo'
  import OrgnztModal from './OrgnztModal'

  export default {
  metaInfo: {
    title: "조직관리"
  },
  components: {
    'orgnzt-level-one': OrgnztLevelOne,
    'orgnzt-level-two': OrgnztLevelTwo,
    'orgnzt-tree': OrgnztTree,
    'orgnzt-info': OrgnztInfo,
    'orgnzt-modal': OrgnztModal
  },
  data () {
    return {
      orgnztLevelOneList: [],
      orgnztLevelTwoList: [],
      treeData: [],
      clickedNode: {}, // 현재 클릭된 노드.
      clickedInfo: {useYn: ''},
      modalInfo: {},
      modalOpenMode: ''
    }
  },
  created () {
    this.load(1)

    this.$on('getInfo', this.getInfo)
    this.$on('nodeClicked', this.nodeClicked) // OrgnztTree 노드 클릭 이벤트 발생.
    this.$on('openModal', this.openModal) // OrgnztInfo 저장 버튼 클릭 이벤트 발생
    this.$on('delete', this.delete)
  },
  methods: {
    load (level, upOrgnztUnitNo) {
      let params = {
        params: {
          level: level,
          upOrgnztUnitNo: upOrgnztUnitNo || null
        }
      }

      this.$http.get('/orgnzt', params)
        .then(
          (result) => {
            let resultList = result.data.resultList

            if (level === 1) {
              this.orgnztLevelOneList = resultList
            } else if (level === 2) {
              this.orgnztLevelTwoList = resultList
              this.treeData = [] // 초기화
            } else {
              this.treeData = resultList
            }
          }
        )
    },

    getInfo (orgnztUnitNo, nextLevel) {
      this.$http.get('/orgnzt/' + orgnztUnitNo)
        .then(
          (result) => {
            this.clickedInfo = result.data.resultObject
            this.clickedInfo.currLv = nextLevel - 1
            this.clickedInfo.nextLv = nextLevel
          }
        )

      if (nextLevel <= 3) { // 1, 2레벨 클릭시 하위 레벨 정보, 트리 조회
        this.load(nextLevel, orgnztUnitNo)
      }
    },

    nodeClicked (clickedNode) {
      this.clickedNode = clickedNode
    },

    openModal (passedValue) {
      if (typeof passedValue === 'object') { // 수정
        this.modalOpenMode = 'PUT'
        this.modalInfo = this.$commons.cloneProp(passedValue)
      } else if (typeof passedValue === 'number') { // 등록
        this.modalOpenMode = 'POST'
        this.modalInfo = {
          upOrgnztUnitNo: passedValue,
          upOrgnztUnitName: this.clickedInfo.name,
          lv: this.clickedInfo.nextLv
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
        this.$http.put('/orgnzt', this.modalInfo)
          .then(
            (result) => {
              alert('저장이 완료되었습니다.')

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
              alert('저장이 완료되었습니다.')

              if (this.modalInfo.lv === 2) { // 2레벨 조직 등록시
                this.load(2, this.modalInfo.upOrgnztUnitNo)
              } else if (this.modalInfo.lv >= 3) { // 3레벨 이하 조직 등록시
                this.clickedNode.model.icon = ''

                if (this.clickedNode.model.children === null) this.clickedNode.model.children = []

                this.clickedNode.model.addChild(this.$tree.init(result.data.resultObject))
              }
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
                alert('삭제가 완료되었습니다.')

                if (this.clickedInfo.currLv <= 2) { // 1, 2레벨일때
                  this.getInfo(this.clickedInfo.upOrgnztUnitNo, this.clickedInfo.currLv)
                  this.clickedInfo = {useYn: ''}
                } else { // 3레벨 이하일때
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
            }
          )
      }
    }
  }
}
</script>

<style scoped>

</style>
