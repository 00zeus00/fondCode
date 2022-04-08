<template>
  <el-container>
    <!-- main-主体区域 -->
    <el-main>
      <!-- header-搜索栏区域 -->
      <el-header class="header">
        <!-- <el-button type="primary" class="new" @click="opendialog('1')"
          >新增</el-button
        > -->
        <!-- <el-button
          type="danger"
          class="delete"
          :plain="true"
          @click="handleAllDelete"
          >删除</el-button
        > -->
        <el-container class="check">
          <el-form label-width="80px" :model="queryParams">
            <el-form-item label="角色名称" prop="name">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入角色名称"
              ></el-input>
            </el-form-item>
          </el-form>
          <!-- @click="search" -->
          <el-button class="search" type="primary" icon="el-icon-search"
            >查询</el-button
          >
          <el-button type="info" icon="el-icon-search" @click="reset"
            >重置</el-button
          >
        </el-container>
      </el-header>
      <!-- table-表格区域 -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        :border="true"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column
          type="selection"
          label="全选"
          align="center"
          width="55"
        >
        </el-table-column> -->
        <el-table-column prop="userId" label="序号" align="center" width="500">
        </el-table-column>
        <el-table-column
          prop="realName"
          label="用户名"
          show-overflow-tooltip
          align="center"
          width="500"
        >
        </el-table-column>
        <el-table-column
          prop="account"
          label="账号"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <!-- <el-table-column prop="password" label="密码" align="center">
        </el-table-column> -->

        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              class="change"
              @click="opendialog('2', scope.row)"
              >修改</el-button
            >
            <!-- <el-button
              type="danger"
              size="mini"
              :plain="true"
              @click="handleDelete(scope.row.userId)"
              >删除</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.currentPage"
        :page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 30]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 弹框 -->
      <el-dialog
        :title="status == '1' ? '新增角色信息' : '修改角色信息'"
        :visible.sync="dialogFormVisible"
      >
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item
            label="账号"
            prop="account"
            :label-width="formLabelWidth"
          >
            <el-input
              ref="account"
              v-model="form.account"
              placeholder="请输入账号"
              name="account"
              type="text"
              autocomplete="off"
            />
          </el-form-item>

          <el-form-item
            label="旧密码"
            prop="password"
            :label-width="formLabelWidth"
          >
            <el-input
              :key="passwordType"
              ref="password"
              v-model="form.password"
              :type="passwordType"
              placeholder="请输入旧密码"
              name="password"
              tabindex="2"
              maxlength="20"
              autocomplete="off"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>
          <el-form-item
            label="新密码"
            prop="newPassword"
            :label-width="formLabelWidth"
          >
            <el-input
              :key="passwordNewType"
              ref="newPassword"
              v-model="form.newPassword"
              :type="passwordNewType"
              placeholder="请输入新密码"
              name="newPassword"
              tabindex="2"
              maxlength="20"
              autocomplete="off"
            />
            <span class="show-pwd" @click="showNewPwd">
              <svg-icon
                :icon-class="
                  passwordNewType === 'password' ? 'eye' : 'eye-open'
                "
              />
            </span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="status == '1' ? submitForm('form') : updateForm('form')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import { getAllData, updateAdmin } from "@/api/admin";
