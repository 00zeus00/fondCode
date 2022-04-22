<template>
  <el-upload
    id="ab"
    list-type="picture"
    class="avatar-uploader"
    :action="uploadUrl"
    :headers="headers"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <!--   :on-error="err" -->
    <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
    <!-- <el-button size="small" type="primary">点击上传</el-button> -->

    <!-- <el-img v-if="imageUrl" :src="imageUrl" class="avatar"> -->

    <img v-if="imageUrl" :src="imageUrl" class="avatar" />

    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
/**
 * 头像上传组件（只支持上传一张图片）
 */
// import { getToken } from "@/util/auth";
import { getToken } from "@/utils/auth"; // get token from cookie
// import website from "@/config/website";
// import { Base64 } from "js-base64";
import { addPicture } from "@/api/award";
export default {
  props: ["ids"],
  name: "UploadAvatar",
  data() {
    return {
      pid: this.ids,
      uploadUrl: "/dev-api/PictureInformation/add",
      // uploadUrl: "/stage-api/PictureInformation/add",
      headers: {
        Authorization: getToken(),
      },
      // headers: {
      //   Authorization: `Basic ${Base64.encode(
      //     `${website.clientId}:${website.clientSecret}`
      //   )}`,
      //   "Blade-Auth": "bearer " + getToken(),
      // },
      imageUrl: "",
      avatar: null,
    };
  },
  created() {},
  methods: {
    // uploadUrl(file) {
    //   const hasToken = getToken();
    //   addPicture(file);
    // },
    // err(code) {
    //   if (code.status && code.status == "401") {
    //     this.$message.error("登录超时，请重新登录!");
    //     this.$store.dispatch("FedLogOut").then(() => {
    //       this.$router.push({ path: "/login" });
    //     });
    //   }

    //   if (code.code && code.code == "401") {
    //     this.$message.error("登录超时，请重新登录!");
    //     this.$store.dispatch("FedLogOut").then(() => {
    //       this.$router.push({ path: "/login" });
    //     });
    //   }
    // },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.avatar = res.data;
      this.$emit("callbackFunction", this.avatar);
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type == "image/jpeg" || file.type == "image/png";

      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG或PNG 格式!");
      } else if (!isLt10M) {
        this.$message.error("上传头像图片大小不能超过 10MB!");
      }
      return isJPG && isLt10M;
    },
    clearFiles() {
      this.avatar = [];
      this.imageUrl = "";
    },

    // 获取上传图片列表
    getFileList() {
      return this.avatar !== "" ? this.avatar : "";
    },

    // 设置上传图片列表
    setFileList(avatar) {
      if (avatar) {
        this.avatar = avatar[0];
        this.imageUrl = this.avatar.url;
      } else {
        this.avatar = [];
        this.imageUrl = "";
      }
    },
  },
};
</script>

<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
