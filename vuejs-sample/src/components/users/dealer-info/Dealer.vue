<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">회원관리 /</span> 딜러 관리
    </h4>

    <hr class="border-light container-m--x mt-0">

    <div class="ui-bordered px-4 pt-4 mb-4">
      <div class="form-row align-items-center">
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
      </div>
      <div class="form-row">
        <div class="col-md mb-4">
          <label class="form-label">인증</label>
          <b-form-select v-model="searchCondition" :options="conditionOptions">
            <template slot="first">
              <option value="">전체</option>
            </template>
          </b-form-select>
        </div>
        <div class="col-md-4">
          <b-form-group label="상사명">
            <div class="input-group">
              <b-input type="text" placeholder="상사명" v-model="shopName" readonly></b-input>
              <span class="input-group-append">
                <button class="btn btn-secondary" @click="$EventBus.$emit('search-shop', 'A')">상사 검색</button>
              </span>
            </div>
          </b-form-group>
        </div>
        <div class="col-md-4">
          <b-form-group label="딜러명">
            <div class="input-group">
              <b-input type="text" placeholder="딜러명" v-model="userName" readonly></b-input>
              <span class="input-group-append">
                <button class="btn btn-secondary" @click="$EventBus.$emit('search-shop', 'B')">딜러 검색</button>
              </span>
            </div>
          </b-form-group>
        </div>
        <div class="col-md col-xl-2 mb-4">
          <label class="form-label d-none d-md-block">&nbsp;</label>
          <b-btn variant="secondary" :block="true" @click="filterSearch">검색</b-btn>
        </div>
      </div>
<!--      <div class="form-row">
        <div class="col-sm-5 pr-4">
          <b-form-group label="검색시작일자" :label-cols="4">
            <flat-pickr v-model="searchParameters.startDay" ref="startDay" :config="flatConfig" :placeholder="!isIE ? '검색시작일자' : null" />
          </b-form-group>
        </div>
        <div class="col-sm-5 pr-4">
          <b-form-group label="검색종료일자" :label-cols="4">
            <flat-pickr v-model="searchParameters.endDay " ref="endDay" :config="flatConfig" :placeholder="!isIE ? '검색종료일자' : null" />
          </b-form-group>
        </div>
        <div class="col-md col-xl-2 mb-4">
          <label class="form-label d-none d-md-block">&nbsp;</label>
          <b-btn variant="secondary" :block="true" @click="filterSearch">검색</b-btn>
        </div>
      </div>-->
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

          <!--<template slot="radioButton" slot-scope="row">
            <b-form-checkbox
              v-model="row.item.selected"
              :disabled="true"></b-form-checkbox>
          </template>-->

          <template slot="crtfcYn" slot-scope="row">
            <b-button size="sm" @click.stop="updateCrtfcYn(row.item)">{{row.item.crtfcYn == 'Y' ? '인증' : '미인증'}}
            </b-button>
          </template>

          <template slot="table-colgroup">
            <col span="1" width="7%" />
            <col span="1" width="5%" />
            <col span="1" width="13%" />
            <col span="1" width="4%" />
            <col span="1" width="3%" />
            <col span="1" width="8%" />
            <col span="1" width="10%" />
            <col span="1" width="10%" />
            <col span="1" width="10%" />
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
      <user-info-modal ref="userInfoModal" :user-info-modal-info="modalRowInfo" :gender-code-options="genderCodeOptions"></user-info-modal>
    </b-modal>
    <shop-dealer-popup></shop-dealer-popup>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>

<script>
import Pagination from '@/components/common/pagination/Pagination'
import DealerModal from './DealerModal'
import flatPickr from 'vue-flatpickr-component'
import ShopDealerPopup from '@/components/common/search/ShopDealerPopup'
import JsonExcel from 'vue-json-excel'

