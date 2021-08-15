<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      <span class="text-muted font-weight-light">컨텐츠 관리 /</span> 배너 관리
    </h4>

    <div class="ui-bordered px-4 pt-4 mb-4">
      <div class="form-row">
        <div class="col-md mb-4">
          <label class="form-label">메뉴채널</label>
          <b-form-select v-model="searchParameters.bannerChnnlCode" :options="bannerChnnlOptions" v-on:change="changeChnnl">
            <template slot="first">
              <option value="">전체</option>
            </template>
          </b-form-select>
        </div>
        <div class="col-md mb-4">
          <label class="form-label">배너영역</label>
          <b-form-select v-model="searchParameters.bannerAreaId" :options="bannerAreaIdOptions" v-on:change="changeArea">
            <template slot="first">
              <option value="">전체</option>
            </template>
          </b-form-select>
        </div>
      </div>
    </div>

    <b-card>
      <h5 slot="header" class="mb-0">배너 목록</h5>
      <b-card-body class="p-0">
        <div>
          <div v-for="(area, chnnl) in tableData" :key="chnnl" class="list-complete-item">
            <h6 class="list-tit ml-2">{{chnnl}}</h6>
            <div v-for="(obj, banner) in area" :key="banner" class="list-complete-item-group" >
              <h6 class="list-tit">{{banner}}</h6>
              <draggable v-model="tableData[obj]" @end="onEnd">
              <transition-group>
                <div v-for="(value, i) in obj" :key="i+0" @click="clickModal(value)"
                     :data-chnnl="value.chnnlCode" :data-id="value.bannerAreaId" :data-sn="value.bannerAreaSn" :data-no="value.sortNo"
                     class="list-complete-item-list">
                  {{value.dscrp}} <b-img v-bind:src="$global.prefix+value.imageUrl"/><span id="sortNo">{{value.sortNo}}</span>
                </div>
              </transition-group>
              </draggable>
            </div>
          </div>
        </div>

      </b-card-body>

      <b-card-footer class="mt-3">
        <b-btn variant="primary" class="d-block float-right" @click="openModal">등록</b-btn>
      </b-card-footer>
    </b-card>

    <b-modal ref="modal" size="lg" hide-footer :title="modalTitle">
      <sub-modal :modal-data="modalData" :modal-mode="modalMode" :banner-area-id-options="bannerAreaIdOptions" :banner-chnnl-options="bannerChnnlOptions" ref="bannerModal"></sub-modal>
    </b-modal>
  </div>

</template>

<style src="@/vendor/libs/vue-color/vue-color.scss" lang="scss"></style>

