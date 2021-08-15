<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">고객서비스 /</span> 고객요청서비스 관리
    </h4>

    <div class="ui-bordered px-4 pt-4 mb-4">
      <div class="form-row align-items-center">
        <div class="col-md mb-4">
          <b-form-group label="서비스종류">
            <b-form-select v-model="searchParameters.svcItemCode" :options="svcItemCodeOptions">
              <template slot="first">
                <option value="">전체</option>
              </template>
            </b-form-select>
          </b-form-group>
        </div>
        <div class="col-md mb-4">
          <b-form-group label="요청서비스번호">
            <b-input type="text" placeholder="요청서비스번호" v-model="searchParameters.svcReqstNo"></b-input>
          </b-form-group>
        </div>
        <div class="col-md mb-4">
          <b-form-group label="차량번호">
            <b-input type="text" placeholder="차량번호" v-model="searchParameters.carPlateNumber"></b-input>
          </b-form-group>
        </div>
        <div class="col-md mb-4">
          <b-form-group label="신청고객번호">
            <b-input type="text" placeholder="신청고객번호" v-model="searchParameters.svcReqstUserNo"></b-input>
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
      </div>
    </div>

    <b-card>
      <h5 slot="header" class="mb-0">고객요청서비스 목록</h5>
      <b-card-body class="pb-0">
        <b-table show-empty
          ref="table"
          class="card-table"
          :items="tableData"
          :fields="fields"
          :per-page="perPage"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :striped="true"
          :bordered="true"
          @row-clicked="rowClicked">

          <template slot="table-colgroup">
            <col span="1" width="1%" />
            <col span="1" width="5%" />
            <col span="1" width="10%" />
            <col span="1" width="10%" />
            <col span="1" width="5%" />
            <col span="1" width="10%" />
            <col span="1" width="8%" />
            <col span="1" width="8%" />
            <col span="1" width="8%" />
            <col span="1" width="8%" />
          </template>

          <template slot="radioButton" slot-scope="row">
            <b-form-checkbox
              v-model="row.item.selected"
              :disabled="true"></b-form-checkbox>
          </template>

          <template slot="svcReqstStatusName" slot-scope="row">
            {{ row.item.svcItemCode === '500' ? row.item.svcConsignStatusName : row.item.svcReqstStatusName }}
          </template>

        </b-table>

        <!-- Pagination -->
        <pagination :total-size="totalSize" :current-page="currentPage" :per-page="perPage"></pagination>
      </b-card-body>
      <b-card-footer>
        <div>
          <span class="float-left">
            <b-btn id="btnDelete" variant="default" :disabled="clickedRowInfo.svcReqstNo === undefined" @click="removeModal">삭제</b-btn>
          </span>
          <span class="float-right">
            <b-btn id="btnUpdate" variant="secondary" :disabled="clickedRowInfo.svcReqstNo === undefined" @click="openModal(false)">상세</b-btn>
            <b-btn variant="primary" @click="openModal(true)">등록</b-btn>
          </span>
        </div>
      </b-card-footer>
    </b-card>

    <b-modal ref="modal" size="md" hide-footer>
      <div slot="modal-title">{{ openModalTitle }}</div>
      <type1-modal>
        <b-form>
          <div class="row">
            <div class="col-md-6" v-if="modalRowInfo.svcReqstNo !== undefined">
              <b-form-group label="요청서비스번호">
                <b-input type="text" placeholder="요청서비스번호" v-model="modalRowInfo.svcReqstNo" :readonly="true"></b-input>
              </b-form-group>
            </div>
            <div class="col-md-6">
              <b-form-group label="신청일">
                <flat-pickr v-model="modalRowInfo.svcReqstDt" ref="svcReqstDt" :config="flatConfig" :placeholder="!isIE ? '신청일' : null" />
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <b-form-group label="서비스종류">
                <b-form-select v-model="modalRowInfo.svcItemCode" :options="svcItemCodeOptions"></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-6">
              <b-form-group label="서비스상태">
                <b-form-select v-if="modalRowInfo.svcItemCode != 500" v-model="modalRowInfo.svcReqstStatus" :options="svcReqstStatusOptions"></b-form-select>
                <b-form-select v-else v-model="modalRowInfo.svcReqstStatus" :options="svcConsignStatusOptions"></b-form-select>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <b-form-group label="차량번호">
                <b-input type="text" placeholder="차량번호" v-model="modalRowInfo.carPlateNumber"></b-input>
              </b-form-group>
            </div>
            <div class="col-md-6">
              <b-form-group label="신청고객번호">
                <b-input type="text" placeholder="신청고객번호" v-model="modalRowInfo.svcReqstUserNo"></b-input>
              </b-form-group>
            </div>
          </div>
          <b-form-group label="설명">
            <b-input type="text" placeholder="설명" v-model="modalRowInfo.dscrp"></b-input>
          </b-form-group>
          <b-form-group label="출발지 정보">
            <div class="row">
              <div class="col-md-3">
                <b-input type="text" placeholder="우편번호" v-model="modalRowInfo.frmZipCode"></b-input>
              </div>
              <div class="col-md-9">
                <b-input class="mb-2" type="text" placeholder="주소" v-model="modalRowInfo.frmAddr"></b-input>
              </div>
            </div>
            <b-input class="mb-2" type="text" placeholder="상세주소" v-model="modalRowInfo.frmAddrDetail"></b-input>
          </b-form-group>
          <b-form-group label="도착지 정보">
            <div class="row">
              <div class="col-md-3">
                <b-input type="text" placeholder="우편번호" v-model="modalRowInfo.toZipCode"></b-input>
              </div>
              <div class="col-md-9">
                <b-input class="mb-2" type="text" placeholder="주소" v-model="modalRowInfo.toAddr"></b-input>
              </div>
            </div>
            <b-input class="mb-2" type="text" placeholder="상세주소" v-model="modalRowInfo.toAddrDetail"></b-input>
          </b-form-group>
        </b-form>
      </type1-modal>
    </b-modal>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>

