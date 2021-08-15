<template>
  <div>
    <h4>{{this.searchParameters}}</h4>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">치량관리 /</span> 차량리스트
    </h4>
    <div class="ui-bordered px-4 pt-4 mb-4">
      <div class="form-row align-items-center">
        <sido-area/>
      </div>
      <div class="form-row">
        <div class="col-md mb-4">
          <car-sale-search v-on:filterSearch="filterSearch"></car-sale-search>
        </div>
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
              <b-select size="sm" :options="perPageOptions" v-model="perPage" class="d-inline-block w-auto"
                        @input="changePerPaging(perPage)"/>
            </b-form-group>
            &nbsp;&nbsp;&nbsp;&nbsp; 총 검색수 : {{ totalSize }}
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
                 :hover="true">
          <!--                 @row-clicked="rowClicked"-->
          <template slot="table-colgroup">
            <col span="1" width="7%"/>
            <col span="1" width="6%"/>
            <col span="1" width="5%"/>
            <col span="1" width="8%"/>
            <col span="1" width="8%"/>
            <col span="1" width="7%"/>
            <col span="1" width="7%"/>
            <col span="1" width="8%"/>
            <col span="1" width="7%"/>
            <col span="1" width="10%"/>
            <col span="1" width="9%"/>
            <col span="1" width="8%"/>
          </template>
        </b-table>
        <pagination :total-size="totalSize" :current-page="currentPage" :per-page="perPage"></pagination>
        <!-- Pagination -->
        <!--<div class="text-center d-inline-block">
          <moon-loader :loading="isBusy"></moon-loader>
        </div>-->
      </b-card-body>
    </b-card>

  </div>
</template>