<script>
import BannerModal from './BannerModal'
import moment from 'moment'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
    'sub-modal': BannerModal
  },

  data: () => ({
    // option 정보
    bannerChnnlOptions: {},
    bannerAreaIdOptions: {},

    // sort
    sortBy: 'bannerAreaId',
    sortDesc: true,

    // page
    perPage: 10,
    currentPage: 1,
    perPageOptions: [10, 20, 30, 40, 50],
    totalCount: 0,
    totalSize: 0,

    // table 정보
    tableData: [],

    // Modal Options
    modalData: {},
    modalMode: '',
    modalTitle: '',

    // table loading
    isBusy: false,

    // Search param
    searchParameters: {
      bannerAreaId: '',
      keyword: '',
      bannerChnnlCode: '',
      order: null,
      orderDesc: ''
    }
  }),

  created () {
    this.loadBannerCombo('')
    this.getList()

    this.$on('closeModal', this.closeModal)
    this.$on('deleteModal', this.deleteModal)
    this.$on('saveModal', this.saveModal)
  },

  methods: {
    onEnd: function (evt) {
      let _parent = evt.to
      let _children = _parent.childNodes
      let _sort = 'up'

      let id, sn, no, cn, og
      for (let i = 0; i < _children.length; i++) {
        if (_children[i].getAttribute('draggable')) {
          cn = _children[i].getAttribute('data-chnnl')
          id = _children[i].getAttribute('data-id')
          sn = _children[i].getAttribute('data-sn')
          og = _children[i].getAttribute('data-no')
          no = i + 1
          _children[i].removeAttribute('draggable')
        }
      }

      if (no === og) return
      else if (og < no) _sort = 'down'
      else _sort = 'up'

      let _formData = new FormData()

      _formData.set('bannerChnnlCode', cn)
      _formData.set('bannerAreaId', id)
      _formData.set('bannerAreaSn', sn)
      _formData.set('sortNo', no)
      _formData.set('bannrSort', _sort)

      this.$http.post('/banner/update-sort', _formData)
        .then(
          () => {
            for (let i = 0; i < _children.length; i++) {
              _children[i].setAttribute('data-no', i + 1)
              _children[i].lastChild.innerHTML = i + 1
            }
            for (let i = 0; i < _children.length; i++) {
              _children[i].setAttribute('data-no', i + 1)
            }
            this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>순서변경이 완료되었습니다.`, {theme: 'bubble', duration: 3000})
            this.afterProcess()
          }
        )
    },

    remove: function (index) {
      this.list.splice(index, 1)
    },

    getList () {
      this.isBusy = true
      const parameters = {
        params: this.searchParameters
      }

      return getlist(parameters, this)

      function getlist (parameters, _super) {
        return getBannerlist(parameters, _super)
      }

      function getBannerlist (parameters, _super) {
        return _super.$http.get('/banner/all-list', parameters)
          .then((result) => {
            _super.tableData = result.data['resultObject']
            _super.totalSize = result.data['resultCount']
            _super.isBusy = false
            return _super.tableData
          })
      }
    },

    loadBannerCombo () {
      const parameter = '?codeLv2=BANNER_AREA_ID&lv=3'
      this.loadCombo(parameter, 'bannerChnnlOptions')
    },

    loadBannerAreaCode: function (e) {
      const parameter = `?codeLv2=BANNER_AREA_ID&lv=4&codeLv3=${e}`
      this.loadCombo(parameter, 'bannerAreaIdOptions')
    },

    loadCombo (parameter, type) {
      this.$http.get(`/code/combo${parameter}`)
        .then(
          (result) => {
            this[type] = this.$commons.clone(result.data['resultList'])
          }
        )
    },

    changeChnnl (e) {
      this.loadBannerAreaCode(e)
      this.searchParameters['bannerChnnlCode'] = e
      this.searchParameters['bannerAreaId'] = ''
      this.getList()
    },

    changeArea (e) {
      this.searchParameters['bannerAreaId'] = e
      this.getList()
    },

    openModal () {
      this.modalTitle = '배너 등록'
      this.modalMode = 'POST'
      this.modalData = {
        bannerAreaId: '',
        bannerChnnlCode: '',
        dscrp: '',
        advertisers: '',
        link: '',
        files: ''
      }
      this.$refs.modal.show()
      this.$EventBus.$emit('file-clear')
    },

    clickModal (node) {
      const parameters = '?bannerChnnlCode=' + node['chnnlCode'] + '&bannerAreaId=' + node['bannerAreaId'] + '&bannerAreaSn=' + node['bannerAreaSn']
      this.modalTitle = '배너 수정'
      this.modalMode = 'PUT'
      this.modalData.files = ''
      this.$http.get(`/banner${parameters}`)
        .then(
          (result) => {
            this.modalData = result.data['resultObject']
            this.loadBannerAreaCode(this.modalData.bannerChnnlCode)
          }
        )
      this.$refs.modal.show()
      this.$EventBus.$emit('file-clear')
    },

    // Close Modal
    closeModal () {
      this.$refs.modal.hide()
    },

    // 삭제 process
    deleteModal () {
      if (confirm('삭제하시겠습니까?')) {
        const parameters = '?bannerChnnlCode=' + this.modalData.bannerChnnlCode + '&bannerAreaId=' + this.modalData.bannerAreaId + '&bannerAreaSn=' + this.modalData.bannerAreaSn

        this.$http.delete(`/banner${parameters}`)
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
      var fileData = new FormData()

      var files = this.modalData.files
      if (files) {
        fileData.set('files', files)
      } else {
        if (this.modalMode === 'POST') {
          alert('이미지를 등록해주세요.')
          return
        }
      }

      fileData.set('bannerChnnlCode', this.modalData.bannerChnnlCode)
      fileData.set('bannerAreaId', this.modalData.bannerAreaId)
      fileData.set('link', this.modalData.link)
      fileData.set('width', this.modalData.width)
      fileData.set('height', this.modalData.height)
      fileData.set('stDt', moment(this.modalData.stDt).format('YYYY-MM-DD'))
      fileData.set('edDt', moment(this.modalData.edDt).format('YYYY-MM-DD'))
      fileData.set('advertisers', this.modalData.advertisers)
      fileData.set('dscrp', this.modalData.dscrp)

      let config = {
        header: {
          'Content-Type': 'multipart/form-data'
        }
      }

      if (this.modalMode === 'POST') {
        this.$http.post('/banner', fileData, config)
          .then(
            () => {
              this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>저장이 완료되었습니다.`, {theme: 'bubble', duration: 3000})
              this.afterProcess()
            }
          )
      } else {
        fileData.set('bannerAreaSn', this.modalData.bannerAreaSn)
        fileData.set('sortNo', this.modalData.sortNo)
        this.$http.post('/banner/update', fileData, config)
          .then(
            () => {
              this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>수정이 완료되었습니다.`, {theme: 'bubble', duration: 3000})
              this.afterProcess()
            }
          )
      }
    },

    // after process
    afterProcess () {
      this.$refs.modal.hide()
      this.getList()
    }
  }
}
</script>

<style scoped>
  .list-complete-item {
    padding: 20px 5px 5px;
    margin-top: 30px;
    border-top:1px solid #ddd;
    transition: all 1s;
    display:flex;
    position:relative;
  }
  .list-complete-item-group{
    flex-grow:1;
    margin:20px 5px 20px;
    position:relative;
    padding:5px 10px 5px 20px;
    border:1px solid #ddd;
    border-radius:5px;
  }
  .list-complete-item-list{
    margin:5px 0;
    padding:5px 0px 10px 15px;
    line-height:1.8em;
    cursor:all-scroll;
    position:relative;
  }
  .list-complete-item-list img{
    max-height:50px;
    max-width:100px;
    display:block;
  }
  .list-complete-item-list span{
    position:absolute;
    left:-10px;
    top:8px;
    background:#ccc;
    border-radius:10px;
    display:block;
    width:18px;
    height:18px;
    line-height:20px;
    text-align:center;
    color:#fff;
    font-size:12px;
  }
  .list-tit {
    position:absolute;
    left:0;
    top:-20px;
  }
</style>
