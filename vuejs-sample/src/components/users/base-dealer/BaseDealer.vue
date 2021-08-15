<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">회원관리 /</span> 딜러 기초데이터 관리
    </h4>

    <hr class="border-light container-m--x mt-0">

    <div class="ui-bordered px-4 pt-4 mb-4">
      <div class="form-row align-items-center">
        <div class="form-row">
          <div class="col-md mb-2">
            <label class="form-label">사원증 번호</label>
            <b-input placeholder="사원증 번호" v-model="searchParameters.licenseNo" />
          </div>
          <div class="col-md mb-4">
            <b-form-group label="사원증 시작일자">
              <datepicker
                v-model="searchParameters.searchStartDay"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                placeholder="Select arrival date"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
                :disabled-dates="disabledDates"
                :highlighted="highlightedDates"
                :format="customFormatter"/>
            </b-form-group>
          </div>
          <div class="col-md mb-4">
            <b-form-group label="사원증 종료일자">
              <datepicker
                v-model="searchParameters.searchEndDay"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                placeholder="Select arrival date"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
                :disabled-dates="disabledDates"
                :highlighted="highlightedDates"
                :format="customFormatter"/>
            </b-form-group>
          </div>
          <div class="col-md col-xl-2 mb-2">
            <label class="form-label d-none d-md-block">&nbsp;</label>
            <b-btn variant="secondary" :block="true" @click="filterSearch">검색</b-btn>
          </div>
        </div>
      </div>
    </div>

    <b-card>
      <h5 slot="header" class="mb-0">딜러 목록</h5>
      <div class="row">
        <div class="col">
          <b-form-group>
            Records: &nbsp;
            <b-select size="sm" :options="perPageOptions" v-model="perPage" class="d-inline-block w-auto" @input="changePaging('1')"/>
          </b-form-group>
        </div>
      </div>
      <b-card-body>
        <b-table
          show-empty
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

          <template slot="table-colgroup">
            <col span="1" width="10%" />
            <col span="1" width="10%" />
            <col span="1" width="10%" />
            <col span="1" width="10%" />
            <col span="1" width="10%" />
          </template>
        </b-table>

        <!-- Pagination -->
        <pagination :total-size="totalSize" :current-page="currentPage" :per-page="perPage"></pagination>
      </b-card-body>
      <b-card-footer>
        <div>
          <span class="float-right">
            <b-btn variant="primary" @click="openModal">등록</b-btn>
          </span>
        </div>
      </b-card-footer>
    </b-card>

    <b-modal ref="modal" size="lg" hide-footer class="big">
      <div slot="modal-title">{{openModalTitle}}</div>
      <base-dealer-modal :base-dealer-modal-info="modalRowInfo" :mode="openModalMode"></base-dealer-modal>
    </b-modal>
  </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import Datepicker from 'vuejs-datepicker'
import Pagination from '@/components/common/pagination/Pagination'
import moment from 'moment'
import BaseDealerModal from './BaseDealerModal'