<script>
    import SidoArea from '@/components/common/search/SidoArea'
    import CarSaleSearch from '@/components/common/search/CarSaleSearch'
    import Pagination from '@/components/common/pagination/Pagination'
    import {mapState} from 'vuex'
    import CarCategory from '@/components/common/search/CarCategory'
    import ShopDealerPopup from '@/components/common/search/ShopDealerPopup'
    import CarDetail from '@/components/car/search/CarDetail'


    export default {
        name: 'CardataList',
        components: {
            'sido-area': SidoArea,
            'car-sale-search': CarSaleSearch,
            'pagination': Pagination,
            // 'shop-dealer-popup': ShopDealerPopup,
            // 'car-category': CarCategory,
            // 'car-detail': CarDetail
        },
        computed: {
            //...mapState(['searchParameters'])//이거왜 안되지..ㅡㅡ;;
            computed: {
                searchParameters() {
                    return this.$commSearch.getters.fetchSearchParameters;
                }
            },
        },
        data: () => ({
            // totalSize: 0,
            carListtableData: [],
            isFrist: true,
            currentPage: 1,
            perPage: 20,
            perPageOptions: [10, 20, 30, 40, 50],
            sortDesc: false,
            items: [],
            totalItems: [],
            originalItems: [],
            sortBy: 'carRegDt',
            isBusy: false,
            fields: [
                {key: 'carNo', sortable: false, tdClass: 'align-middle', label: '차량번호', 'class': 'text-center'},
                {key: 'nameLv1', sortable: false, tdClass: 'align-middle', label: '딜러 | 상사', 'class': 'text-center'},
                {key: 'nameLv2', sortable: false, tdClass: 'align-middle', label: '등록일', 'class': 'text-center'},
                {key: 'nameLv3', sortable: false, tdClass: 'align-middle', label: '사진', 'class': 'text-center'},
                {key: 'nameLv4', sortable: false, tdClass: 'align-middle', label: '제조사 | 모델', 'class': 'text-center'},
                {key: 'nameLv5', sortable: false, tdClass: 'align-middle', label: '세부모델 | 등급', 'class': 'text-center'},
                {
                    key: 'nameLv6',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '미션 | 연료 | 색상',
                    'class': 'text-center'
                },
                {key: 'carPlateNumber', sortable: false, tdClass: 'align-middle', label: '연식', 'class': 'text-center'},
                {key: 'carFrameNo', sortable: false, tdClass: 'align-middle', label: '주행거리', 'class': 'text-center'},
                {key: 'carRegYear', sortable: false, tdClass: 'align-middle', label: '가격', 'class': 'text-center'},
                {
                    key: 'carRegDt',
                    sortable: false,
                    tdClass: 'align-middle',
                    label: '옵션',
                    formatter: 'getYyyymmdd',
                    'class': 'text-center'
                },
                {key: 'carUseKm', sortable: false, tdClass: 'align-middle', label: '수정일', 'class': 'text-center'},
                {key: 'shopName', sortable: false, tdClass: 'align-middle', label: '연동관리', 'class': 'text-center'},
                {key: 'shopName', sortable: false, tdClass: 'align-middle', label: '번호', 'class': 'text-center'},
                {key: 'shopName', sortable: false, tdClass: 'align-middle', label: '점검표', 'class': 'text-center'},
                {key: 'shopName', sortable: false, tdClass: 'align-middle', label: '수기입력', 'class': 'text-center'},
                {key: 'shopName', sortable: false, tdClass: 'align-middle', label: '고유번호', 'class': 'text-center'},
                {key: 'shopName', sortable: false, tdClass: 'align-middle', label: '온카번호', 'class': 'text-center'},
            ],
        }),
        created() {
            this.searchParameters.sidoType = 'A'
            this.$on('changePaging', this.changePaging)
        },
        computed: {
            searchParameters() {
                return this.$commSearch.getters.fetchSearchParameters;
            },
            totalSize() {
                return this.$carCodeStore.getters.totalSize;
            },
            tableData() {
                return this.$carCodeStore.getters.tableData;
            },

        },
        methods: {
            changePaging(page) {
                this.currentPage = page;
                this.searchParameters.currentPage = page;
                // alert(this.searchParameters.currentPage);
                this.getList();
                this.$refs.table.refresh();
            },
            changePerPaging(perPage) {
                this.perPage = perPage;
                this.changePaging(1);
            }
            ,
            getList(ctx) {
                console.log("getList들어옴", this);
                let _super = this;
                if (this.isFrist == true) {
                    this.isFrist = false;
                    return;
                }
                if (ctx === undefined && this.isFrist == false) {
                    return;
                }
                this.isBusy = true;
                this.searchParameters.perPage = this.perPage;
                if (ctx !== undefined) {
                    if (ctx.sortBy !== undefined) {
                        switch (ctx.sortBy) {
                            case 'carNo':
                                this.searchParameters.orderBy = 99;
                                break;
                            case 'carRegDt':
                                this.searchParameters.orderBy = 1;
                                break;
                            default:
                                break
                        }
                    }

                    if (ctx.sortDesc !== undefined) {
                        switch (ctx.sortDesc) {
                            case true:
                                this.searchParameters.orderDesc = 'ASC';
                                break
                            case false:
                                this.searchParameters.orderDesc = 'DESC';
                                break
                            default:
                                break
                        }
                    }
                }
                `                // this.searchParameters.orderBy = ctx.sortBy;
                // this.searchParameters.sortDesc = ctx.sortDesc;`

                const parameters = {
                    params: this.searchParameters
                };
                console.log(parameters);
                let valCheckMsg = '';
                valCheckMsg = this.valCheck(parameters);

                if(valCheckMsg){
                    alert(valCheckMsg);
                    this.isBusy = false;
                    return;
                }
                // //최소검색조건
                // if(!parameters.sidoCode && !parameters.cityCode && !parameters.dealerName && !parameters.srTypeText){
                //     alert("검색시 시도 , 지역은 필수 입력사항입니다.\n입력검색시 전체 검색이 가능합니다");
                //     this.isBusy = false;
                //     return;
                // }

                let tempTableData ='';
                return this.$carCodeStore.dispatch('FETCH_CAR_LIST', parameters)
                    .then(() => {
                    this.isBusy = false;
                    console.log("this.tableData ====", this.tableData);
                    return this.tableData;
                })
                    .catch((err) => {
                        this.isBusy = false;
                        console.log(err);
                    });
            },
            filterSearch() {
                console.log("filterSearch");
                this.searchParameters.currentPage = 1;
                this.getList();
                this.$refs.table.refresh();
            },
            valCheck(parameters){
                let msg = '';
                if(!parameters.params.sidoCode && !parameters.params.cityCode){
                    if(!parameters.params.dealerName && !parameters.params.srTypeText){
                        console.log(parameters.params.dealerName, parameters.params.srTypeText);
                        msg = "검색시 시도 , 지역은 필수 입력사항입니다.\n딜러성함, 검색조건 검색시 전체 검색이 가능합니다";
                    }
                }
                return msg;
            }
        }
    }
</script>

<style scoped>

</style>
