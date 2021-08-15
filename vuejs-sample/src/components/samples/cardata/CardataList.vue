<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      Users
    </h4>

    <!-- AreaFilters -->
    <area-filter></area-filter>
    <!-- / AreaFilters -->

    <b-card no-body>
      <!-- Table controls -->
      <b-card-body>

        <div class="row">
          <div class="col">
            Per page: &nbsp;
            <b-select size="sm" v-model="perPage" :options="[10, 20, 30, 40, 50]" class="d-inline-block w-auto" />
          </div>
          <div class="col">
            <b-input size="sm" placeholder="Search..." class="d-inline-block w-auto float-sm-right" @input="filter($event)" />
          </div>
        </div>

      </b-card-body>
      <!-- / Table controls -->

      <hr class="border-light m-0">

      <!-- Table -->
      <div class="table-responsive">
        <b-table
          striped
          bordered
          hover
          :items="totalItems"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc">

          <template slot="index" slot-scope="row">
            <span>{{ setIndexing(row.index + 1) }}</span>
          </template>

          <template slot="carUseKm" slot-scope="row">
            <span>{{ setCommaCarUseKm(row.item.carUseKm) }}</span>
          </template>

          <template slot="showDetail" slot-scope="row">
            <b-btn-group>
              <b-dd :right="isRTL" text="상세" size="sm">
                <b-dd-item @click.stop="row.toggleDetails">
                  상세보기
                </b-dd-item>
                <b-dd-item @click.stop="info(row.item, row.index, $event.target)">
                  수정
                </b-dd-item>
              </b-dd>
            </b-btn-group>
          </template>

          <template slot="row-details" slot-scope="row">
            <b-card>
              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right"><b>식별번호</b></b-col>
                <b-col>{{ row.item.carNo }}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right"><b>차량번호</b></b-col>
                <b-col>{{ row.item.carPlateNumber }}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right"><b>주행거리</b></b-col>
                <b-col>{{ setCommaCarUseKm(row.item.carUseKm) }}</b-col>
              </b-row>
            </b-card>
          </template>

        </b-table>
        <!--</table>-->

        <!-- Info modal -->
        <b-modal ref="cardataModel" title="차량 정보 수정">
          <cardata-model :modelInfo="modelInfo"></cardata-model>
        </b-modal>
        <!-- /Info modal -->

      </div>

      <!--pagination-->
      <pagination
        v-on:change-paging="changePaging"
        :totalSize="totalSize"
        :perPage="perPage">
      </pagination>
      <!--//pagination-->

    </b-card>
  </div>
</template>

<script>
import AreaFilter from '..//common/AreaFilter'
import Pagination from '../common/Pagination'
import CardataModel from './CardataModel'

export default {
  name: 'CardataList',
  data: () => ({
    items: [],
    totalItems: [],
    originalItems: [],

    sortBy: 'index',
    sortDesc: false,
    searchKeys: ['carNo', 'carPlateNumber', 'carUseKm'],
    fields: [
      { key: 'index', sortable: false, tdClass: 'align-middle', label: '번호' },
      { key: 'carNo', sortable: true, tdClass: 'align-middle', label: '식별번호' },
      { key: 'carPlateNumber', sortable: true, tdClass: 'align-middle', label: '차량번호' },
      { key: 'carUseKm', sortable: true, tdClass: 'align-middle', label: '주행거리' },
      { key: 'showDetail', sortable: false, tdClass: 'align-middle', label: '' }
    ],

    totalSize: 0,
    currentPage: 1,
    perPage: 10,

    modelInfo: {}
  }),
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.$root.$children[0].loading = true

      let params = '?carShopNo=700081&carFuelCode=101'

      let url = `/oncar/jpa ${params}`

      this.$http.get(url)
        .then(
          (result) => {
            let resultList = result.data.resultList

            this.totalItems = resultList
            this.originalItems = resultList

            this.totalSize = this.totalItems.length

            this.setItems()
          }
        )
        .then(
          () => {
            this.$root.$children[0].loading = false
          }
        )
    },

    setItems () {
      this.items = this.totalItems.slice((this.currentPage - 1) * this.perPage, (this.perPage * this.currentPage))
    },

    setIndexing (index) {
      return index + ((this.currentPage - 1) * this.perPage)
    },

    setCommaCarUseKm (carUseKm) {
      /* comma 작업을 하면 되는거쥬 */
      return `${carUseKm} km`
    },

    changePaging (_p) {
      this.currentPage = _p
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
    }
  },
  components: {
    'cardata-model': CardataModel,
    'area-filter': AreaFilter,
    'pagination': Pagination
  }
}
</script>

<style scoped>

</style>
