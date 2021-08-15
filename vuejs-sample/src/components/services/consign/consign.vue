<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">고객서비스 /</span> 탁송서비스 관리
    </h4>

    <div class="ui-bordered px-4 pt-4 mb-4">
      <div class="form-row align-items-center">
        <!--<div class="col-md mb-4">
          <b-form-group label="서비스종류">
            <b-form-select v-model="searchParameters.svcItemCode" :options="svcItemCodeOptions">
              <template slot="first">
                <option value="">전체</option>
              </template>
            </b-form-select>
          </b-form-group>
        </div>-->
        <!--<div class="col-md mb-4">
          <b-form-group label="요청서비스번호">
            <b-input type="text" placeholder="요청서비스번호" v-model="searchParameters.svcReqstNo"></b-input>
          </b-form-group>
        </div>-->
        <div class="col-md mb-4">
          <b-form-group label="차량번호">
            <b-input type="text" placeholder="차량번호" v-model="searchParameters.carPlateNumber"></b-input>
          </b-form-group>
        </div>
        <div class="col-md mb-4">
          <b-form-group label="신청고객명">
            <b-input type="text" placeholder="신청고객명" v-model="searchParameters.svcReqstUserName"></b-input>
          </b-form-group>
        </div>
        <div class="col-md mb-4">
          <b-form-group label="상태">
            <b-form-select v-if="searchParameters.svcItemCode != 500" v-model="searchParameters.svcReqstStatus" :options="svcReqstStatusOptions">
              <template slot="first">
                <option value="">전체</option>
              </template>
            </b-form-select>
            <b-form-select v-else v-model="searchParameters.svcReqstStatus" :options="svcConsignStatusOptions">
              <template slot="first">
                <option value="">전체</option>
              </template>
            </b-form-select>
          </b-form-group>
        </div>
      </div>
      <div class="form-row">
        <div class="col-md mb-4">
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
        <div class="col-md mb-4">
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
        <div class="col-md col-xl-2 mb-4">
          <label class="form-label d-none d-md-block">&nbsp;</label>
          <b-btn variant="secondary" :block="true" @click="filterSearch">검색</b-btn>
        </div>
      </div>
    </div>

    <b-card>
      <h5 slot="header" class="mb-0">탁송서비스 목록</h5>
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
            <col span="1" width="10%" />
            <col span="1" width="8%" />
            <col span="1" width="7%" />
            <col span="1" width="15%" />
            <col span="1" width="10%" />
            <col span="1" width="10%" />
            <col span="1" width="10%" />
            <col span="1" width="10%" />
            <col span="1" width="10%" />
          </template>

          <template slot="HEAD_radioButton" slot-scope="row">
            <b-form-checkbox @click.native="toggleSelected" v-model="allSelected"></b-form-checkbox>
          </template>

          <template slot="radioButton" slot-scope="row">
            <b-form-checkbox v-model="selectedItems" v-bind:value="row.item.svcReqstNo"></b-form-checkbox>
          </template>

          <template slot="svcReqstStatusName" slot-scope="row">
            {{ row.item.svcItemCode === '500' ? row.item.svcConsignStatusName : row.item.svcReqstStatusName }}
          </template>

          <template slot="showDetail" slot-scope="row">
            <b-btn variant="secondary" size="sm" @click="getDetail(row.item)">상세</b-btn>
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
            <!--<b-btn id="btnUpdate" variant="secondary" :disabled="clickedRowInfo.svcReqstNo === undefined" @click="openModal(false)">상세</b-btn>-->
            <b-btn variant="primary" @click="openModal(true)">등록</b-btn>
          </span>
        </div>
      </b-card-footer>
    </b-card>

    <b-modal ref="modal" size="md" hide-footer>
      <div slot="modal-title">{{ openModalTitle }}</div>
      <service-modal ref="ServiceModal" :modal-row-info="modalRowInfo" :reqst-options="svcReqstStatusOptions" :consign-options="svcConsignStatusOptions"></service-modal>
    </b-modal>

  </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import Datepicker from 'vuejs-datepicker'
import Pagination from '@/components/common/pagination/Pagination'
import moment from 'moment'
import ServiceModal from '@/components/common/services/service-modal'

