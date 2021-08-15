<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">컨텐츠 관리 /</span> 공지사항 관리
    </h4>

    <div class="ui-bordered px-4 pt-4 mb-4">
      <div class="form-row align-items-center">
        <!--<div class="col-md mb-4">-->
          <!--<label class="form-label">유형</label>-->
          <!--<b-form-select v-model="searchParameters.noticeTyCd" :options="noticeTyCdOptions">-->
            <!--<template slot="first">-->
              <!--<option value="">전체</option>-->
            <!--</template>-->
          <!--</b-form-select>-->
        <!--</div>-->
        <div class="col-md mb-4">
          <label class="form-label">숨김여부</label>
          <b-form-select v-model="searchParameters.hiddenYn" :options="ynOptions">
            <template slot="first">
              <option value="">전체</option>
            </template>
          </b-form-select>
        </div>
        <div class="col-md mb-4">
          <label class="form-label">팝업유무</label>
          <b-form-select v-model="searchParameters.popupYn" :options="ynOptions">
            <template slot="first">
              <option value="">전체</option>
            </template>
          </b-form-select>
        </div>
        <div class="col-md mb-4">
          <label class="form-label">Keyword</label>
          <b-input placeholder="제목 또는 내용" v-model="searchParameters.keyword" />
        </div>
      </div>
      <div class="form-row">
        <div class="col-md-3 mb-4">
          <b-form-group label="공지시작일">
            <datepicker
              v-model="searchParameters.searchStartDay"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              placeholder="공지시작일을 선택해주세요."
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="true"
              :disabled-dates="disabledDates"
              :highlighted="highlightedDates"
              :format="customFormatter"/>
          </b-form-group>
        </div>
        <div class="col-md-3 mb-4">
          <b-form-group label="공지종료일">
            <datepicker
              v-model="searchParameters.searchEndDay"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              placeholder="공지종료일을 선택해주세요."
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="true"
              :disabled-dates="disabledDates"
              :highlighted="highlightedDates"
              :format="customFormatter"/>
          </b-form-group>
        </div>
        <div class="col-md col-xl-2 mb-4">
          <label class="form-label d-none d-md-block">&nbsp;</label>
          <b-btn variant="secondary" :block="true" @click="filterSearch">검색</b-btn>
        </div>
      </div>
    </div>

    <b-card>
      <h5 slot="header" class="mb-0">공지사항 목록</h5>
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
          @row-clicked="clickModal"
          class="card-table">
          <template slot="table-colgroup">
            <col span="1" width="1%" />
            <col span="1" width="40%" />
            <col span="1" width="7%" />
            <col span="1" width="7%" />
            <col span="1" width="10%" />
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
    <sub-modal ref="noticeModal"></sub-modal>
  </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import Pagination from '@/components/common/pagination/Pagination'
import NoticeModal from './NoticeModal'

