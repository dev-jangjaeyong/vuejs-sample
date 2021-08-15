<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">통계 /</span> 내차알림현황
    </h4>
    <div class="ui-bordered px-4 pt-4 mb-4">
      <div class="form-row align-items-center">
        <div class="col-md mb-2">
          <b-form-group label="딜러명">
            <div class="input-group">
              <b-input type="text" placeholder="회원명" v-model="userName" readonly></b-input>
              <span class="input-group-append">
                <button class="btn btn-secondary" @click="$EventBus.$emit('user-search', 'A')">회원 검색</button>
              </span>
            </div>
          </b-form-group>
        </div>
        <div class="col-md mb-2">
          <b-form-group label="차량가격(From)">
            <b-input type="text" placeholder="숫자만 입력하세요" v-model="searchParameters.carSaleAmtFr"></b-input>
          </b-form-group>
        </div>
        <div class="col-md mb-2">
          <b-form-group label="차량가격(To)">
            <b-input type="text" placeholder="숫자만 입력하세요" v-model="searchParameters.carSaleAmtTo"></b-input>
          </b-form-group>
        </div>
        <div class="col-md mb-2">
          <b-form-group label="주행거리(From)">
            <b-input type="text" placeholder="숫자만 입력하세요" v-model="searchParameters.carUseKmFr"></b-input>
          </b-form-group>
        </div>
        <div class="col-md mb-2">
          <b-form-group label="주행거리(To)">
            <b-input type="text" placeholder="숫자만 입력하세요" v-model="searchParameters.carUseKmTo"></b-input>
          </b-form-group>
        </div>
        <div class="col-md mb-2">
          <b-form-group label="연식(From)">
            <b-input type="text" placeholder="숫자만 입력하세요" v-model="searchParameters.carRegYearFr"></b-input>
          </b-form-group>
        </div>
        <div class="col-md mb-2">
          <b-form-group label="연식(To)">
            <b-input type="text" placeholder="숫자만 입력하세요" v-model="searchParameters.carRegYearTo"></b-input>
          </b-form-group>
        </div>
      </div>
      <div class="form-row">
        <div class="col-md mb-2">
          <b-form-group label="전송일(From)">
            <datepicker
              v-model="state.startDate"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              placeholder="Select arrival date"
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="true"
              :disabled-dates="disabledDates"
              :format="customFormatter"/>
          </b-form-group>
        </div>
        <div class="col-md mb-2">
          <b-form-group label="전송일(To)">
            <datepicker
              v-model="state.endDate"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              placeholder="Select arrival date"
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="true"
              :disabled-dates="disabledDates"
              :format="customFormatter"/>
          </b-form-group>
        </div>
        <div class="col-md mb-4">
          <b-form-group label="알람상태">
            <b-form-select v-model="searchParameters.status">
              <template slot="first">
                <option value="">전체</option><!--임의 코드-->
                <option value="001">저장</option><!--임의 코드-->
                <option value="002">취소</option><!--임의 코드-->
                <option value="003">삭제</option><!--임의 코드-->
              </template>
            </b-form-select>
          </b-form-group>
        </div>
        <sido title="시도1순위" v-model="searchParameters.sidoCd1st" :sidoCode="searchParameters.sidoCd1st" :sidoOptions="sidoOptions" ref="sidoFirst"></sido>
        <sido title="시도2순위" v-model="searchParameters.sidoCd2nd" :sidoCode="searchParameters.sidoCd2nd" :sidoOptions="sidoOptions" ref="sidoSecond"></sido>
        <div class="col-md col-xl-2 mb-4">
          <label class="form-label d-none d-md-block">&nbsp;</label>
          <b-btn variant="secondary" :block="true" @click="filterSearch">검색</b-btn>
        </div>
      </div>
    </div>

    <b-card>
      <h5 slot="header" class="mb-0">알람 목록</h5>
      <b-card-body class="pb-0">
        <!-- Table controls -->
        <div class="row">
          <div class="col">
            <b-form-group>
              Records: &nbsp;
              <b-select size="sm" :options="perPageOptions" v-model="perPage" class="d-inline-block w-auto" @input="changePaging('1')"/>
            </b-form-group>
          </div>
        </div>
        <b-table show-empty
          ref="table"
          :items="getList"
          :fields="fields"
          :per-page="perPage"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :striped="true"
          :bordered="false"
          :busy.sync="isBusy"
          :hover="true"
          @row-clicked="rowClicked">
          <template slot="table-colgroup">
            <col span="1" width="6%" />
            <col span="1" width="6%" />
            <col span="1" width="6%" />
            <col span="1" width="6%" />
            <col span="1" width="8%" />
            <col span="1" width="8%" />
            <col span="1" width="6%" />
            <col span="1" width="7%" />
            <col span="1" width="8%" />
            <col span="1" width="5%" />
            <col span="1" width="7%" />
            <col span="1" width="7%" />
            <col span="1" width="8%" />
          </template>
        </b-table>
        <pagination :total-size="totalSize" :current-page="currentPage" :per-page="perPage"></pagination>
      </b-card-body>
    </b-card>
    <user-popup></user-popup>
  </div>

</template>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-color/vue-color.scss" lang="scss"></style>

<script>
import Pagination from '@/components/common/pagination/Pagination'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import chart1 from '@/components/common/chart/dashboard-chart-1'
import Sido from '@/components/common/search/Sido'
import UserPopup from '@/components/common/search/UserPopup'