<style lang="scss">
  .default-style .flatpickr-calendar.open {
    z-index: 1100
  }
</style>

<script>
import Type1Modal from '@/components/common/modal/Type1Modal'
import Pagination from '@/components/common/pagination/Pagination'
import flatPickr from 'vue-flatpickr-component'

export default {
  name: 'ServiceRequest',

  components: {
    'pagination': Pagination,
    'type1-modal': Type1Modal,
    'flat-pickr': flatPickr
  },

  data: () => ({
    tableData: [],
    clickedRowInfo: {},
    clickedIndex: 0,
    modalRowInfo: {},
    openModalMode: '',
    openModalTitle: '',

    totalSize: 0,
    perPage: 10,
    currentPage: 1,
    sortDesc: true,
    sortBy: 'svcReqstNo',
    fields: [
      { key: 'radioButton', sortable: false, tdClass: 'align-middle', label: '' },
      { key: 'svcReqstNo', sortable: false, tdClass: 'align-middle', label: '번호' },
      { key: 'svcItemCodeName', sortable: true, tdClass: 'align-middle', label: '서비스종류' },
      { key: 'carPlateNumber', sortable: false, tdClass: 'align-middle', label: '차량번호' },
      { key: 'svcReqstStatusName', sortable: true, tdClass: 'align-middle', label: '상태' },
      { key: 'affiliateCode', sortable: true, tdClass: 'align-middle', label: '제휴사코드' },
      { key: 'svcReqstUserNo', sortable: true, tdClass: 'align-middle', label: '신청고객번호' },
      { key: 'svcReqstDt', sortable: true, tdClass: 'align-middle', label: '신청일' },
      { key: 'createDt', sortable: true, tdClass: 'align-middle', label: '등록일' },
      { key: 'updateDt', sortable: true, tdClass: 'align-middle', label: '수정일' }
    ],

    searchParameters: {
      svcItemCode: '',
      svcReqstStatus: ''
    },

    svcItemCodeOptions: [],
    svcReqstStatusOptions: [],
    svcConsignStatusOptions: [],

    flatConfig: {
      altFormat: 'Y-m-d',
      dateFormat: 'Y-m-d',
      altInput: true,
      animate: true
    }
  }),

  created () {
    this.loadTableData()
    this.loadSvcItemCode()
    this.loadSvcReqstStatus()
    this.loadSvcConsignStatus()

    this.$on('saveModal', this.saveModal) // 저장 이벤트
    this.$on('removeModal', this.removeModal) // 삭제 이벤트
    this.$on('changePaging', this.changePaging)
  },

  methods: {
    // Load Table Data
    loadTableData () {
      this.searchParameters['currentPageNo'] = this.currentPage
      this.searchParameters['rowsPerPage'] = this.perPage

      const parameters = {
        params: this.searchParameters
      }

      this.$http.get('/service-request', parameters)
        .then(
          (result) => {
            this.tableData = result.data['resultList']
            this.tableData.forEach((value) => {
              value.selected = false
            })
            this.totalSize = result.data['resultCount']
          }
        )
    },

    loadSvcItemCode () {
      const parameter = '?codeLv2=SVC_ITEM_CODE&lv=3'
      this.loadCombo(parameter, 'svcItemCodeOptions')
    },

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

    // Row Clicked
    rowClicked (item, index, event) {
      if (this.clickedRowInfo.svcReqstNo === undefined || this.clickedIndex !== index) {
        this.clickedIndex = index
        this.clickedRowInfo = item
      } else {
        this.clickedRowInfo = {}
      }

      this.tableData.forEach((value, idx) => {
        if (this.clickedIndex === idx && this.clickedRowInfo.svcReqstNo !== undefined) {
          value._rowVariant = 'info'
          value.selected = true
        } else {
          value._rowVariant = ''
          value.selected = false
        }
      })

      this.$forceUpdate()
    },

    // Open ApiModal
    openModal (flag) {
      if (flag) {
        // Row 등록 Modal Open
        this.openModalTitle = '고객요청서비스 등록'
        this.openModalMode = 'POST'
        this.modalRowInfo = {}
      } else {
        // Row 수정 Model Open
        this.openModalTitle = '고객요청서비스 상세'
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

      this.$commons.copyObject(this.tableData[this.clickedIndex], response)

      this.$refs.modal.hide()
    },

    // 삭제 프로세스
    removeModal () {
      if (confirm('삭제하시겠습니까?')) {
        this.$http.delete('/service-request/' + this.clickedRowInfo.svcReqstNo)
          .then(
            (result) => {
              if (result.data['resultCount'] > 0) {
                this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>삭제가 완료되었습니다.`, {theme: 'bubble', duration: 3000})
                this.$refs.modal.hide()
                this.loadTableData()
              } else {
                alert('삭제에 실패했습니다.')
              }
            }
          )
      }
    },

    // filter Search
    filterSearch () {
      this.currentPage = 1

      this.loadTableData()
    },

    // Paging
    changePaging (page) {
      this.currentPage = page

      this.loadTableData()
    }
  }
}
</script>
