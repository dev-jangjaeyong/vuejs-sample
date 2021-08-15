<template>
  <b-modal ref="eventModal" size="lg" hide-footer>
    <div slot="modal-title">이벤트 상세</div>
    <div>
      <b-form>
        <b-card-body class="pb-2 pt-1">

          <b-form-group label="분류" horizontal :label-cols="1">
            <b-input type="text" placeholder="분류" v-model="eventData.boardTyCdName" ref="boardTyCd" :readonly="true"/>
          </b-form-group>

          <b-form-group label="제목" horizontal :label-cols="1">
            <b-input type="text" placeholder="제목" v-model="eventData.title" ref="boardTitle" />
          </b-form-group>

          <b-form-group class="date">
            <div class="form-row">
              <div class="col-sm-6">
                <b-form-group label="시작일" horizontal :label-cols="2">
                  <datepicker
                    v-model="eventData.contentsStDt"
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
                <b-form-group label="종료일" horizontal :label-cols="2">
                  <datepicker
                    v-model="eventData.contentsEdDt"
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

          <b-form-group>
            <div class="form-row">
              <div class="col-sm-6">
                <b-form-group label="등록일" horizontal :label-cols="2">
                  <b-input type="text" v-model="eventData.createDt" :readonly="true"/>
                </b-form-group>
              </div>

              <div class="col-sm-6">
                <b-form-group label="수정일" horizontal :label-cols="2">
                  <b-input type="text" v-model="eventData.updateDt" :readonly="true"/>
                </b-form-group>
              </div>
            </div>
          </b-form-group>

          <b-form-group>
            <quill-editor ref="editor"
                          @ready="onEditorReady($event)"
                          v-model="eventData.contents"
                          :options="editorOptions"
                          v-if="!isIE10" />
            <!-- Fallback -->
          </b-form-group>
        </b-card-body>
        <div class="text-right mt-3">
          <b-btn class="float-left" variant="danger" v-if="eventData.boardNo" @click="deleteEventModal">삭제</b-btn>
          <b-btn variant="default" @click="closeEventModal">취소</b-btn>
          <b-btn variant="primary" v-if="eventData.boardNo" @click="eventSaveModal">수정</b-btn>
          <b-btn variant="primary" v-else @click="eventSaveModal">저장</b-btn>
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
  name: 'EventModal',

  components: {
    Datepicker,
    quillEditor: () => import('vue-quill-editor/dist/vue-quill-editor').then(m => m.quillEditor).catch(() => {})
  },

  created () {
    this.$EventBus.$on('event-modal', (item) => {
      this.eventData = item
      this.$refs.eventModal.show()
    })
    this.$EventBus.$on('event-modal-close', () => {
      this.$refs.eventModal.hide()
    })
    this.$on('eventSaveModal', this.eventSaveModal)
    this.$on('closeEventModal', this.closeEventModal)
    this.$on('deleteEventInfo', this.deleteEventInfo)
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
    eventData: []
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

      fileData.set('serviceBoard', this.eventData.serviceBoard)

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

    closeEventModal () {
      this.$refs.eventModal.hide()
    },

    deleteEventModal () {
      this.$parent.$emit('deleteEventInfo', this.eventData.boardNo)
    },

    registEventInfo () {
      let _listReg = []
      let _listImg = []
      let _linkNode = this.$el.querySelectorAll('.ql-container img')

      if (_linkNode.length < 1) {
        alert('컨텐츠에 이미지를 한 개 이상 등록해주세요.')
        return
      }

      for (let i = 0; i < _linkNode.length; i++) {
        _listReg[i] = _linkNode[i].alt
        _listImg[i] = this.replaceAll(_linkNode[i].src, this.$global.prefix, '')
        _linkNode[i].removeAttribute('alt')
      }

      let _contents = this.$el.querySelectorAll('.ql-editor')
      this.eventData.contents = _contents[0].innerHTML

      this.$parent.$emit('registEventInfo', this.eventData, _listReg, _listImg)
    },

    eventSaveModal () {
      this.registEventInfo()
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
