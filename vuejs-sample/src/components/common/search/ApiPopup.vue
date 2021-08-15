<template>
  <b-modal ref="modal" size="md" hide-footer>
    <div slot="modal-title">{{openModalTitle}}</div>
    <type2-modal>
      <form @submit.prevent="ActionSearch">
        <div class="row">
          <div class="card-body overflow-auto pt-0" style="height:400px;">
            <ul class="list-group">
              <li class="list-group-item list-group-item-action rounded-0 border-secondary border-right-0 border-left-0" style="background-color: #5bc1f7; color:#000000;">
                <div class="form-row">
                  <a class="col-6" style="text-align: center;">거래 ID</a>
                  <a class="col-6" style="text-align: center;">거래 명</a>
                </div>
              </li>
              <li v-for="(result, index) in searchResultList" class="list-group-item list-group-item-action rounded-0 border-secondary border-right-0 border-left-0" :class="{active:result.selected}" @click="handler(result,index)">
                <div class="form-row">
                  <a class="col-6" style="text-align: center;">{{ result.apiNo }}</a>
                  <a class="col-6" style="text-align: center;">{{ result.apiName }}</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </form>
    </type2-modal>
  </b-modal>
</template>

<script>

import Type2Modal from '@/components/common/modal/Type2Modal'

export default {
  name: 'ShopDealerPopup',
  components: {
    'type2-modal': Type2Modal
  },
  created () {
    this.$EventBus.$on('api-search', () => {
      this.infoList = []
      this.$refs.modal.show()
      this.searchResultList = []
      this.ActionSearch()
    })
    this.$on('saveModal', this.saveModal) // 저장 이벤트
  },
  data () {
    return {
      openModalTitle: '거래 선택',
      infoList: [],
      searchResultList: [],
      selected: undefined
    }
  },
  methods: {
    ActionSearch () {
      let parameter = ``

      parameter = `?startNumber=0&endNumber=500`
      this.$http.get(`/api${parameter}`)
        .then(
          (result) => {
            this.searchResultList = result.data['resultList']
          }
        )
      this.infoList = []
    },
    handler (result, index) {
      this.$set(result, 'selected', !result.selected)
      if (result.selected) {
        this.infoList.push({'key': result.apiNo, 'value': result.apiName})
      } else {
        let index = this.infoList.findIndex((item, i) => {
          return item.key === result.apiNo
        })
        this.infoList.splice(index, 1)
      }
    },
    registActionIdSearchInfo () {
      this.$parent.$emit('registActionIdSearchInfo', this.infoList)
    },
    saveModal () {
      this.registActionIdSearchInfo()
    }
  }
}
</script>

<style scoped>
  span.error {
    color: #9F3A38;
  }
  .list-group-item.active, .list-group-item.active:hover, .list-group-item.active:focus{background-color:#f1f3f5;color:#616263;}
</style>
