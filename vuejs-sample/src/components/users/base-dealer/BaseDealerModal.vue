<template>
  <div>
    <b-form>
      <div class="row">
        <div class="row col-md-7">
          <div class="col-md-6">
            <b-form-group label="연합회">
              <b-input type="text" placeholder="연합회" :readonly="true" v-model="baseDealerModalInfo.nameLv1"></b-input>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="조합">
              <b-input type="text" placeholder="조합" :readonly="true" v-model="baseDealerModalInfo.nameLv2"></b-input>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="단지">
              <b-input type="text" placeholder="단지" :readonly="true" v-model="baseDealerModalInfo.nameLv3"></b-input>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="상사">
              <b-input type="text" v-if="mode === 'POST'" placeholder="상사" :readonly="true" v-model="baseDealerModalInfo.nameLv4" ></b-input>
              <b-input type="text" v-else placeholder="상사" :readonly="true" v-model="baseDealerModalInfo.nameLv4" @input="changeData"></b-input>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="사원증 번호">
              <b-input type="text" v-if="mode === 'POST'" placeholder="사원증 번호를 입력하세요." v-model="baseDealerModalInfo.licenseNo"></b-input>
              <b-input type="text" v-else placeholder="사원증 번호를 입력하세요." v-model="baseDealerModalInfo.licenseNo" @input="changeData"></b-input>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="사원증 시작일">
              <b-input type="text" placeholder="YYYY-MM-DD 형식." v-model="baseDealerModalInfo.licenseStDt"></b-input>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="사원증 종료일">
              <b-input type="text" placeholder="YYYY-MM-DD 형식." v-model="baseDealerModalInfo.licenseEdDt"></b-input>
            </b-form-group>
          </div>
        </div>
        <div class="col-md-5 br-left">
            <b-card header-tag="header" class="mb-6">
              <h5 slot="header" class="mb-0">조직 목록</h5>
              <base-orgnzt-tree :tree-data="treeData" ref="tree"></base-orgnzt-tree>
            </b-card>
        </div>
      </div>

      <b-button v-if="mode === 'POST'" type ="button" @click="dupchk">딜러 중복체크</b-button>
      <b-button v-else :disabled="buttonStatus === 0" type ="button" @click="dupchk">딜러 중복체크</b-button>
    </b-form>

    <div class="w-100">
      <!--<span class="float-left" v-if="mode === 'PUT'">
        <b-btn variant="default" @click="removeModal">삭제</b-btn>
      </span>-->
      <span class="float-right">
          <b-btn variant="secondary" @click="closeModal">닫기</b-btn>
          <b-btn variant="primary" @click="saveModal" v-if="mode === 'POST'">저장</b-btn>
          <b-btn variant="primary" @click="saveModal" v-else>수정</b-btn>
      </span>
    </div>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>

<style lang="scss">
  .default-style .flatpickr-calendar.open {
    z-index: 1100
  }
</style>

<script>
import flatPickr from 'vue-flatpickr-component'
import BaseOrgnztTree from './BaseOrgnztTree'

export default{
  name: 'BaseDealerModal',

  created () {
    this.$on('getInfo', this.getInfo)
    this.$on('nodetrigger', this.getInfo)
  },

  metaInfo: {
    title: '딜러 기초 정보 관리'
  },

  components: {
    'flat-pickr': flatPickr,
    'base-orgnzt-tree': BaseOrgnztTree
  },
  props: [
    'baseDealerModalInfo',
    'mode'
  ],

  data () {
    return {
      flatConfig: {
        altFormat: 'Y-m-d',
        dateFormat: 'Y-m-d',
        altInput: true,
        animate: true
      },

      treeData: [],

      currentPage: 1,

      buttonStatus: 0
    }
  },

  methods: {
    getInfo (orgnztUnitNo) {
      this.$http.get('/orgnzt/allshop/' + orgnztUnitNo)
        .then(
          (result) => {
            this.baseDealerModalInfo.nameLv1 = result.data['resultObject'].nameLv1
            this.baseDealerModalInfo.nameLv2 = result.data['resultObject'].nameLv2
            this.baseDealerModalInfo.nameLv3 = result.data['resultObject'].nameLv3
            this.baseDealerModalInfo.nameLv4 = result.data['resultObject'].nameLv4
            this.baseDealerModalInfo.orgnztUnitNo = orgnztUnitNo
            this.$forceUpdate()
          }
        )

      this.currentPage = 1
    },

    saveModal () {
      this.$parent.$parent.$emit('saveModal')
    },

    removeModal () {
      this.$parent.$parent.$emit('removeModal')
    },

    closeModal () {
      this.$parent.hide()
    },

    dupchk () {
      const param = '?orgnztUnitNo=' + this.baseDealerModalInfo.orgnztUnitNo + '&licenseNo=' + this.baseDealerModalInfo.licenseNo
      this.$parent.$parent.$emit('dupchk', param)
    },

    changeData () {
      if ((this.baseDealerModalInfo.beforeLicenseNo !== this.baseDealerModalInfo.licenseNo) ||
        (this.baseDealerModalInfo.beforeOrgnztUnitNo !== this.baseDealerModalInfo.orgnztUnitNo)) {
        this.buttonStatus = 1
      } else {
        this.buttonStatus = 0
      }
    }
  },
  mounted () {
    this.$EventBus.$on('close-child', () => {
      this.treeData.forEach(function (value, index) {
        value.closeChildren()
      })
    })

    this.$EventBus.$on('open-child', (param) => {
      /* console.log('param')
      console.log(param.codeLv1,param.codeLv2,param.codeLv3,param.codeLv4)
      console.log('this.treeData')
      console.log(this.treeData)
      this.treeData.forEach(function (value, index) {
        console.log('1depth - nodeNo')
        console.log(value.nodeNo)
        console.log('1depth - value')
        console.log(value)
        console.log(value.children)

        if (value.nodeNo === param.codeLv1) {
          value.openChildren()
        }
        if (value.nodeNo === param.codeLv1) {
          value.openChildren()
          value.children.forEach(function (value2, index) {
            console.log('2depth - value')
            console.log(value2)
            if (value2.nodeNo === param.codeLv2) {
              value2.openChildren()
              value2.children.forEach(function (value3, index) {
                console.log('3depth - value')
                console.log(value3)
                if (value3.nodeNo === param.codeLv3) {
                  value3.openChildren()
                }
              })
            }
          })
        } */
    })
  }
}
</script>

<style scoped>
  .br-left{border-left:1px solid rgba(24, 28, 33, 0.1);}
</style>
