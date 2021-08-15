<template>
  <div class="layout-wrapper layout-1">
    <div class="layout-inner">
      <app-layout-navbar />

      <div class="layout-container">
        <app-layout-sidenav />

        <div class="layout-content">
          <div class="router-transitions container-fluid flex-grow-1 container-p-y">
            <router-view ref="routerView"/>
          </div>

          <app-layout-footer />
        </div>
      </div>
    </div>
    <div class="layout-overlay" @click="closeSidenav"></div>

    <BlockUI message="" v-if="loading">
      <div class="sk-folding-cube sk-primary"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div>
      <h5 class="text-center mb-0">LOADING...</h5>
    </BlockUI>
  </div>
</template>

<style src="@/vendor/libs/spinkit/spinkit.scss" lang="scss"></style>

<style>
  .loading-container .loading-backdrop {
    background: #fff !important;
    opacity: .7 !important;
  }
  .loading-container .loading {
    background: none !important;
    box-shadow: none !important;
  }
</style>

<script>
import LayoutNavbar from './LayoutNavbar'
import LayoutSidenav from './LayoutSidenav'
import LayoutFooter from './LayoutFooter'

export default {
  name: 'app-layout-1',
  components: {
    'app-layout-navbar': LayoutNavbar,
    'app-layout-sidenav': LayoutSidenav,
    'app-layout-footer': LayoutFooter
  },

  data () {
    return {
      loading: false
    }
  },

  mounted () {
    window.routerView = this.$refs.routerView
    this.layoutHelpers.init()
    this.layoutHelpers.update()
    this.layoutHelpers.setAutoUpdate(true)
  },

  beforeDestroy () {
    this.layoutHelpers.destroy()
  },

  methods: {
    closeSidenav () {
      this.layoutHelpers.setCollapsed(true)
    }
  }
}
</script>
