<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">통계 /</span> 매물전송현황
    </h4>
    <div class="ui-bordered px-4 pt-4 mb-4">
      <div class="form-row align-items-center">
        <sido-area :sidoCode="searchParameters.sidoCode" :sidoOptions="sidoOptions" :areaOptions="areaOptions"/>
        <div class="col-md mb-2">
          <b-form-group label="차량번호">
            <b-input type="text" placeholder="차량번호" v-model="searchParameters.plateNumber"></b-input>
          </b-form-group>
        </div>
        <div class="col-md mb-2">
          <b-form-group label="상사명">
            <div class="input-group">
              <b-input type="text" placeholder="상사명" v-model="shopName" readonly></b-input>
              <span class="input-group-append">
                <button class="btn btn-secondary" @click="$EventBus.$emit('search-shop', 'A')">상사 검색</button>
              </span>
            </div>
          </b-form-group>
        </div>
        <div class="col-md mb-2">
          <b-form-group label="딜러명">
            <div class="input-group">
              <b-input type="text" placeholder="딜러명" v-model="userName" readonly></b-input>
                <span class="input-group-append">
                <button class="btn btn-secondary" @click="$EventBus.$emit('search-shop', 'B')">딜러 검색</button>
              </span>
            </div>
          </b-form-group>
        </div>
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
      </div>
      <div class="form-row">
        <car-category :cateCode="searchParameters.cateCode" :cateOptions="cateOptions"/>
        <div class="col-md mb-4">
          <b-form-group label="판매구분">
            <b-form-select v-model="searchParameters.saleSate">
              <template slot="first">
                <option value="3">판매중</option>
                <option value="9">판매완료</option>
              </template>
            </b-form-select>
          </b-form-group>
        </div>
        <div class="col-md mb-2">
          <b-form-group label="주행거리(From)">
            <b-input type="text" placeholder="숫자만 입력하세요" v-model="searchParameters.fromUseKm"></b-input>
          </b-form-group>
        </div>
        <div class="col-md mb-2">
          <b-form-group label="주행거리(To)">
            <b-input type="text" placeholder="숫자만 입력하세요" v-model="searchParameters.toUseKm"></b-input>
          </b-form-group>
        </div>
        <div class="col-md mb-2">
          <b-form-group label="연식(From)">
            <b-input type="text" placeholder="숫자만 입력하세요" v-model="searchParameters.fromRegYear"></b-input>
          </b-form-group>
        </div>
        <div class="col-md mb-2">
          <b-form-group label="연식(To)">
            <b-input type="text" placeholder="숫자만 입력하세요" v-model="searchParameters.toRegYear"></b-input>
          </b-form-group>
        </div>
        <div class="col-md col-xl-2 mb-4">
          <label class="form-label d-none d-md-block">&nbsp;</label>
          <b-btn variant="secondary" :block="true" @click="filterSearch">검색</b-btn>
        </div>
      </div>
    </div>

    <!-- Statistics -->
    <!--<b-card no-body class="mb-4">
      <b-card-header header-tag="h6" class="with-elements">
        <div class="card-header-title">Statistics</div>
        <div class="card-header-elements ml-auto">
          <label class="text m-0">
            <span class="text-light text-tiny font-weight-semibold align-middle">
              SHOW STATS
            </span>
            <span class="switcher switcher-sm d-inline-block align-middle mr-0 ml-2">
              <input type="checkbox" class="switcher-input" checked>
              <span class="switcher-indicator">
                <span class="switcher-yes"></span>
                <span class="switcher-no"></span>
              </span>
            </span>
          </label>
        </div>
      </b-card-header>
      <div class="row no-gutters row-bordered">
        <div class="col-md-8 col-lg-12 col-xl-8">
          <b-card-body>
            <chart-1/>
          </b-card-body>
        </div>

        <div class="col-md-4 col-lg-12 col-xl-4">
          <b-card-body>
            &lt;!&ndash; Numbers &ndash;&gt;
            <div class="row">
              <div class="col-6 col-xl-5 text-muted mb-3">Total sales</div>
              <div class="col-6 col-xl-7 mb-3">
                <span class="text-big">10,332</span>
                <sup class="text-success">+12%</sup>
              </div>
              <div class="col-6 col-xl-5 text-muted mb-3">Income amount</div>
              <div class="col-6 col-xl-7 mb-3">
                <span class="text-big">$1,534</span>
                <sup class="text-danger">-5%</sup>
              </div>
              <div class="col-6 col-xl-5 text-muted mb-3">Total budget</div>
              <div class="col-6 col-xl-7 mb-3">
                <span class="text-big">$10,534</span>
                <sup class="text-success">+12%</sup>
              </div>
              <div class="col-6 col-xl-5 text-muted mb-3">Page views</div>
              <div class="col-6 col-xl-7 mb-3">
                <span class="text-big">21,332</span>
                <sup class="text-danger">-12%</sup>
              </div>
              <div class="col-6 col-xl-5 text-muted mb-3">Completed tasks</div>
              <div class="col-6 col-xl-7 mb-3">
                <span class="text-big">12</span>
                <sup class="text-success">+12%</sup>
              </div>
            </div>
            &lt;!&ndash; / Numbers &ndash;&gt;

          </b-card-body>
        </div>
      </div>
    </b-card>-->
    <!-- / Statistics -->

    <b-card>
      <h5 slot="header" class="mb-0">차량 목록</h5>
      <b-card-body class="pb-0">
        <!-- Table controls -->
        <div class="row">
          <div class="col">
            <b-form-group>
              Records: &nbsp;
              <b-select size="sm" :options="perPageOptions" v-model="perPage" class="d-inline-block w-auto" />
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
            <col span="1" width="5%" />
            <col span="1" width="7%" />
            <col span="1" width="7%" />
            <col span="1" width="8%" />
            <col span="1" width="8%" />
          </template>
        </b-table>
        <pagination :total-size="totalSize" :current-page="currentPage" :per-page="perPage"></pagination>
        <!-- Pagination -->
        <!--<div class="text-center d-inline-block">
          <moon-loader :loading="isBusy"></moon-loader>
        </div>-->
      </b-card-body>
    </b-card>
    <car-detail></car-detail>
    <shop-dealer-popup></shop-dealer-popup>
  </div>

