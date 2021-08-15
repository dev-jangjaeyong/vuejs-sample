<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">회원관리 /</span> 고객 관리
    </h4>

    <hr class="border-light container-m--x mt-0">

    <div class="ui-bordered px-4 pt-4 mb-4">
      <div class="form-row align-items-center">
        <!--<div class="col-md mb-4">
          <label class="form-label">회원구분</label>
          <b-form-select v-model="searchParameters.userTyCd" :options="userTypeOptions">
            <template slot="first">
              <option value="">전체</option>
            </template>
          </b-form-select>
        </div>-->
        <div class="col-md mb-4">
          <label class="form-label">조건</label>
          <b-form-select v-model="searchCondition" :options="conditionOptions">
            <template slot="first">
              <option value="" :disabled="true">조건 선택</option>
            </template>
          </b-form-select>
        </div>
        <div class="col-md mb-4">
          <label class="form-label">&nbsp;</label>
          <b-input placeholder="검색어 입력" v-model="searchParameters.keyword" />
        </div>
        <div class="col-md mb-4">
          <label class="form-label">상태</label>
          <b-form-select v-model="searchParameters.userStatus" :options="userStatusCodeOptions">
            <template slot="first">
              <option value="">전체</option>
            </template>
          </b-form-select>
        </div>
        <div class="col-md mb-4">
          <label class="form-label">성별</label>
          <b-form-select v-model="searchParameters.genderCode" :options="genderCodeOptions">
            <template slot="first">
              <option value="">전체</option>
            </template>
          </b-form-select>
        </div>
        <div class="col-md mb-4">
          <label class="form-label">휴대폰번호</label>
          <b-input placeholder="휴대폰번호" v-model="searchParameters.cellPhoneNo" />
        </div>
        <div class="col-md mb-4">
          <label class="form-label">이메일</label>
          <b-input placeholder="이메일" v-model="searchParameters.email" />
        </div>
        <!--<div class="col-md col-xl-2 mb-4">-->
          <!--<label class="form-label d-none d-md-block">&nbsp;</label>-->
          <!--<b-btn variant="secondary" :block="true" @click="filterSearch">검색</b-btn>-->
        <!--</div>-->
      </div>
      <div class="form-row">
        <div class="col-md mb-4">
          <b-form-group label="임직원여부" :label-cols="4">
            <b-form-select v-model="searchParameters.empYn">
              <option value="">전체</option>
              <option value="Y">예</option>
              <option value="N">아니오</option>
            </b-form-select>
          </b-form-group>
        </div>
        <div class="col-md mb-4">
          <b-form-group label="사번" :label-cols="4">
            <b-input placeholder="사번" v-model="searchParameters.empNo" />
          </b-form-group>
        </div>
        <div class="col-md mb-4">
          <b-form-group label="추천인" :label-cols="4">
            <b-input placeholder="추천인" v-model="searchParameters.recomendEmpId" />
          </b-form-group>
        </div>

        <div class="col-md mb-4">
          <b-form-group label="검색시작일자(가입)" :label-cols="4">
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
          <b-form-group label="검색종료일자" :label-cols="4">
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
      <h5 slot="header" class="mb-0">고객 목록</h5>
      <div class="row">
        <div class="col">
          <b-form-group>
            Records: &nbsp;
            <b-select size="sm" :options="perPageOptions" v-model="perPage" class="d-inline-block w-auto" @input="changePaging('1')"/>
          </b-form-group>
        </div>
        <downloadExcel
          class = "btn btn-outline-secondary"
          :fetch   = "getExcelList"
          :fields = "excel.fields"
          type    = "csv">
          Download Excel
        </downloadExcel>
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

          <!--<template slot="radioButton" slot-scope="row">
            <b-form-checkbox
              v-model="row.item.selected"
              :disabled="true"></b-form-checkbox>
          </template>-->

          <template slot="table-colgroup">
            <col span="1" width="8%" />
            <col span="1" width="7%" />
            <col span="1" width="9%" />
            <col span="1" width="7%" />
            <col span="1" width="8%" />
            <col span="1" width="13%" />
            <col span="1" width="14%" />
            <col span="1" width="10%" />
            <col span="1" width="13%" />
          </template>
        </b-table>

        <!-- Pagination -->
        <pagination :total-size="totalSize" :current-page="currentPage" :per-page="perPage"></pagination>
      </b-card-body>
      <!--<b-card-footer>
        <div>
          <span class="float-left">
            <b-btn id="btnDelete" variant="default" :disabled="clickedRowInfo.userNo === undefined" @click="removeModal">삭제</b-btn>
          </span>
          <span class="float-right">
            <b-btn id="btnUpdate" variant="secondary" :disabled="clickedRowInfo.userNo === undefined" @click="openModal(false)">수정</b-btn>
            &lt;!&ndash;<b-btn variant="primary" @click="openModal(true)">등록</b-btn>&ndash;&gt;
          </span>
        </div>
      </b-card-footer>-->
    </b-card>

    <b-modal ref="modal" size="md" hide-footer>
      <div slot="modal-title">{{openModalTitle}}</div>
      <user-info-modal ref="userInfoModal" :user-info-modal-info="modalRowInfo" :user-type-options="userTypeOptions" :gender-code-options="genderCodeOptions"></user-info-modal>
    </b-modal>
  </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import Pagination from '@/components/common/pagination/Pagination'
