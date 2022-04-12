<template>
  <el-container>
    <!-- main-主体区域 -->
    <el-main>
      <!-- header-搜索栏区域 -->
      <el-header class="header">
        <el-button type="primary" class="new" @click="dialogFormVisible = true"
          >新增奖品</el-button
        >
        <el-container class="check">
          <el-form
            label-width="80px"
            :model="queryParams"
            @keyup.enter.native="search"
            @submit.native.prevent
          >
            <el-form-item label="奖品名称" prop="awardName">
              <el-input
                v-model="queryParams.awardName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="奖品状态" prop="isExist">
              <el-select v-model="queryParams.isExist" placeholder="请选择">
                <el-option label="已上架" :value="1"></el-option>
                <el-option label="已下架" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <!-- @click="search" -->
          <el-button
            class="search"
            type="primary"
            icon="el-icon-search"
            @click="search"
            >查询</el-button
          >
          <el-button type="info" icon="el-icon-search" @click="reset"
            >重置</el-button
          >
        </el-container>
      </el-header>
      <!-- table-表格区域 -->
      <el-table ref="multipleTable" :data="tableData" :border="true">
        <!-- @selection-change="handleSelectionChange" -->
        <el-table-column
          prop="awardId"
          label="奖品编号"
          align="center"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="awardName"
          label="奖品名称"
          show-overflow-tooltip
          min-width="200"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="awardPrice" label="积分价格" align="center">
        </el-table-column>
        <el-table-column prop="awardPicture" label="图片" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleOpenPicture(scope.row)"
              >图片预览</el-link
            >
          </template>
        </el-table-column>
        <el-table-column prop="isExist" label="奖品状态" align="center">
          <template slot-scope="scope">
            {{ scope.row.isExist | statusFilter }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100" align="center">
          <template slot-scope="scope">
            <el-link
              type="primary"
              :disabled="scope.row.isExist === 1"
              @click="condition(scope.row, 1)"
              >上架</el-link
            >
            <el-divider direction="vertical"></el-divider>
            <el-link
              type="primary"
              :disabled="scope.row.isExist === 0"
              @click="condition(scope.row, 0)"
              >下架</el-link
            >
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
      <!-- 新增弹框 -->
      <el-dialog
        title="奖品信息新增"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        append-to-body
      >
        <el-form :model="form" :rules="rules" ref="addform">
          <el-form-item
            label="奖品名称"
            prop="awardName"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.awardName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="积分价格"
            prop="awardPrice"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.awardPrice" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="上传图片" :label-width="formLabelWidth">
            <UploadImage
              ref="coverPicture"
              style="text-align: left"
              @callbackFunction="driveBookFunction"
            ></UploadImage>
          </el-form-item>
          <el-form-item
            label="奖品状态"
            prop="isExist"
            v-model="form.isExist"
            :label-width="formLabelWidth"
          >
            <el-radio v-model="form.isExist" :label="1">上架</el-radio>
            <el-radio v-model="form.isExist" :label="0">下架</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addAwardOne('addform')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!-- 图片预览弹窗 -->
      <el-dialog
        class="dialogPicture"
        title="大图展示"
        :visible.sync="dialogVisiblePicture"
        :close-on-click-modal="false"
        append-to-body
      >
        <!-- <img :src="'http://172.168.111.56:8080/' + itemRow.awardPicture" /> -->
        <img :src="itemRow" />
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import { getAllData, awardState, addAward } from "@/api/award"; // awardState
import { Row } from "element-ui";
import UploadImage from "@/components/UploadImage";
export default {
  components: {
    UploadImage,
  },
  data() {
    const validPriceNumber = (rule, value, callback) => {
      let numberReg = /^\d+$|^\d+[.]?\d+$/;
      if (value !== "") {
        if (!numberReg.test(value)) {
          callback(new Error("请输入数字"));
        } else {
          callback();
        }
      } else {
        callback(new Error("请输入值"));
      }
    };
    return {
      uploadurl: "",
      queryParams: {
        awardName: null,
        isExist: null,
        currentPage: 1,
        pageSize: 10,
      },
      tableData: [],
      total: null,

      dialogFormVisible: false,
      dialogVisible: false,
      disabled: false,
      form: {
        awardName: "",
        awardPrice: "",
        picturePath: "",
        isExist: 1,
      },
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      formLabelWidth: "80px",
      rules: {
        awardName: [
          { required: true, message: "请输入奖品名称", trigger: "blur" },
        ],
        awardPrice: [
          {
            required: true,
            message: "请输入奖品价格",
            trigger: "blur",
            validator: validPriceNumber,
          },
        ],
      },
      itemRow: {},
      dialogVisiblePicture: false,
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "已下架",
        1: "已上架",
      };
      return statusMap[status];
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获得全部数据
    getList() {
      getAllData(this.queryParams)
        .then((res) => {
          console.log(res);
          if (res.success == true) {
            this.tableData = res.data.records;
            this.total = res.data.total * 1;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 搜索
    search() {
      this.getList();
    },
    // 重置
    reset() {
      this.queryParams = {
        awardName: null,
        isExist: null,
        currentPage: 1,
        pageSize: 10,
      };
      this.getList();
    },
    changeState(data) {
      // console.log("data======" + data);

      // let formdata = new FormData();
      // formdata.append("awardId", data.awardId);
      // formdata.append("isExist", data.isExist);
      awardState(data)
        .then((res) => {
          if (res.success) {
            this.$message.success("操作成功");
            this.getList();
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
    condition(row, sta) {
      var that = this;
      this.$confirm("确定要执行该操作吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.changeState({ awardId: row.awardId, isExist: parseInt(sta) });
          // if (row.isExist === 1) {
          //   this.changeState({ awardId: row.awardId, isExist: 0 });
          // } else if (row.isExist === 2) {
          //   this.changeState({ awardId: row.awardId, isExist: 1 });
          // }
          // if (awardId.isExist === 0) {
          //   this.$message.success("奖品下架成功");
          //   this.getList();
          // }
        })
        .catch((err) => {
          this.$message.error("操作失败");
          console.log(err);
        });
    },
    //新增图片
    driveBookFunction(item) {
      this.form.picturePath = item;
    },
    addAwardOne(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.form);
          addAward(this.form)
            .then((res) => {
              console.log(res);
              this.$message({
                message: "恭喜你，已提交成功！！！！",
                type: "success",
              });
              this.$refs[formName].resetFields();
              this.dialogFormVisible = false;
              this.getList();
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("提交失败！！！");
          return false;
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //图片预览
    handleOpenPicture(row) {
      this.dialogVisiblePicture = true;
      this.itemRow = row.awardPicture;
    },
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
    // logo链接
    company(url) {
      window.open(url, "_blank");
    },
  },
};
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .new {
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
.el-dialog__body {
  width: 80%;
  padding: 30px 70px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}
.el-pagination {
  margin: 20px 0;
  display: flex;
  justify-content: flex-end;
}
.dialogPicture {
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
<style>
.el-dialog__body {
  width: 80%;
  padding: 30px 70px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}
.el-table--border th.el-table__cell,
.el-table__fixed-right-patch {
  background: #f5f7fa !important;
}
</style>
