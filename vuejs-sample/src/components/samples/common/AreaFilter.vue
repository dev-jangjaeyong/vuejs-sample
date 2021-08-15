<template>
  <div class="ui-bordered px-4 pt-4 mb-4">
    <div class="form-row align-items-center">
      <div class="col-md mb-4">
        <label class="form-label">시도</label>
        <b-select value-field="codeValue" v-model="selected.sidoCode" :options="areaCodes.sidoCodes" @input="setCityCodes">
          <template slot="first">
            <option :value="null" disabled>시도 선택</option>
            <option value="">전체</option>
          </template>
        </b-select>
      </div>
      <div class="col-md mb-4">
        <label class="form-label">지역</label>
        <b-select value-field="codeValue" v-model="selected.cityCode" :options="areaCodes.cityCodes" @input="setDanjiCodes">
          <template slot="first">
            <option :value="null" disabled>지역 선택</option>
            <option value="">전체</option>
          </template>
        </b-select>
      </div>
      <div class="col-md mb-4">
        <label class="form-label">단지</label>
        <b-select value-field="codeValue" v-model="selected.danjiCode" :options="areaCodes.danjiCodes">
          <template slot="first">
            <option :value="null" disabled>단지 선택</option>
            <option value="">전체</option>
          </template>
        </b-select>
      </div>
      <div class="col-md col-xl-2 mb-4">
        <label class="form-label d-none d-md-block">&nbsp;</label>
        <b-btn variant="secondary" :block="true">검색</b-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AreaFilter',
  data: () => ({
    selected: {
      sidoCode: 'null',
      cityCode: 'null',
      danjiCode: 'null'
    },

    areaCodes: {
      sidoCodes: [],
      cityCodes: [],
      danjiCodes: []
    }
  }),
  created () {
    this.getAreaCodes()
  },
  methods: {
    getAreaCodes () {
      let params = '?upCodeNo=1005'

      let url = `/code ${params}`

      this.$http.get(url)
        .then(
          (result) => {
            this.setSidoCodes(result.data.resultList)
          }
        )
    },

    setSidoCodes (_data) {
      this.areaCodes.sidoCodes = _data
    },

    setCityCodes () {
      let sidoCode = this.selected.sidoCode

      if (sidoCode) {
        let cites = this.areaCodes.sidoCodes.filter(function (sidos) { return sidos.codeValue === sidoCode })[0]

        this.areaCodes.cityCodes = cites.children
      }
    },

    setDanjiCodes (_this) {

    }
  }
}
</script>

<style scoped>

</style>