export default {
  data() {
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
      status: 1,
      queryParams: {
        userId: null,
        account: null,
        realName: null,
        password: null,
        currentPage: 1,
        pageSize: 10,
      },

      tableData: [],
      index_x: [],
      total: null,
      // 弹框
      dialogFormVisible: false,
      form: {
        realName: "",
        account: "",
        password: "",
        newPassword: "",
      },
      formLabelWidth: "80px",
      multipleSelection: [], //多选
      passwordType: "password",
      passwordNewType: "password",
      rules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [
          {
            required: true,
            trigger: "blur",
            validator: validatePassword,
          },
        ],
        newPassword: [
          {
            required: true,
            trigger: "blur",
            validator: validatePassword,
          },
        ],
      },
    };
  },

  mounted() {
    this.getList();
  },
  methods: {
    // // 获得全部数据
    getList() {
      getAllData(this.queryParams)
        .then((res) => {
          console.log(res);
          if (res.success == true) {
            this.tableData = res.data.rows;
            this.total = res.data.totalRows * 1;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //搜索
    search() {
      this.getList();
    },
    // 重置
    reset() {
      this.queryParams = {
        title: null,
        feedbackType: null,
        dateTime: null,
        currentPage: 1,
        pageSize: 10,
      };
      this.getList();
    },
    // 弹窗状态切换
    opendialog(status, row) {
      this.dialogFormVisible = true;
      this.status = status;
      this.form = {
        name: "",
        password: "",
      };
      if (status == "2") {
        this.form = row;
      }
    },
    // 新增
    // submitForm(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       addAdmin(this.form).then((res) => {
    //         console.log(res);
    //         if (res.success) {
    //           this.$message({
    //             type: "success",
    //             message: "提交成功!",
    //           });
    //           this.$refs.form.resetFields();
    //           this.dialogFormVisible = false;
    //           this.getList();
    //         } else {
    //         }
    //       });
    //     } else {
    //       return false;
    //     }
    //   });
    // },
    updateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateAdmin(this.form).then(async (res) => {
            console.log(res);
            this.$message({
              type: "success",
              message: "修改成功!",
            });
            this.$refs.form.resetFields();
            this.dialogFormVisible = false;
            await this.$store.dispatch("user/logout");
            this.$router.push(`/login?redirect=${this.$route.fullPath}`);
          });
        } else {
          return false;
        }
      });
    },
    // 弹窗中密码
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
    showNewPwd() {
      if (this.passwordNewType === "password") {
        this.passwordNewType = "";
      } else {
        this.passwordNewType = "password";
      }
      this.$nextTick(() => {
        this.$refs.newPassword.focus();
      });
    },
    // // 单个删除
    // handleDelete(userId) {
    //   console.log(userId);
    //   this.$confirm("是否确认删除用户吗?", "警告", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   }).then(() => {
    //     deleteSuggestion({ tid: userId })
    //       .then((res) => {
    //         this.getList();
    //         this.$message({
    //           type: "success",
    //           message: "删除成功",
    //         });
    //       })
    //       .catch(() => {
    //         this.$message({
    //           type: "info",
    //           message: "删除失败",
    //         });
    //       });
    //   });
    // },
    // //批量删除
    // handleAllDelete() {
    //   const ids = this.ids;

    //   if (ids == "") {
    //     this.$message.error("请先勾选");
    //   } else {
    //     this.$confirm("是否确认删除用户吗?", "警告", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning",
    //     })
    //       .then(function () {
    //         return deleteAllSuggestion({ id: ids });
    //       })
    //       .then(() => {
    //         this.getList();
    //         this.$message.success("删除成功");
    //       });
    //   }
    // },
    // 分页
    handleSizeChange(pageSize) {
      console.log(pageSize);
      this.queryParams.pageSize = pageSize;
      this.getList();
    },
    handleCurrentChange(currentPage) {
      this.queryParams.currentPage = currentPage;
      this.getList();
    },
    // 多选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      console.log(this.ids);
    },
    // logo链接
    company(url) {
      window.open(url, "_blank");
    },
  },
};
</script>
<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .new {
    margin-bottom: 20px;
  }
  .delete {
    margin-bottom: 20px;
  }
  .check {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    .el-form {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-right: 20px;
    }
  }
}
.el-table {
  width: 100%;
  .el-divider {
    color: #000;
  }
}
.el-input__inner {
  height: 40px;
  width: 80%;
}
.el-pagination {
  margin: 20px 0;
  display: flex;
  justify-content: flex-end;
}
.view {
  position: relative;
  margin: auto;
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
</style>
