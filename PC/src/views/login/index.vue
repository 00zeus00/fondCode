<template>
  <div class="container">
    <div class="login-container">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <div class="title-container">
          <img class="logo" src="../../assets/logo2.png" alt="" />
          <img class="name" src="../../assets/name.png" alt="" />
          <!-- <h3 class="title">河钢数字积分商城</h3> -->
        </div>
        <el-form-item prop="account">
          <span class="svg-container">
            <svg-icon icon-class="users" />
          </span>
          <el-input
            ref="account"
            v-model="loginForm.account"
            placeholder="请输入用户名"
            name="account"
            type="text"
            tabindex="1"
            maxlength="20"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="suo" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            maxlength="20"
            auto-complete="off"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>
        <div class="remember">
          <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
          <el-link target="_blank" class="forget" @click="restPsw()"
            >重置密码？</el-link
          >
        </div>

        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 30px"
          @click.native.prevent="handleLogin"
        >
          {{ $t("login.logIn") }}
        </el-button>
      </el-form>
    </div>
    <div class="foot-container">
      <div class="text">河钢数字技术股份有限公司版权所有</div>
    </div>
  </div>
</template>

<script>
import { resetpassword } from "@/api/login";
// 引入base64
const Base64 = require("js-base64").Base64;
import Cookies from "js-cookie";
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入用户名"));
      } else if (value.length <= 0) {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else if (value.length < 6) {
        callback(new Error("密码为6-20位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        userId: "",
        account: "",
        password: "",
        remember: "",
      },
      loginRules: {
        account: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      List: {},
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getCookie();
    this.List =
      Cookies.get("loginUser") && JSON.parse(Cookies.get("loginUser"));
    // this.List = JSON.parse(Cookies.get("loginUser"));
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              console.log(2222);

              if (this.loginForm.remember) {
                // 传入账号名，密码，和保存天数7个参数
                Cookies.set("account", this.loginForm.account, { expires: 7 });
                Cookies.set("password", this.loginForm.password, {
                  expires: 7,
                });
                Cookies.set("remember", this.loginForm.remember, {
                  expires: 7,
                });
              }
              //  else {
              //   // 如果没有选中自动登录，那就清除cookie
              //   this.setCookie("", "", -1); // 修改2值都为空，天数为负1天就好了
              // }
              this.$router.push({ path: "/" });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getCookie() {
      const account = Cookies.get("account");
      const password = Cookies.get("password");
      const remember = Cookies.get("remember");
      this.loginForm = {
        account: account === undefined ? this.loginForm.account : account,
        password: password === undefined ? this.loginForm.password : password,
        remember: remember === undefined ? false : Boolean(remember),
      };
    },
    restPsw() {
      this.loginForm = {
        userId: this.List.userId,
        account: this.loginForm.account,
        password: "123456",
      };
      console.log(this.loginForm, this.List);
      resetpassword(this.loginForm)
        .then(async (res) => {
          if (res.success) {
            this.$message.success("操作成功");
            // await this.$store.dispatch("user/logout");
            // this.$router.push(`/login?redirect=${this.$route.fullPath}`);
          } else {
            this.$message.error("操作失败");
            console.log(err);
          }
        })
        .catch((err) => {
          this.$message.error("操作失败");
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-checkbox {
    color: #cfcdcd;
  }
  .el-link.el-link--default {
    color: #cfcdcd;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(14, 64, 104, 1);
    border-radius: 5px;
    color: #454545;
  }
  .svg-icon[data-v-c8a70580] {
    width: 1.2em;
    height: 1.2em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.container {
  background: url("../../assets/background2.png") 0 0 no-repeat;
  background-size: 100%;
  min-height: 100%;
  width: 100%;
  .login-container {
    // background: url("../../assets/background2.png") 0 0 no-repeat;
    // background-size: 100%;
    // min-height: 100%;
    width: 100%;
    // background-color: $bg;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .login-form {
      position: relative;
      width: 480px;
      padding: 20px 40px 0;
      margin-right: 10%;
      background-color: RGBA(4, 67, 120, 0.3);
      margin-top: 12%;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .logo {
        width: 47px;
        height: 38px;
        margin: 0px 0px 30px 50px;
      }
      .name {
        width: 60%;
        height: 70%;
        margin: 0px 50px 30px 0;
      }
      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px 0 30px -120px;
        // text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .remember {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      margin: 10px 5px;
      padding: 10px 0;
    }
  }
  .foot-container {
    color: #fff;
    display: flex !important;
    align-items: flex-end;
    justify-content: center;
    .text {
      font-size: 10px;
      margin-top: 16%;
      color: #cfcdcd;
      letter-spacing: 1px;
    }
  }
}
</style>