export default {
  name: 'Dealer',

  components: {
    'pagination': Pagination,
    'user-info-modal': DealerModal,
    'flat-pickr': flatPickr,
    'shop-dealer-popup': ShopDealerPopup,
    'downloadExcel': JsonExcel
  },

  data: () => ({
    // option 정보
    genderCodeOptions: [],
    userStatusCodeOptions: [],

    searchCondition: '',
    conditionOptions: [
      { value: 'Y', text: '인증' },
      { value: 'N', text: '미인증' }
    ],

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
    shopDealerInfos: [''],
    shopName: '',
    userName: '',

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
      {key: 'fullName', sortable: true, tdClass: 'align-middle', label: '상사명', 'class': 'text-center'},
      {key: 'userStatusName', sortable: true, tdClass: 'align-middle', label: '상태', 'class': 'text-center'},
      {key: 'crtfcYn', sortable: true, tdClass: 'align-middle', label: '인증', 'class': 'text-center'},
      {key: 'cellPhoneNo', sortable: false, tdClass: 'align-middle', label: '휴대폰번호', 'class': 'text-center'},
      {key: 'licenseStDt', sortable: true, tdClass: 'align-middle', label: '사원증 시작일', formatter: 'getYyyymmdd', 'class': 'text-center'},
      {key: 'licenseEdDt', sortable: true, tdClass: 'align-middle', label: '사원증 종료일', formatter: 'getYyyymmdd', 'class': 'text-center'},
      {key: 'lastLoginDt', sortable: true, tdClass: 'align-middle', label: '최종 로그인일시', 'class': 'text-center'}
    ],

    // pickr
    flatConfig: {
      altFormat: 'Y-m-d',
      dateFormat: 'Y-m-d',
      altInput: true,
      animate: true
    },

    searchParameters: {
      genderCode: '',
      userStatus: '',
      userTyCd: '200',
      shopNos: '',
      userNos: '',

      order: null,
      orderDesc: ''
    }
  }),

  created () {
    this.loadGenderCodeCombo()
    this.loadUserStatusCodeCombo()

    this.$on('saveModal', this.saveModal) // 저장 이벤트
    this.$on('removeModal', this.removeModal) // 삭제 이벤트
    this.$on('changePaging', this.changePaging)
    this.$on('registShopDealerSearchInfo', this.registShopDealerSearchInfo) // 저장 이벤트
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
            case 'fullName': this.searchParameters['order'] = 1; break
            case 'userStatusName': this.searchParameters['order'] = 2; break
            case 'genderCodeName': this.searchParameters['order'] = 3; break
            case 'licenseStDt': this.searchParameters['order'] = 4; break
            case 'licenseEdDt': this.searchParameters['order'] = 5; break
            case 'lastLoginDt': this.searchParameters['order'] = 6; break
            case 'crtfcYn': this.searchParameters['order'] = 7; break
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
        return _super.$http.get('/dealer/admin-list', parameters)
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
      this.modalRowInfo = item
      this.openModalTitle = '딜러 상세'
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
      this.searchParameters['crtfcYn'] = this.searchCondition
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

    // Save Modal
    registShopDealerSearchInfo (_o, _t) {
      this.shopDealerSearchInit()
      this.shopDealerInfos = this.$commons.clone(_o)

      let nameAndNos = this.getNameAndNo(_t)
      let names = nameAndNos.name
      let nos = nameAndNos.nos

      if (_t === 'A') {
        this.shopName = names.join(', ')
        this.searchParameters.shopNos = nos.join(', ')
      } else {
        let shopNos = nameAndNos.shopNos
        let shopNames = nameAndNos.shopNames

        this.userName = names.join(', ')
        this.searchParameters.userNos = nos.join(', ')
        this.searchParameters.shopNos = shopNos.join(', ')
        this.shopName = shopNames.join(', ')
      }
    },
    getNameAndNo (_t) {
      let _names = []
      let _nos = []

      if (_t === 'A') {
        Object.keys(this.shopDealerInfos).forEach(itemKey => {
          _names.push(this.shopDealerInfos[itemKey].value)
          _nos.push(this.shopDealerInfos[itemKey].key)
        })

        return {
          'name': _names,
          'nos': _nos
        }
      } else {
        let _shopNos = []
        let _shopNames = []
        Object.keys(this.shopDealerInfos).forEach(itemKey => {
          _names.push(this.shopDealerInfos[itemKey].value.userName)
          _shopNos.push(this.shopDealerInfos[itemKey].value.shopNo)
          _shopNames.push(this.shopDealerInfos[itemKey].value.shopName)
          _nos.push(this.shopDealerInfos[itemKey].key)
        })

        return {
          'name': _names,
          'nos': _nos,
          'shopNos': _shopNos,
          'shopNames': _shopNames
        }
      }
    },

    shopDealerSearchInit () {
      this.userName = ''
      this.shopName = ''
      this.searchParameters.shopNos = ''
      this.searchParameters.userNos = ''
    },

    updateCrtfcYn (e) {
      let message = '인증상태를 변경하시겠습니까?'

      if (confirm(message)) {
        if (e.crtfcYn === 'Y') e.crtfcYn = 'N'
        else e.crtfcYn = 'Y'

        this.$http.put('/dealer/crtfc', e)
          .then(
            () => {
              this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>수정이 완료되었습니다.`, {theme: 'bubble', duration: 3000})
              this.getList()
              this.$refs.table.refresh()
            }
          )
      }
    },
    getYyyymmdd (value, key, item) {
      return value !== null ? value.split(' ')[0] : ''
    }
  }
}
</script>

<style scoped>

</style>
