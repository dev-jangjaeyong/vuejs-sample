<template>
  <b-card-body class="pt-0 pb-3">
    <div class="row">
      <div class="col-sm sm-3 col-xl-2 text-sm-left text-center pt-3">
        <span class="text-muted" v-if="totalSize">Page {{ currentPage }} of {{ getTotalPage }}</span>
      </div>
      <div class="col-sm sm-6 text-sm-center text-left pt-3">
        <b-pagination
          v-if="totalSize"
          v-model="currentPage"
          size="sm"
          align="right"
          :total-rows="totalSize"
          :per-page="perPage"
          @change="changePaging"></b-pagination>
      </div>
    </div>
  </b-card-body>
</template>

<script>
export default {
  name: 'Pagination',

  props: {
    totalSize: {
      type: Number,
      default () { return 0 }
    },
    currentPage: {
      type: Number,
      default () { return 1 }
    },
    perPage: {
      type: Number,
      default () { return 20 }
    }
  },

  computed: {
    getTotalPage () {
      return Math.ceil(this.totalSize / this.perPage)
    }
  },

  methods: {
    changePaging (page) {
      this.$parent.$emit('changePaging', page)
    }
  }
}
</script>

<style scoped>

</style>
