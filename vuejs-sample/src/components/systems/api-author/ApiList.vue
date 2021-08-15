<template>
  <div>
    <div v-if="$parent.prmisnAuthorTyCd !== '200'" class="card text-center bg-transparent border-primary text-primary mt-4">
      <div class="card-body">
        개별 권한유형에만 API를 추가할 수 있습니다.
      </div>
    </div>
    <b-table v-if="$parent.prmisnAuthorTyCd === '200'"
             head-variant="dark"
             hover
             fixed
             class="text-center"
             :fields="fields"
             :items="apiListData"
             @row-clicked="rowClicked">
      <template slot="HEAD_selected" slot-scope="data">
        <i class="ion d-block ion-ios-checkbox h4 m-0"></i>
      </template>
          <template slot="selected" slot-scope="data">
          <b-form-checkbox disabled=disabled v-model="data.item.selected"></b-form-checkbox>
      </template>
    </b-table>
    <b-card-footer>
      <div class="text-right">
        <b-btn variant="primary" v-if="$parent.prmisnAuthorTyCd === '200'" @click="save">저장</b-btn>
      </div>
    </b-card-footer>
  </div>
</template>

<style src="@/vendor/libs/vue-jstree/vue-jstree.scss" lang="scss"></style>

<script>
export default {
  name: 'ApiList',
  props: ['apiListData'],
  created () {
  },
  data () {
    return {
      fields: [{
        key: 'selected',
        label: '',
        tdClass: 'cursor-pointer'
      }, {
        key: 'apiName',
        label: 'API명',
        tdClass: 'cursor-pointer'
      }, {
        key: 'apiUrl',
        label: 'API URL',
        tdClass: 'cursor-pointer'
      }, {
        key: 'methodName',
        label: 'Method',
        tdClass: 'cursor-pointer'
      }]
    }
  },
  methods: {
    rowClicked (item, index, event) {
      item.selected = !item.selected
    },

    save () {
      if (confirm('API권한을 저장하시겠습니까?')) {
        this.$parent.$emit('save', this.getRequestApiAuthors())
      }
    },

    getRequestApiAuthors () {
      let requestParams = []

      this.apiListData.forEach(r => {
        let param = {
          authorNo: this.$parent.authorNo,
          apiNo: r.apiNo,
          selected: r.selected
        }
        console.log(param)

        requestParams.push(param)
      })

      return requestParams
    }
  }
}
</script>

<style scoped>

</style>
