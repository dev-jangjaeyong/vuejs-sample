<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">컨텐츠 관리 /</span> 게시판 관리
    </h4>

    <div class="ui-bordered px-4 pt-4 mb-4">
      <div class="form-row">
        <div class="col-md mb-4">
          <label class="form-label">분류</label>
          <b-form-select v-model="searchParameters.boardTyCd" :options="boardTyCdOptions">
            <template slot="first">
              <option value="">전체</option>
            </template>
          </b-form-select>
        </div>
        <!--<div class="col-md mb-4">-->
          <!--<label class="form-label">User No</label>-->
          <!--<b-input placeholder="User No" v-model="searchParameters.userNo" />-->
        <!--</div>-->
        <div class="col-md mb-4">
          <label class="form-label">Keyword</label>
          <b-input placeholder="제목 또는 내용 입력" v-model="searchParameters.keyword" />
        </div>

        <div class="col-md mb-4">
          <b-form-group label="등록시작일">
            <datepicker
              v-model="searchParameters.searchStartDay"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              placeholder=""
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="true"
              :disabled-dates="disabledDates"
              :highlighted="highlightedDates"
              :format="customFormatter"/>
          </b-form-group>
        </div>
        <div class="col-md mb-4">
          <b-form-group label="등록종료일">
            <datepicker
              v-model="searchParameters.searchEndDay"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              placeholder=""
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
      <!-- Table -->
      <h5 slot="header" class="mb-0">게시판 목록</h5>
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
            <col span="1" width="15%" />
            <!--<col span="1" width="10%" />-->
            <col span="1" width="50%" />
            <col span="1" width="15%" />
            <col span="1" width="15%" />
          </template>
        </b-table>

        <!-- Pagination -->
        <pagination :total-size="totalSize" :current-page="currentPage" :per-page="perPage"></pagination>
      </b-card-body>

      <b-card-footer class="mt-3" v-if="type === '003'">
        <b-btn variant="primary" class="d-block float-right" @click="openModal">등록</b-btn>
      </b-card-footer>
    </b-card>

    <b-modal ref="modal" size="lg" hide-footer>
      <div slot="modal-title">
        게시글 관리
      </div>
      <sub-modal :modal-data="modalData" ref="boardModal"></sub-modal>
    </b-modal>
    <evt-modal></evt-modal>
  </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import BoardModal from './BoardModal'
import EventModal from './EventModal'
import Pagination from '@/components/common/pagination/Pagination'

