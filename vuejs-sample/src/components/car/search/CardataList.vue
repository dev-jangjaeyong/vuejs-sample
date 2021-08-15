<template>
  <div>
    <h4>{{ this.searchParameters }}</h4>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">치량관리 /</span>
      차량리스트
    </h4>
    <div class="ui-bordered px-4 pt-4 mb-4">
      <div class="form-row align-items-center">
        <sido-area />
      </div>
      <div class="form-row">
        <div class="col-md mb-4">
          <car-sale-search
            v-on:filterSearch="filterSearch"
          ></car-sale-search>
        </div>
      </div>
      <div>
        <DatePicker
          dateType="range"
          dateFormat="YYYY-MM-DD"
          startDate="2020-07-15"
          endDate="today"
          minShowDate=""
          maxShowDate=""
          :disabledDate="[]"
        ></DatePicker>
      </div>
    </div>

    <b-card>
      <h5 slot="header" class="mb-0">차량 목록</h5>
      <b-card-body class="pb-0">
        <!-- Table controls -->
        <div class="row">
          <div class="col">
            <b-form-group>
              Records: &nbsp;
              <b-select
                size="sm"
                :options="perPageOptions"
                v-model="perPage"
                class="d-inline-block w-auto"
                @input="changePerPaging(perPage)"
              />
              &nbsp;&nbsp;&nbsp;&nbsp; 총 검색수 : {{ totalSize }}
              <div
                v-if="tableData.length > 0"
                class="btn btn-outline-secondary float-right"
                @click="excelDownload"
              >
                Download Excel
              </div>
            </b-form-group>
            <b-button size="sm" @click="selectAllRows"
            >Select all</b-button
            >
            <b-button size="sm" @click="clearSelected"
            >Clear selected</b-button
            >
          </div>
        </div>
        <b-table
          show-empty
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
          selectable
          :select-mode="selectMode"
          @row-selected="onRowSelected"
        >
          <!--          전체보기-->
          <template v-slot:cell(selected)="{rowSelected}">
            <template v-if="rowSelected">
              <span aria-hidden="true">&check;</span>
              <span class="sr-only">Selected</span>
            </template>
            <template v-else>
              <span aria-hidden="true">&nbsp;</span>
              <span class="sr-only">Not selected</span>
            </template>
          </template>
          <!--          전체보기 끝-->
          <!--          상세보기-->
          <template v-slot:cell(showdetails)="row">
            <b-button
              size="sm"
              @click="row.toggleDetails"
              class="mr-2"
            >
              {{ row.detailsShowing ? '닫기' : '보기' }}
            </b-button>
          </template>
          <!--          상세보기 끝-->
          <template v-slot:row-details="row">
            <b-card>
              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right"
                ><b>Age:</b></b-col
                >
                <b-col>{{ row.item.age }}</b-col>
              </b-row>

              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right"
                ><b>Is Active:</b></b-col
                >
                <b-col>{{ row.item.isActive }}</b-col>
              </b-row>

              <b-button size="sm" @click="row.toggleDetails"
              >Hide Details</b-button
              >
            </b-card>
          </template>

          <!--          <template slot="selected" slot-scope="data">-->
          <!--            <input type="checkbox" id="checkbox" >-->
          <!--          </template>-->
          <!--                 @row-clicked="rowClicked"-->
          <!--          <template slot="table-colgroup">-->
          <!--            <col span="1" width="5%"/>-->
          <!--            <col span="1" width="12%"/>-->
          <!--            <col span="1" width="15%"/>-->
          <!--            <col span="1" width="8%"/>-->
          <!--            <col span="1" width="15%"/>-->
          <!--            <col span="1" width="3%"/>-->
          <!--            <col span="1" width="7%"/>-->
          <!--            <col span="1" width="8%"/>-->
          <!--            <col span="1" width="7%"/>-->
          <!--            <col span="1" width="10%"/>-->
          <!--            <col span="1" width="9%"/>-->
          <!--            <col span="1" width="8%"/>-->
          <!--            <col span="1" width="8%"/>-->
          <!--            <col span="1" width="8%"/>-->
          <!--            <col span="1" width="8%"/>-->
          <!--            <col span="1" width="8%"/>-->
          <!--            <col span="1" width="8%"/>-->
          <!--            <col span="1" width="8%"/>-->
          <!--          </template>-->
          <template slot="row-details" slot-scope="row">
            <b-card>
              <!--              <ul>-->
              <!--                <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>-->
              <!--              </ul>-->
              <b-table
                ref=""
                class="card-table"
                :items="[row.item]"
                :fields="carDetailFields"
                :striped="true"
                :bordered="true"
              >
                <template slot="table-colgroup">
                  <col span="1" width="25%" />
                  <col span="1" width="25%" />
                  <col span="1" width="25%" />
                  <col span="1" width="25%" />
                </template>
              </b-table>
            </b-card>
          </template>
          <!--차량번호-->
          <template v-slot:cell(carPlateNumber)="row">
            <b-button
              size="sm"
              @click="getDetail(row.item, 'A')"
              class="mr-2"
            >
              {{ row.item.carPlateNumber }}
            </b-button>
          </template>
          <!--차량사진카운트-->
          <template v-slot:cell(imageCnt)="row">
            <b-button
              size="sm"
              @click="getDetail(row.item, 'B')"
              class="mr-2"
            >
              {{ row.item.imageCnt }}
            </b-button>
          </template>
        </b-table>

        <pagination
          :total-size="totalSize"
          :current-page="currentPage"
          :per-page="perPage"
        ></pagination>
        <!-- Pagination -->
        <!--<div class="text-center d-inline-block">
          <moon-loader :loading="isBusy"></moon-loader>
        </div>-->
      </b-card-body>
    </b-card>

    <!--차량번호 변경 모달-->
    <b-modal ref="modal" size="sm" hide-footer>
      <div slot="modal-title">{{ openModalTitle }}</div>
      <type2-modal>
        <b-form>
          <div class="row">
            <div
              class="col-md-5"
              v-if="modalRowInfo.carPlateNumber !== undefined"
            >
              <b-form-group label="차량번호">
                <b-input
                  type="text"
                  placeholder="차량번호"
                  v-model="modalRowInfo.carPlateNumber"
                  :readonly="true"
                ></b-input>
              </b-form-group>
              <b-form-group label="변경하실차량번호">
                <b-input
                  type="text"
                  placeholder="차량번호"
                  v-model="newCarPlateNumber"
                  :readonly="false"
                ></b-input>
              </b-form-group>
            </div>
          </div>
        </b-form>
      </type2-modal>
    </b-modal>

    <!--차량이미지 모달-->
    <b-modal ref="carDataImageModal" hide-footer size="huge">
      <div slot="modal-title">{{ openModalTitle }}</div>
      <car-data-image-modal class="">
        <span v-for="i in 20" :key="i"> </span>
        <span
          v-for="(image, index) in images"
          :value="image.imagePathTh"
        >
					<span v-if="image.imageYN == 'Y'">
						<img
              style="
								width: 134px;
								height: 103px;
								vertical-align: top;
								margin-top: 15px;
							"
              v-bind:src="image.imagePathTh"
            />
					</span>
					<span v-else>
						<!--            <img style="width: 134px; height:103px; vertical-align: top;" src="@/assets/image/photo/icon_photo_sn0.gif">-->
            <!--            <img style="width: 134px; height:103px; vertical-align: top;" src="../../../assets/image/photo/icon_photo_sn0.gif">-->
						<img
              style="
								width: 134px;
								height: 103px;
								vertical-align: top;
							"
              :src="getImgUrl(index)"
            />
					</span>
					&nbsp;
				</span>
      </car-data-image-modal>
    </b-modal>
  </div>