import UserInfoModal from './UserInfoModal'
import JsonExcel from 'vue-json-excel'

export default {
  name: 'UserInfo',

  components: {
    Datepicker,
    'pagination': Pagination,
    'user-info-modal': UserInfoModal,
    'downloadExcel': JsonExcel
  },

  data: () => ({
    // option 정보
    searchCondition: '',

    conditionOptions: [
      /* { value: 'userNo', text: '사용자번호' }, */
      { value: 'userId', text: '아이디' },
      { value: 'userName', text: '회원명' }
    ],

    userTypeOptions: [],
    genderCodeOptions: [],
    userStatusCodeOptions: [],

    // sort
    sortBy: 'userNo',
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

    // field
    fields: [
      /* { key: 'radioButton', sortable: false, tdClass: 'align-middle', label: '' }, */
      {key: 'userId', sortable: false, tdClass: 'align-middle', label: '회원 아이디', 'class': 'text-center'},
      {key: 'userName', sortable: false, tdClass: 'align-middle', label: '회원명', 'class': 'text-center'},
      {key: 'userStatusName', sortable: true, tdClass: 'align-middle', label: '회원 상태', 'class': 'text-center'},
      {key: 'genderCodeName', sortable: true, tdClass: 'align-middle', label: '성별', 'class': 'text-center'},
      {key: 'empYn', sortable: false, tdClass: 'align-middle', label: '임직원여부', 'class': 'text-center'},
      {key: 'cellPhoneNo', sortable: false, tdClass: 'align-middle', label: '휴대폰번호', 'class': 'text-center'},
      {key: 'email', sortable: false, tdClass: 'align-middle', label: '이메일', 'class': 'text-center'},
      {key: 'createDt', sortable: true, tdClass: 'align-middle', label: '가입일자', formatter: 'getYyyymmdd', 'class': 'text-center'},
      {key: 'lastLoginDt', sortable: true, tdClass: 'align-middle', label: '최종 로그인일시', 'class': 'text-center'}
    ],

    excel: {
      fields: {},
      data: [],
      meta: [
        {'key': 'charset', 'value': 'utf-8'}
      ]
    },

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
      genderCode: '',
      userStatus: '',
      userTyCd: '100',
      empYn: '',
      empNo: '',
      recomendEmpId: '',
      searchStartDay: moment().add(-1, 'month').format('YYYY-MM-DD'),
      searchEndDay: moment().format('YYYY-MM-DD'),

      order: null,
      orderDesc: ''
    }
  }),

  created () {
    /* this.loadData() */
    /* this.loadUserTyCdCombo() */
    this.loadGenderCodeCombo()
    this.loadUserStatusCodeCombo()

    this.$on('saveModal', this.saveModal) // 저장 이벤트
    this.$on('removeModal', this.removeModal) // 삭제 이벤트
    this.$on('changePaging', this.changePaging)
    this.$on('secessionModal', this.secessionModal) // 탈퇴 이벤트
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
            case 'userStatusName': this.searchParameters['order'] = 1; break
            case 'genderCodeName': this.searchParameters['order'] = 2; break
            case 'createDt': this.searchParameters['order'] = 3; break
            case 'lastLoginDt': this.searchParameters['order'] = 4; break
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
        return _super.$http.get('/user', parameters)
          .then(
            (result) => {
              _super.tableData = result.data['resultList']
              _super.tableData.forEach((value) => {
                value.selected = false
                value.empYn = value.empYn === 'Y' ? '예' : '아니오'
              })

              _super.isBusy = false
              _super.totalSize = result.data['resultCount']
              return _super.tableData
            })
      }
    },

    getExcelList () {
      const parameters = {
        params: this.searchParameters
      }

      return this.excel.data = getExcelUserlist(parameters, this)

      function getExcelUserlist (parameters, _super) {
        /* return _super.$http.get('/excel/user/download', parameters)
          .then(
            (result) => {
              _super.excel.fields = {
                '회원ID': 'userId',
                '회원명': 'userName',
                '생년월일': 'birthDay',
                '회원상태': 'userStatusName',
                '성별': 'genderCodeName',
                '임지원 여부': 'empYn',
                '임직원 번호': 'empNo',
                '관계사': 'affiliateCode',
                '추천임직원': 'recomendAffiliateEmpName',
                '추천임직원 사번': 'recomendEmpId',
                '추천관계사 코드': 'recomendAffiliateEmp',
                '휴대폰 번호': 'cellPhoneNo',
                '이메일' : 'email',
                '주소': 'addr',
                '문자 수신여부': 'rcivSmsUseYn',
                '이메일 수신여부': 'rcivEmailUseYn',
                '푸시 수신여부': 'rcivPushUseYn',
                '가입일자': 'joinDt',
                '최종로그인 일시': 'lastLoginDt'
              }
              return result.data['resultList']
            }) */
        // _super.$router.push('http://localhost:8220/excel/user/download', parameters)
        const querystring = require('querystring');
        let queryString = querystring.stringify(parameters);

        location.href = 'https://www.hanadreamcar.co.kr:8220/excel/user/download?' + queryString
      }
    },

    // Row 클릭
    rowClicked (item, index, event) {
      this.modalRowInfo = item
      this.openModalTitle = '고객 상세'
      this.$refs.modal.show()
      /* if (this.clickedRowInfo.userNo === undefined || this.clickedIndex !== index) {
        this.clickedIndex = index
        this.clickedRowInfo = item
      } else {
        this.clickedRowInfo = {}
      }

      this.tableData.forEach((value, idx) => {
        if (this.clickedIndex === idx && this.clickedRowInfo.userNo !== undefined) {
          value._rowVariant = 'info'
          value.selected = true
        } else {
          value._rowVariant = ''
          value.selected = false
        }
      })

      this.$forceUpdate() */
    },

    // Open ApiModal
    openModal (flag) {
      if (flag) {
        // Row 등록 Modal Open
        this.openModalTitle = '고객 정보 등록'
        this.openModalMode = 'POST'
        this.modalRowInfo = {}
      } else {
        // Row 수정 Model Open
        this.openModalTitle = '고객 정보 수정'
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
      if (!this.modalRowInfo.userName) {
        alert('회원명을 입력하세요')
        return
      }

      if (this.openModalMode === 'POST') {
        this.$http.post('/user/createUser', this.modalRowInfo)
          .then(
            (response) => {
              this.afterSaveModal(response.data['resultObject'])
            }
          )
      } else {
        this.$http.put('/user', this.modalRowInfo)
          .then(
            (response) => {
              this.afterSaveModal(response.data['resultObject'])
            }
          )
      }
    },

    secessionModal () {
      const parameter = '?userNo=' + this.modalRowInfo.userNo
      this.$http.get(`/user-admin/secession${parameter}`)
        .then(
          () => {
            this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>탈퇴가 완료되었습니다.`, {theme: 'bubble', duration: 3000})
            this.$refs.modal.hide()
            this.getList()
            this.$refs.table.refresh()
          }
        )
    },
    // Save Modal 후처리
    afterSaveModal (response) {
      this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>저장이 완료되었습니다.`, {theme: 'bubble', duration: 3000})

      this.$commons.copyObject(this.userInfoData[this.clickedIndex], response)

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

    /* loadUserTyCdCombo () {
      const parameter = '?codeLv2=USER_TYPE&lv=3'
      this.loadCombo(parameter, 'userTypeOptions')
    }, */

    loadGenderCodeCombo () {
      const parameter = '?codeLv2=GENDER&lv=3'
      this.loadCombo(parameter, 'genderCodeOptions')
    },

    loadUserStatusCodeCombo () {
      const parameter = '?codeLv2=USER_STATUS&lv=3'
      this.loadCombo(parameter, 'userStatusCodeOptions')
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

    filterSearch () {
      if (this.searchCondition === 'userName') {
        if (!this.searchParameters.cellPhoneNo) {
          alert('휴대폰 번호도 같이 입력해주세요.')
          return
        }
      }

      this.conditionOptions.forEach((value, index) => {
        const condition = value.value
        if (condition === this.searchCondition) {
          this.searchParameters[`${condition}`] = this.searchParameters.keyword
        } else {
          this.searchParameters[`${condition}`] = undefined
        }
      })
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

    getYyyymmdd (value, key, item) {
      return value !== null ? value.split(' ')[0] : ''
    }
  }
}
</script>

<style scoped>

</style>
