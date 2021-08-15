<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">컨텐츠 관리 /</span> 1:1문의 관리
    </h4>

    <div class="ui-bordered px-4 pt-4 mb-4">
      <div class="form-row align-items-center">
        <div class="col-md mb-4">
          <label class="form-label">상태</label>
          <b-form-select v-model="searchParameters.status" :options="statusOptions">
            <template slot="first">
              <option value="">전체</option>
            </template>
          </b-form-select>
        </div>
        <div class="col-md mb-4">
          <label class="form-label">유형</label>
          <b-form-select v-model="searchParameters.qnaBoardTyCd" :options="qnaBoardTyCdOptions">
            <template slot="first">
              <option value="">전체</option>
            </template>
          </b-form-select>
        </div>
        <!--<div class="col-md mb-4">-->
          <!--<label class="form-label">제목</label>-->
          <!--<b-input placeholder="제목" v-model="searchParameters.title" />-->
        <!--</div>-->
        <div class="col-md mb-4">
          <label class="form-label">고객ID</label>
          <b-input placeholder="고객ID" v-model="searchParameters.userNo" />
        </div>
        <div class="col-md mb-4">
          <label class="form-label">고객명</label>
          <b-input placeholder="고객명" v-model="searchParameters.userName" />
        </div>
      </div>
      <div class="form-row">
        <div class="col-md-2 mb-4">
          <b-form-group label="검색시작일자">
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
        <div class="col-md-2 mb-4">
          <b-form-group label="검색종료일자">
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
        <div class="col-md-2 mb-4">
          <label class="form-label d-none d-md-block">&nbsp;</label>
          <b-btn variant="secondary" :block="true" @click="filterSearch">검색</b-btn>
        </div>
      </div>
    </div>

    <b-card>
      <h5 slot="header" class="mb-0">1:1문의 목록</h5>
      <div class="row">
        <div class="col">
          <b-form-group>
            Records: &nbsp;
            <b-select size="sm" :options="perPageOptions" v-model="perPage" class="d-inline-block w-auto" @input="changePaging('1')"/>
          </b-form-group>
        </div>
      </div>
      <b-card-body class="pb-0">
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
          @row-clicked="clickModal">

          <template slot="table-colgroup">
            <col span="1" width="1%" />
            <col span="1" width="8%" />
            <col span="1" width="15%" />
            <col span="1" width="9%" />
            <col span="1" width="9%" />
            <col span="1" width="25%" />
            <col span="1" width="15%" />
            <col span="1" width="15%" />
          </template>
        </b-table>

        <!-- Pagination -->
        <pagination :total-size="totalSize" :current-page="currentPage" :per-page="perPage"></pagination>
      </b-card-body>
    </b-card>
    <sub-modal></sub-modal>
  </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import subModal from './QnaModal'
import Pagination from '@/components/common/pagination/Pagination'

