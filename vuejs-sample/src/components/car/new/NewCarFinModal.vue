<template>
  <div>
    <b-form>
      <b-card-body class="pb-2 pt-1">

        <b-form-group>
          <div class="form-row">
            <div class="col-sm-6">
              <b-form-group label="제조사" horizontal :label-cols="2">
                <b-input type="text" v-if="modalData.brandName !== ''" v-model="modalData.brandName" readonly></b-input>
                <b-input type="text" v-else v-model="modalData.brandNo"></b-input>
              </b-form-group>
            </div>

            <div class="col-sm-6">
              <b-form-group label="모델" horizontal :label-cols="2">
                <b-input type="text" v-if="modalData.modelName !== ''" v-model="modalData.modelName" readonly></b-input>
                <b-input type="text" v-else v-model="modalData.modelNo"></b-input>
              </b-form-group>
            </div>
          </div>
          <div class="form-row">
            <div class="col-sm-12">
              <b-form-group label="등급" horizontal :label-cols="1">
                <b-input type="text" v-if="modalData.lineUpName !== ''" v-model="modalData.lineUpName" readonly></b-input>
                <b-input type="text" v-else v-model="modalData.lineUpNo"></b-input>
              </b-form-group>
            </div>

          </div>

          <div class="form-row" v-show="modalData.brandName === ''">
            <div class="col-sm-6">
              <b-form-group label="신차가격" horizontal :label-cols="2">
                <b-input type="text" v-model="modalData.newCarPrice"></b-input>
              </b-form-group>
            </div>

            <div class="col-sm-6">
              <b-form-group label="금융유형" horizontal :label-cols="2">
                <b-input type="text" v-model="modalData.itemTyCd"></b-input>
              </b-form-group>
            </div>
          </div>

          <div class="form-row">
            <div class="col-sm-12">
              <b-form-group label="월불입금" horizontal :label-cols="1">
                <b-input type="text" v-model="modalData.monthCost" ></b-input>
              </b-form-group>
            </div>
          </div>

          <div class="form-row">
            <div class="col-sm-6">
              <b-form-group label="기간" horizontal :label-cols="2">
                <b-input type="text" v-model="modalData.term" ></b-input>
              </b-form-group>
            </div>

            <div class="col-sm-6">
              <b-form-group label="선수금" horizontal :label-cols="2">
                <b-input type="text" v-model="modalData.advancePay" ></b-input>
              </b-form-group>
            </div>
          </div>

          <div class="form-row" v-show="modalData.brandName !== ''">
            <div class="col-sm-6">
              <b-form-group label="등록일" horizontal :label-cols="2">
                <b-input type="text" v-model="modalData.createDt" readonly></b-input>
              </b-form-group>
            </div>

            <div class="col-sm-6">
              <b-form-group label="수정일" horizontal :label-cols="2">
                <b-input type="text" v-model="modalData.updateDt" readonly></b-input>
              </b-form-group>
            </div>
          </div>
        </b-form-group>

      </b-card-body>
      <div class="text-right mt-3">
        <b-btn class="float-left" variant="danger" v-if="modalData.brandName" @click="deleteModal">삭제</b-btn>
        <b-btn variant="default" @click="closeModal">취소</b-btn>
        <b-btn variant="primary" @click="saveModal">저장</b-btn>
      </div>
    </b-form>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css" />
<style src="@/vendor/libs/vue-multiselect/vue-multiselect.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-quill-editor/typography.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-quill-editor/editor.scss" lang="scss"></style>

<style lang="scss">
  .ql-container.ql-snow {
    height: 400px;
  }
  .default-style .flatpickr-calendar.open {
    z-index: 1100
  }
</style>

<script>
import flatPickr from 'vue-flatpickr-component'

export default {
  name: 'NewCardFinModal',
  props: ['modalData', 'brandOptions'],
  components: {
    'flat-pickr': flatPickr,
    quillEditor: () => import('vue-quill-editor/dist/vue-quill-editor').then(m => m.quillEditor).catch(() => {})
  },
  data: () => ({
    editorOptions: {
      modules: {
        toolbar: [
          [{'header': [1, 2, 3, 4, 5, 6, false]}, {'font': []}, {'size': []}],
          ['bold', 'italic', 'underline', 'strike'],
          [{'color': []}, {'background': []}],
          [{'script': 'sub'}, {'script': 'super'}],
          ['blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          [{'direction': 'rtl'}, {'align': []}],
          ['link', 'image', 'video'],
          ['clean']
        ]
      }
    },

    flatConfig: {
      altFormat: 'Y-m-d',
      dateFormat: 'Y-m-d',
      altInput: true,
      animate: true
    }
  }),

  methods: {
    closeModal () {
      this.$parent.$parent.$emit('closeModal')
    },

    deleteModal () {
      this.$parent.$parent.$emit('deleteModal')
    },

    saveModal () {
      this.$parent.$parent.$emit('saveModal')
    }
  }
}
</script>