export default {
  components: {
    Datepicker,
    'pagination': Pagination,
    'sub-modal': NoticeModal
  },

  data: () => ({
    // option 정보
    tableData: [],
    noticeTyCdOptions: [],
    ynOptions: {
      'Y': '사용',
      'N': '미사용'
    },

    // Modal Options
    modalData: {},
    modalMode: '',
    modalTitle: '',
    noticeData: [],

    // sort
    sortBy: 'noticeNo',
    sortDesc: true,

    // page
    perPage: 10,
    currentPage: 1,
    perPageOptions: [10, 20, 30, 40, 50],
    totalCount: 0,
    totalSize: 0,

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
      {key: 'noticeNo', sortable: true, tdClass: 'align-middle', label: 'NO', 'class': 'text-center'},
      {key: 'noticeTitle', sortable: false, tdClass: 'align-middle', label: '제목', 'class': 'text-center'},
      // { key: 'noticeTyCdName', sortable: true, tdClass: 'align-middle', label: '공지유형' },
      {key: 'hiddenYnName', sortable: true, tdClass: 'align-middle', label: '숨김', 'class': 'text-center'},
      {key: 'popupYnName', sortable: true, tdClass: 'align-middle', label: '팝업', 'class': 'text-center'},
      {key: 'useStDt', sortable: true, tdClass: 'align-middle', label: '공지시작', 'class': 'text-center'},
      {key: 'useEdDt', sortable: true, tdClass: 'align-middle', label: '공지종료', 'class': 'text-center'},
      {key: 'createDt', sortable: true, tdClass: 'align-middle', label: '등록일', 'class': 'text-center'},
      {key: 'updateDt', sortable: true, tdClass: 'align-middle', label: '수정일', 'class': 'text-center'}
    ],

    // Search param
    searchParameters: {
      hiddenYn: '',
      popupYn: '',
      keyword: '',
      searchStartDay: moment().add(-3, 'month').format('YYYY-MM-DD'),
      searchEndDay: moment().format('YYYY-MM-DD')
    }
  }),

  created () {
    this.loadMenuTypeCombo() // 유형 code load

    this.$on('deleteModal', this.deleteModal)
    this.$on('saveModal', this.saveModal)
    this.$on('changePaging', this.changePaging)
  },

  methods: {
    // notice data load
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
            case 'noticeNo': this.searchParameters['order'] = 1; break
            case 'hiddenYnName': this.searchParameters['order'] = 2; break
            case 'popupYnName': this.searchParameters['order'] = 3; break
            case 'useStDt': this.searchParameters['order'] = 4; break
            case 'useEdDt': this.searchParameters['order'] = 5; break
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
        return getNoticelist(parameters, _super)
      }

      function getNoticelist (parameters, _super) {
        return _super.$http.get('/notice', parameters)
          .then((result) => {
            _super.tableData = result.data['resultList']
            _super.totalSize = result.data['resultCount']
            _super.tableData.forEach((item) => {
              item.hiddenYnName = _super.ynOptions[item.hiddenYn]
              item.popupYnName = _super.ynOptions[item.popupYn]
            })
            _super.isBusy = false
            return _super.tableData
          })
      }
    },

    // 유형 Code load
    loadMenuTypeCombo () {
      this.$http.get('/code/combo?codeLv2=NOTICE_TY_CD&lv=3')
        .then(
          (result) => {
            this.noticeTyCdOptions = result.data['resultList']
          }
        )
    },

    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },

    // Open Modal
    openModal () {
      let item = {
        useYn: 'Y',
        popupYn: 'N',
        hiddenYn: 'N',
        noticeTyCd: '100',
        noticeContents: '',
        pid: this.$global.PID
      }
      this.modalMode = 'POST'
      this.$EventBus.$emit('notice-modal', item, this.noticeTyCdOptions)
    },

    // Click Modal
    clickModal (node) {
      this.modalMode = 'PUT'
      this.$http.get('/notice/' + node['noticeNo'])
        .then(
          (result) => {
            let item = result.data['resultObject']
            this.$EventBus.$emit('notice-modal', item, this.noticeTyCdOptions)
          }
        )
    },

    // Delete Modal
    deleteModal (noticeNo) {
      if (confirm('삭제하시겠습니까?')) {
        this.$http.delete('/notice/' + noticeNo)
          .then(
            (result) => {
              if (result.data['resultCount'] > 0) {
                this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>삭제가 완료되었습니다.`, {theme: 'bubble', duration: 3000})
                this.$EventBus.$emit('notice-modal-close')
                this.getList()
                this.$refs.table.refresh()
              } else {
                alert('삭제에 실패했습니다.')
              }
            }
          )
      }
    },

    // Save Modal
    saveModal (obj, listReg, listImgSrc) {
      this.noticeData = this.$commons.clone(obj)
      this.noticeData.listPath = listReg
      this.noticeData.listImgSrc = listImgSrc

      if (this.modalMode === 'POST') {
        this.$http.post('/notice', this.noticeData)
          .then(
            () => {
              this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>저장이 완료되었습니다.`, {
                theme: 'bubble',
                duration: 3000
              })
              this.$EventBus.$emit('notice-modal-close')
              this.getList()
              this.$refs.table.refresh()
            }
          )
      } else {
        this.$http.put('/notice', this.noticeData)
          .then(
            () => {
              this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>수정이 완료되었습니다.`, {
                theme: 'bubble',
                duration: 3000
              })
              this.$EventBus.$emit('notice-modal-close')
              this.getList()
              this.$refs.table.refresh()
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