export default {
  components: {
    Datepicker,
    'pagination': Pagination,
    'sub-modal': BoardModal,
    'evt-modal': EventModal
  },

  data: () => ({
    // option 정보
    boardTyCdOptions: {},
    type: '',

    // sort
    sortBy: 'boardNo',
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
    eventData: [],

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
      {key: 'boardNo', sortable: true, tdClass: 'align-middle', label: 'NO', 'class': 'text-center'},
      {key: 'boardTyCdName', sortable: true, tdClass: 'align-middle', label: '분류', 'class': 'text-center'},
      // { key: 'userNo', sortable: true, tdClass: 'align-middle', label: '사용자번호' },
      {key: 'title', sortable: false, tdClass: 'align-middle subject', label: '제목', 'class': 'text-center'},
      {key: 'createDt', sortable: true, tdClass: 'align-middle', label: '등록일', 'class': 'text-center'},
      {key: 'updateDt', sortable: true, tdClass: 'align-middle', label: '수정일', 'class': 'text-center'}
    ],

    // search param
    searchParameters: {
      boardTyCd: '',
      userNo: '',
      keyword: '',

      searchStartDay: moment().add(-3, 'month').format('YYYY-MM-DD'),
      searchEndDay: moment().format('YYYY-MM-DD'),

      order: null,
      orderDesc: ''
    }
  }),

  created () {
    this.loadTyCdCombo()

    this.$on('closeModal', this.closeModal)
    this.$on('deleteModal', this.deleteModal)
    this.$on('saveModal', this.saveModal)
    this.$on('changePaging', this.changePaging)
    this.$on('deleteEventInfo', this.deleteEventInfo)
    this.$on('registEventInfo', this.registEventInfo)
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

      this.type = this.searchParameters.boardTyCd

      if (ctx !== undefined) {
        if (ctx.sortBy !== undefined) {
          switch (ctx.sortBy) {
            case 'boardNo': this.searchParameters['order'] = 1; break
            case 'boardTyCdName': this.searchParameters['order'] = 2; break
            case 'createDt': this.searchParameters['order'] = 3; break
            case 'updateDt': this.searchParameters['order'] = 4; break
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
        return getBoardlist(parameters, _super)
      }

      function getBoardlist (parameters, _super) {
        return _super.$http.get('/board', parameters)
          .then((result) => {
            _super.tableData = result.data['resultList']
            _super.tableData.forEach((value) => {
              if (value.contentsTyCd === '001') {
                value.boardTyCdName += '(구매후기)'
              } else if (value.contentsTyCd === '002') {
                value.boardTyCdName += '(판매후기)'
              }
            })
            _super.totalSize = result.data['resultCount']
            _super.isBusy = false
            return _super.tableData
          })
      }
    },

    loadTyCdCombo () {
      const parameter = 'BOARD_TY_CD'
      this.$http.get(`/code/combo?code=${parameter}`)
        .then(
          (result) => {
            let options = result.data['resultList']
            for (let i = 0; i < options.length; i++) {
              if (options[i].text === 'QNA') {
                options.splice(i, 1)
              }
            }
            this.boardTyCdOptions = options
          }
        )
    },

    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },

    openModal () {
      let item = {
        useYn: 'Y',
        popupYn: 'N',
        hiddenYn: 'N',
        pid: this.$global.PID,
        boardTyCd: this.type,
        boardTyCdName: '이벤트',
        serviceBoard: '003'
      }
      this.modalMode = 'post'
      this.$EventBus.$emit('event-modal', item)
    },

    clickModal (node) {
      this.modalMode = 'put'
      if (node.boardTyCdName === '이벤트') {
        this.$http.get(`/event-board/${node.boardNo}`)
          .then(
            (result) => {
              let item = result.data['resultObject']
              item.serviceBoard = item.boardTyCd
              this.$EventBus.$emit('event-modal', item)
            }
          )
      } else {
        this.$http.get(`/board/${node.boardNo}`)
          .then(
            (result) => {
              this.modalData = result.data['resultObject']
              this.modalData.boardTyCdName = node.boardTyCdName
            }
          )
        this.$refs.modal.show()
      }
    },

    // Close Modal
    closeModal () {
      this.$refs.modal.hide()
    },

    // 삭제 process
    deleteModal () {
      if (confirm('삭제하시겠습니까?')) {
        this.$http.delete(`/board/${this.modalData.boardNo}`)
          .then(
            (result) => {
              if (result.data['resultCount'] > 0) {
                this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>삭제가 완료되었습니다.`, {theme: 'bubble', duration: 3000})
                this.afterProcess()
              } else {
                alert('삭제에 실패했습니다.')
              }
            }
          )
      }
    },

    // 등록 및 수정 process
    saveModal () {
      if (this.modalMode === 'post') {
        this.$http.post('/board', this.modalData)
          .then(
            () => {
              this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>저장이 완료되었습니다.`, {theme: 'bubble', duration: 3000})
              this.afterProcess()
            }
          )
      } else {
        this.$http.put('/board', this.modalData)
          .then(
            () => {
              this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>수정이 완료되었습니다.`, {theme: 'bubble', duration: 3000})
              this.afterProcess()
            }
          )
      }
    },

    // 이벤트 등록 및 수정 process
    registEventInfo (obj, listReg, listImgSrc) {
      this.eventData = this.$commons.clone(obj)
      this.eventData.listPath = listReg
      this.eventData.listImgSrc = listImgSrc

      if (this.modalMode === 'post') {
        this.$http.post('/board/event', this.eventData)
          .then(
            () => {
              this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>저장이 완료되었습니다.`, {
                theme: 'bubble',
                duration: 3000
              })
              this.$EventBus.$emit('event-modal-close')
              this.getList()
              this.$refs.table.refresh()
            }
          )
      } else {
        this.$http.put('/board/event', this.eventData)
          .then(
            () => {
              this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>수정이 완료되었습니다.`, {
                theme: 'bubble',
                duration: 3000
              })
              this.$EventBus.$emit('event-modal-close')
              this.getList()
              this.$refs.table.refresh()
            }
          )
      }
    },

    deleteEventInfo (boardNo) {
      if (confirm('삭제하시겠습니까?')) {
        this.$http.delete('/board/event/' + boardNo)
          .then(
            () => {
              this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>삭제가 완료되었습니다.`, {
                theme: 'bubble',
                duration: 3000
              })
              this.$EventBus.$emit('event-modal-close')
              this.getList()
              this.$refs.table.refresh()
            }
          )
      }
    },

    // after process
    afterProcess () {
      this.$refs.modal.hide()
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

<style scoped>

</style>