export default {
  name: 'CardataList',
  components: {
    Datepicker,
    'pagination': Pagination,
    'chart-1': chart1,
    'sido': Sido,
    'user-popup': UserPopup
  },

  data: () => ({
    sidoOptions: [''],
    tableData: [],
    totalSize: 0,

    // Pagination
    perPage: 10,
    currentPage: 1,
    perPageOptions: [10, 20, 30, 40, 50],

    sortDesc: true,
    items: [],
    totalItems: [],
    originalItems: [],
    sortBy: 'carNo',

    // where clause
    cateOptions: [''],
    userName: '',
    rowInfo: {},
    isBusy: false,

    disabledDates: {
      days: [0] // Disable sunday
    },
    /* highlightedDates: {
      dates: [
        moment().add(1, 'd').toDate(),
        moment().add(2, 'd').toDate(),
        moment().add(3, 'd').toDate()
      ]
    }, */
    state: {
      startDate: moment().add(-3, 'month').toDate(),
      endDate: moment().toDate()
    },

    fields: [
      { key: 'userNo', sortable: false, tdClass: 'align-middle', label: '회원번호', 'class': 'text-center' },
      { key: 'status', sortable: false, tdClass: 'align-middle', label: '알람상태', 'class': 'text-center' },
      { key: 'carSaleAmt', sortable: false, tdClass: 'align-middle', label: '차량금액', 'class': 'text-center' },
      { key: 'carRegYear', sortable: false, tdClass: 'align-middle', label: '연식', 'class': 'text-center' },
      { key: 'carUseKm', sortable: false, tdClass: 'align-middle', label: '주행거리', 'class': 'text-center' },
      { key: 'option1', sortable: false, tdClass: 'align-middle', label: '옵션1', 'class': 'text-center' },
      { key: 'option2', sortable: false, tdClass: 'align-middle', label: '옵션2', 'class': 'text-center' },
      { key: 'option3', sortable: false, tdClass: 'align-middle', label: '옵션3', 'class': 'text-center' },
      { key: 'sidoCd1st', sortable: false, tdClass: 'align-middle', label: '시도 1순위', 'class': 'text-center' },
      { key: 'sidoCd2nd', sortable: false, tdClass: 'align-middle', label: '시도 2순위', 'class': 'text-center' },
      { key: 'memo', sortable: false, tdClass: 'align-middle', label: '메모', 'class': 'text-center' }
    ],
    searchParameters: {
      sidoCd1st: '',
      sidoCd2nd: '',
      status: '',
      userNo: '',
      carUseKmFr: '',
      carUseKmTo: '',
      carSaleAmtFr: '',
      carSaleAmtTo: '',
      carRegYearTo: null,
      carRegYearFr: null,

      order: null,
      orderDesc: ''
    }
  }),
  created () {
    // this.getList()
    this.$on('changePaging', this.changePaging)
    this.$on('changeSido', this.changeSido)
  },
  methods: {
    getList (ctx) {
      this.isBusy = true
      // this.$root.$children[0].loading = true
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
            case 'toRegYear': this.searchParameters['order'] = 4; break
            case 'fromRegYear': this.searchParameters['order'] = 5; break
            case 'toUseKm': this.searchParameters['order'] = 2; break
            case 'fromUseKm': this.searchParameters['order'] = 1; break
            case 'alarmState': this.searchParameters['order'] = 3; break
            default: break
          }
        }

        if (ctx.sortDesc !== undefined) {
          switch (ctx.sortDesc) {
            case true: this.searchParameters['orderDesc'] = 'ASC'; break
            case false: this.searchParameters['orderDesc'] = 'DESC'; break
            default: break
          }
        }
      }

      return getlist(parameters, this)

      function getlist (parameters, _super) {
        totalCnt(parameters, _super)
        return getCarlist(parameters, _super)
      }

      function totalCnt (parameters, _super) {
        _super.$http.get('/oncar/alarm-log-listcount', parameters)
          .then((result) => {
            _super.totalSize = result.data['resultCount']
            // console.log()
          })
      }

      function getCarlist (parameters, _super) {
        return _super.$http.get('/oncar/alarm-log-pagelist', parameters)
          .then((result) => {
            _super.tableData = result.data['resultList']
            _super.tableData.forEach((value) => {
              value.selected = false
            })

            _super.isBusy = false
            return _super.tableData
          })
      }
    },

    setCommaCarUseKm (carUseKm) {
      return `${carUseKm} km`
    },

    getYyyymmdd (value, key, item) {
      return value !== null ? value.split(' ')[0] : ''
    },

    setItems () {
      this.items = this.totalItems.slice((this.currentPage - 1) * this.perPage, (this.perPage * this.currentPage))
    },

    setIndexing (index) {
      return index + ((this.currentPage - 1) * this.perPage)
    },

    filter (value) {
      const val = value.toLowerCase()
      const filtered = this.originalItems.filter(d => {
        return Object.keys(d)
          .filter(k => this.searchKeys.includes(k))
          .map(k => String(d[k]))
          .join('|')
          .toLowerCase()
          .indexOf(val) !== -1 || !val
      })
      this.totalItems = filtered
    },

    rowClicked (item, index, event) {
      this.rowInfo = item
      // this.$EventBus.$emit('car-detail-start', item)
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
    },

    changeSido (sidoCode) {
      // this.searchParameters.sidoCode = sidoCode
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
    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    }
  }
}
</script>

<style scoped>

</style>
