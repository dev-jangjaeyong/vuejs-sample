<template>
  <div>
    <b-form>
      <b-card-body class="pb-2 pt-1">

        <b-form-group label="채널" horizontal :label-cols="2">
          <div class="form-row">
            <div class="col-sm-5">
              <b-form-select v-if="modalMode !== 'POST'" v-model="modalData.bannerChnnlCode" :options="bannerChnnlOptions" :label-cols="1" :disabled="true">
                <option value="" disabled v-if="!modalData.bannerChnnlCode">채널을 선택하세요</option>
              </b-form-select>
              <b-form-select v-else v-model="modalData.bannerChnnlCode" :options="bannerChnnlOptions" :label-cols="1" @change="onChange">
                <option value="">채널을 선택하세요</option>
              </b-form-select>
            </div>
          </div>
        </b-form-group>

        <b-form-group label="배너영역" horizontal :label-cols="2">
          <div class="form-row">
            <div class="col-sm-5">
              <b-form-select v-if="modalMode !== 'POST'" v-model="modalData.bannerAreaId" :options="bannerAreaIdOptions" :label-cols="1" :disabled="true">
                <option value="" disabled v-if="!modalData.bannerAreaId">배너영역을 선택하세요</option>
              </b-form-select>
              <b-form-select v-else v-model="modalData.bannerAreaId" :options="bannerAreaIdOptionsCode" :label-cols="1">
                <option value="">배너영역을 선택하세요</option>
              </b-form-select>
            </div>

            <div class="col-sm-7" v-if="modalMode !== 'POST'">
              <b-form-group label="순번" horizontal :label-cols="4">
                <b-input type="text" placeholder="순번" v-model="modalData.sortNo" ref="sortNo" :readonly="true"/>
              </b-form-group>
            </div>
          </div>
        </b-form-group>

        <b-form-group label="배너 이미지" horizontal :label-cols="2" v-if="modalData.imagePath">
          <div class="form-row banner-img">
            <b-img v-bind:src="this.$global.prefix+modalData.imageUrl"/>
          </div>
        </b-form-group>

        <b-form-group label="URL주소" horizontal :label-cols="2">
          <b-input type="text" placeholder="URL주소" v-model="modalData.imageUrl" ref="imageUrl" :readonly="true"/>
        </b-form-group>

        <b-form-group label="저장위치" horizontal :label-cols="2">
          <b-input type="text" placeholder="저장위치" v-model="modalData.imagePath" ref="imagePath" :readonly="true"/>
        </b-form-group>

        <b-form-group label="링크" horizontal :label-cols="2">
          <b-input type="text" placeholder="링크" v-model="modalData.link" ref="link" />
        </b-form-group>

        <b-form-group>
          <div class="form-row">
            <div class="col-sm-6">
              <b-form-group label="너비" horizontal :label-cols="4">
                <b-input type="number" placeholder="너비" v-model="modalData.width" ref="width" />
              </b-form-group>
            </div>

            <div class="col-sm-6">
              <b-form-group label="높이" horizontal :label-cols="4">
                <b-input type="number" placeholder="높이" v-model="modalData.height" ref="height" />
              </b-form-group>
            </div>
          </div>
        </b-form-group>

        <b-form-group class="date">
          <div class="form-row">
            <div class="col-sm-6">
              <b-form-group label="시작일" horizontal :label-cols="4">
                <datepicker
                  v-model="modalData.stDt"
                  :bootstrapStyling="true"
                  :monday-first="true"
                  :full-month-name="true"
                  placeholder="Select arrival date"
                  :calendar-button="true"
                  calendar-button-icon="ion ion-md-calendar"
                  :clear-button="true"
                  :disabled-dates="disabledDates"
                  :highlighted="highlightedDates"
                  :format="customFormatter"/>
              </b-form-group>
            </div>

            <div class="col-sm-6">
              <b-form-group label="종료일" horizontal :label-cols="4">
                <datepicker
                  v-model="modalData.edDt"
                  :bootstrapStyling="true"
                  :monday-first="true"
                  :full-month-name="true"
                  placeholder="Select arrival date"
                  :calendar-button="true"
                  calendar-button-icon="ion ion-md-calendar"
                  :clear-button="true"
                  :disabled-dates="disabledDates"
                  :highlighted="highlightedDates"
                  :format="customFormatter"/>
              </b-form-group>
            </div>
          </div>
        </b-form-group>

        <b-form-group label="광고주" horizontal :label-cols="2">
          <b-input type="text" placeholder="광고주" v-model="modalData.advertisers" ref="advertisers" />
        </b-form-group>

        <b-form-group>
          <div class="form-row">
            <div class="col-sm-6">
              <b-form-group label="등록일" horizontal :label-cols="4">
                <b-input type="text" v-model="modalData.createDt" readonly/>
              </b-form-group>
            </div>

            <div class="col-sm-6">
              <b-form-group label="수정일" horizontal :label-cols="4">
                <b-input type="text" v-model="modalData.updateDt" readonly/>
              </b-form-group>
            </div>
          </div>
        </b-form-group>

        <b-form-group>
          <!--<quill-editor v-model="modalData.dscrp" :options="editorOptions" v-if="!isIE10" />-->
          <!-- Fallback -->
          <b-input type="text" v-model="modalData.dscrp" ref="Contents" placeholder="상세설명"/>
        </b-form-group>
        <div class="form-row">
          <div class="col-10">
            <b-form-file v-model="modalData.files" :state="Boolean(modalData.files)" placeholder="이미지를 선택해 주세요" accept="image/jpeg, image/png, image/gif" ref="fileinput" @change="fileChanged"></b-form-file>
          </div>
        <!--<div class="mt-3">선택된 이미지: {{modalData.files && modalData.files.name}}</div>-->
          <div class="col-2 btn-reset">
            <b-button @click="clearFiles">Reset</b-button>
          </div>
        </div>
      </b-card-body>
      <div class="text-right mt-3">
        <b-btn class="float-left" variant="danger" v-if="modalMode !== 'POST'" @click="deleteModal">삭제</b-btn>
        <b-btn variant="default" @click="closeModal">취소</b-btn>
        <b-btn variant="primary" @click="saveModal" v-if="modalMode !== 'POST'" >수정</b-btn>
        <b-btn variant="primary" @click="saveModal" v-else>저장</b-btn>
      </div>
    </b-form>
  </div>
