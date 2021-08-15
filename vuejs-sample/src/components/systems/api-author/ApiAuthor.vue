<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">시스템 /</span> API 권한관리
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
          <h5 slot="header" class="mb-0">API 목록</h5>
          <api-list :api-list-data="apiListData" ref="apiList"></api-list>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import AuthorTree from './AuthorTree'
import ApiList from './ApiList'

export default {
  metaInfo: {
    title: 'API권한관리'
  },
  components: {
    'author-tree': AuthorTree,
    'api-list': ApiList
  },
  data () {
    return {
      authTreeData: [],
      apiListData: [],
      authorNo: '',
      prmisnAuthorTyCd: ''
    }
  },
  created () {
    this.loadAuthTree()

    this.$on('authorNodeClick', this.loadApiList)
    this.$on('clearApiList', this.clearApiList)
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

    loadApiList (authorNo) {
      this.$http.get('api-author/' + authorNo)
        .then(
          (result) => {
            this.apiListData = result.data.resultList
          }
        )
    },

    clearApiList () {
      this.apiListData = []
    },

    save (requestApiAuthor) {
      let requestParams = {
        apiAuthors: requestApiAuthor
      }

      this.$http.put('/api-author', requestParams)
        .then(
          (result) => {
            this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>저장이 완료되었습니다.`, {theme: 'bubble', duration: 3000})

            this.loadApiList(this.authorNo)
          }
        )
    }
  }
}
</script>

<style scoped>

</style>
