<template>
  <b-modal ref="noticeModal" size="lg" hide-footer>
    <div slot="modal-title">공지사항 상세</div>
    <div>
      <b-form>
        <b-card-body class="pb-2 pt-1">
          <b-form-group label="공지유형" horizontal :label-cols="1">
            <b-select v-model="noticeData.noticeTyCd" :options="noticeOptions" ref="noticeTyCd">
              <option value="" disabled v-if="!noticeData.noticeTyCd">공지유형을 선택하세요</option>
            </b-select>
          </b-form-group>

          <b-form-group label="제목" horizontal :label-cols="1">
            <b-input type="text" placeholder="제목" v-model="noticeData.noticeTitle" ref="noticeTitle" />
          </b-form-group>

          <b-form-group class="mb-0">
            <div class="form-row">
              <div class="col-sm-6">
                <b-form-group label="숨김여부" horizontal :label-cols="2">
                  <b-select v-model="noticeData.hiddenYn" :options="{'Y': '사용', 'N': '미사용'}" ref="hiddenYn" />
                </b-form-group>
              </div>

              <div class="col-sm-6">
                <b-form-group label="팝업유무" horizontal :label-cols="2">
                  <b-select v-model="noticeData.popupYn" :options="{'Y': '사용', 'N': '미사용'}" ref="popupYn" />
                </b-form-group>
              </div>
            </div>
          </b-form-group>

          <b-form-group class="date">
            <div class="form-row">
              <div class="col-sm-6">
                <b-form-group label="시작일" horizontal :label-cols="2">
                  <datepicker
                    v-model="noticeData.useStDt"
                    :bootstrapStyling="true"
                    :monday-first="true"
                    :full-month-name="true"
                    placeholder="공지시작일을 선택해주세요."
                    :calendar-button="true"
                    calendar-button-icon="ion ion-md-calendar"
                    :clear-button="true"
                    :disabled-dates="disabledDates"
                    :highlighted="highlightedDates"
                    :format="customFormatter"/>
                </b-form-group>
              </div>

              <div class="col-sm-6">
                <b-form-group label="종료일" horizontal :label-cols="2">
                  <datepicker
                    v-model="noticeData.useEdDt"
                    :bootstrapStyling="true"
                    :monday-first="true"
                    :full-month-name="true"
                    placeholder="공지종료일을 선택해주세요."
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

          <b-form-group>
            <div class="form-row">
              <div class="col-sm-6">
                <b-form-group label="등록일" horizontal :label-cols="2">
                  <b-input type="text" v-model="noticeData.createDt" :readonly="true"/>
                </b-form-group>
              </div>

              <div class="col-sm-6">
                <b-form-group label="수정일" horizontal :label-cols="2">
                  <b-input type="text" v-model="noticeData.updateDt" :readonly="true"/>
                </b-form-group>
              </div>
            </div>
          </b-form-group>

          <b-form-group>
            <quill-editor ref="editor"
                          @ready="onEditorReady($event)"
                          v-model="noticeData.noticeContents"
                          :options="editorOptions"
                          v-if="!isIE10" />
            <!-- Fallback -->
          </b-form-group>
        </b-card-body>

        <div class="text-right mt-3">
          <b-btn variant="danger" class="float-left" v-if="noticeData.noticeNo" @click="deleteModal">삭제</b-btn>
          <b-btn variant="default" @click="closeModal">취소</b-btn>
          <b-btn variant="primary" @click="saveModal" v-if="noticeData.noticeNo" >수정</b-btn>
          <b-btn variant="primary" @click="saveModal" v-else>저장</b-btn>
        </div>
      </b-form>
    </div>
  </b-modal>
</template>

<style src="@/vendor/libs/vue-quill-editor/typography.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-quill-editor/editor.scss" lang="scss"></style>

<style lang="scss">
  .ql-container.ql-snow {
    height: 400px;
  }
</style>

<script>
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'