</template>

<script>
    import SidoArea from '@/components/common/search/SidoArea';
    import CarSaleSearch from '@/components/common/search/CarSaleSearch';
    import Type2Modal from '@/components/common/modal/Type2Modal';
    import CardataImageModal from '@/components/car/search/CardataImageModal';
    import Pagination from '@/components/common/pagination/Pagination';
    import JsonExcel from 'vue-json-excel';
    import XLSX from 'xlsx';
    import DefaultDataFetching from '@/mixins/DataFetching';
    import DatePicker from '@/components/common/calendar/DatePicker';

    // import Calendar from 'v-calendar/lib/components/calendar.umd'
    // import DatePicker from 'v-calendar/lib/components/date-picker.umd'
    // import {Service} from '@/service/serviceType'
    // import {mapState} from 'vuex'
    // import ShopDealerPopup from '@/components/common/search/ShopDealerPopup'
    // import CarDetail from '@/components/car/search/CarDetail'
    // import {service} from "../../../service/serviceType";

    export default {
        name: 'CardataList',
        components: {
            'sido-area': SidoArea,
            'car-sale-search': CarSaleSearch,
            'type2-modal': Type2Modal,
            'car-data-image-modal': CardataImageModal,
            downloadExcel: JsonExcel,
            pagination: Pagination,
            DatePicker: DatePicker,
        },
        mixins: [DefaultDataFetching],
        computed: {
            searchParameters() {
                return this.$commSearch.getters.fetchSearchParameters;
            },
        },
        data: () => ({
            sortBy: 'CreateDate',
            newCarPlateNumber: '',
            // totalSize: 0,
            // tableData: [],
            // isFrist: true,
            // currentPage: 1,
            // perPage: 20,
            // perPageOptions: [10, 20, 30, 40, 50],
            // sortDesc: false,
            // items: [],
            // totalItems: [],
            // originalItems: [],
            // sortBy: 'CreateDate',
            // isBusy: false,
            // // row 정보
            // clickedRowInfo: {},
            // clickedIndex: 0,
            //
            // // modal Options
            // modalRowInfo: {},
            // openModalMode: '',
            // openModalTitle: '',
            // openModalType:'',
            //
            // //alertModal -- 보류중
            // alertMessage: '',
            // //이미지 path
            // images :[],
            // //변경
            //// newCarPlateNumber:'',
            // selected:[],
            // },
            props: {
                // dateType:{}
            },
            fields: [
                {
                    key: 'selected',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '선택',
                    class: 'text-center',
                },
                {
                    key: 'showDetails',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '상세',
                    class: 'text-center',
                },
                {
                    key: 'carPlateNumber',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '차량번호',
                    class: 'text-center',
                },
                {
                    key: 'carUserName',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '딜러 | 상사',
                    formatter: 'dealerShop',
                    class: 'text-center',
                },
                {
                    key: 'carSaleState',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '상태',
                    formatter: 'getSaleStateString',
                    class: 'text-center',
                },
                {
                    key: 'carApplyDt',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '등록일',
                    formatter: 'strDayChange',
                    class: 'text-center',
                },
                {
                    key: 'imageCnt',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '사진',
                    class: 'text-center',
                },
                {
                    key: 'nameLv4',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '제조사 | 모델',
                    class: 'text-center',
                },
                {
                    key: 'nameLv5',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '세부모델 | 등급',
                    class: 'text-center',
                },
                {
                    key: 'nameLv6',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '미션 | 연료 | 색상',
                    class: 'text-center',
                },
                {
                    key: 'asdasd',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '연식',
                    class: 'text-center',
                },
                {
                    key: 'carFrameNo',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '주행거리',
                    class: 'text-center',
                },
                {
                    key: 'carRegYear',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '가격',
                    class: 'text-center',
                },
                {
                    key: 'createDt',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '옵션',
                    formatter: 'getYyyymmdd',
                    class: 'text-center',
                },
                {
                    key: 'shopName',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '수정일',
                    class: 'text-center',
                },
                {
                    key: 'shopName',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '번호',
                    class: 'text-center',
                },
                {
                    key: 'shopName',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '점검표',
                    class: 'text-center',
                },
                {
                    key: 'shopName',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '수기입력',
                    class: 'text-center',
                },
                {
                    key: 'shopName',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '고유번호',
                    class: 'text-center',
                },
                {
                    key: 'shopName',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '온카번호',
                    class: 'text-center',
                },
            ],
            items: [{dealerShop: {first: 'carUserName', last: 'shopName'}}],
            carDetailFields: [
                {
                    key: 'carNo',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: 'carNo',
                    class: 'text-center',
                },
                {
                    key: 'carPlateNumber',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '차량번호',
                    class: 'text-center',
                },
                {
                    key: '123',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '컬럼컬럼',
                    class: 'text-center',
                },
                {
                    key: '1324',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '컬럼~~',
                    class: 'text-center',
                },
            ],
            // excel: {
            //     fields: {},
            //     data: [],
            //     meta: [
            //         {'key': 'charset', 'value': 'utf-8'}
            //     ]
            // },
            // selectMode: 'multi',
            // selected: []
        }),
        created() {
            console.log(this.$router);

            // this.searchParameters.maxdate = endDate
            // this.searchParameters.dates.start = new Date()
            // this.searchParameters.dates.end = new Date()
            this.searchParameters.sidoType = 'B';
            this.$on('saveModal', this.saveModal); // 저장 이벤트
            this.$on('removeModal', this.removeModal); // 삭제 이벤트
            this.$on('changePaging', this.changePaging); //페이지이동
            this.$on('photoDownload', this.photoDownload); //사진다운로드
            this.$on('photoAllDelete', this.photoAllDelete); //사진전체삭제
            this.$on('selectAllDelete', this.selectAllDelete); //선택차량 전체삭제
        },
        methods: {
            //checkBox
            onRowSelected(items) {
                // console.log('items:::::', items);
                this.selected = items;
            },
            selectAllRows() {
                this.$refs.table.selectAllRows();
            },
            clearSelected() {
                this.$refs.table.clearSelected();
            },
            // Paging
            changePaging(page) {
                console.log('페이지변경 : ', page);
                this.currentPage = page;
                this.searchParameters.currentPageNo = page;
                // alert(this.searchParameters.currentPage);
                this.getList();
                this.$refs.table.refresh();
            },
            changePerPaging(perPage) {
                let checkCount = this.totalSize;
                console.log('perPaging :', checkCount, typeof checkCount);
                if (Number(checkCount) !== 0) {
                    this.perPage = perPage;
                    this.changePaging(1);
                }
            },
            photoDownload() {
                let carNo = this.modalRowInfo.carNo;
                let carPlateNumber = this.modalRowInfo.carPlateNumber;
                console.log('포토다운로드 :', carNo, carPlateNumber);
                window.location.href = `http://cmphoto.carmanager.co.kr/ImageDownload/CarImageDownloadAllZip/${carNo}?CarPlateNumber=${carPlateNumber}`;
            },
            photoAllDelete() {
                if (confirm('사진을 전체 삭제하시겠습니까?')) {
                    let carNo = this.modalRowInfo.carNo;
                    alert(carNo);
                }
            },
            getList(ctx) {
                console.log('getList들어옴 : ', ctx);

                if (this.isFrist === true) {
                    this.isFrist = false;
                    return;
                }
                if (ctx === undefined && this.isFrist === false) {
                    return;
                }
                const parameters = {
                    params: this.searchParameters,
                };
                console.log('parameters : ', parameters);
                //밸리데이션
                let valCheckMsg = '';
                valCheckMsg = this.valCheck(parameters);
                if (valCheckMsg) {
                    alert(valCheckMsg);
                    this.isBusy = false;
                    return;
                }
                this.isBusy = true;
                this.searchParameters.rowsPerPage = this.perPage;
                this.searchParameters.orderBy = ctx.sortBy;
                if (ctx !== undefined) {
                    // if (ctx.sortBy !== undefined) {
                    //     switch (ctx.sortBy) {
                    //         case 'carNo':
                    //             this.searchParameters.orderBy = 99;
                    //             break;
                    //         case 'carRegDt':
                    //             this.searchParameters.orderBy = 1;
                    //             break;
                    //         default:
                    //             break
                    //     }
                    // }
                    if (ctx.sortDesc !== undefined) {
                        switch (ctx.sortDesc) {
                            case true:
                                this.searchParameters.orderDesc = 'ASC';
                                break;
                            case false:
                                this.searchParameters.orderDesc = 'DESC';
                                break;
                            default:
                                break;
                        }
                    }
                }

                return getlist(parameters, this);

                function getlist(parameters, _super) {
                    totalCnt(parameters, _super);
                    return getCarlist(parameters, _super);
                }

                // function totalCnt(parameters, _super) {
                //     console.log("test totalcnt");
                //     let Service =  new service();
                //     Service.totalCnt(parameters).then((result) => { _super.totalSize = result })
                // }
                //
                // function getCarlist(parameters, _super) {
                //
                //     return _super.$http.get('/oncar', parameters)
                //         .then((result) => {
                //             console.log("차량데이터=================================", result.data.resultList);
                //             _super.tableData = result.data['resultList']
                //             _super.tableData.forEach((value) => {
                //                 value.selected = false
                //             })
                //
                //             _super.isBusy = false
                //             return _super.tableData
                //         }).catch(error => {
                //             _super.isBusy = false
                //             // console.log(error)
                //         })
                // }
                function totalCnt(parameters, _super) {
                    _super.$http.get('/oncar/count', parameters).then((result) => {
                        console.log(
                            '토탈카운트==================',
                            result.data.resultCount,
                        );
                        _super.totalSize = result.data['resultCount'];
                    });
                }

                function getCarlist(parameters, _super) {
                    return _super.$http
                        .get('/oncar', parameters)
                        .then((result) => {
                            console.log(
                                '차량데이터=================================',
                                result.data.resultList,
                            );
                            _super.tableData = result.data['resultList'];
                            _super.tableData.forEach((value) => {
                                value.selected = false;
                            });

                            _super.isBusy = false;
                            return _super.tableData;
                        })
                        .catch((error) => {
                            _super.isBusy = false;
                            console.log(error)
                        });
                }
            },

            // setItems () {
            //     this.items = this.totalItems.slice((this.currentPage - 1) * this.perPage, (this.perPage * this.currentPage))
            // },
            //
            // setIndexing (index) {
            //     return index + ((this.currentPage - 1) * this.perPage)
            // },
            //
            // setCommaCarUseKm (carUseKm) {
            //     return `${carUseKm} km`
            // },
            //
            // getYyyymmdd (value, key, item) {
            //     return value !== null ? value.split(' ')[0] : ''
            // },

            // filter (value) {
            //     const val = value.toLowerCase()
            //     const filtered = this.originalItems.filter(d => {
            //         return Object.keys(d)
            //             .filter(k => this.searchKeys.includes(k))
            //             .map(k => String(d[k]))
            //             .join('|')
            //             .toLowerCase()
            //             .indexOf(val) !== -1 || !val
            //     })
            //     this.totalItems = filtered
            // },
            //
            // info (item, index, button) {
            //     this.modelInfo = item
            //     this.$refs.cardataModel.show()
            // },
            //
            // rowClicked (item, index, event) {
            //     this.rowInfo = item
            //     this.$EventBus.$emit('car-detail-start', this.$commons.clone(item))
            //     this.$EventBus.$emit('car-category', this.cateOptions)
            // },

            // filter Search
            filterSearch() {
                this.searchParameters.currentPageNo = 1;
                this.getList();
                this.$refs.table.refresh();
            },
            selectAllDelete() {
                let list = [];
                this.selected.forEach(function(value, index){
                    list.push(value.carNo);
                });
                // $.each(this.selected, function (key, value) {
                //     list.push(value.carNo);
                // });
                if (list.length === 0) {
                    alert('선택된 차량이 없습니다. 차량 선택을 해주세요.');
                    return;
                }
                console.log(list);
            },
            valCheck(parameters) {
                let msg = '';
                if (!parameters.params.cityCode) {
                    if (
                        !parameters.params.dealerName &&
                        !parameters.params.srTypeText
                    ) {
                        // console.log(parameters.params.dealerName, parameters.params.srTypeText);
                        msg =
                            '검색시 시도 , 지역은 필수 입력사항입니다.\n딜러성함, 검색조건 검색시 전체 검색이 가능합니다';
                        // this.alertMessage = "검색시 시도 , 지역은 필수 입력사항입니다.\n딜러성함, 검색조건 검색시 전체 검색이 가능합니다";
                        // this.$refs.alertModal.show()
                    }
                }
                return msg;
            },
            getDetail(item, modalType) {
                // console.log("item", item);
                this.clickedRowInfo = item;
                this.openModal(modalType);
            },
            // Open ApiModal
            openModal(flag) {
                this.openModalType = flag;
                if (flag === 'A') {
                    // Row 등록 Modal Open
                    this.newCarPlateNumber = '';
                    this.openModalTitle = '차량번호 변경';
                    this.openModalMode = 'PUT';
                    this.modalRowInfo = this.$commons.clone(this.clickedRowInfo);
                    this.$refs.modal.show();
                } else if (flag === 'B') {
                    this.openModalTitle = '차량 이미지';
                    // this.openModalMode = 'PUT';

                    // _super.$http.get('/oncar/count', parameters)
                    //     .then((result) => {
                    //         console.log("토탈카운트==================", result.data.resultCount);
                    //         _super.totalSize = result.data['resultCount']
                    //     })
                    const imageParameters = {
                        params: {
                            carNo: this.clickedRowInfo.carNo,
                            carSaleState: this.clickedRowInfo.carSaleState,
                        },
                    };
                    if (this.clickedRowInfo.imageCnt > 0) {
                        this.images = [];
                        this.$http
                            .get('oncarImagePath', imageParameters)
                            .then((result) => {
                                // console.log("이미지path리스트 : ", result.data.resultList[3]);
                                //이미지담기
                                for (var i = 0; i < 20; i++) {
                                    // let data = {};
                                    let imagePathTh = '';
                                    let imageYN = '';
                                    // console.log(result.data.resultList[i].carImageSort);
                                    if (result.data.resultList[i] !== undefined) {
                                        if (
                                            i + 1 ===
                                            Number(
                                                result.data.resultList[i]
                                                    .carImageSort,
                                            )
                                        ) {
                                            // console.log("111111", result.data.resultList[i].carImageThumbnailPath);
                                            imagePathTh =
                                                result.data.resultList[i]
                                                    .carImageThumbnailPath;
                                            imageYN = 'Y';
                                        }
                                    }
                                    if (imagePathTh === '') {
                                        imageYN = 'N';
                                        if (i < 10) {
                                            imagePathTh = `@/assets/image/photo/icon_photo_sn${i}.gif`;
                                        } else {
                                            imagePathTh =
                                                '@/assets/image/photo/icon_photo_snblank.gif';
                                        }
                                    }
                                    let data = {
                                        imagePathTh: imagePathTh,
                                        imageYN: imageYN,
                                    };
                                    this.images.push(data);
                                }
                                // this.images = result.data.resultList;
                            });
                    } else {
                        alert('이미지 개수가 0개 입니다.');
                        return;
                    }

                    this.modalRowInfo = this.$commons.clone(this.clickedRowInfo);
                    this.$refs.carDataImageModal.show();
                }
            },
            getYyyymmdd(value, key, item) {
                return this.$commons.getYyyymmdd(value);
            },
            getSaleStateString(value, key, item) {
                return this.$commons.getSaleStateString(value);
            },
            strDayChange(value) {
                return this.$commons.strDayChange(value);
            },
            dealerShop(value, key, item) {
                return `${value} | ${item.shopName}`;
            },
            // Save Modal
            saveModal() {
                // console.log("this.modalRowInfo :", this.modalRowInfo);
                // console.log("this.openModalType :", this.openModalType);
                // return;
                if (this.openModalType === 'A') {
                    //차량번호 변경
                    this.$http
                        .put('/oncar-visit', this.modalRowInfo)
                        .then((response) => {
                            this.afterSaveModal(response.data['resultObject']);
                        });
                } else if (this.openModalType === 'B') {
                    this.$http
                        .post('/oncar-visit', this.modalRowInfo)
                        .then((response) => {
                            this.afterSaveModal(response.data['resultObject']);
                        });
                }
            },
            getImgUrl(index) {
                let imageName = '';
                if (index < 10) {
                    imageName = `icon_photo_sn${index}`;
                } else {
                    imageName = 'icon_photo_snblank';
                }
                var images = require.context(
                    '../../../assets/image/photo/',
                    false,
                    /\.gif$/,
                );
                return images('./' + imageName + '.gif');
            },
            excelDownload() {
                var tableDataWS = XLSX.utils.json_to_sheet(this.tableData);
                var wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, tableDataWS, 'tableData');
                //TODO : 출력일시는 생각좀 해봐야할듯..
                let yyyymmdd = this.$moment(new Date()).format('YYYYMMDD');

                console.log(yyyymmdd);
                let title = `차량리스트_${yyyymmdd}.xlsx`;
                XLSX.writeFile(wb, title);
            },
        },
    };
</script>

<style>
  .modal .modal-huge {
    max-width: 930px;
    /*width: 800px;*/
  }
</style>
