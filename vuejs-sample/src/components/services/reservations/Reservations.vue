<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">고객서비스 /</span> 방문예약 관리
    </h4>

    <div class="ui-bordered px-4 pt-4 mb-4">
      <div class="form-row align-items-center">
        <div class="col-md mb-4">
          <b-form-group label="방문예약번호">
            <b-input type="text" placeholder="방문예약번호" v-model="searchParameters.visitNo"></b-input>
          </b-form-group>
        </div>
        <div class="col-md mb-4">
          <b-form-group label="차량번호">
            <b-input type="text" placeholder="차량번호" v-model="searchParameters.carPlateNumber"></b-input>
          </b-form-group>
        </div>
        <div class="col-md mb-4">
          <b-form-group label="고객명">
            <b-input type="text" placeholder="고객명" v-model="searchParameters.userName"></b-input>
          </b-form-group>
        </div>
        <div class="col-md mb-4">
          <b-form-group label="딜러명">
            <b-input type="text" placeholder="딜러명" v-model="searchParameters.dealerUserName"></b-input>
          </b-form-group>
        </div>
      </div>
      <div class="form-row">

        <div class="col-md mb-4">
          <b-form-group label="예약상태">
            <b-form-select v-model="searchParameters.visitState" :options="visitStateOptions">
              <template slot="first">
                <option value="">전체</option>
              </template>
            </b-form-select>
          </b-form-group>
        </div>
        <div class="col-md mb-4">
          <b-form-group label="방문일(시작)">
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
          <b-form-group label="방문일(종료)">
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
          <b-form-group label="오전/오후">
            <b-form-select v-model="searchParameters.ampmTyCd" :options="ampmTyCdOptions">
              <template slot="first">
                <option value="">전체</option>
              </template>
            </b-form-select>
          </b-form-group>
        </div>
        <div class="col-md col-xl-2 mb-4">
          <label class="form-label d-none d-md-block">&nbsp;</label>
          <b-btn variant="secondary" :block="true" @click="filterSearch">검색</b-btn>
        </div>
      </div>
    </div>

    <b-card>
      <h5 slot="header" class="mb-0">방문예약 목록</h5>
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
          >

          <template slot="table-colgroup">
            <col span="1" width="1%" />
            <col span="1" width="7%" />
            <col span="1" width="10%" />
            <col span="1" width="7%" />
            <col span="1" width="7%" />
            <col span="1" width="8%" />
            <col span="1" width="10%" />
            <col span="1" width="8%" />
            <col span="1" width="10%" />
            <col span="1" width="10%" />
            <col span="1" width="10%" />
            <col span="1" width="8%" />
          </template>

          <template slot="HEAD_radioButton" slot-scope="row">
            <b-form-checkbox @click.native="toggleSelected" v-model="allSelected"></b-form-checkbox>
          </template>

          <template slot="radioButton" slot-scope="row">
            <b-form-checkbox v-model="selectedItems" v-bind:value="row.item.visitNo"></b-form-checkbox>
          </template>

          <template slot="showDetails" slot-scope="row">
            <b-button size="sm" @click.stop="row.toggleDetails" class="mr-2" v-if="row.item.sicknessReqYn === 'Y'">
              {{ row.detailsShowing ? '닫기' : '상세'}}
            </b-button>
          </template>

          <template slot="showDetail" slot-scope="row">
            <b-btn variant="secondary" size="sm" @click="getDetail(row.item)">상세</b-btn>
          </template>

          <template slot="row-details" slot-scope="row">
            <b-card>
              <b-table
                ref="table"
                class="card-table"
                :items="[row.item]"
                :fields="sicknessFields"
                :striped="true"
                :bordered="true">

                <template slot="table-colgroup">
                  <col span="1" width="25%" />
                  <col span="1" width="25%" />
                  <col span="1" width="25%" />
                  <col span="1" width="25%" />
                </template>

                <template slot="sicknessTyCdName" slot-scope="row">
                  {{ row.item.sicknessTyCdName === '직접입력' ? row.item.sicknessTyEtc : row.item.sicknessTyCdName }}
                </template>
              </b-table>
            </b-card>
          </template>
        </b-table>

        <!-- Pagination -->
        <pagination :total-size="totalSize" :current-page="currentPage" :per-page="perPage"></pagination>
      </b-card-body>
      <b-card-footer>
        <div>
          <span class="float-left">
            <b-btn id="btnDelete" variant="default" @click="removeModal" :disabled="selectedItems.length === 0">삭제</b-btn>
          </span>
          <span class="float-right">
            <!--<b-btn id="btnUpdate" variant="secondary" :disabled="clickedRowInfo.visitNo === undefined" @click="openModal(false)">상세</b-btn>-->
            <!--<b-btn variant="primary" @click="openModal(true)">등록</b-btn>-->
          </span>
        </div>
      </b-card-footer>
    </b-card>

    <b-modal ref="modal" size="md" hide-footer>
      <div slot="modal-title">{{openModalTitle}}</div>
      <type1-modal>
        <b-form>
          <div class="row">
            <div class="col-md-4" v-if="modalRowInfo.visitNo !== undefined">
              <b-form-group label="방문예약번호">
                <b-input type="text" placeholder="방문예약번호" v-model="modalRowInfo.visitNo" :readonly="true"></b-input>
              </b-form-group>
            </div>
            <div class="col-md-4">
              <b-form-group label="차량번호">
                <b-input type="text" placeholder="차량번호" v-model="modalRowInfo.carPlateNumber"></b-input>
              </b-form-group>
            </div>
            <div class="col-md-4">
              <b-form-group label="예약상태">
                <b-form-select v-model="modalRowInfo.visitState" :options="visitStateOptions"></b-form-select>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <b-form-group label="고객번호">
                <b-input type="text" placeholder="고객번호" v-model="modalRowInfo.userNo"></b-input>
              </b-form-group>
            </div>
            <div class="col-md-6">
              <b-form-group label="고객명">
                <b-input type="text" placeholder="고객명" v-model="modalRowInfo.userName" :disabled="true"></b-input>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <b-form-group label="딜러번호">
                <b-input type="text" placeholder="딜러번호" v-model="modalRowInfo.dealerUserNo"></b-input>
              </b-form-group>
            </div>
            <div class="col-md-6">
              <b-form-group label="딜러명">
                <b-input type="text" placeholder="딜러명" v-model="modalRowInfo.dealerUserName" :disabled="true"></b-input>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <b-form-group label="방문일">
                <b-form-select v-model="modalRowInfo.ampmTyCd" :options="ampmTyCdOptions"></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-8">
              <b-form-group label="&nbsp;">
                <flat-pickr v-model="modalRowInfo.visitDate" ref="visitDate" :config="flatConfig" :placeholder="!isIE ? '방문일' : null" />
              </b-form-group>
            </div>
          </div>
        </b-form>
      </type1-modal>
    </b-modal>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<style lang="scss">
  .default-style .flatpickr-calendar.open {
    z-index: 1100
  }
