<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">시스템 /</span> Menu
    </h4>

    <hr class="border-light container-m--x mt-0">

    <div class="row">
      <div class="col-md-4">
        <b-card header-tag="header" class="mb-4">
          <h5 slot="header" class="mb-0">메뉴 목록</h5>
          <menu-tree :menu-tree-data="menuTreeData" :clicked-menu-info="clickedMenuInfo" ref="menuTree"></menu-tree>
        </b-card>
      </div>
      <div class="col-md-8">
        <b-card header-tag="header" class="mb-4">
          <h5 slot="header" class="mb-0">메뉴 정보</h5>
          <menu-info :clicked-menu-info="clickedMenuInfo" ref="menuInfo"></menu-info>
        </b-card>
      </div>
    </div>

    <b-modal ref="modal" size="md" cancel-title="취소하기" ok-title="저장하기" @ok="saveModal">
      <div slot="modal-title">
        메뉴 정보
        <!--<small class="text-muted">We need payment information to process your order.</small>-->
      </div>
      <menu-modal :menu-info="modalMenuInfo"/>
    </b-modal>
  </div>
</template>

<script>
import MenuTree from './MenuTree'
import MenuInfo from './MenuInfo'
import MenuModal from './MenuModal'

export default {
  metaInfo: {
    title: '메뉴관리'
  },
  components: {
    'menu-tree': MenuTree,
    'menu-info': MenuInfo,
    'menu-modal': MenuModal
  },
  data () {
    return {
      menuTreeData: [],
      clickedNode: {}, // 현재 클릭된 노드.
      clickedMenuInfo: {},
      modalMenuInfo: {},
      modalOpenMode: ''
    }
  },
  created () {
    this.loadMenuTree()

    this.$on('treeNodeClick', this.treeNodeClick) // MenuTree 노드 클릭 이벤트 발생.
    this.$on('openModal', this.openModal) // MenuInfo 저장 버튼 클릭 이벤트 발생
    this.$on('remove', this.remove)
  },
  methods: {
    loadMenuTree () {
      this.$http.get('/menu/tree')
        .then(
          (result) => {
            this.menuTreeData = this.$tree.init(result.data.resultList)
            this.clickedMenuInfo = {}
            this.$refs.menuInfo.empty()
          }
        )
    },

    treeNodeClick (menuNo, clickedNode) {
      this.clickedNode = clickedNode
      this.$http.get('/menu/' + menuNo)
        .then(
          (result) => {
            this.clickedMenuInfo = result.data.resultObject
          }
        )
    },

    openModal (menuNo) {
      if (menuNo) {
        this.modalOpenMode = 'PUT'
        this.modalMenuInfo = this.$commons.clone(this.clickedMenuInfo)
      } else {
        this.modalOpenMode = 'POST'
        this.modalMenuInfo = {
          upMenuNo: this.clickedMenuInfo.menuNo,
          menuTyCd: ''
        }
      }

      this.$refs.modal.show()
    },

    saveModal (evt) {
      evt.preventDefault()

      if (!this.modalMenuInfo.menuName) {
        alert('메뉴명을 입력하세요.')
      } else {
        if (confirm('저장하시겠습니까?')) {
          this.saveProc()
        }
      }
    },

    saveProc () {
      if (this.modalOpenMode === 'POST') {
        this.$http.put('/menu', this.modalMenuInfo)
          .then(
            (result) => {
              alert('저장이 완료되었습니다.')

              this.clickedMenuInfo = result.data.resultObject
            }
          )
          .then(
            () => {
              this.$refs.modal.hide()
            }
          )
      } else {
        this.$http.post('/menu', this.modalMenuInfo)
          .then(
            (result) => {
              this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>저장이 완료되었습니다.`, {theme: 'bubble', duration: 3000})

              this.clickedMenuInfo = result.data.resultObject

              this.clickedNode.model.icon = ''

              if (this.clickedNode.model.children === null) this.clickedNode.model.children = []

              this.clickedNode.model.addChild(this.$tree.init(result.data.resultObject))
            }
          )
          .then(
            () => {
              this.$refs.modal.hide()
            }
          )
      }
    },

    remove () {
      if (confirm('삭제하시겠습니까?')) {
        this.$http.delete('/menu/' + this.clickedMenuInfo.menuNo)
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
                    if (e.data.menuNo === this.clickedMenuInfo.menuNo) {
                      e.$parent.model.children.splice(i, 1)
                    }
                  })
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
