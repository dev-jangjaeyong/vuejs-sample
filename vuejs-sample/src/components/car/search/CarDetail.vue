<template>
  <b-modal ref="modal" size="md" hide-footer>
    <div slot="modal-title">차량상세</div>
    <type1-modal>
      <b-form>
        <div class="row">
          <div class="col-md-4">
            <b-form-group label="일련번호">
              <b-input type="text" placeholder="차량일련번호" v-model="carDetailInfo.carNo" :readonly="true"></b-input>
            </b-form-group>
          </div>
          <div class="col-md-4">
            <b-form-group label="차량번호">
              <b-input type="text" placeholder="차량번호" v-model="carDetailInfo.carPlateNumber" :readonly="true"></b-input>
            </b-form-group>
          </div>
          <div class="col-md-4">
            <b-form-group label="차대번호">
              <b-input type="text" placeholder="차대번호" v-model="carDetailInfo.carFrameNo" :readonly="true"></b-input>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <b-form-group label="제조국가">
              <b-input type="text" placeholder="제조국가" v-model="carDetailInfo.nameLv1" :readonly="true"></b-input>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="제조사">
              <b-input type="text" placeholder="제조사" v-model="carDetailInfo.nameLv2" :readonly="true"></b-input>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="모델">
              <b-input type="text" placeholder="모델" v-model="carDetailInfo.nameLv3" :readonly="true"></b-input>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="세부모델">
              <b-input type="text" placeholder="세부모델" v-model="carDetailInfo.nameLv4" :readonly="true"></b-input>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="등급">
              <b-input type="text" placeholder="등급" v-model="carDetailInfo.nameLv5" :readonly="true"></b-input>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="세부등급">
              <b-input type="text" placeholder="세부등급" v-model="carDetailInfo.nameLv6" :readonly="true"></b-input>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <b-form-group label="최초등록일">
              <b-input type="text" placeholder="최초등록일" v-model="carDetailInfo.carRegDt" :readonly="true"></b-input>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="연식">
              <b-input type="text" placeholder="최초등록일" v-model="carDetailInfo.carRegYear" :readonly="true"></b-input>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="변속기">
              <b-input type="text" placeholder="변속기" v-model="carDetailInfo.mission" :readonly="true"></b-input>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="연료">
              <b-input type="text" placeholder="연료" v-model="carDetailInfo.carFuelCodeName" :readonly="true"></b-input>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="시도">
              <b-input type="text" placeholder="지도" v-model="carDetailInfo.sidoName" :readonly="true"></b-input>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="지역">
              <b-input type="text" placeholder="지역" v-model="carDetailInfo.cityName" :readonly="true"></b-input>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="조합명">
              <b-input type="text" placeholder="조합명" v-model="carDetailInfo.johapName" :readonly="true"></b-input>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="단지명">
              <b-input type="text" placeholder="단지명" v-model="carDetailInfo.danjiName" :readonly="true"></b-input>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="상사명">
              <b-input type="text" placeholder="상사명" v-model="carDetailInfo.shopName" :readonly="true"></b-input>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="카테고리">
              <b-form-checkbox v-for="(item, index) in carCategory" v-bind:value="item.value" v-model="selectedItems" v-bind:key="index">{{item.text}}</b-form-checkbox>
            </b-form-group>
          </div>
        </div>
      </b-form>
    </type1-modal>
  </b-modal>
</template>

<script>
import Type1Modal from '@/components/common/modal/Type1Modal'

export default {
  name: 'CarDetail',
  components: {
    'type1-modal': Type1Modal
  },
  created () {
    this.$EventBus.$on('car-detail-start', (item) => {
      if (item.carSaleState === 9) {
        this.$EventBus.$emit('mod-removeBtn-name', {'name': '광고매물 이관'})
      } else {
        this.$EventBus.$emit('mod-removeBtn-name', {'name': '판매완료 이관'})
      }
      this.carDetailInfo = item
      if (item.carCategory !== '') {
        this.selectedItems = item.carCategory.split(',')
      }
      this.$refs.modal.show()
    })
    this.$EventBus.$on('car-category', (item) => {
      this.carCategory = item
    })
    this.$on('saveModal', this.saveModal) // 저장 이벤트
    this.$on('removeModal', this.removeModal) // 삭제 이벤트
  },
  methods: {
    removeModal () {
      let param = '?carNo=' + this.carDetailInfo.carNo + '&saleSate=' + this.carDetailInfo.carSaleState
      let _state = ''
      if (this.carDetailInfo.carSaleState === 9) {
        _state = '광고매물'
      } else {
        _state = '판매완료'
      }
      this.$http.get('/oncar/update-car-admin' + param)
        .then((result) => {
          if (result.status === 200) {
            this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>` + _state + ` 이관이 완료되었습니다.`, {theme: 'bubble', duration: 3000})
            this.$refs.modal.hide()
            this.$parent.$refs.table.refresh()
          } else {
            alert(_state + ' 이관에 실패하였습니다.')
          }
        })
    },
    saveModal () {
      let param = '?carNo=' + this.carDetailInfo.carNo + '&carCategory=' + this.selectedItems
      this.$http.post('/oncar/update-car-category' + param)
        .then((result) => {
          if (result.status === 200) {
            this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>` + ` 수정이 완료되었습니다.`, {theme: 'bubble', duration: 3000})
            this.$refs.modal.hide()
            this.$parent.$refs.table.refresh()
          } else {
            alert('수정에 실패하였습니다.')
          }
        })
    }
  },
  data () {
    return {
      carDetailInfo: [],
      carCategory: [],
      selectedItems: []
    }
  }
}
</script>

<style scoped>

</style>