export default {
  name: 'consign',

  components: {
    Datepicker,
    'pagination': Pagination,
    'service-modal': ServiceModal
  },

  data: () => ({
    // option 정보
    // svcItemCodeOptions: [],
    svcReqstStatusOptions: [],
    svcConsignStatusOptions: [],

    // sort
    sortDesc: true,
    sortBy: 'svcReqstNo',

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
    openModalCodeName: '탁송서비스',

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
      {key: 'radioButton', sortable: false, tdClass: 'align-middle', label: '', 'class': 'text-center'},
      {key: 'svcReqstNo', sortable: true, tdClass: 'align-middle', label: '신청번호', isActive: false, 'class': 'text-center'},
      /* { key: 'svcItemCodeName', sortable: true, tdClass: 'align-middle', label: '서비스종류' }, */
      {key: 'carPlateNumber', sortable: false, tdClass: 'align-middle', label: '차량번호', 'class': 'text-center'},
      {key: 'svcReqstStatusName', sortable: true, tdClass: 'align-middle', label: '상태', 'class': 'text-center'},
      // {key: 'affiliateCode', sortable: false, tdClass: 'align-middle', label: '제휴사코드', 'class': 'text-center'},
      {key: 'svcReqstUserNo', sortable: true, tdClass: 'align-middle', label: '신청고객번호', 'class': 'text-center'},
      {key: 'svcReqstUserName', sortable: true, tdClass: 'align-middle', label: '신청고객', 'class': 'text-center'},
      {key: 'svcReqstDt', sortable: true, tdClass: 'align-middle', label: '신청일', 'class': 'text-center'},
      {key: 'createDt', sortable: true, tdClass: 'align-middle', label: '등록일시', 'class': 'text-center'},
      {key: 'updateDt', sortable: true, tdClass: 'align-middle', label: '수정일시', 'class': 'text-center'},
      {key: 'showDetail', sortable: false, tdClass: 'align-middle', label: '상세보기', 'class': 'text-center'}
    ],

    searchParameters: {
      svcItemCode: '500',
      svcReqstStatus: '',

      searchStartDay: moment().add(-3, 'month').format('YYYY-MM-DD'),
      searchEndDay: moment().format('YYYY-MM-DD'),

      order: null,
      orderDesc: ''
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
    this.loadSvcReqstStatus()
    this.loadSvcConsignStatus()

    this.$on('closeModal', this.closeModal)
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
            case 'svcReqstNo': this.searchParameters['order'] = 1; break
            case 'carPlateNumber': this.searchParameters['order'] = 2; break
            case 'svcReqstStatusName': this.searchParameters['order'] = 3; break
            case 'svcReqstUserNo': this.searchParameters['order'] = 4; break
            case 'svcReqstDt': this.searchParameters['order'] = 5; break
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
        return getServicelist(parameters, _super)
      }

      function getServicelist (parameters, _super) {
        return _super.$http.get('/service-request', parameters)
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

    /* loadSvcItemCode () {
      const parameter = '?codeLv2=SVC_ITEM_CODE&lv=3'
      this.loadCombo(parameter, 'svcItemCodeOptions')
    }, */

    loadSvcReqstStatus () {
      const parameter = '?codeLv2=SVC_REQST_STATUS&lv=3'
      this.loadCombo(parameter, 'svcReqstStatusOptions')
    },

    loadSvcConsignStatus () {
      const parameter = '?codeLv2=SVC_CONSIGN_STATUS&lv=3'
      this.loadCombo(parameter, 'svcConsignStatusOptions')
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
        this.openModalTitle = '탁송서비스 등록'
        this.openModalMode = 'POST'
        this.modalRowInfo = {
          svcItemCodeName: this.openModalCodeName,
          svcItemCode: this.searchParameters['svcItemCode'],
          svcReqstStatus: '100',
          pid: this.$global.PID
        }
      } else {
        // Row 수정 Model Open
        this.openModalTitle = '탁송서비스 상세'
        this.openModalMode = 'PUT'
        this.modalRowInfo = this.$commons.clone(this.clickedRowInfo)
      }

      this.$refs.modal.show()
    },

    // Save Modal
    saveModal () {
      if (this.openModalMode === 'POST') {
        this.$http.post('/service-request', this.modalRowInfo)
          .then(
            (response) => {
              this.afterSaveModal(response.data['resultObject'])
            }
          )
      } else {
        this.$http.put('/service-request', this.modalRowInfo)
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
      this.afterProcess()
    },

    // 삭제 프로세스
    removeModal () {
      if (confirm('삭제하시겠습니까?')) {
        this.$http.delete('/service-request-admin?requestId=' + this.selectedItems)
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

    // Close Modal
    closeModal () {
      this.$refs.modal.hide()
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
          this.selectedItems.push(this.tableData[i].svcReqstNo)
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
