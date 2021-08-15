<template>
  <div class="col-md mb-2 form-row">
    <div class="col-3">
      <b-form-group label="시도">
        <b-form-select v-model="sidoCode" :options="sidoOptions" v-on:change="changeSido">
          <template slot="first">
            <option value="">전체</option>
          </template>
        </b-form-select>
      </b-form-group>
    </div>
    <div class="col-3">
      <b-form-group label="지역">
        <b-form-select v-model="areaCode" :options="areaOptions" v-on:change="changeArea">
          <template slot="first">
            <option value="">전체</option>
          </template>
        </b-form-select>
      </b-form-group>
    </div>
    <div class="col-3">
      <b-form-group label="단지">
        <b-form-select v-model="danjiCode" :options="danjiOptions" v-on:change="changeDanji">
          <template slot="first">
            <option value="">전체</option>
          </template>
        </b-form-select>
      </b-form-group>
    </div>
    <!--    <div class="col-3">-->
    <!--      <b-form-group label="상사">-->
    <!--        <b-form-select v-model="shopCode" :options="shopOptions" v-on:change="changeShop">-->
    <!--          <template slot="first">-->
    <!--            <option value="">전체</option>-->
    <!--          </template>-->
    <!--        </b-form-select>-->
    <!--      </b-form-group>-->
    <!--    </div>-->
  </div>
</template>

<script>
    export default {
        name: 'SidoArea',
        created() {
            this.sidoCode = '';
            this.areaCode = '';
            this.danjiCode = '';
            this.loadSidoCode()
        },
        props: {
            sidoOptions: {
                type: [Array, Object]
            },
            areaOptions: {
                type: [Array, Object]
            },
            danjiOptions: {
                type: [Array, Object]
            }
        },
        data() {
            return {
                currentSidoCode: this.sidoCode,
                currentAreaCode: this.areaCode
            }
        },
        computed: {
            sidoCode: {
                get() {
                    return this.currentSidoCode
                },
                set(value) {
                    this.currentSidoCode = value
                    this.currentAreaCode = ''
                }
            },
            areaCode: {
                get() {
                    return this.currentAreaCode
                },
                set(value) {
                    this.currentAreaCode = value
                }
            }
        },

        methods: {
            loadSidoCode() {
                const parameter = '?codeLv2=AREA&lv=3';
                this.loadCombo(parameter, 'sidoOptions');
            },

            changeSido(e) {
                this.$parent.$emit('changeSido', e);
                this.$parent.$emit('changeArea', '');
                this.loadAreaCode(e);
            },

            changeArea(e) {
                this.$parent.$emit('changeArea', e);
                this.$parent.$emit('changeDanji', '');
                this.loadDanjiCode(e);
            },

            changeDanji(e) {

              this.$parent.$emit('changeDanji', e);
            },
            loadAreaCode: function (e) {
                const parameter = `?codeLv2=AREA&lv=4&codeLv3=${e}`;
                this.loadCombo(parameter, 'areaOptions');
            },
            loadDanjiCode: function (e) {
                const parameter = `?codeLv2=AREA&lv=4&codeLv3=${e}`;
                this.loadCombo(parameter, 'areaOptions');
            },
            loadCombo(parameter, type) {
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
