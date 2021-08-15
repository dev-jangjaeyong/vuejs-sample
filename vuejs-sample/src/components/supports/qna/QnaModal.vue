<template>
  <b-modal ref="qnaModal" size="lg" hide-footer>
    <div>
      <b-card>
        <div class="row">
          <div slot="modal-title">1:1문의 상세</div>
        </div>
        <b-form-textarea v-model="qnaData.contents" plaintext no-resize></b-form-textarea>
        <b-btn v-if="qnaData.fileUploadInfoNo !== null" v-bind:href="this.$global.API_URL+'/download/image?seq='+qnaData.fileUploadInfoNo">첨부파일</b-btn>
      </b-card>

      <b-form>
        <b-card>
          <b-card-body class="pb-2">
            <div class="row">
              <div class="col-md-6">
                <b-form-group label="답변제목">
                  <b-input type="text" placeholder="제목" v-model="qnaData.upTitle" ref="title" />
                </b-form-group>
              </div>
              <div class="col-md-6">
                <b-form-group label="답변유형">
                  <b-form-select v-model="qnaData.status" :options="statusOptions"></b-form-select>
                </b-form-group>
              </div>
            </div>
            <b-form-group>
              <b-textarea rows="3" v-model="qnaData.upContents" placeholder="내용"  style="height: 400px" ref="contents" />
            </b-form-group>
          </b-card-body>
        </b-card>
      </b-form>

      <div class="text-right mt-3">
        <b-btn class="float-left" variant="danger" :disabled="qnaData.upQnaBoardNo === null"  @click="deleteModal">삭제</b-btn>
        <b-btn variant="default" @click="closeModal">취소</b-btn>
        <b-btn variant="primary" v-if="qnaData.upQnaBoardNo === null" @click="saveModal">저장</b-btn>
        <b-btn variant="primary" v-else @click="saveModal">수정</b-btn>
      </div>
    </div>
  </b-modal>
</template>

<style src="@/vendor/libs/vue-quill-editor/typography.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-quill-editor/editor.scss" lang="scss"></style>

<script>
export default {
  name: 'QnaModal',

  components: {
  },

  created () {
    this.$EventBus.$on('qna-modal', (item, boardTyCdOptions, statusOptions) => {
      this.qnaData = item
      this.qnaBoardTyCdOptions = boardTyCdOptions
      this.statusOptions = statusOptions
      this.$refs.qnaModal.show()
    })
    this.$EventBus.$on('qna-modal-close', () => {
      this.$refs.qnaModal.hide()
    })
    this.$on('saveModal', this.saveModal)
    this.$on('closeModal', this.closeModal)
    this.$on('deleteModal', this.deleteModal)
  },

  data: () => ({
    qnaData: [],
    qnaBoardTyCdOptions: [],
    statusOptions: []
  }),

  methods: {
    closeModal () {
      this.$refs.qnaModal.hide()
    },

    deleteModal () {
      this.$parent.$emit('deleteModal', this.qnaData)
    },

    saveModal (evt) {
      this.$parent.$emit('saveModal', this.qnaData, evt)
    }
  }
}
</script>
