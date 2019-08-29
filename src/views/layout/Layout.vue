<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>

    <!--<admin-nav></admin-nav>-->
    <!--<admin-side></admin-side>-->
<!--&lt;!&ndash;&ndash;&gt;-->
    <!--<sidebar class="sidebar-container" />-->
    <!--<div class="main-container">-->
      <!--<navbar/>-->
      <!--&lt;!&ndash;<navbar/>&ndash;&gt;-->
      <!--&lt;!&ndash;<admin-nav></admin-nav>&ndash;&gt;-->
      <!--&lt;!&ndash;<admin-nav></admin-nav>&ndash;&gt;-->
      <!--&lt;!&ndash;<tags-view/>&ndash;&gt;-->
      <!--<app-main/>-->
    <!--</div>-->
    <app-main/>
  </div>
</template>

<script>
  // Navbar,
import { AppMain} from './components'
import ResizeMixin from './mixin/ResizeHandler'
export default {
  name: 'Layout',
  components: {
    AppMain,
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    }
  },
  mounted () {
    $('body').resize();
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/styles/mixin.scss';
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
