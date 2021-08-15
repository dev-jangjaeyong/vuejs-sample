<template>
  <div>
    <b-form>
      <b-card>
        <b-card-body>
          <div class="form-row">
            <div class="col-sm-3">
              <b-form-select v-model="faqModalInfo.faqBoardTyCd" :options="faqTyCdOptions">
                <template slot="first">
                  <option value="undefined" :disabled="true">유형</option>
                </template>
              </b-form-select>
            </div>
            <div class="col-sm-9">
              <b-form-group>
                <b-input type="text" placeholder="질문" v-model="faqModalInfo.title" ref="title" />
              </b-form-group>
            </div>
          </div>
          <b-form-group>
            <!--<quill-editor v-model="faqModalInfo.contents" :options="editorOptions" v-if="!isIE10"></quill-editor>-->
            <!--<b-textarea v-model="faqModalInfo.contents" v-if="isIE10" ref="contents"></b-textarea>-->
            <b-textarea v-model="faqModalInfo.contents" placeholder="내용"  style="height: 400px" ref="contents"></b-textarea>
          </b-form-group>
        </b-card-body>
      </b-card>
    </b-form>

    <div class="text-right mt-3">
      <b-btn class="float-left" variant="danger" @click="deleteModal" v-if="faqModalInfo.faqBoardNo !== undefined">삭제</b-btn>
      <b-btn variant="default" @click="closeModal">취소</b-btn>
      <b-btn variant="primary" @click="saveModal">저장</b-btn>&nbsp;
    </div>
  </div>
</template>

<style src="@/vendor/libs/vue-quill-editor/typography.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-quill-editor/editor.scss" lang="scss"></style>

<script>
export default {
  name: 'FaqModal',

  props: [
    'faqModalInfo',
    'faqTyCdOptions'
  ],

  components: {
    /* quillEditor: () => import('vue-quill-editor/dist/vue-quill-editor').then(m => m.quillEditor).catch(() => {}) */
  },

  data: () => ({
    /* editorOptions: {
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
      },
      placeholder: ''
    } */
  }),

  methods: {
    saveModal () {
      this.$parent.$parent.$emit('saveModal')
    },

    closeModal () {
      this.$parent.$parent.$emit('closeModal')
    },

    deleteModal () {
      this.$parent.$parent.$emit('removeModal')
    }
  }
}
</script>

<style scoped>

</style>
