
<div id="app">
  Parent counter : {{ $carCodeStore.state.counter }} <br />
  <button @click="addCounter">+</button>
  <button @click="subCounter">-</button>

  <!-- 기존 코드 -->
  <!-- <child v-bind:num="counter"></child> -->
  <child></child>
</div>
<script>
    // App.vue(Parent)
    import Child from "./Child.vue";

    export default {
        components: {
            child: Child
        },
        // 기존 코드
        // data () {
        //   return {
        //     counter: 0
        //   }
        // },
        methods: {
            addCounter() {
                this.$carCodeStore.state.counter++;
            },
            subCounter() {
                this.$carCodeStore.state.counter--;
            }
        }
    };
</script>
