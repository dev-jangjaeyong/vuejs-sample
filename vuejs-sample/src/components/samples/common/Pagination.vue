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
          align="center"
          :total-rows="totalSize"
          :per-page="perPage"
          @change="change"></b-pagination>
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
    perPage: {
      type: Number,
      default () { return 10 }
    }
  },
  data: () => ({
    currentPage: 1
  }),
  computed: {
    getTotalPage () {
      return Math.ceil(this.totalSize / this.perPage)
    }
  },
  watch: {
    currentPage (val) {
      // b-pagination 할 때
      this.$parent.changePaging(val)
      // this.$emit('change-paging', val)
    }
  },
  methods: {
    change (page) {
      // custom Pagination 할 때
      console.log(page)
      // this.$emit('change-paging', page)
    }
  },
  components: {
    // Paginate
  }
}
</script>

<style scoped>

</style>