</template>

<style src="@/vendor/libs/vue-multiselect/vue-multiselect.scss" lang="scss"></style>

<script>
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'

export default {
  name: 'BannerModal',
  props: ['modalData', 'bannerAreaIdOptions', 'modalMode', 'bannerChnnlOptions'],

  components: {
    Datepicker
  },
  data: () => ({
    // datepicker
    disabledDates: {
      days: [0] // Disable sunday
    },
    highlightedDates: {
      dates: [
        moment().add(1, 'd').toDate(),
        moment().add(2, 'd').toDate(),
        moment().add(3, 'd').toDate()
      ]
    },
    bannerAreaIdOptionsCode: {}
  }),

  methods: {
    clearFiles () {
      this.$refs.fileinput.reset()
    },

    closeModal () {
      this.$parent.$parent.$emit('closeModal')
    },

    deleteModal () {
      this.$parent.$parent.$emit('deleteModal')
    },

    saveModal () {
      this.$parent.$parent.$emit('saveModal')
    },

    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },

    onChange (e) {
      this.loadBannerAreaCode(e)
      // this.searchParameters['bannerAreaId'] = ''
    },

    loadBannerAreaCode: function (e) {
      const parameter = `?codeLv2=BANNER_AREA_ID&lv=4&codeLv3=${e}`
      this.loadCombo(parameter, 'bannerAreaIdOptionsCode')
    },

    loadCombo (parameter, type) {
      this.$http.get(`/code/combo${parameter}`)
        .then(
          (result) => {
            this[type] = this.$commons.clone(result.data['resultList'])
          }
        )
    },

    fileChanged (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }

      this.createImage(files[0])
    },

    createImage (file) {
      let view = this

      let reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = () => {
        let image = new Image()
        image.src = reader.result
        image.onload = function () {
          view.modalData.width = this.width
          view.modalData.height = this.height
          view.$forceUpdate()
        }
      }
    }
  },
  mounted () {
    this.$EventBus.$on('file-clear', () => {
      this.$refs.fileinput.reset()
    })
  }
}
</script>

<style scoped>
  .banner-img{
    overflow:hidden;
    height:auto;
  }
  .banner-img img {
    height:100%;
    width:100%;
  }
  .btn-reset{text-align:right;}
</style>
