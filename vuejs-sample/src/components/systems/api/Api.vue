<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">시스템 /</span> API 관리
    </h4>

    <hr class="border-light container-m--x mt-0">

    <div class="ui-bordered px-4 pt-4 mb-4">
      <div class="form-row align-items-center">
        <div class="col-md mb-4">
          <label class="form-label">HTTP Method</label>
          <b-form-select v-model="searchParameters.methodName" :options="options.methodNameOptions">
            <template slot="first">
              <option value="">전체</option>
            </template>
          </b-form-select>
        </div>
        <div class="col-md mb-4">
          <label class="form-label">API명</label>
          <b-input placeholder="API명 검색" v-model="searchParameters.apiName" />
        </div>
        <div class="col-md mb-4">
          <label class="form-label">URL</label>
          <b-input placeholder="URL 검색" v-model="searchParameters.apiUrl" />
        </div>
        <div class="col-md col-xl-2 mb-4">
          <label class="form-label d-none d-md-block">&nbsp;</label>
          <b-btn variant="secondary" :block="true" @click="filterSearch">검색</b-btn>
        </div>
      </div>
    </div>

    <b-card>
      <h5 slot="header" class="mb-0">API 목록</h5>
      <b-card-body>
        <b-table show-empty
          ref="table"
          :items="getList"
          :fields="fields"
          :per-page="perPage"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :striped="true"
          :bordered="true"
          :busy.sync="isBusy"
          :hover="true"
          @row-clicked="rowClicked">

          <template slot="radioButton" slot-scope="row">
            <b-form-checkbox
              v-model="row.item.selected"
              :disabled="true"></b-form-checkbox>
          </template>

          <template slot="table-colgroup">
            <col span="1" width="1%" />
          </template>

        </b-table>

        <!-- Pagination -->
        <pagination :total-size="totalSize" :current-page="currentPage" :per-page="perPage"></pagination>

      </b-card-body>
      <b-card-footer>
        <div>
          <span class="float-left">
            <b-btn id="btnDelete" variant="default" :disabled="clickedRowInfo.apiNo === undefined" @click="removeModal">삭제</b-btn>
          </span>
          <span class="float-right">
            <b-btn id="btnUpdate" variant="secondary" :disabled="clickedRowInfo.apiNo === undefined" @click="openModal(false)">상세</b-btn>
            <b-btn variant="primary" @click="openModal(true)">등록</b-btn>
          </span>
        </div>
      </b-card-footer>
    </b-card>

    <b-modal ref="modal" size="md" hide-footer>
      <div slot="modal-title">{{openModalTitle}}</div>
      <api-modal ref="apiModal" :api-modal-info="modalRowInfo" :modal-mode="openModalMode" :options="options"></api-modal>
    </b-modal>
  </div>
</template>

<script>
import Pagination from '@/components/common/pagination/Pagination'
import ApiModal from './ApiModal'
// import Type1Modal from '@/components/common/modal/Type1Modal'

