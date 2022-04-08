<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="right-container" trigger="click">
        <div class="right-wrapper">
          <span class="username">欢迎管理员！</span>
          <el-button type="danger" class="outlogin" size="mini" @click="logout"
            >退出</el-button
          >
        </div>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    return {
      activeIndex: "1",
    };
  },
  computed: {
    ...mapGetters(["sidebar", "name", "infornum"]),
  },
  methods: {
    gopath(path) {
      console.log("path==", path);
      this.$router.push({ path });
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    logout() {
      this.$confirm("是否退出登录？", "退出", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {
          await this.$store.dispatch("user/logout");
          this.$router.push(`/login?redirect=${this.$route.fullPath}`);
        })
        .catch(() => {
          //取消
        });
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .left-menu {
    float: left;
    height: 100%;
  }

  .right-menu {
    float: right;
    // height: 100%;
    // line-height: 50px;
    display: flex;
    align-items: center;
    &:focus {
      outline: none;
    }
    .el-badge {
      position: relative;
      vertical-align: middle;
      display: inline-block;
      height: 10px;
      margin-right: 20px;
      cursor: pointer;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .right-container {
      margin-right: 30px;

      .right-wrapper {
        margin-top: 12px;
        position: relative;
        display: flex;
        align-items: center;
        cursor: pointer;
        .username {
          margin: 0 10px;
        }
      }
    }
  }
}
</style>