</template>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-color/vue-color.scss" lang="scss"></style>

<script>
import Pagination from '@/components/common/pagination/Pagination'
import SidoArea from '@/components/common/search/SidoArea'
import CarCategory from '@/components/common/search/CarCategory'
import ShopDealerPopup from '@/components/common/search/ShopDealerPopup'
import CarDetail from '@/components/car/search/CarDetail'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import chart1 from '@/components/common/chart/dashboard-chart-1'

export default {
  name: 'CardataList',
  components: {
    Datepicker,
    'pagination': Pagination,
    'sido-area': SidoArea,
    'shop-dealer-popup': ShopDealerPopup,
    'car-category': CarCategory,
    'car-detail': CarDetail,
    'chart-1': chart1
  },

  data: () => ({
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
    sidoOptions: [''],
    areaOptions: [''],
    cateOptions: [''],
    shopDealerInfos: [''],
    shopName: '',
    userName: '',
    modelInfo: {},
    rowInfo: {},
    isBusy: false,

    disabledDates: {
      days: [0] // Disable sunday
    },
    state: {
      startDate: moment().add(-3, 'month').toDate(),
      endDate: moment().toDate()
    },

    fields: [
      { key: 'carNo', sortable: false, tdClass: 'align-middle', label: '식별번호', 'class': 'text-center' },
      { key: 'nameLv1', sortable: false, tdClass: 'align-middle', label: '제조국가', 'class': 'text-center' },
      { key: 'nameLv2', sortable: false, tdClass: 'align-middle', label: '제조사', 'class': 'text-center' },
      { key: 'nameLv3', sortable: false, tdClass: 'align-middle', label: '모델', 'class': 'text-center' },
      { key: 'nameLv4', sortable: false, tdClass: 'align-middle', label: '상세모델', 'class': 'text-center' },
      { key: 'nameLv5', sortable: false, tdClass: 'align-middle', label: '등급', 'class': 'text-center' },
      { key: 'nameLv6', sortable: false, tdClass: 'align-middle', label: '상세등급', 'class': 'text-center' },
      { key: 'carPlateNumber', sortable: false, tdClass: 'align-middle', label: '차량번호', 'class': 'text-center' },
      { key: 'carRegYear', sortable: true, tdClass: 'align-middle', label: '연식', 'class': 'text-center' },
      { key: 'carRegDt', sortable: true, tdClass: 'align-middle', label: '최초등록일', formatter: 'getYyyymmdd', 'class': 'text-center' },
      { key: 'carUseKm', sortable: true, tdClass: 'align-middle', label: '주행거리', 'class': 'text-center' },
      { key: 'shopName', sortable: false, tdClass: 'align-middle', label: '상사명', 'class': 'text-center' },
      { key: 'createDt', sortable: true, tdClass: 'align-middle', label: '전송일', formatter: 'getYyyymmdd', 'class': 'text-center' }
    ],
    searchParameters: {
      sidoCode: '',
      areaCode: '',
      plateNumber: '',
      saleSate: '3',
      cateCode: '',
      // dealerName: '',
      toUseKm: '',
      fromUseKm: '',
      shopNos: '',
      userNos: '',
      order: '',
      orderDesc: '',
      toRegYear: null,
      fromRegYear: null
    }
  }),
  created () {
    // this.getList()
    this.$on('changePaging', this.changePaging)
    this.$on('changeSido', this.changeSido)
    this.$on('changeArea', this.changeArea)
    this.$on('changeCateCode', this.changeCateCode)
    this.$on('registShopDealerSearchInfo', this.registShopDealerSearchInfo) // 저장 이벤트
  },
  methods: {
    getList (ctx) {
      this.isBusy = true
      // this.$root.$children[0].loading = true
      this.searchParameters['currentPageNo'] = this.currentPage
      this.searchParameters['rowsPerPage'] = this.perPage
      this.searchParameters['startNumber'] = (this.currentPage - 1) * this.perPage + 1
      this.searchParameters['endNumber'] = this.searchParameters['startNumber'] + this.perPage - 1
      this.searchParameters['startDay'] = moment(this.state.startDate).format('YYYY-MM-DD')
      this.searchParameters['endDay'] = moment(this.state.endDate).format('YYYY-MM-DD')

      const parameters = {
        params: this.searchParameters
      }

      if (ctx !== undefined) {
        if (ctx.sortBy !== undefined) {
          switch (ctx.sortBy) {
            case 'carNo': this.searchParameters['order'] = 99; break
            case 'carRegYear': this.searchParameters['order'] = 4; break
            case 'carRegDt': this.searchParameters['order'] = 3; break
            case 'carUseKm': this.searchParameters['order'] = 2; break
            case 'createDt': this.searchParameters['order'] = 5; break
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
        _super.$http.get('/oncar/orglist-count', parameters)
          .then((result) => {
            _super.totalSize = result.data['resultCount']
          })
      }

      function getCarlist (parameters, _super) {
        return _super.$http.get('/oncar/orglist', parameters)
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

    setItems () {
      this.items = this.totalItems.slice((this.currentPage - 1) * this.perPage, (this.perPage * this.currentPage))
    },

    setIndexing (index) {
      return index + ((this.currentPage - 1) * this.perPage)
    },

    setCommaCarUseKm (carUseKm) {
      return `${carUseKm} km`
    },

    getYyyymmdd (value, key, item) {
      return value !== null ? value.split(' ')[0] : ''
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

    info (item, index, button) {
      this.modelInfo = item
      this.$refs.cardataModel.show()
    },

    rowClicked (item, index, event) {
      this.rowInfo = item
      this.$EventBus.$emit('car-detail-start', item)
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
      this.searchParameters.sidoCode = sidoCode
    },

    changeArea (areaCode) {
      this.searchParameters.areaCode = areaCode
    },

    changeCateCode (cateCode) {
      this.searchParameters.cateCode = cateCode
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
