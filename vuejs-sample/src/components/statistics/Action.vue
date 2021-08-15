<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">통계 /</span> 거래로그 현황
    </h4>
    <div class="ui-bordered px-4 pt-4 mb-4">
      <div class="form-row align-items-center">
        <div class="col-md col-xl-2 mb-4">
          <label class="form-label d-none d-md-block">거래 선택</label>
          <b-btn variant="secondary" :block="true" @click="$EventBus.$emit('api-search')">거래 선택</b-btn>
        </div>
        <div class="col-md mb-4">
          <label class="form-label">거래채널</label>
          <b-form-select v-model="searchParameters.chnnlCd">
            <template slot="first">
              <option value="">전체</option>
              <option value="ADM">관리자</option>
              <option value="WEB">PC 웹</option>
              <option value="MBL">모바일</option>
            </template>
          </b-form-select>
        </div>
        <div class="col-md mb-2">
          <b-form-group label="검색시작일자">
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
          <b-form-group label="검색종료일자">
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
        <div class="col-md col-xl-2 mb-4">
          <label class="form-label d-none d-md-block">&nbsp;</label>
          <b-btn variant="secondary" :block="true" @click="filterSearch">검색</b-btn>
        </div>
      </div>
    </div>

    <b-card no-body class="mb-4">
      <div class="row no-gutters row-bordered">
        <b-card-body>
          <line-chart :label="lineChart.label"></line-chart>
        </b-card-body>
      </div>
    </b-card>

    <b-card>
      <h5 slot="header" class="mb-0">거래 현황</h5>
      <b-card-body class="pb-0">
        <div class="row">
          <div class="col">
            <b-form-group>
              Records: &nbsp;
              <b-select size="sm" :options="perPageOptions" v-model="perPage" class="d-inline-block w-auto" />
            </b-form-group>
          </div>
        </div>
        <span style="font-size: small;">
        <b-table
           show-empty
           ref="table"
           :items="loadTableData"
           :fields="fields"
           :per-page="perPage"
           :sort-by.sync="sortBy"
           :sort-desc.sync="sortDesc"
           :striped="true"
           :bordered="false"
           :busy.sync="isBusy"
           :hover="true">
          <template slot="table-colgroup">
            <col span="1" width="4%" />
            <col span="1" width="4%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
            <col span="1" width="2%" />
          </template>
        </b-table>
        </span>
      </b-card-body>
    </b-card>
    <api-popup></api-popup>
  </div>
</template>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import Chart1 from '@/components/common/chart/dashboard-chart-1'
import ApiPopup from '@/components/common/search/ApiPopup'