export default {
  components: {
    Datepicker,
    'pagination': Pagination,
    'sub-modal': subModal
  },
  data: () => ({
    // option 정보
    qnaBoardTyCdOptions: [],
    statusOptions: [],

    // sort
    sortBy: 'qnaBoardNo',
    sortDesc: true,

    // page
    perPage: 10,
    currentPage: 1,
    perPageOptions: [10, 20, 30, 40, 50],
    totalCount: 0,
    totalSize: 0,

    // table 정보
    tableData: [],
    // currentPage: 1,
    modalData: {},
    modalMode: '',
    qnaData: [],

    // table loading
    isBusy: false,

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

    // field
    fields: [
      {key: 'qnaBoardNo', sortable: true, tdClass: 'align-middle', label: 'NO', 'class': 'text-center'},
      {key: 'statusName', sortable: true, tdClass: 'align-middle', label: '상태', 'class': 'text-center'},
      {key: 'qnaBoardTyCdName', sortable: true, tdClass: 'align-middle', label: '문의유형', 'class': 'text-center'},
      {key: 'userNo', sortable: true, tdClass: 'align-middle', label: '고객ID', 'class': 'text-center'},
      {key: 'userName', sortable: true, tdClass: 'align-middle', label: '고객명', 'class': 'text-center'},
      {key: 'title', sortable: false, tdClass: 'align-middle', label: '제목', 'class': 'text-center'},
      {key: 'createDt', sortable: true, tdClass: 'align-middle', label: '등록일', 'class': 'text-center'},
      {key: 'updateDt', sortable: true, tdClass: 'align-middle', label: '수정일', 'class': 'text-center'}
    ],

    // search param
    searchParameters: {
      status: '',
      qnaBoardTyCd: '',
      title: '',
      userNo: '',
      userName: '',
      serviceBoard: '004',
      searchStartDay: moment().add(-3, 'month').format('YYYY-MM-DD'),
      searchEndDay: moment().format('YYYY-MM-DD')
    }
  }),

  created () {
    this.loadStatusCombo()
    this.loadTyCdCombo()

    this.$on('closeModal', this.closeModal)
    this.$on('deleteModal', this.deleteModal)
    this.$on('saveModal', this.saveModal)
    this.$on('changePaging', this.changePaging)
  },

  methods: {
    getList (ctx) {
      this.isBusy = true
      // this.$root.$children[0].loading = true
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
            case 'qnaBoardNo': this.searchParameters['order'] = 1; break
            case 'qnaBoardTyCdName': this.searchParameters['order'] = 2; break
            case 'statusName': this.searchParameters['order'] = 3; break
            case 'userNo': this.searchParameters['order'] = 4; break
            case 'userName': this.searchParameters['order'] = 5; break
            case 'createDt': this.searchParameters['order'] = 6; break
            case 'updateDt': this.searchParameters['order'] = 7; break
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
        return getQnalist(parameters, _super)
      }

      function getQnalist (parameters, _super) {
        return _super.$http.get('/qna', parameters)
          .then((result) => {
            _super.tableData = result.data['resultList']
            _super.tableData.forEach((value) => {
              value.selected = false
            })
            _super.totalSize = result.data['resultCount']
            _super.isBusy = false
            return _super.tableData
          })
      }
    },

    loadTyCdCombo () {
      const parameter = '?codeLv2=QNA_BOARD_TY_CD&lv=3'
      this.loadCombo(parameter, 'qnaBoardTyCdOptions')
    },

    loadStatusCombo () {
      const parameter = '?codeLv2=STATUS&lv=3'
      this.loadCombo(parameter, 'statusOptions')
    },

    loadCombo (parameter, type) {
      this.$http.get(`/code/combo${parameter}`)
        .then(
          (result) => {
            this[type] = this.$commons.clone(result.data['resultList'])
          }
        )
    },

    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },

    clickModal (node) {
      if (node.upQnaBoardNo === null) {
        this.modalMode = 'post'
      } else {
        this.modalMode = 'put'
      }
      this.$EventBus.$emit('qna-modal', node, this.qnaBoardTyCdOptions, this.statusOptions)
    },

    deleteModal (obj) {
      this.qnaData = this.$commons.clone(obj)
      if (confirm('삭제하시겠습니까?')) {
        this.$http.put('/qna/delete', this.qnaData)
          .then(
            () => {
              this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>답변 삭제가 완료되었습니다.`, {theme: 'bubble', duration: 3000})
              this.afterProcess()
            }
          )
      }
    },

    saveModal (obj, evt) {
      evt.preventDefault()
      this.qnaData = this.$commons.clone(obj)
      if (this.modalMode === 'post') {
        this.$http.post('/qna/insertAns', this.qnaData)
          .then(
            () => {
              this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>저장이 완료되었습니다.`, {theme: 'bubble', duration: 3000})
              this.afterProcess()
            }
          )
      } else {
        this.$http.put('/qna/updateAns', this.qnaData)
          .then(
            () => {
              this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>수정이 완료되었습니다.`, {theme: 'bubble', duration: 3000})
              this.afterProcess()
            }
          )
      }
    },

    // after process
    afterProcess () {
      this.$EventBus.$emit('qna-modal-close')
      this.getList()
      this.$refs.table.refresh()
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
