<template>
  <sidenav :orientation="orientation" :class="curClasses">
    <div class="sidenav-inner" :class="{ 'py-1': orientation !== 'horizontal' }">
      <sidenav-menu v-for="menu in menuList" :key="menu.menuNo" v-if="menu.menuTyCd === '100'" icon="ion ion-ios-folder-open" :active="isMenuActive(menu.menuUrl)" :open="isMenuOpen(menu.menuUrl)">
        <template slot="link-text">{{menu.menuName}}</template>
        <template v-if="menu.children.length > 0 && child.menuTyCd === '200'" v-for="child in menu.children">
          <sidenav-menu :key="child.menuNo" icon="ion ion-md-speedometer" :active="isMenuActive(child.menuUrl)" :open="isMenuOpen(child.menuUrl)">
            <template slot="link-text">{{child.menuName}}</template>
            <template v-if="child.children.length > 0" v-for="deepChild in child.children">
              <sidenav-router-link v-if="deepChild.menuTyCd === '300'" :key="deepChild.menuNo" :to="`${deepChild.menuUrl}`" :exact="true" :icon="'ion ion-md-speedometer'">
                {{deepChild.menuName}}
              </sidenav-router-link>
            </template>
          </sidenav-menu>
          <!--<sidenav-router-link v-if="child.menuUrl !== '' && child.menuUrl !== null" :key="child.menuNo" :to="child.menuUrl" :exact="true" :icon="'ion ion-ios-settings'">
            {{child.menuName}}
          </sidenav-router-link>-->
        </template>
      </sidenav-menu>
    </div>
  </sidenav>
</template>

<script>
import {Sidenav, SidenavBlock, SidenavDivider, SidenavHeader, SidenavLink, SidenavMenu, SidenavRouterLink} from '@/vendor/libs/sidenav'

export default {
  name: 'app-layout-sidenav',
  components: {
    Sidenav,
    SidenavLink,
    SidenavRouterLink,
    SidenavMenu,
    SidenavHeader,
    SidenavBlock,
    SidenavDivider
  },

  data () {
    return {
      menuList: []
    }
  },

  props: {
    orientation: {
      type: String,
      default: 'vertical'
    }
  },

  beforeCreate () {
    this.$http.get('/menu')
      .then(
        (result) => {
          this.menuList = result.data.resultList
        }
      )
  },

  computed: {
    curClasses () {
      let bg = this.layoutSidenavBg

      if (this.orientation === 'horizontal' && (bg.indexOf(' sidenav-dark') !== -1 || bg.indexOf(' sidenav-light') !== -1)) {
        bg = bg
          .replace(' sidenav-dark', '')
          .replace(' sidenav-light', '')
          .replace('-darker', '')
          .replace('-dark', '')
      }

      return `bg-${bg} ` + (
        this.orientation !== 'horizontal'
          ? 'layout-sidenav'
          : 'layout-sidenav-horizontal container-p-x flex-grow-0'
      )
    }
  },

  methods: {
    isMenuActive (url) {
      return url !== undefined && url !== null && url !== '' && this.$route.path.indexOf(url) === 0
    },

    isMenuOpen (url) {
      return url !== null && url !== '' && this.$route.path.indexOf(url) === 0 && this.orientation !== 'horizontal'
    },

    toggleSidenav () {
      this.layoutHelpers.toggleCollapsed()
    }
  }
}
</script>
