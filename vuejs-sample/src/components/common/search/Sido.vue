<template>
  <div class="col-md mb-4 form-row">
    <div class="col-12">
      <b-form-group v-bind:label="title">
        <b-form-select v-model="sidoCode" :options="sidoOptions">
          <template slot="first">
            <option value="">전체</option>
          </template>
        </b-form-select>
      </b-form-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidoArea',
  created () {
    this.sidoCode = ''
    this.loadSidoCode()
  },
  props: {
    sidoOptions: {
      type: [Array, Object]
    },
    title: {
      type: String
    }
  },
  data () {
    return {
      currentSidoCode: this.sidoCode
    }
  },
  computed: {
    sidoCode: {
      get () { return this.currentSidoCode },
      set (value) {
        this.currentSidoCode = value
      }
    }
  },

  methods: {
    loadSidoCode () {
      const parameter = '?codeLv2=AREA&lv=3'
      this.loadCombo(parameter, 'sidoOptions')
    },

    loadCombo (parameter, type) {
      this.$http.get(`/code/combo${parameter}`)
        .then(
          (result) => {
            this.$parent[type] = this.$parent.$commons.clone(result.data['resultList'])
          }
        )
    }
  }
}
</script>

<style scoped>

</style>