export default {
  name: 'BaseDealer',

  components: {
    'pagination': Pagination,
    'base-dealer-modal': BaseDealerModal,
    Datepicker
  },

  data: () => ({
    // option 정보

    // sort
    sortBy: 'licenseNo',
    sortDesc: true,

    // row 정보
    clickedRowInfo: {},
    clickedIndex: 0,

    // modal Options
    modalRowInfo: {},
    openModalMode: '',
    openModalTitle: '',

    // table loading
    isBusy: false,

    // page
    perPage: 10,
    currentPage: 1,
    perPageOptions: [10, 20, 30, 40, 50],
    totalCount: 0,
    totalSize: 0,

    // table 정보
    tableData: [],

    // 등록 시 중복체크 status
    dupStatus: 0,

    // field
    fields: [
      {key: 'licenseNo', sortable: true, tdClass: 'align-middle', label: '사원증 번호', 'class': 'text-center'},
      {key: 'licenseStDt', sortable: true, tdClass: 'align-middle', label: '사원증 시작일', 'class': 'text-center'},
      {key: 'licenseEdDt', sortable: true, tdClass: 'align-middle', label: '사원증 종료일', 'class': 'text-center'},
      {key: 'fullName', sortable: true, tdClass: 'align-middle', label: '상사', 'class': 'text-center'},
      {key: 'createDt', sortable: true, tdClass: 'align-middle', label: '생성일', formatter: 'getYyyymmdd', 'class': 'text-center'}
    ],

    // datepicker
    disabledDates: {
      days: [0] // Disable sunday
    },

    highlightedDates: {
      dates: [
        moment().add(1, 'd').toDate(),
        moment().add(2, 'd').toDate(),
        moment().add(3, 'd').toDate()
      ]
    },

    searchParameters: {
      licenseNo: '',
      userTyCd: '200',
      searchStartDay: moment().add(-3, 'month').format('YYYY-MM-DD'),
      searchEndDay: moment().format('YYYY-MM-DD'),

      order: null,
      orderDesc: ''
    }
  }),

  created () {
    this.$on('saveModal', this.saveModal) // 저장 이벤트
    this.$on('removeModal', this.removeModal) // 삭제 이벤트
    this.$on('changePaging', this.changePaging)
    this.$on('dupchk', this.dupchk)
  },

  methods: {
    // Load Table Data
    getList (ctx) {
      this.isBusy = true
      this.searchParameters['currentPageNo'] = this.currentPage
      this.searchParameters['rowsPerPage'] = this.perPage
      this.searchParameters['startNumber'] = (this.currentPage - 1) * this.perPage + 1
      this.searchParameters['endNumber'] = this.searchParameters['startNumber'] + this.perPage - 1

      this.searchParameters['searchStartDay'] = moment(this.searchParameters['searchStartDay']).format('YYYY-MM-DD')
      this.searchParameters['searchEndDay'] = moment(this.searchParameters['searchEndDay']).format('YYYY-MM-DD')

      const parameters = {
        params: this.searchParameters
      }
      if (ctx !== undefined) {
        if (ctx.sortBy !== undefined) {
          switch (ctx.sortBy) {
            case 'licenseNo': this.searchParameters['order'] = 0; break
            case 'licenseStDt': this.searchParameters['order'] = 1; break
            case 'licenseEdDt': this.searchParameters['order'] = 2; break
            case 'fullName': this.searchParameters['order'] = 3; break
            case 'createDt': this.searchParameters['order'] = 4; break
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
        return getUserlist(parameters, _super)
      }

      function getUserlist (parameters, _super) {
        return _super.$http.get('/dealer/base', parameters)
          .then(
            (result) => {
              _super.tableData = result.data['resultList']
              _super.totalSize = result.data['resultCount']
              _super.isBusy = false
              return _super.tableData
            }).catch(error => {
            _super.isBusy = false
             console.log(error);
          })
      }
    },

    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },

    // Row 클릭
    rowClicked (item, index, event) {
      this.modalRowInfo = this.$commons.clone(item)
      this.modalRowInfo.beforeLicenseNo = this.modalRowInfo.licenseNo
      this.modalRowInfo.beforeOrgnztUnitNo = this.modalRowInfo.orgnztUnitNo
      this.openModalMode = 'PUT'
      this.openModalTitle = '상세 정보'
      this.$refs.modal.show()
      this.dupStatus = 0
      this.$EventBus.$emit('close-child')
      // this.$EventBus.$emit('open-child', this.modalRowInfo)
    },

    // Open ApiModal
    openModal () {
      // Row 등록 Modal Open
      this.openModalTitle = '등록 정보'
      this.openModalMode = 'POST'
      this.modalRowInfo = {
        userTyCd: '200'
      }
      this.dupStatus = 0
      this.$refs.modal.show()
      this.$EventBus.$emit('close-child')
    },

    // Close Modal
    closeModal () {
      this.$refs.modal.hide()
      this.getList()
      this.$refs.table.refresh()
    },

    // Save Modal
    saveModal () {
      this.modalRowInfo.pid = this.$global.PID
      if (!this.valid(this.modalRowInfo)) return

      if (this.openModalMode === 'POST') {
        // console.log(this.modalRowInfo)
        this.$http.post('/dealer/base', this.modalRowInfo)
          .then(
            (response) => {
              this.afterSaveModal(response.data['resultObject'])
            }
          )
      } else {
        this.$http.put('/dealer/base', this.modalRowInfo)
          .then(
            (response) => {
              this.afterSaveModal(response.data['resultObject'])
            }
          )
      }
    },

    // Save Modal 후처리
    afterSaveModal (response) {
      this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>저장이 완료되었습니다.`, {theme: 'bubble', duration: 3000})

      this.$refs.modal.hide()
      this.getList()
      this.$refs.table.refresh()
    },

    // remove Modal
    removeModal () {
      if (confirm('삭제하시겠습니까?')) {
        this.$http.delete('/user/' + this.clickedRowInfo.userNo)
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
    },

    dupchk (param) {
      this.$http.get(`/dealer/dupcheck${param}`)
        .then(
          (result) => {
            if (result.data.resultCount === 1) {
              alert('이미 발급된 사원증 입니다.')
              this.dupStatus = 0
            } else {
              alert('가입이 가능한 사원입니다.')
              this.dupStatus = 1
            }
          }
        )
    },

    valid (data) {
      if (!data.licenseNo) {
        alert('사원증 번호를 입력하세요.')
        return false
      }

      if (this.dupStatus === 0) {
        alert('사원증 중복체크를 해주세요.')
        return false
      }

      if (!data.licenseStDt) {
        alert('사원증 시작일을 입력해주세요.')
        return false
      }

      if (!data.licenseEdDt) {
        alert('사원증 종료일을 입력해주세요.')
        return false
      }

      if (!data.nameLv4) {
        alert('상사를 선택해주세요.')
        return false
      }

      return true
    },

    getYyyymmdd (value, key, item) {
      return value !== null ? value.split(' ')[0] : ''
    }
  }
}
</script>

<style scoped>

</style>