export default {
  components: {
    'pagination': Pagination,
    'api-modal': ApiModal
  },
  data: () => ({
    // option 정보
    options: {
      methodNameOptions: [
        { value: 'POST', text: 'POST' },
        { value: 'PUT', text: 'PUT' },
        { value: 'GET', text: 'GET' },
        { value: 'DELETE', text: 'DELETE' }
      ],
      apiClassTyCdOptions: [
        {value: '200', text: '개별'},
        {value: '100', text: '그룹'}
      ]
    },

    tableData: [],
    // row 정보
    clickedRowInfo: {},
    clickedIndex: 0,

    // modal Options
    modalRowInfo: {},
    openModalMode: '',
    openModalTitle: '',

    // page
    perPage: 10,
    currentPage: 1,
    perPageOptions: [10, 20, 30, 40, 50],
    totalCount: 0,
    totalSize: 0,

    // table loading
    isBusy: false,

    // field
    fields: [
      { key: 'radioButton', sortable: false, tdClass: 'align-middle', label: '' },
      { key: 'apiNo', sortable: true, tdClass: 'align-middle', label: 'API ID', 'class': 'text-center' },
      { key: 'apiName', sortable: false, tdClass: 'align-middle', label: 'API명', 'class': 'text-center' },
      { key: 'apiClassTyCdName', sortable: true, tdClass: 'align-middle', label: '분류', 'class': 'text-center' },
      { key: 'methodName', sortable: true, tdClass: 'align-middle', label: 'HTTP Method', 'class': 'text-center' },
      { key: 'apiUrl', sortable: true, tdClass: 'align-middle', label: 'URL', 'class': 'text-center' },
      { key: 'dscrp', sortable: false, tdClass: 'align-middle', label: '설명', 'class': 'text-center' }
    ],

    // Filter Options
    searchParameters: {
      methodName: '',
      order: null,
      orderDesc: ''
    },
    // sort
    sortBy: 'apiNo',
    sortDesc: false,
    selected: ''
  }),

  created () {
    /* this.loadData() */

    this.$on('saveModal', this.saveModal) // 저장 이벤트
    this.$on('removeModal', this.removeModal) // 삭제 이벤트
    this.$on('changePaging', this.changePaging)
  },

  methods: {
    // API Data Load
    getList (ctx) {
      this.isBusy = true
      this.searchParameters['currentPageNo'] = this.currentPage
      this.searchParameters['rowsPerPage'] = this.perPage
      this.searchParameters['startNumber'] = (this.currentPage - 1) * this.perPage + 1
      this.searchParameters['endNumber'] = this.searchParameters['startNumber'] + this.perPage - 1

      const parameters = {
        params: this.searchParameters
      }

      if (ctx !== undefined) {
        if (ctx.sortBy !== undefined) {
          switch (ctx.sortBy) {
            case 'apiNo': this.searchParameters['order'] = 1; break
            case 'apiClassTyCdName': this.searchParameters['order'] = 2; break
            case 'methodName': this.searchParameters['order'] = 3; break
            case 'apiUrl': this.searchParameters['order'] = 4; break
            default: break
          }
        }

        if (ctx.sortDesc !== undefined) {
          switch (ctx.sortDesc) {
            case true: this.searchParameters['orderDesc'] = 'DESC'; break
            case false: this.searchParameters['orderDesc'] = 'ASC'; break
            default: break
          }
        }
      }

      return getlist(parameters, this)

      function getlist (parameters, _super) {
        return getApiList(parameters, _super)
      }

      function getApiList (parameters, _super) {
        return _super.$http.get('/api', parameters)
          .then(
            (result) => {
              _super.tableData = result.data['resultList']
              _super.tableData.forEach((value) => {
                value.selected = false
              })

              _super.isBusy = false
              _super.totalSize = result.data['resultCount']
              return _super.tableData
            })
      }
    },

    // Row 클릭
    rowClicked (item, index, event) {
      if (this.clickedRowInfo.apiNo === undefined || this.clickedIndex !== index) {
        this.clickedIndex = index
        this.clickedRowInfo = item
      } else {
        this.clickedRowInfo = {}
      }

      this.tableData.forEach((value, idx) => {
        if (this.clickedIndex === idx && this.clickedRowInfo.apiNo !== undefined) {
          value._rowVariant = 'info'
          value.selected = true
        } else {
          value._rowVariant = ''
          value.selected = false
        }
      })

      this.$forceUpdate()
    },

    // Open ApiModal
    openModal (flag) {
      if (flag) {
        // Row 등록 Modal Open
        this.openModalTitle = 'API 등록'
        this.openModalMode = 'POST'
        this.modalRowInfo = {}
      } else {
        // Row 수정 Model Open
        this.openModalTitle = 'API 상세'
        this.openModalMode = 'PUT'
        this.modalRowInfo = this.$commons.clone(this.clickedRowInfo)
      }

      this.$refs.modal.show()
    },

    // Close Modal
    closeModal () {
      this.$refs.modal.hide()
    },

    // Save Modal
    saveModal () {
      /* console.log(this.modalRowInf)
      if (!this.modalRowInfo.apiNo) {
        alert('ID를 입력하세요')
        return
      } */

      if (this.openModalMode === 'POST') {
        this.$http.post('/api', this.modalRowInfo)
          .then(
            (response) => {
              this.afterSaveModal(response.data['resultObject'])
            }
          )
      } else {
        this.$http.put('/api', this.modalRowInfo)
          .then(
            (response) => {
              this.afterSaveModal(response.data['resultObject'])
            }
          )
      }
    },

    // 저장 프로세스 후처리
    afterSaveModal (response) {
      this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>저장이 완료되었습니다.`, {theme: 'bubble', duration: 3000})
      // this.$commons.copyObject(this.tableData[this.clickedIndex], response)
      this.$refs.modal.hide()
      this.getList()
      this.$refs.table.refresh()
    },

    // 삭제 프로세스
    removeModal () {
      if (confirm('삭제하시겠습니까?')) {
        this.$http.delete('/api/' + this.clickedRowInfo.apiNo)
          .then(
            (result) => {
              if (result.data['resultCount'] > 0) {
                this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>삭제가 완료되었습니다.`, {theme: 'bubble', duration: 3000})
                this.$refs.modal.hide()
                this.getList()
                this.$refs.table.refresh()
              } else {
                alert('삭제에 실패했습니다.')
              }
            }
          )
      }
    },

    // filter Search
    filterSearch () {
      this.currentPage = 1
      this.getList()
      this.$refs.table.refresh()
    },

    // Paging
    changePaging (page) {
      this.currentPage = page
      this.getList()
      this.$refs.table.refresh()
    }
  }
}
</script>
