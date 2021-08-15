<template>
  <moon-loader v-if="loader === 'moon'" :loaderName="loader" :loading="loading" class="d-inline-block"></moon-loader>
</template>

<script>
export default {
  name: 'MoonLoading',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    loader: {
      type: String,
      default: 'moon'
    }
  },
  data () {
    return {
      currentIsLoading: this.loading
    }
  }
}
</script>

<style scoped>

</style>
