<template>
  <b-modal ref="modal" size="md" hide-footer>
    <div slot="modal-title">{{openModalTitle}}</div>
    <type2-modal>
      <form @submit.prevent="UserSearch">
        <div class="row">
          <div class="card-body input-group pt-0">
            <label>
              <select class="custom-select mr-2" v-model="searchType" @change="changeSearchType">
                <option v-for="option in options" v-bind:value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </label>
            <!--<span>선택함: {{ searchType }}</span>-->
            <input type="text" class="form-control" placeholder="검색어를 입력하세요." v-model="srchWord" v-validate="'required'" data-vv-name="inputValue">
            <span class="input-group-append pb-2">
              <button class="btn btn-secondary" type="submit">검색</button>
            </span>
            <span class="error col-12" v-if="errors.has('inputValue')" >{{errors.first('inputValue')}}</span>
          </div>
          <div class="card-body overflow-auto pt-0" style="height:400px;">
            <ul class="list-group">
              <li v-for="(result, index) in searchResultList" class="list-group-item list-group-item-action rounded-0 border-secondary border-right-0 border-left-0" :class="{active:result.selected}" @click="handler(result,index)">
                <div class="form-row">
                  <a class="col-6" style="text-align: center;">{{ result.userName }}</a>
                  <a class="col-6" style="text-align: center;">{{ result.cellPhoneNo }}</a>
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
    this.searchType = 'A'
    this.$EventBus.$on('user-search', (type) => {
      this.infoList = []
      this.currentSearchType = type
      this.srchWord = ''
      this.$refs.modal.show()
      this.searchResultList = []
    })
    this.$on('saveModal', this.saveModal) // 저장 이벤트
  },
  data () {
    return {
      openModalTitle: '회원 검색',
      shopNo: '',
      userNo: '',
      options: [
        {text: '회원명', value: 'A'},
        {text: '휴대폰번호', value: 'B'}
      ],
      srchWord: '',
      infoList: [],
      currentSearchType: this.searchType,
      searchResultList: [],
      selected: undefined
    }
  },
  methods: {
    UserSearch () {
      this.$validator.validate().then(valid => {
        if (valid) {
          let parameter = ``

          if (this.searchType === 'A') {
            parameter = `?userName=${this.srchWord}&cellPhoneNo=''`
            this.$http.get(`/user/phone-name${parameter}`)
              .then(
                (result) => {
                  this.searchResultList = result.data['resultList']
                }
              )
          } else {
            alert(1)
            parameter = `?cellPhoneNo=${this.srchWord}&userName=''`
            this.$http.get(`/user/phone-name${parameter}`)
              .then(
                (result) => {
                  this.searchResultList = result.data['resultList']
                }
              )
          }
          this.infoList = []
        }
      })
    },
    changeSearchType (e) {
      this.infoList = []
      this.currentSearchType = e.target.value
      this.srchWord = ''
    },
    handler (result, index) {
      this.$set(result, 'selected', !result.selected)
      if (this.searchType === 'A') {
        if (result.selected) {
          this.infoList.push({'key': result.orgnztUnitNo, 'value': result.fullName})
        } else {
          let index = this.infoList.findIndex((item, i) => {
            return item.key === result.orgnztUnitNo
          })
          this.infoList.splice(index, 1)
        }
      } else {
        if (result.selected) {
          this.infoList.push({'key': result.userNo, 'value': {'userName': result.userName, 'shopNo': result.codeLv4, 'shopName': result.fullName}})
        } else {
          let index = this.infoList.findIndex((item, i) => {
            return item.key === result.userNo
          })
          this.infoList.splice(index, 1)
        }
      }
    },
    registShopDealerSearchInfo () {
      this.$parent.$emit('registShopDealerSearchInfo', this.infoList, this.searchType)
    },
    saveModal () {
      this.registShopDealerSearchInfo()
    }
  },
  computed: {
    searchType: {
      get () { return this.currentSearchType },
      set (value) {
        this.currentSearchType = value
      }
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
