<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img
          v-if="logo"
          src="../../../assets/logo2.png"
          class="sidebar-logo"
          @click="company('http://www.hbisdt.com/')"
        />
        <h1
          v-else
          class="sidebar-title"
          @click="company('http://www.hbisdt.com/')"
        >
          {{ title }}
        </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img
          v-if="logo"
          src="../../../assets/logo2.png"
          class="sidebar-logo"
          @click="company('http://www.hbisdt.com/')"
        />
        <h1 class="sidebar-title" @click="company('http://www.hbisdt.com/')">
          {{ title }}
        </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      title: "河钢数字积分商城",
      logo: "https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png",
    };
  },
  methods: {
    // logo链接
    company(url) {
      window.open(url, "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  // text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    & .sidebar-logo {
      width: 26px;
      height: 26px;
      vertical-align: middle;
      margin-right: 6px;
      margin-left: 15px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      letter-spacing: 2px;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