</style>

<script>
import Type1Modal from '@/components/common/modal/Type1Modal'
import Pagination from '@/components/common/pagination/Pagination'
import flatPickr from 'vue-flatpickr-component'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'Reservations',

  components: {
    Datepicker,
    'pagination': Pagination,
    'type1-modal': Type1Modal,
    'flat-pickr': flatPickr
  },

  data: () => ({
    // option 정보
    visitStateOptions: [],
    ampmTyCdOptions: [],

    // sort
    sortDesc: true,
    sortBy: 'visitNo',

    // page
    perPage: 10,
    currentPage: 1,
    perPageOptions: [10, 20, 30, 40, 50],
    totalCount: 0,
    totalSize: 0,

    // table 정보
    tableData: [],

    // row 정보
    clickedRowInfo: {},
    clickedIndex: 0,

    // modal Options
    modalRowInfo: {},
    openModalMode: '',
    openModalTitle: '',

    // table loading
    isBusy: false,

    // delete data
    selectedItems: [],

    // all select
    allSelected: false,

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
      {key: 'radioButton', sortable: false, tdClass: 'align-middle', 'class': 'text-center'},
      {key: 'visitNo', sortable: true, tdClass: 'align-middle', label: '번호', 'class': 'text-center'},
      {key: 'carPlateNumber', sortable: false, tdClass: 'align-middle', label: '차량번호', 'class': 'text-center'},
      {key: 'userName', sortable: false, tdClass: 'align-middle', label: '고객명', 'class': 'text-center'},
      {key: 'dealerUserName', sortable: false, tdClass: 'align-middle', label: '딜러명', 'class': 'text-center'},
      {key: 'visitDate', sortable: true, tdClass: 'align-middle', label: '방문일', 'class': 'text-center'},
      {key: 'ampmTyCdName', sortable: true, tdClass: 'align-middle', label: '오전/오후', 'class': 'text-center'},
      {key: 'visitStateName', sortable: true, tdClass: 'align-middle', label: '상태', 'class': 'text-center'},
      {key: 'createDt', sortable: true, tdClass: 'align-middle', label: '등록일', 'class': 'text-center'},
      {key: 'updateDt', sortable: true, tdClass: 'align-middle', label: '수정일', 'class': 'text-center'},
      {key: 'showDetails', sortable: false, tdClass: 'align-middle', label: '헛걸음보상', 'class': 'text-center'},
      {key: 'showDetail', sortable: false, tdClass: 'align-middle', label: '상세보기', 'class': 'text-center'}
    ],
    sicknessFields: [
      {key: 'sicknessTyCdName', sortable: false, tdClass: 'align-middle', label: '사유', 'class': 'text-center'},
      {key: 'sicknessReqDt', sortable: false, tdClass: 'align-middle', label: '신청일', 'class': 'text-center'},
      {key: 'sicknessStateName', sortable: false, tdClass: 'align-middle', label: '보상상태', 'class': 'text-center'}
    ],

    searchParameters: {
      visitState: '',
      ampmTyCd: '',

      searchStartDay: moment().add(-3, 'month').format('YYYY-MM-DD'),
      searchEndDay: moment().format('YYYY-MM-DD'),

      order: null,
      orderDesc: ''
    },

    flatConfig: {
      altFormat: 'Y-m-d',
      dateFormat: 'Y-m-d',
      altInput: true,
      animate: true
    }
  }),
  watch: {
    selectedItems (a) {
      if (this.tableData.length > 0) {
        this.allSelected = this.tableData.length === a.length
      }
    }
  },
  created () {
    this.loadAmpmTyCd()
    this.loadVisitState()

    this.$on('saveModal', this.saveModal) // 저장 이벤트
    this.$on('removeModal', this.removeModal) // 삭제 이벤트
    this.$on('changePaging', this.changePaging)
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
            case 'visitNo': this.searchParameters['order'] = 1; break
            case 'visitDate': this.searchParameters['order'] = 2; break
            case 'ampmTyCdName': this.searchParameters['order'] = 3; break
            case 'visitStateName': this.searchParameters['order'] = 4; break
            case 'createDt': this.searchParameters['order'] = 5; break
            case 'updateDt': this.searchParameters['order'] = 6; break
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
        return getVisitlist(parameters, _super)
      }

      function getVisitlist (parameters, _super) {
        return _super.$http.get('/oncar-visit', parameters)
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

    loadAmpmTyCd () {
      const parameter = '?codeLv2=VISIT_TY_CD&lv=3'
      this.loadCombo(parameter, 'ampmTyCdOptions')
    },

    loadVisitState () {
      const parameter = '?codeLv2=VISIT_STATE&lv=3'
      this.loadCombo(parameter, 'visitStateOptions')
    },

    loadCombo (parameter, type) {
      this.$http.get(`/code/combo${parameter}`)
        .then(
          (result) => {
            this[type] = this.$commons.clone(result.data['resultList'])
          }
        )
    },

    getDetail (item) {
      this.clickedRowInfo = item
      this.openModal(false)
    },

    // Open ApiModal
    openModal (flag) {
      if (flag) {
        // Row 등록 Modal Open
        this.openModalTitle = '방문예약 등록'
        this.openModalMode = 'POST'
        this.modalRowInfo = {
          pid: this.$global.PID
        }
      } else {
        // Row 수정 Model Open
        this.openModalTitle = '방문예약 상세'
        this.openModalMode = 'PUT'
        this.modalRowInfo = this.$commons.clone(this.clickedRowInfo)
      }

      this.$refs.modal.show()
    },

    // Save Modal
    saveModal () {
      if (!this.modalRowInfo.userNo) {
        alert('예약 고객 번호를 입력하세요')
        return
      }

      if (this.openModalMode === 'POST') {
        this.$http.post('/oncar-visit', this.modalRowInfo)
          .then(
            (response) => {
              this.afterSaveModal(response.data['resultObject'])
            }
          )
      } else {
        this.$http.put('/oncar-visit', this.modalRowInfo)
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
      this.$commons.copyObject(this.tableData[this.clickedIndex], response)
      this.afterProcess()
    },

    // 삭제 프로세스
    removeModal () {
      if (confirm('삭제하시겠습니까?')) {
        this.$http.delete('/oncar-visit-admin?visitNos=' + this.selectedItems)
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

    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },

    // after process
    afterProcess () {
      this.$refs.modal.hide()
      this.getList()
      this.selectedItems = []
      this.$refs.table.refresh()
    },

    // filter Search
    filterSearch () {
      this.currentPage = 1
      this.getList()
      this.selectedItems = []
      this.$refs.table.refresh()
    },

    // Paging
    changePaging (page) {
      this.currentPage = page
      this.getList()
      this.selectedItems = []
      this.$refs.table.refresh()
    },

    // 체크박스 선택시
    toggleSelected (e) {
      e.preventDefault()
      e.stopPropagation()
      this.allSelected = !this.allSelected
      if (this.allSelected) {
        for (let i in this.tableData) {
          this.selectedItems.push(this.tableData[i].visitNo)
        }
      } else {
        this.selectedItems = []
      }
      // 중복제거
      let removeDup = this.selectedItems.reduce((a, b) => {
        if (a.indexOf(b) < 0) a.push(b)
        return a
      }, [])
      this.selectedItems = removeDup
    }
  }
}
</script>
