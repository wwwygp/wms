<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default{
  name: 'App',
  data() {
    return{
      isRoute: true
    }
  },
  watch: {
    '$route': 'resizeDom'
  },
  mounted () {
    // $('#app').resize();
  },
  methods: {
    resizeDom () {
      this.isRoute = false;
      this.$nextTick(() => {
        this.isRoute = true;
      })
      // $('body')[0].resize();
    }
  }
}
</script>
