<template>
  <b-navbar toggleable="lg" :variant="getLayoutNavbarBg()" class="layout-navbar align-items-lg-center container-p-x">

    <!-- Brand -->
    <b-navbar-brand to="/home">비즈인포그룹 관리자</b-navbar-brand>
    <a class="nav-item nav-link px-0 ml-2 ml-lg-0" href="javascript:void(0)" @click="toggleSidenav" style="color:#a3a4a6">
      <i class="ion ion-md-menu text-large align-middle" />
    </a>
    <!-- Sidenav toggle -->
    <b-navbar-nav class="navbar-nav align-items-lg-center ml-auto" v-if="sidenavToggle">
      <!-- Divider -->
      <b-collapse is-nav id="app-layout-navbar">
        <b-navbar-nav class="align-items-lg-center">
          <!--<b-nav-item href="#">Link 1</b-nav-item>-->
          <!--<b-nav-item href="#">Link 2</b-nav-item>-->
        </b-navbar-nav>
      </b-collapse>

      <div class="nav-item d-none d-lg-block text-big font-weight-light line-height-1 opacity-25 mr-3 ml-1">|</div>

      <b-nav-item-dropdown :right="!isRTL" class="demo-navbar-user">
        <template slot="button-content">
          <span class="d-inline-flex flex-lg-row-reverse align-items-center align-middle">
            <img src="/static/img/avatars/1.png" alt class="d-block ui-w-30 rounded-circle">
            <span class="px-1 mr-lg-2 ml-2 ml-lg-0">{{userName}}</span>
          </span>
        </template>
        <!--
        <b-dd-item><i class="ion ion-ios-person text-lightest"></i> &nbsp; 내정보</b-dd-item>
        <b-dd-item><i class="ion ion-md-settings text-lightest"></i> &nbsp; 계정관리</b-dd-item>
        <b-dd-divider></b-dd-divider>
        -->
        <b-dd-item v-on:click="logoutSubmit()"><i class="ion ion-ios-log-out text-danger" ></i> &nbsp; Log Out</b-dd-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>

    <!-- Navbar toggle -->
    <b-navbar-toggle target="app-layout-navbar"></b-navbar-toggle>

  </b-navbar>
</template>

<script>
export default {
  name: 'app-layout-navbar',
  data () {
    return this.$store.getters.getAccessToken
  },
  props: {
    sidenavToggle: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    logoutSubmit () {
      this.$session.destroy()
      this.$store.dispatch('LOGOUT')
        .then(() => this.redirect())
      // .catch(({message}) => this.msg = message)
    },
    redirect () {
      this.$router.push({path: '/'})
    },
    toggleSidenav () {
      this.layoutHelpers.toggleCollapsed()
    },
    getLayoutNavbarBg () {
      return this.layoutNavbarBg
    },
    navUserinfo () {
      // console.log(this.$store.getters.getAccessToken)
      this.user = this.$store.getters.getAccessToken
    }
  }
}
</script>
