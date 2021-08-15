<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">컨텐츠 관리 /</span> FAQ 관리
    </h4>

    <hr class="border-light container-m--x mt-0">

    <div class="ui-bordered px-4 pt-4 mb-4">
      <div class="form-row align-items-center">
        <div class="col-md-2 mb-3">
          <label class="form-label">FAQ 유형</label>
          <b-form-select v-model="searchParameters.faqBoardTyCd" :options="faqTyCdOptions">
            <template slot="first">
              <option value="">전체</option>
            </template>
          </b-form-select>
        </div>
        <div class="col-md-2 mb-3">
          <label class="form-label">FAQ게시글번호</label>
          <b-input placeholder="FAQ게시글번호" v-model="searchParameters.faqBoardNo" />
        </div>
        <div class="col-md-4 mb-3">
          <label class="form-label">Keyword</label>
          <b-input placeholder="질문 또는 내용" v-model="searchParameters.keyword" />
        </div>
        <div class="col-md-2 mb-3">
          <label class="form-label d-none d-md-block">&nbsp;</label>
          <b-btn variant="secondary" :block="true" @click="filterSearch">검색</b-btn>
        </div>
      </div>
    </div>

    <b-card>
      <h5 slot="header" class="mb-0">FAQ 목록</h5>
      <div class="row">
        <div class="col">
          <b-form-group>
            Records: &nbsp;
            <b-select size="sm" :options="perPageOptions" v-model="perPage" class="d-inline-block w-auto" @input="changePaging('1')"/>
          </b-form-group>
        </div>
      </div>
      <b-card-body>
        <b-table show-empty
          ref="table"
          :items="getList"
          :fields="fields"
          :per-page="perPage"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :striped="true"
          :bordered="true"
          :hover="true"
          :busy.sync="isBusy"
          >

          <template slot="table-colgroup">
            <col span="1" width="1%" />
            <col span="1" width="7%" />
            <col span="1" width="10%" />
            <col span="1" width="50%" />
            <col span="1" width="10%" />
            <col span="1" width="10%" />
          </template>

          <template slot="radioButton" slot-scope="row">
            <b-form-checkbox v-model="row.item.selected"></b-form-checkbox>
          </template>
          <template slot="showDetail" slot-scope="row">
            <b-button size="sm" @click.stop="row.toggleDetails" @click="detailClick(row.item)" class="mr-2">
              {{ row.detailsShowing ? '숨기기' : '상세'}}
            </b-button>
          </template>
          <template slot="row-details" slot-scope="row">
            <b-form>
              <b-card>
                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-center"><b>유형</b></b-col>
                  <b-col sm="3">
                    <b-form-select v-model="detailRowInfo.faqBoardTyCd" :options="faqTyCdOptions">
                      <template slot="first">
                        <option value="undefined" :disabled="true">유형</option>
                      </template>
                    </b-form-select>
                  </b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-center"><b>질문</b></b-col>
                  <b-col sm="8">
                    <b-input type="text" placeholder="질문" v-model="detailRowInfo.title"/>
                  </b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-center"><b>내용</b></b-col>
                  <b-col sm="8">
                    <b-textarea v-model="detailRowInfo.contents" placeholder="내용" style="height: 150px"></b-textarea>
                  </b-col>
                </b-row>
                <b-button size="sm" @click="row.toggleDetails">숨기기</b-button>
                <b-button size="sm" class="float-right" variant="primary" @click="updateFaq(detailRowInfo)">저장</b-button>
              </b-card>
            </b-form>
          </template>
        </b-table>

        <!-- Pagination -->
        <pagination :total-size="totalSize" :current-page="currentPage" :per-page="perPage"></pagination>
      </b-card-body>
      <b-card-footer>
        <div>
          <span class="float-left">
            <b-btn id="btnDelete" variant="default" :disabled="clickedRowInfo.faqBoardNo === undefined" @click="removeModal">삭제</b-btn>
          </span>
          <span class="float-right">
            <!--<b-btn id="btnUpdate" variant="secondary" :disabled="clickedRowInfo.faqBoardNo === undefined" @click="openModal(false)">수정</b-btn>-->
            <b-btn variant="primary" @click="openModal(true)">등록</b-btn>
          </span>
        </div>
      </b-card-footer>
    </b-card>

    <b-modal ref="modal" size="lg" hide-footer>
      <div slot="modal-title">FAQ 등록</div>
      <faq-modal :faq-modal-info="modalRowInfo" :faq-ty-cd-options="faqTyCdOptions"></faq-modal>
    </b-modal>
  </div>
</template>

<script>
import Pagination from '@/components/common/pagination/Pagination'
import FaqModal from './FaqModal'