export default {
  components: {
    Datepicker,
    'line-chart': Chart1,
    'api-popup': ApiPopup
  },
  data: () => ({
    tableData: [],
    sortBy: 'reqDt',
    sortDesc: true,
    perPage: 10,
    currentPage: 1,
    perPageOptions: [10, 20, 30, 40, 50],
    isBusy: false,
    state: {
      startDate: moment().add(-3, 'month').toDate(),
      endDate: moment().toDate()
    },
    disabledDates: {
      days: [0] // Disable sunday
    },
    actionInfos: [''],
    actionName: [''],
    fields: [
      {key: 'reqDt', sortable: true, tdClass: 'align-middle', label: '날짜', 'class': 'text-center', formatter: 'getYyyymmdd'},
      {key: 'chnnlCode', sortable: true, tdClass: 'align-middle', label: '채널', 'class': 'text-center', formatter: 'getChnnlName'},
      {key: 'h00', sortable: false, tdClass: 'align-middle', label: '00시', 'class': 'text-center'},
      {key: 'h01', sortable: false, tdClass: 'align-middle', label: '01시', 'class': 'text-center'},
      {key: 'h02', sortable: false, tdClass: 'align-middle', label: '02시', 'class': 'text-center'},
      {key: 'h03', sortable: false, tdClass: 'align-middle', label: '03시', 'class': 'text-center'},
      {key: 'h04', sortable: false, tdClass: 'align-middle', label: '04시', 'class': 'text-center'},
      {key: 'h05', sortable: false, tdClass: 'align-middle', label: '05시', 'class': 'text-center'},
      {key: 'h06', sortable: false, tdClass: 'align-middle', label: '06시', 'class': 'text-center'},
      {key: 'h07', sortable: false, tdClass: 'align-middle', label: '07시', 'class': 'text-center'},
      {key: 'h08', sortable: false, tdClass: 'align-middle', label: '08시', 'class': 'text-center'},
      {key: 'h09', sortable: false, tdClass: 'align-middle', label: '09시', 'class': 'text-center'},
      {key: 'h10', sortable: false, tdClass: 'align-middle', label: '10시', 'class': 'text-center'},
      {key: 'h11', sortable: false, tdClass: 'align-middle', label: '11시', 'class': 'text-center'},
      {key: 'h12', sortable: false, tdClass: 'align-middle', label: '12시', 'class': 'text-center'},
      {key: 'h13', sortable: false, tdClass: 'align-middle', label: '13시', 'class': 'text-center'},
      {key: 'h14', sortable: false, tdClass: 'align-middle', label: '14시', 'class': 'text-center'},
      {key: 'h15', sortable: false, tdClass: 'align-middle', label: '15시', 'class': 'text-center'},
      {key: 'h16', sortable: false, tdClass: 'align-middle', label: '16시', 'class': 'text-center'},
      {key: 'h17', sortable: false, tdClass: 'align-middle', label: '17시', 'class': 'text-center'},
      {key: 'h18', sortable: false, tdClass: 'align-middle', label: '18시', 'class': 'text-center'},
      {key: 'h19', sortable: false, tdClass: 'align-middle', label: '19시', 'class': 'text-center'},
      {key: 'h20', sortable: false, tdClass: 'align-middle', label: '20시', 'class': 'text-center'},
      {key: 'h21', sortable: false, tdClass: 'align-middle', label: '21시', 'class': 'text-center'},
      {key: 'h22', sortable: false, tdClass: 'align-middle', label: '22시', 'class': 'text-center'},
      {key: 'h23', sortable: false, tdClass: 'align-middle', label: '23시', 'class': 'text-center'}
    ],
    // Search Options
    searchParameters: {
      mobileYn: '',
      chnnlCd: '',
      apiNos: ''
    },
    ynOptions: {
      'Y': 'Y',
      'N': 'N'
    },
    lineChart: {
      label: []
    }
  }),
  created () {
    this.$on('registActionIdSearchInfo', this.registActionIdSearchInfo) // 저장 이벤트
  },
  methods: {
    // Save Modal
    registActionIdSearchInfo (_o, _t) {
      this.actionSearchInit()
      this.actionInfos = this.$commons.clone(_o)

      let nameAndNos = this.getNameAndNo(_t)
      let names = nameAndNos.name
      let nos = nameAndNos.nos

      this.actionName = names.join(', ')
      this.searchParameters.apiNos = nos.join(', ')
    },
    actionSearchInit () {
      this.actionName = ''
      this.searchParameters.apiNos = ''
    },
    getNameAndNo (_t) {
      let _names = []
      let _nos = []

      Object.keys(this.actionInfos).forEach(itemKey => {
        _names.push(this.actionInfos[itemKey].value)
        _nos.push(this.actionInfos[itemKey].key)
      })

      return {
        'name': _names,
        'nos': _nos
      }
    },
    // notice data load
    loadTableData (ctx) {
      if (ctx !== undefined) {
        if (ctx.sortBy !== undefined) {
          switch (ctx.sortBy) {
            case 'reqDt': this.searchParameters['order'] = 0; break
            case 'chnnlCode': this.searchParameters['order'] = 1; break
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

      this.isBusy = true
      this.searchParameters['fromDate'] = moment(this.state.startDate).format('YYYY-MM-DD')
      this.searchParameters['toDate'] = moment(this.state.endDate).format('YYYY-MM-DD')
      this.searchParameters['rowsPerPage'] = this.perPage

      const parameters = {
        params: this.searchParameters
      }
      return this.$http.get('/statistics/login-list', parameters)
        .then(
          (result) => {
            this.tableData = result.data['resultList']
            this.isBusy = false
            this.getLabelData(this.tableData)
            return this.tableData
          }
        )
    },
    filterSearch () {
      this.loadTableData()
      this.$refs.table.refresh()
    },
    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    getChnnlName (value, key, item) {
      let ret = ''
      switch (value) {
        case 'ADM': ret = '관리자'; break
        case 'WEB': ret = 'PC웹'; break
        case 'MBL': ret = '모바일'; break
        default: ret = '-'; break
      }
      return ret
    },
    getYyyymmdd (value, key, item) {
      return moment(value).format('YYYY-MM-DD')
    },
    getLabelData (tableData) {
      let ret = []
      let webCount = []
      let mblCount = []
      let admCount = []

      for (let i = 0; i < tableData.length; i++) {
        let index = ret.findIndex((item, k) => {
          return item === tableData[i].reqDt
        })

        if (index < 0) {
          ret.push(tableData[i].reqDt)
        }

        let count = Number(tableData[i].h00) + Number(tableData[i].h01) + Number(tableData[i].h02) + Number(tableData[i].h03) + Number(tableData[i].h04) +
          Number(tableData[i].h05) + Number(tableData[i].h06) + Number(tableData[i].h07) + Number(tableData[i].h08) + Number(tableData[i].h09) + Number(tableData[i].h10) +
          Number(tableData[i].h11) + Number(tableData[i].h12) + Number(tableData[i].h13) + Number(tableData[i].h14) + Number(tableData[i].h15) + Number(tableData[i].h16) +
          Number(tableData[i].h17) + Number(tableData[i].h18) + Number(tableData[i].h19) + Number(tableData[i].h20) + Number(tableData[i].h21) + Number(tableData[i].h22) + Number(tableData[i].h23)

        switch (tableData[i].chnnlCode) {
          case 'WEB': webCount.push(count); break
          case 'MBL': mblCount.push(count); break
          case 'ADM': admCount.push(count); break
          default: break
        }
      }
      this.lineChart.label = ret

      let chartData = [
        {
          label: 'PC 웹',
          data: webCount,
          borderWidth: 1,
          backgroundColor: 'rgba(28,180,255,.05)',
          borderColor: 'rgba(28,180,255,1)'
        },
        {
          label: '모바일',
          data: mblCount,
          borderWidth: 1,
          borderDash: [5, 5],
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          borderColor: '#8897aa'
        },
        {
          label: '관리자',
          data: admCount,
          borderWidth: 1,
          backgroundColor: 'rgba(136, 151, 170, 0.1)',
          borderColor: '#8897aa'
        }
      ]

      this.$EventBus.$emit('label-set', ret, chartData)
    }
  }

}
</script>
