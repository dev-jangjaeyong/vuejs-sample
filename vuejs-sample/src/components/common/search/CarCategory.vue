<template>
    <div class="col-md mb-2">
      <b-form-group label="카테고리">
        <b-form-select v-model="cateCode" :options="cateOptions" v-on:change="changeCategory">
          <template slot="first">
            <option value="">전체</option>
          </template>
        </b-form-select>
      </b-form-group>
    </div>
</template>

<script>
export default {
  name: 'CarCategory',
  created () {
    this.cateCode = ''
    this.loadCateCode()
  },
  props: {
    cateOptions: {
      type: [Array, Object]
    }
  },
  data () {
    return {
      currentCateCode: this.cateCode
    }
  },
  computed: {
    cateCode: {
      get () { return this.currentCateCode },
      set (value) {
        this.currentCateCode = value
      }
    }
  },

  methods: {
    loadCateCode () {
      const parameter = '?codeLv2=CAR_CATEGORY&lv=3'
      this.loadCombo(parameter, 'cateOptions')
    },

    changeCategory (e) {
      this.$parent.$emit('changeCateCode', e)
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
