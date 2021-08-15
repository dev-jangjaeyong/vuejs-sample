<template>
  <div>
    <b-form>
      <b-card-body class="pb-2 pt-1">

        <b-form-group label="분류" horizontal :label-cols="1">
          <!--<b-form-select v-model="modalData.boardTyCd" :options="boardTyCdOptions">
          </b-form-select>-->
          <b-input type="text" placeholder="분류" v-model="modalData.boardTyCdName" ref="boardTitle" :readonly="true"/>
        </b-form-group>

        <b-form-group label="제목" horizontal :label-cols="1">
          <b-input type="text" placeholder="제목" v-model="modalData.title" ref="boardTitle" />
        </b-form-group>

        <b-form-group>
          <div class="form-row">
            <div class="col-sm-6">
              <b-form-group label="등록일" horizontal :label-cols="2">
                <b-input type="text" v-model="modalData.createDt" :readonly="true"/>
              </b-form-group>
            </div>

            <div class="col-sm-6">
              <b-form-group label="수정일" horizontal :label-cols="2">
                <b-input type="text" v-model="modalData.updateDt" :readonly="true"/>
              </b-form-group>
            </div>
          </div>
        </b-form-group>

        <b-form-group>
          <!--<quill-editor v-model="modalData.contents" :options="editorOptions" v-if="!isIE10" />-->
          <!-- Fallback -->
          <!--<b-textarea v-model="modalData.contents" style="height: 400px" v-if="isIE10" ref="boardContents" />-->
          <b-textarea v-model="modalData.contents" placeholder="내용" style="height: 400px" ref="boardContents"/>
        </b-form-group>
      </b-card-body>
      <div class="text-right mt-3">
        <b-btn class="float-left" variant="danger" v-if="modalData.boardNo" @click="deleteModal">삭제</b-btn>
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
  name: 'BoardModal',
  /* props: ['modalData', 'boardTyCdOptions'], */
  props: ['modalData'],
  components: {
    'flat-pickr': flatPickr
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
      }
    }, */

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
