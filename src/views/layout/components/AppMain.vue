<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view v-if="isRoute" :key="key"/>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data () {
    return{
      isRoute: true,
      cachedViews: []
    }
  },
  computed: {
    key() {
      return this.$route.fullPath
    }
  },
  watch: {
    '$route': 'resizeDom'
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

<style scoped>
.app-main {
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>

