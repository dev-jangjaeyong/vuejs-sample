<template>
  <div>
    <b-card header="Vue Simplemde Sample" header-tag="h6" class="mb-4">
      <markdown-editor v-model="content" :configs="configs"></markdown-editor>
      <pre class="mt-4"><strong>Content:</strong><br>{{ content }}</pre>
    </b-card>

    <b-card no-body header="Vue Quill Editor" header-tag="h6" class="mb-4">
      <b-card-body>
        <quill-editor v-model="editorContent" :options="editorOptions" />
        <pre class="mt-4"><strong>Content:</strong><br>{{ editorContent }}</pre>
      </b-card-body>
      <!--<hr class="m-0">-->
      <!--<b-card-body>-->
        <!--<div class="text-light small font-weight-semibold mb-3">Bubble</div>-->

        <!--<quill-editor v-model="bubbleEditorContent" :options="bubbleEditorOptions" />-->
        <!--<pre class="mt-4"><strong>Content:</strong><br>{{bubbleEditorContent}}</pre>-->
      <!--</b-card-body>-->
    </b-card>
  </div>
</template>

<style src="simplemde/dist/simplemde.min.css" />
<style src="@/vendor/libs/vue-simplemde/vue-simplemde.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-quill-editor/typography.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-quill-editor/editor.scss" lang="scss"></style>

<script>
import markdownEditor from 'vue-simplemde/src/markdown-editor'

export default {
  name: 'InqueryList',
  data: () => ({
    content: '### title\ncontent',
    configs: {
      spellChecker: false
    },

    editorContent: '',
    bubbleEditorContent: '',
    editorOptions: {
      modules: {
        toolbar: [
          [{'header': [1, 2, 3, 4, 5, 6, false]}, {'font': []}, {'size': []}],
          ['bold', 'italic', 'underline', 'strike'],
          [{'color': []}, {'background': []}],
          [{'script': 'sub'}, {'script': 'super'}],
          ['blockquote', 'code-block'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          [{'direction': 'rtl'}, {'align': []}],
          ['link', 'image', 'video'],
          ['clean']
        ]
      }
    }
  }),
  components: {
    markdownEditor,
    quillEditor: () => import('vue-quill-editor/dist/vue-quill-editor').then(m => m.quillEditor).catch(() => {})
  }
}
</script>

<style scoped>

</style>
