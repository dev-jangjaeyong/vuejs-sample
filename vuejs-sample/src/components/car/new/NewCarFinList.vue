<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">차량정보 관리 /</span> 신차금융
    </h4>

    <div class="ui-bordered px-4 pt-4 mb-4">
      <div class="form-row align-items-center">
        <div class="col-md mb-4">
          <label class="form-label">금융유형</label>
          <b-form-select v-model="searchParameters.itemTyCd" :options="itemTyCdOptions">
            <template slot="first">
              <option value="">전체</option>
            </template>
          </b-form-select>
        </div>
        <div class="col-md mb-4">
          <label class="form-label">제조사</label>
          <b-form-select v-model="searchParameters.brandNo" @change="loadModelCombo">
            <option value="">전체</option>
            <option v-for="option in brandOptions" v-bind:value="option.brandNo">
              {{ option.brandName }}
            </option>
          </b-form-select>
        </div>
        <div class="col-md mb-4">
          <label class="form-label">모델</label>
          <b-form-select v-model="searchParameters.modelNo">
            <option value="">전체</option>
            <option v-for="option in modelOptions" v-bind:value="option.modelNo">
              {{ option.modelName }}
            </option>
          </b-form-select>
        </div>
        <div class="col-md-2 mb-4">
          <label class="form-label d-none d-md-block">&nbsp;</label>
          <b-btn variant="secondary" :block="true" @click="filterSearch">검색</b-btn>
        </div>
      </div>
    </div>

    <b-card>
      <!-- Table -->
      <h5 slot="header" class="mb-0">신차 목록</h5>
      <b-card-body class="pb-0">
        <b-table
          v-if="tableData.length !== 0"
          :items="tableData"
          :fields="fields"
          :per-page="perPage"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :striped="true"
          :bordered="true"
          @row-clicked="clickModal"
          class="card-table">
          <template slot="table-colgroup">
            <col span="1" width="8%" />
            <col span="1" width="8%" />
            <col span="1" width="10%" />
            <col span="1" width="19%" />
            <col span="1" width="10%" />
            <col span="1" width="7%" />
            <col span="1" width="8%" />
            <col span="1" width="15%" />
            <col span="1" width="15%" />
          </template>
        </b-table>

        <!-- Pagination -->
        <pagination :total-size="totalSize" :current-page="currentPage" :per-page="perPage"></pagination>
      </b-card-body>

      <b-card-footer class="mt-3">
        <b-btn variant="primary" class="d-block float-right" @click="openModal">등록</b-btn>
      </b-card-footer>
    </b-card>

    <b-modal ref="modal" size="lg" hide-footer>
      <div slot="modal-title">
        신차금융 관리
      </div>
      <sub-modal :modal-data="modalData" :brand-options="newCarOptions" ref="NewCarFinModal"></sub-modal>
    </b-modal>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>

<script>
import flatPickr from 'vue-flatpickr-component'
import NewCarFinModal from './NewCarFinModal'
import Pagination from '@/components/common/pagination/Pagination'

