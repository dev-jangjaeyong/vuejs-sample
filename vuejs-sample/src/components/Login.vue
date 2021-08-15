<template>
  <div class="authentication-wrapper authentication-1 px-4">
    <div class="authentication-inner py-5">

      <!-- Logo -->
      <div class="d-flex justify-content-center align-items-center">
        <div>
          <div class="w-100 position-relative">
            <!--<svg class="w-100 h-100 position-absolute" viewBox="0 0 148 80" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient id="a" x1="46.49" x2="62.46" y1="53.39" y2="48.2" gradientUnits="userSpaceOnUse"><stop stop-opacity=".25" offset="0"></stop><stop stop-opacity=".1" offset=".3"></stop><stop stop-opacity="0" offset=".9"></stop></linearGradient><linearGradient id="e" x1="76.9" x2="92.64" y1="26.38" y2="31.49" xlink:href="#a"></linearGradient><linearGradient id="d" x1="107.12" x2="122.74" y1="53.41" y2="48.33" xlink:href="#a"></linearGradient></defs><path class="fill-primary" transform="translate(-.1)" d="M121.36,0,104.42,45.08,88.71,3.28A5.09,5.09,0,0,0,83.93,0H64.27A5.09,5.09,0,0,0,59.5,3.28L43.79,45.08,26.85,0H.1L29.43,76.74A5.09,5.09,0,0,0,34.19,80H53.39a5.09,5.09,0,0,0,4.77-3.26L74.1,35l16,41.74A5.09,5.09,0,0,0,94.82,80h18.95a5.09,5.09,0,0,0,4.76-3.24L148.1,0Z"></path><path transform="translate(-.1)" d="M52.19,22.73l-8.4,22.35L56.51,78.94a5,5,0,0,0,1.64-2.19l7.34-19.2Z" fill="url(#a)"></path><path transform="translate(-.1)" d="M95.73,22l-7-18.69a5,5,0,0,0-1.64-2.21L74.1,35l8.33,21.79Z" fill="url(#e)"></path><path transform="translate(-.1)" d="M112.73,23l-8.31,22.12,12.66,33.7a5,5,0,0,0,1.45-2l7.3-18.93Z" fill="url(#d)"></path></svg>-->
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="121px" height="47px" viewBox="0 0 121 47" enable-background="new 0 0 121 47" xml:space="preserve">  <image id="image0" width="121" height="47" x="0" y="0"
    href="data:image/png;base64,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" />
</svg>
          </div>
        </div>
      </div>
      <!-- / Logo -->

      <!-- Form -->
      <form class="my-5">
        <b-form-group label="ID">
          <b-input v-model="username" v-on:keyup.enter.native="loginSubmit(username, password, rememberMe)"></b-input>
        </b-form-group>
        <b-form-group>
          <div slot="label" class="d-flex justify-content-between align-items-end">
            <div>Password</div>
            <!--<a href="javascript:void(0)" class="d-block small">Forgot password?</a>-->
          </div>
          <b-input type="password" v-model="password" v-on:keyup.enter.native="loginSubmit(username, password, rememberMe)"></b-input>
        </b-form-group>

        <div class="d-flex justify-content-between align-items-center m-0">
          <!--<b-check v-model="rememberMe" class="m-0">Remember Me</b-check>-->
          <b-btn variant="primary" v-on:click="loginSubmit(username, password, rememberMe)">로그인</b-btn>
        </div>
      </form>
      <!-- / Form -->

      <!--<div class="text-center text-muted">
        Don't have an account yet? <a href="javascript:void(0)">Sign Up</a>
      </div>-->

    </div>
  </div>
</template>

<!-- Page -->
<style src="@/vendor/styles/pages/authentication.scss" lang="scss"></style>

<script>
export default {
  name: 'pages-authentication-login-v1',
  metaInfo: {
    title: '신규 2.0 - 관리자'
  },
  data: () => (
    {
      username: '',
      password: '',
      chnnlCode: 'ADM',
      userTyCd: '300',
      rememberMe: false
    }
  ),
  methods: {
    loginSubmit (username, password, rememberMe) {
      this.$session.start()
      let _chnnlCode = this.chnnlCode
      let _userTyCd = this.userTyCd
      this.$store.dispatch('LOGIN', {username, password, _chnnlCode, _userTyCd, rememberMe})
        .then(() => {})
        // .catch(({message}) => this.msg = message)
    },
    redirect () {
      // this.$router.push({path: '/dashboards/dashboard-1'})
    }
  },
  mounted () {
    this.$store.dispatch('LOGOUT_TRY_STATE', false)
  }
}
</script>
