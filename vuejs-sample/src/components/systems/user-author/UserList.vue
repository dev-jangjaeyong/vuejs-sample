<template>
  <div>
    <div v-if="authorNo === ''" class="card text-center bg-transparent border-primary text-primary mt-4 mb-4">
      <div class="card-body">
        메뉴를 선택하세요.
      </div>
    </div>
    <b-table show-empty
             head-variant="dark"
             hover
             fixed
             small
             class="text-center"
             :fields="fields"
             :items="userListData"
             v-if="authorNo != ''"
             @row-clicked="rowClicked">
      <template slot="table-colgroup">
        <col width="40px" />
        <col />
        <col />
        <col />
      </template>
      <template slot="HEAD_selected" slot-scope="data">
          <i class="ion d-block ion-ios-checkbox h4 m-0"></i>
        </template>
        <template slot="selected" slot-scope="data">
        <b-form-checkbox disabled=disabled v-model="data.item.selected"></b-form-checkbox>
      </template>
    </b-table>
    <b-pagination align="center" size="sm" class="mt-4" :total-rows="totalRows" v-model="currentPage" :per-page="10" @input="changePage" v-if="userListData.length !== 0 && authorNo != ''"></b-pagination>
    <b-card-footer>
      <div class="text-right">
        <b-btn variant="primary" v-if="userListData.length !== 0" @click="save">저장</b-btn>
      </div>
    </b-card-footer>
  </div>
</template>

<style src="@/vendor/libs/vue-jstree/vue-jstree.scss" lang="scss"></style>

<script>
export default {
  name: 'UserList',
  props: ['userListData', 'totalRows', 'authorNo'],
  created () {
  },
  watch: {
    userListData () {
      this.userListData.forEach(d => {
        if (d.selected) d._rowVariant = 'success'
      })
    }
  },
  data () {
    return {
      currentPage: 1,
      fields: [{
        key: 'selected',
        label: '',
        tdClass: 'cursor-pointer'
      }, {
        key: 'userTyCdName',
        label: '사용자 유형',
        tdClass: 'cursor-pointer'
      }, {
        key: 'userId',
        label: 'ID',
        tdClass: 'cursor-pointer'
      }, {
        key: 'userName',
        label: '사용자명',
        tdClass: 'cursor-pointer'
      }]
    }
  },
  methods: {
    rowClicked (item, index, event) {
      item.selected = !item.selected

      if (item.selected) {
        item._rowVariant = 'success'
      } else {
        item._rowVariant = ''
      }

      this.$forceUpdate()
    },

    save () {
      if (confirm('사용자권한을 저장하시겠습니까?')) {
        this.$parent.$emit('save', this.getRequestUserAuthors())
      }
    },

    getRequestUserAuthors () {
      let requestParams = []

      this.userListData.forEach(r => {
        let param = {
          authorNo: this.$parent.authorNo,
          userNo: r.userNo,
          selected: r.selected
        }

        requestParams.push(param)
      })

      return requestParams
    },

    changePage (pageNumber) {
      this.$parent.$emit('changePage', pageNumber)
    }
  }
}
</script>

<style scoped>

</style>