export default {
  name: 'Faq',

  components: {
    'pagination': Pagination,
    'faq-modal': FaqModal
  },

  data: () => ({
    // option 정보
    faqTyCdOptions: [],

    // sort
    sortBy: 'faqBoardNo',
    sortDesc: true,

    // page
    totalSize: 0,
    totalCount: 0,
    currentPage: 1,
    perPage: 10,
    perPageOptions: [10, 20, 30, 40, 50],

    // table 정보
    tableData: [],
    modalRowInfo: {},

    // row 정보
    clickedRowInfo: {},
    clickedIndex: 0,

    // modal 정보
    openModalMode: '',
    openModalTitle: '',

    detailRowInfo: {},

    // table loading
    isBusy: false,

    // field
    fields: [
      {key: 'radioButton', sortable: false, tdClass: 'align-middle', label: '', 'class': 'text-center'},
      {key: 'faqBoardNo', sortable: true, tdClass: 'align-middle', label: '번호', 'class': 'text-center'},
      {key: 'faqBoardTyCdName', sortable: true, tdClass: 'align-middle', label: '유형', 'class': 'text-center'},
      {key: 'title', sortable: false, tdClass: 'align-middle', label: '질문', 'class': 'text-center'},
      {key: 'createDt', sortable: true, tdClass: 'align-middle', label: '등록일', 'class': 'text-center'},
      {key: 'updateDt', sortable: true, tdClass: 'align-middle', label: '수정일', 'class': 'text-center'},
      {key: 'showDetail', sortable: false, tdClass: 'align-middle', label: '', 'class': 'text-center'}
    ],

    // search param
    searchParameters: {
      faqBoardNo: '',
      faqBoardTyCd: '',
      keyword: '',

      order: null,
      orderDesc: ''
    }
  }),

  created () {
    this.loadFaqTyCdCombo()

    this.$on('saveModal', this.saveModal) // 저장 이벤트
    this.$on('closeModal', this.closeModal) // 닫기 이벤트
    this.$on('removeModal', this.removeModal) // 삭제 이벤트
    this.$on('changePaging', this.changePaging)
  },

  methods: {
    // API Data Load
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
            case 'faqBoardNo': this.searchParameters['order'] = 1; break
            case 'faqBoardTyCdName': this.searchParameters['order'] = 2; break
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
        return getFaqlist(parameters, _super)
      }

      function getFaqlist (parameters, _super) {
        return _super.$http.get('/faq-board', parameters)
          .then((result) => {
            _super.tableData = result.data['resultList']
            _super.tableData.forEach((value) => {
              value.selected = false
            })
            _super.totalSize = result.data['resultCount']
            _super.isBusy = false
            return _super.tableData
          })
      }
    },

    loadFaqTyCdCombo () {
      const parameter = '?codeLv2=FAQ&lv=3'
      this.loadCombo(parameter, 'faqTyCdOptions')
    },

    loadCombo (parameter, type) {
      this.$http.get(`/code/combo${parameter}`)
        .then(
          (result) => {
            this[type] = this.$commons.clone(result.data['resultList'])
          }
        )
    },

    // Row 클릭
    rowClicked (item, index, event) {
      if (this.clickedRowInfo.faqBoardNo === undefined || this.clickedIndex !== index) {
        this.clickedIndex = index
        this.clickedRowInfo = item
      } else {
        this.clickedRowInfo = {}
      }

      this.tableData.forEach((value, idx) => {
        if (this.clickedIndex === idx && this.clickedRowInfo.faqBoardNo !== undefined) {
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
        this.openModalTitle = 'FAQ 정보 등록'
        this.openModalMode = 'POST'
        this.modalRowInfo = {
          pid: this.$global.PID
        }
      } else {
        // Row 수정 Model Open
        this.openModalTitle = 'FAQ 정보 수정'
        this.openModalMode = 'PUT'
        this.modalRowInfo = this.$commons.clone(this.clickedRowInfo)
      }

      this.$refs.modal.show()
    },

    // Close Modal
    closeModal () {
      this.$refs.modal.hide()
    },

    removeModal () {
      if (confirm('삭제하시겠습니까?')) {
        this.$http.delete('/faq-board/' + this.clickedRowInfo['faqBoardNo'])
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
        this.$http.post('/faq-board', this.modalRowInfo)
          .then(
            () => {
              this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>저장이 완료되었습니다.`, {theme: 'bubble', duration: 3000})
              this.afterProcess()
            }
          )
      }
    },

    updateFaq (item) {
      this.modalRowInfo = item
      this.$http.put('/faq-board', this.modalRowInfo)
        .then(
          () => {
            this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>수정이 완료되었습니다.`, {theme: 'bubble', duration: 3000})
            this.afterProcess()
          }
        )
    },

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
    },

    detailClick (item) {
      this.detailRowInfo = this.$commons.clone(item)
    }
  }
}
</script>

<style scoped>

</style>