export default {
  name: 'NoticeModal',

  components: {
    Datepicker,
    quillEditor: () => import('vue-quill-editor/dist/vue-quill-editor').then(m => m.quillEditor).catch(() => {})
  },

  created () {
    this.$EventBus.$on('notice-modal', (item, option) => {
      this.noticeData = item
      this.noticeOptions = option
      this.$refs.noticeModal.show()
    })
    this.$EventBus.$on('notice-modal-close', () => {
      this.$refs.noticeModal.hide()
    })
    this.$on('saveModal', this.saveModal)
    this.$on('closeModal', this.closeModal)
    this.$on('deleteModal', this.deleteModal)
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
          ['image'],
          ['clean']
        ]
      }
    },

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

    editor: {},
    noticeData: [],
    noticeOptions: []
  }),

  methods: {
    onEditorReady (editor) {
      editor.getModule('toolbar').addHandler('image', this.imageHandler)
      this.editor = editor
    },

    imageHandler: function () {
      this.selectLocalImage()
    },

    selectLocalImage () {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.click()

      input.onchange = () => {
        const file = input.files[0]

        // file type is only image.
        if (/^image\//.test(file.type)) {
          this.saveToServer(file)
        } else {
          console.warn('파일 선택 안됨.')
        }
      }
    },

    saveToServer (file) {
      let reader = new FileReader()
      let fileData = new FormData()
      let that = this

      if (file) {
        fileData.set('files', file)
      } else {
        alert('이미지를 선택해주세요.')
        return
      }

      fileData.set('serviceBoard', 'NT')

      let config = {
        header: {
          'Content-Type': 'multipart/form-data'
        }
      }

      this.$http.post('/board/fileTempUpload', fileData, config)
        .then(
          (result) => {
            this.$toasted.show(`<i class="ion ion-md-checkmark mr-2"></i>이미지가 임시 저장되었습니다.`, {theme: 'bubble', duration: 3000})
            reader.readAsDataURL(file)
            reader.onloadend = function () {
              that.insertToEditor(result)
            }
          }
        )
    },

    insertToEditor (result) {
      let _opt = []
      let _contentLength = this.editor.getLength()
      let _range = this.editor.getSelection()
      let _length = _range.index

      if (_length === 0) {
        if (_contentLength > 1) {
          _opt.push(
            {retain: _contentLength - 1},
            {
              insert: {image: this.$global.prefix + result.data['resultObject'].url},
              attributes: {alt: result.data['resultObject'].filePath}
            }
          )
        } else {
          _opt.push({
            insert: {image: this.$global.prefix + result.data['resultObject'].url},
            attributes: {alt: result.data['resultObject'].filePath}
          })
        }
      } else {
        _opt.push(
          {retain: _length},
          {
            insert: {image: this.$global.prefix + result.data['resultObject'].url},
            attributes: {alt: result.data['resultObject'].filePath}
          }
        )
      }

      let _delta = {
        ops: _opt
      }

      this.editor.updateContents(_delta)

      if (_length === 0) {
        this.editor.setSelection(_contentLength + 1)
      } else {
        this.editor.setSelection(_length + 1)
      }
    },

    closeModal () {
      this.$refs.noticeModal.hide()
    },

    deleteModal () {
      this.$parent.$emit('deleteModal', this.noticeData.noticeNo)
    },

    registNoticeInfo () {
      let _listReg = []
      let _listImg = []
      let _linkNode = this.$el.querySelectorAll('.ql-container img')

      for (let i = 0; i < _linkNode.length; i++) {
        _listReg[i] = _linkNode[i].alt
        _listImg[i] = this.replaceAll(_linkNode[i].src, this.$global.prefix, '')
        _linkNode[i].removeAttribute('alt')
      }

      let _contents = this.$el.querySelectorAll('.ql-editor')
      this.noticeData.noticeContents = _contents[0].innerHTML
      this.noticeData.serviceBoard = 'NT'
      this.$parent.$emit('saveModal', this.noticeData, _listReg, _listImg)
    },

    saveModal () {
      this.registNoticeInfo()
    },

    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },

    replaceAll (str, searchStr, replaceStr) {
      return str.split(searchStr).join(replaceStr)
    }
  }
}
</script>

<style scoped>

</style>
