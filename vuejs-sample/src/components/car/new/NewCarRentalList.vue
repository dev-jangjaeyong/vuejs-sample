<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">차량정보 관리 /</span> 신차금융(렌탈)
    </h4>

    <div class="ui-bordered px-4 pt-4 mb-4">
      <div class="form-row align-items-center">
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
        <div class="col-md mb-4">
          <label class="form-label">사용여부</label>
          <b-form-select v-model="searchParameters.useYn">
            <option value="">전체</option>
            <option value="Y">사용</option>
            <option value="N">미사용</option>
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
            <col span="1" width="7%" />
            <col span="1" width="8%" />
            <col span="1" width="7%" />
            <col span="1" width="10%" />
            <col span="1" width="10%" />
            <col span="1" width="10%" />
            <col span="1" width="7%" />
            <col span="1" width="10%" />
            <col span="1" width="10%" />
            <col span="1" width="10%" />
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
        신차금융 관리(렌탈)
      </div>
      <sub-modal :modal-data="modalData" :brand-options="brandOptions" ref="NewCarRentalModal"></sub-modal>
    </b-modal>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>

<script>
import flatPickr from 'vue-flatpickr-component'
import NewCarRentalModal from './NewCarRentalModal'
import Pagination from '@/components/common/pagination/Pagination'

export default {
  components: {
    'flat-pickr': flatPickr,
    'pagination': Pagination,
    'sub-modal': NewCarRentalModal
  },

  data: () => ({
    // Options
    searchParameters: {
      'brandNo': '',
      'modelNo': '',
      'useYn': ''
    },
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
      {key: 'brandName', sortable: false, tdClass: 'align-middle subject', label: '제조사', 'class': 'text-center'},
      {key: 'modelName', sortable: false, tdClass: 'align-middle subject', label: '모델', 'class': 'text-center'},
      {key: 'lineUpName', sortable: false, tdClass: 'align-middle subject', label: '라인업', 'class': 'text-center'},
      {key: 'carGradeName', sortable: false, tdClass: 'align-middle subject', label: '등급', 'class': 'text-center'},
      {key: 'finalRentalFee', sortable: false, tdClass: 'align-middle subject text-right', label: '최종렌트료', thClass: 'text-center'},
      {key: 'interestRate', sortable: false, tdClass: 'align-middle subject text-right', label: '금리', thClass: 'text-center'},
      {key: 'residualRate', sortable: false, tdClass: 'align-middle subject text-right', label: '잔가율', thClass: 'text-center'},
      {key: 'residualAmt', sortable: false, tdClass: 'align-middle subject text-right', label: '잔가금액', thClass: 'text-center'},
      {key: 'useYn', sortable: false, tdClass: 'align-middle subject', label: '사용여부', 'class': 'text-center'},
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

      this.$http.get('/newcar/rentallist', parameters)
        .then(
          (result) => {
            this.tableData = result.data['resultList']
            this.totalSize = result.data['resultCount']
          }
        )
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

    openModal () {
      this.modalMode = 'POST'
      this.modalData = {
        brandName: '',
        modelName: '',
        lineUpName: '',
        carGradeName: ''
      }
      this.$refs.modal.show()
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
        let param = '?baseDt=' + this.modalData.baseDt + '&brandNo=' + this.modalData.brandNo + '&modelNo=' + this.modalData.modelNo + '&lineUpNo=' + this.modalData.lineUpNo + '&carGradeNo=' + this.modalData.carGradeNo
        this.$http.delete(`/newcar/car-rental-price` + param)
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
        this.$http.put('/newcar/car-rental-price', this.modalData)
          .then(
            () => {
              this.afterProcess()
            }
          )
      } else if (this.modalMode === 'POST') {
        this.$http.post('/newcar/car-rental-price', this.modalData)
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
    }
  }
}
</script>

<style scoped>

</style>
