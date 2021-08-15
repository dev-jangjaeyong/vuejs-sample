<template>
  <nav class="layout-footer footer" :class="getLayoutFooterBg()">
    <div class="container-fluid d-flex flex-wrap justify-content-between text-center container-p-x pb-3">
      <div class="pt-3">비즈인포그룹</div>
      <div>
        <!--<a href="#" class="footer-link pt-3">Link 1</a>-->
        <!--<a href="#" class="footer-link pt-3 ml-4">Link 2</a>-->
      </div>
    </div>

  </nav>
</template>

<script>
export default {
  name: 'app-layout-footer',

  methods: {
    getLayoutFooterBg () {
      return `bg-${this.layoutFooterBg}`
    }
  }
}
</script>