export default {
  components: {
    'flat-pickr': flatPickr,
    'pagination': Pagination,
    'sub-modal': NewCarFinModal
  },

  data: () => ({
    // Options
    searchParameters: {
      'itemTyCd': '',
      'brandNo': '',
      'modelNo': ''
    },

    newCarOptions: [],
    itemTyCdOptions: [],
    brandOptions: [],
    modelOptions: [],
    sortBy: 'model',
    sortDesc: true,

    // page
    perPage: 10,
    currentPage: 1,
    perPageOptions: [10, 20, 30, 40, 50],
    totalCount: 0,
    totalSize: 0,

    // table 정보
    tableData: [],
    modalData: { registerInfo: {} },
    modalMode: '',
    fields: [
      // { key: 'bannerNo', sortable: false, tdClass: 'align-middle', label: 'NO' },
      {key: 'itemTyCd', sortable: false, tdClass: 'align-middle', label: '금융유형', 'class': 'text-center'},
      {key: 'brandName', sortable: false, tdClass: 'align-middle subject', label: '제조사', 'class': 'text-center'},
      {key: 'modelName', sortable: false, tdClass: 'align-middle subject', label: '모델', 'class': 'text-center'},
      {key: 'lineUpName', sortable: false, tdClass: 'align-middle subject', label: '라인업', 'class': 'text-center'},
      {key: 'monthCost', sortable: false, tdClass: 'align-middle subject text-right', label: '월불입금', thClass: 'text-center'},
      {key: 'term', sortable: false, tdClass: 'align-middle subject text-right', label: '기간', thClass: 'text-center'},
      {key: 'advancePay', sortable: false, tdClass: 'align-middle subject text-right', label: '선수금', thClass: 'text-center'},
      {key: 'createDt', sortable: false, tdClass: 'align-middle', label: '등록일시', 'class': 'text-center'},
      {key: 'updateDt', sortable: false, tdClass: 'align-middle', label: '수정일시', 'class': 'text-center'}
    ],
    flatConfig: {
      altFormat: 'Y-m-d',
      dateFormat: 'Y-m-d',
      altInput: true,
      animate: true
    }
  }),

  created () {
    this.loadUserItemTypeCodeCombo()
    this.loadBrandCombo()

    this.loadTableData()

    this.$on('closeModal', this.closeModal)
    this.$on('deleteModal', this.deleteModal)
    this.$on('saveModal', this.saveModal)
    this.$on('changePaging', this.changePaging)
  },

  methods: {
    loadTableData () {
      this.searchParameters['currentPageNo'] = this.currentPage
      this.searchParameters['rowsPerPage'] = this.perPage
      this.searchParameters['startNumber'] = (this.currentPage - 1) * this.perPage + 1
      this.searchParameters['endNumber'] = this.searchParameters['startNumber'] + this.perPage - 1

      const parameters = {
        params: this.searchParameters
      }

      this.$http.get('/newcar/finlist', parameters)
        .then(
          (result) => {
            this.tableData = result.data['resultList']
            this.totalSize = result.data['resultCount']
          }
        )
    },

    loadUserItemTypeCodeCombo () {
      const parameter = '?codeLv2=FINTYPE&lv=3'
      this.loadCombo(parameter, 'itemTyCdOptions')
    },

    loadCombo (parameter, type) {
      this.$http.get(`/code/combo${parameter}`)
        .then(
          (result) => {
            this[type] = this.$commons.clone(result.data['resultList'])
          }
        )
    },

    loadBrandCombo () {
      this.$http.get(`/newcar/brand`)
        .then(
          (result) => {
            this.brandOptions = result.data['resultList']
          }
        )
    },

    loadModelCombo () {
      setTimeout(() => {
        // brand선택된 경우만 조회
        if (this.searchParameters['brandNo'] === '') {
          this.modelOptions = []
        } else {
          this.$http.get(`/newcar/model?brandNo=` + this.searchParameters['brandNo'])
            .then(
              (result) => {
                this.modelOptions = result.data['resultList']
              }
            )
        }
      }, 0)
    },

    clickModal (node) {
      this.modalMode = 'PUT'
      this.modalData = this.$commons.clone(node)
      this.$refs.modal.show()
    },

    // Close Modal
    closeModal () {
      this.$refs.modal.hide()
    },

    // 삭제 process
    deleteModal () {
      if (confirm('삭제하시겠습니까?')) {
        let param = '?baseDt=' + this.modalData.baseDt + '&brandNo=' + this.modalData.brandNo + '&modelNo=' + this.modalData.modelNo + '&lineUpNo=' + this.modalData.lineUpNo + '&itemTyCd=' + this.modalData.itemTyCd
        this.$http.delete(`/newcar/car-price` + param)
          .then(
            (result) => {
              this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>삭제가 완료되었습니다.`, {theme: 'bubble', duration: 3000})
              this.$refs.modal.hide()
              this.loadTableData()
            }
          )
      }
    },

    // 수정 process
    saveModal () {
      if (this.modalMode === 'PUT') {
        this.$http.put('/newcar/car-price', this.modalData)
          .then(
            () => {
              this.afterProcess()
            }
          )
      } else if (this.modalMode === 'POST') {
        this.$http.post('/newcar/car-price', this.modalData)
          .then(
            () => {
              this.afterProcess()
            }
          ).catch(error => {
            if (error.response.data.apiStatus === 'DUPLICATE') {
              alert('등록에 실패하였습니다. 중복된 key입니다.')
            }
          })
      }
    },

    // after process
    afterProcess () {
      this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>저장이 완료되었습니다.`, {theme: 'bubble', duration: 3000})
      this.$refs.modal.hide()
      this.loadTableData()
    },

    // filter Search
    filterSearch () {
      this.currentPage = 1
      this.loadTableData()
    },

    // Paging
    changePaging (page) {
      this.currentPage = page
      this.loadTableData()
      // Paging
      this.$refs.table.refresh()
    },

    openModal () {
      // 등록하는 경우
      this.modalMode = 'POST'
      this.modalData = {
        brandName: '',
        modelName: '',
        lineUpName: ''
      }
      this.$refs.modal.show()
    }
  }
}
</script>

<style scoped>

</style>
