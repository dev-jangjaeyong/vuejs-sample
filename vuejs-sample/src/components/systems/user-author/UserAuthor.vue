<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">시스템 /</span> 사용자권한관리
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
          <h5 slot="header" class="mb-0">사용자 목록</h5>
          <b-form class="mb-2" v-if="this.authorNo != ''">
            <b-form-row>
              <b-form-group class="col-md-3" label="사용자유형">
                <b-form-select v-model="params.userTyCd" :options="userTypeOptions">
                  <template slot="first">
                    <option value="" selected>전체</option>
                  </template>
                </b-form-select>
              </b-form-group>
              <b-form-group class="col-md-3" label="사용자ID">
                <b-input type="text" placeholder="사용자ID" v-model="params.userId"></b-input>
              </b-form-group>
              <b-form-group class="col-md-3" label="사용자명">
                <b-input type="text" placeholder="사용자명" v-model="params.userName"></b-input>
              </b-form-group>
              <b-form-group class="col-md-2" label-text-align="right" label="&nbsp;">
                <b-btn type="button" variant="secondary" :disabled="this.authorNo === ''" @click="loadUserList(authorNo, 1)">조회</b-btn>
              </b-form-group>
            </b-form-row>
          </b-form>
          <user-list :user-list-data="userListData" :total-rows="totalRows" :current-page="currentPage" ref="userList" :author-no="this.authorNo"></user-list>
          <!--<b-pagination align="center" size="sm" class="mt-4" :total-rows="totalRows" v-model="currentPage" :per-page="10" @input="changePage" v-if="userListData.length !== 0"></b-pagination>-->
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import AuthorTree from './AuthorTree'
import UserList from './UserList'

export default {
  metaInfo: {
    title: '사용자권한관리'
  },
  components: {
    'author-tree': AuthorTree,
    'user-list': UserList
  },
  data () {
    return {
      authTreeData: [],
      userListData: [],
      userTypeOptions: [],
      authorNo: '',
      prmisnAuthorTyCd: '',
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      params: {
        userId: '',
        userName: '',
        userTyCd: ''
      }
    }
  },
  created () {
    this.loadAuthTree()
    this.loaduserTypeCombo()

    this.$on('authorNodeClick', this.loadUserList)
    this.$on('changePage', this.changePage)
    this.$on('save', this.save)
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

    loadUserList (authorNo, pageNumber) {
      if (pageNumber === undefined) {
        pageNumber = 1
      }
      this.currentPage = pageNumber

      this.startNumber = (this.currentPage - 1) * this.perPage + 1
      this.endNumber = this.startNumber + this.perPage - 1

      let params = {
        params: {
          userId: this.params.userId,
          userName: this.params.userName,
          userTyCd: this.params.userTyCd,
          currentPageNo: pageNumber,
          rowsPerPage: this.perPage,
          startNumber: this.startNumber,
          endNumber: this.endNumber
        }
      }

      this.$http.get('/user-author/' + authorNo, params)
        .then(
          (result) => {
            this.userListData = result.data.resultList
            this.totalRows = result.data.resultCount
          }
        )
    },

    loaduserTypeCombo () {
      const parameter = '?codeLv2=USER_TYPE&lv=3'
      this.loadCombo(parameter, 'userTypeOptions')
    },

    loadCombo (parameter, type) {
      this.$http.get(`/code/combo${parameter}`)
        .then(
          (result) => {
            this[type] = this.$commons.clone(result.data['resultList'])
          }
        )
    },

    save (requestUserAuthor) {
      let requestParams = {
        userAuthors: requestUserAuthor
      }

      this.$http.put('/user-author', requestParams)
        .then(
          (result) => {
            this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>저장이 완료되었습니다.`, {theme: 'bubble', duration: 3000})

            this.loadUserList(this.authorNo)
          }
        )
    },

    changePage (pageNumber) {
      this.loadUserList(this.authorNo, pageNumber)
    }
  }
}
</script>

<style scoped>

</style>
