<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">회원관리 /</span> 관리자 관리
    </h4>

    <hr class="border-light container-m--x mt-0">

    <div class="ui-bordered px-4 pt-4 mb-4">
      <div class="form-row align-items-center">
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
<!--        <div class="col-md mb-4">
          <label class="form-label">상태</label>
          <b-form-select v-model="searchParameters.userStatus" :options="userStatusCodeOptions">
            <template slot="first">
              <option value="">전체</option>
            </template>
          </b-form-select>
        </div>-->
        <div class="col-md mb-4">
          <label class="form-label">성별</label>
          <b-form-select v-model="searchParameters.genderCode" :options="genderCodeOptions">
            <template slot="first">
              <option value="">전체</option>
            </template>
          </b-form-select>
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
          <label class="form-label">휴대폰번호</label>
          <b-input placeholder="휴대폰번호" v-model="searchParameters.cellPhoneNo" />
        </div>
        <div class="col-md mb-4">
          <label class="form-label">이메일</label>
          <b-input placeholder="이메일" v-model="searchParameters.email" />
        </div>
        <div class="col-md col-xl-2 mb-4">
          <label class="form-label d-none d-md-block">&nbsp;</label>
          <b-btn variant="secondary" :block="true" @click="filterSearch">검색</b-btn>
        </div>
      </div>
    </div>

    <b-card>
      <h5 slot="header" class="mb-0">관리자 목록</h5>
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

          <!--<template slot="radioButton" slot-scope="row">
            <b-form-checkbox
              v-model="row.item.selected"
              :disabled="true"></b-form-checkbox>
          </template>-->

          <template slot="table-colgroup">
            <col span="1" width="10%" />
            <col span="1" width="9%" />
            <col span="1" width="9%" />
            <col span="1" width="7%" />
            <col span="1" width="13%" />
            <col span="1" width="14%" />
            <col span="1" width="14%" />
            <col span="1" width="14%" />
          </template>
        </b-table>

        <!-- Pagination -->
        <pagination :total-size="totalSize" :current-page="currentPage" :per-page="perPage"></pagination>
      </b-card-body>
      <b-card-footer>
        <div>
          <span class="float-right">
            <!--<b-btn id="btnUpdate" variant="secondary" :disabled="clickedRowInfo.userNo === undefined" @click="openModal(false)">수정</b-btn>-->
            <b-btn variant="primary" @click="openModal(true)">등록</b-btn>
          </span>
        </div>
      </b-card-footer>
    </b-card>

    <b-modal ref="modal" size="md" hide-footer>
      <div slot="modal-title">{{openModalTitle}}</div>
      <admin-modal ref="userInfoModal" :user-info-modal-info="modalRowInfo" :flag="dupStatus" :user-status-code-options="userStatusCodeOptions" :gender-code-options="genderCodeOptions" :mode="openModalMode"></admin-modal>
    </b-modal>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>

<script>
import Pagination from '@/components/common/pagination/Pagination'
import AdminModal from './AdminModal'
import flatPickr from 'vue-flatpickr-component'

export default {
  name: 'Admin',

  components: {
    'pagination': Pagination,
    'admin-modal': AdminModal,
    'flat-pickr': flatPickr
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

    // 등록 시 중복체크 status
    dupStatus: 0,

    // field
    fields: [
      /* { key: 'radioButton', sortable: false, tdClass: 'align-middle', label: '' }, */
      {key: 'userId', sortable: false, tdClass: 'align-middle', label: '회원 아이디', 'class': 'text-center'},
      {key: 'userName', sortable: false, tdClass: 'align-middle', label: '회원명', 'class': 'text-center'},
      {key: 'userStatusName', sortable: true, tdClass: 'align-middle', label: '회원 상태', 'class': 'text-center'},
      {key: 'genderCodeName', sortable: true, tdClass: 'align-middle', label: '성별', 'class': 'text-center'},
      {key: 'cellPhoneNo', sortable: false, tdClass: 'align-middle', label: '휴대폰번호', 'class': 'text-center'},
      {key: 'email', sortable: false, tdClass: 'align-middle', label: '이메일', 'class': 'text-center'},
      {key: 'createDt', sortable: true, tdClass: 'align-middle', label: '생성일자', formatter: 'getYyyymmdd', 'class': 'text-center'},
      {key: 'lastLoginDt', sortable: true, tdClass: 'align-middle', label: '최종 로그인일시', 'class': 'text-center'}
    ],

    /* pickr
    flatConfig: {
      altFormat: 'Y-m-d',
      dateFormat: 'Y-m-d',
      altInput: true,
      animate: true
    }, */

    searchParameters: {
      genderCode: '',
      userStatus: '',
      userTyCd: '300',

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
              })

              _super.isBusy = false
              _super.totalSize = result.data['resultCount']
              return _super.tableData
            })
      }
    },

    // Row 클릭
    rowClicked (item, index, event) {
      this.modalRowInfo = this.$commons.clone(item)
      this.openModalMode = 'PUT'
      this.openModalTitle = '관리자 상세'
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
        this.openModalTitle = '관리자 정보 등록'
        this.openModalMode = 'POST'
        this.modalRowInfo = {
          genderCode: this.genderCodeOptions[0].value,
          userTyCd: '300',
          userStatus: '100'
        }
      } else {
        // Row 수정 Model Open
        this.openModalTitle = '관리자 정보 수정'
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
      this.modalRowInfo.pid = this.$global.PID

      if (this.openModalMode === 'POST') {
        if (!this.valid(this.modalRowInfo)) return
        this.$http.post('/user-admin/create', this.modalRowInfo)
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

    // Save Modal 후처리
    afterSaveModal (response) {
      this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>저장이 완료되었습니다.`, {theme: 'bubble', duration: 3000})

      // this.$commons.copyObject(this.userInfoData[this.clickedIndex], response)

      this.$refs.modal.hide()
      this.getList()
      this.$refs.table.refresh()
    },

    // remove Modal
    removeModal (userNo) {
      if (confirm('삭제하시겠습니까?')) {
        this.$http.delete('/user/' + userNo + '?trueDelete=true')
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

    dupchk (userId) {
      if (userId === undefined) {
        alert('아이디를 입력해주세요.')
        return
      }

      const parameter = '?userId=' + userId

      this.$http.get('/user/dupchk' + parameter)
        .then(
          (result) => {
            if (result.data.resultCount === 1) {
              alert('중복된 아이디가 존재합니다.')
              this.dupStatus = 0
            } else {
              alert('사용 가능한 아이디입니다.')
              this.dupStatus = 1
            }
          }
        )
    },
    getYyyymmdd (value, key, item) {
      return value !== null ? value.split(' ')[0] : ''
    },
    valid (data) {
      if (!data.userId) {
        alert('아이디를 입력하세요.')
        return false
      }

      if (this.dupStatus === 0) {
        alert('아이디 중복체크를 해주세요.')
        return false
      }

      if (!data.userName) {
        alert('관리자명을 입력하세요.')
        return false
      }

      if (!data.userPassword) {
        alert('비밀번호를 입력하세요.')
        return false
      }

      if (!(data.userPassword === data.password2)) {
        alert('비밀번호가 일치하지 않습니다.')
        return false
      }

      if (!data.cellPhoneNo) {
        alert('휴대폰번호를 입력해주세요.')
        return false
      }

      if (!data.email) {
        alert('이메일을 입력하세요.')
        return false
      }

      return true
    }
  }
}
</script>

<style scoped>

</style>
