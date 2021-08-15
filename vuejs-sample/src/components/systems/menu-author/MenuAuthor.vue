<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">시스템 /</span> 메뉴권한관리
    </h4>

    <hr class="border-light container-m--x mt-0">

    <div class="row">
      <div class="col-md-4">
        <b-card header-tag="header" class="mb-4">
          <h5 slot="header" class="mb-0">권한 목록</h5>
          <author-tree :auth-tree-data="authTreeData" ref="authTree"></author-tree>
        </b-card>
      </div>
      <div class="col-md-8">
        <b-card header-tag="header" class="mb-4">
          <h5 slot="header" class="mb-0">메뉴 목록</h5>
          <b-form class="mb-2">
            <b-form-row>
              <b-form-group class="col-md-3" label="메뉴채널">
                <b-form-select v-model="searchParameters.menuChnnlCode" :options="optionMenuChnnlCode" ref="menuSel" @input="changeSelect()">
                  <template slot="first">
                    <option value="">선택</option>
                  </template>
                </b-form-select>
              </b-form-group>
            </b-form-row>
          </b-form>
          <menu-tree :menu-tree-data="menuTreeData" ref="menuTree"></menu-tree>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import AuthorTree from './AuthorTree'
import MenuTree from './MenuTree'

export default {
  metaInfo: {
    title: '메뉴관한관리'
  },
  components: {
    'author-tree': AuthorTree,
    'menu-tree': MenuTree
  },
  data () {
    return {
      authTreeData: [],
      menuTreeData: [],
      authorNo: '',
      prmisnAuthorTyCd: '',
      upNodeNo: '',

      optionMenuChnnlCode: [],

      // 검색조건 추가.
      searchParameters: {
        menuChnnlCode: '',
        authorNo: ''
      }
    }
  },
  created () {
    this.loadAuthTree()
    this.loadMenuChnnlCombo()

    this.$on('authorNodeClick', this.loadMenuTree)
    this.$on('clearMenuTree', this.clearMenuTree)
    this.$on('save', this.save)
    this.$on('changePaging', this.changeSelect)
  },
  methods: {
    loadAuthTree () {
      this.$http.get('/author')
        .then(
          (result) => {
            this.authTreeData = this.$tree.init(result.data.resultList)
          }
        )
    },

    loadMenuTree () {
      this.searchParameters.authorNo = this.authorNo
      const parameters = {
        params: this.searchParameters
      }

      // this.$http.get('/menu-author/' + authorNo)
      this.$http.get('/menu-author', parameters)
        .then(
          (result) => {
            let defaultOptions = {
              opened: true
            }

            this.menuTreeData = this.$tree.init(result.data.resultList, defaultOptions)
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

    clearMenuTree () {
      this.menuTreeData = []
    },

    save: function (requestMenuAuthor) {
      let requestParams = {
        menuAuthors: requestMenuAuthor
      }

      this.$http.put('/menu-author', requestParams)
        .then(
          (result) => {
            this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>저장이 완료되었습니다.`, {theme: 'bubble', duration: 3000})

            this.loadMenuTree(this.authorNo)
          }
        )
    },

    changeSelect () {
      if (this.authorNo === '' || this.upNodeNo === 1 || this.upNodeNo === null) {
        alert('개별 권한유형을 선택해주세요.')
        return
      }

      this.loadMenuTree()
    }

  }
}
</script>

<style scoped>

</style>
