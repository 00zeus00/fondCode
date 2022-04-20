<template>
  <el-container>
    <!-- main-主体区域 -->
    <el-main>
      <!-- header-搜索栏区域 -->
      <el-header class="header">
        <el-button type="primary" class="new" @click="opendialog('1')"
          >新增项目</el-button
        >
        <el-container class="check">
          <el-form
            label-width="80px"
            :model="queryParams"
            @keyup.enter.native="search"
            @submit.native.prevent
          >
            <el-form-item label="项目类别" prop="typeId">
              <el-select v-model="queryParams.typeId" placeholder="请选择">
                <el-option label="主动行为" :value="1"></el-option>
                <el-option label="参与管理" :value="2"></el-option>
                <el-option label="共同成长" :value="3"></el-option>
                <el-option label="责任与担当" :value="4"></el-option>
                <el-option label="主人翁意识" :value="5"></el-option>
                <el-option label="企业认同" :value="6"></el-option>
                <el-option label="个人成长" :value="7"></el-option>
                <el-option label="特定任务" :value="8"></el-option>
                <el-option label="其他" :value="9"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分值" prop="itemValue">
              <el-input
                v-model="queryParams.itemValue"
                type="number"
                @keydown.native="keydown($event)"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="aliveTag">
              <el-select v-model="queryParams.aliveTag" placeholder="请选择">
                <el-option label="已启用" :value="1"></el-option>
                <el-option label="已禁用" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
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
          prop="itemId"
          label="项目编号"
          align="center"
          width="100"
        >
        </el-table-column>
        <el-table-column prop="typeId" label="项目类别" align="center">
          <template slot-scope="scope">
            {{ scope.row.typeId | statusFilter }}
          </template>
        </el-table-column>
        <el-table-column
          prop="itemDescribe"
          label="项目描述"
          align="center"
          show-overflow-tooltip
          min-width="200"
        >
        </el-table-column>
        <el-table-column prop="itemValue" label="分值" align="center">
        </el-table-column>
        <el-table-column
          prop="aliveTag"
          label="状态"
          align="center"
          width="100px"
        >
          <template slot-scope="scope">
            {{ scope.row.aliveTag === 1 ? "已启用" : "已禁用" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-link
              type="success"
              :disabled="scope.row.aliveTag === 1"
              @click="state(scope.row, 1)"
              >启用</el-link
            >
            <el-divider direction="vertical"></el-divider>
            <el-link
              type="danger"
              :disabled="scope.row.aliveTag === 0"
              @click="state(scope.row, 0)"
              >禁用</el-link
            >
            <el-divider direction="vertical"></el-divider>
            <el-link type="primary" @click="opendialog('2', scope.row)"
              >变更</el-link
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pageNo"
        :page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 30]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 新增弹框 -->
      <el-dialog
        :title="status == '1' ? '积分项目信息新增' : '积分项目信息变更'"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form :model="form" :rules="rules" ref="dialogform">
          <el-form-item
            v-if="status == '1'"
            label="项目类别"
            prop="typeId"
            :label-width="formLabelWidth"
          >
            <el-select
              v-model="form.typeId"
              placeholder="请选择反馈类型"
              default-first-option
            >
              <el-option label="主动行为" :value="1"></el-option>
              <el-option label="参与管理" :value="2"></el-option>
              <el-option label="共同成长" :value="3"></el-option>
              <el-option label="责任与担当" :value="4"></el-option>
              <el-option label="主人翁意识" :value="5"></el-option>
              <el-option label="企业认同" :value="6"></el-option>
              <el-option label="个人成长" :value="7"></el-option>
              <el-option label="特定任务" :value="8"></el-option>
              <el-option label="其他" :value="9"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="项目描述"
            prop="itemDescribe"
            show-overflow-tooltip
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="form.itemDescribe"
              @keydown.native="keydown($event)"
              maxlength="40"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="分值"
            prop="itemValue"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="form.itemValue"
              @keydown.native="keydown($event)"
              maxlength="11"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="状态"
            prop="aliveTag"
            :label-width="formLabelWidth"
          >
            <el-radio v-model="form.aliveTag" :label="1">启用</el-radio>
            <el-radio v-model="form.aliveTag" :label="0">禁用</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button
            type="primary"
            slot="reference"
            @click="
              status == '1'
                ? submitForm('dialogform')
                : updateForm('dialogform')
            "
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import {
  getAllData,
  projectState,
  addProject,
  projectUpdate,
} from "@/api/project.js";
export default {
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
      status: 1,
      queryParams: {
        typeId: null,
        itemValue: null,
        aliveTag: null,
        pageNo: 1,
        pageSize: 10,
      },
      tableData: [],
      total: null,
      // 弹框
      dialogFormVisible: false,
      form: {
        typeId: 1,
        itemDescribe: "",
        itemValue: "",
        aliveTag: "",
      },
      formLabelWidth: "80px",
      rules: {
        typeId: [{ required: true, message: "请输入类型", trigger: "blur" }],
        itemDescribe: [
          { required: true, message: "请输入描述", trigger: "blur" },
        ],
        itemValue: [
          {
            required: true,
            message: "请输入分值",
            trigger: "blur",
            validator: validPriceNumber,
          },
        ],
        aliveTag: [{ required: true, message: "选择状态", trigger: "blur" }],
      },
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "主动行为",
        2: "参与管理",
        3: "共同成长",
        4: "责任与担当",
        5: "主人翁意识",
        6: "企业认同",
        7: "个人成长",
        8: "特定任务",
        9: "其他",
      };
      return statusMap[status];
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    //  获取全部的数据
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
    // 禁止输入空格
    keydown(e) {
      if (e.keyCode == 32) {
        e.returnValue = false;
      }
    },
    // 重置
    reset() {
      this.queryParams = {
        typeId: null,
        itemValue: null,
        aliveTag: null,
        pageNo: 1,
        pageSize: 10,
      };
      this.getList();
    },
    //禁用启用
    changeState(data) {
      console.log(data);
      projectState(data).then((res) => {
        this.$message.success("操作成功");
        this.getList();
      });
    },
    state(row, sta) {
      var that = this;
      this.$confirm("确定要执行该操作吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.changeState({
            itemId: parseInt(row.itemId),
            aliveTag: parseInt(sta),
          });
        })
        .catch((err) => {
          // this.$message.error("操作失败");
          console.log(err);
        });
    },
    // 分页
    handleSizeChange(pageSize) {
      console.log(pageSize);
      this.queryParams.pageSize = pageSize;
      this.getList();
    },
    handleCurrentChange(pageNo) {
      this.queryParams.pageNo = pageNo;
      this.getList();
    },
    // 弹窗状态切换
    opendialog(status, row) {
      this.dialogFormVisible = true;
      this.status = status;
      this.form = {
        typeId: 1,
        itemDescribe: "",
        itemValue: "",
        itemRemark: "",
        aliveTag: 1,
      };
      if (status == "2") {
        this.form = row;
      }
    },
    // 新增
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addProject(this.form).then((res) => {
            console.log(res);
            if (res.success) {
              this.$message({
                type: "success",
                message: "提交成功!",
              });
              this.$refs[formName].resetFields();
              this.dialogFormVisible = false;
              this.queryParams.currentPage = 1;
              this.getList();
            } else {
            }
          });
        } else {
          return false;
        }
      });
    },
    updateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          projectUpdate(this.form).then((res) => {
            console.log(res);
            this.$message({
              type: "success",
              message: "变更成功!",
            });
            // this.$refs[formName].resetFields();
            this.dialogFormVisible = false;
            this.getList();
          });
        } else {
          return false;
        }
      });
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
.el-input__inner {
  height: 40px;
  width: 80%;
}
.el-pagination {
  margin: 20px 0;
  display: flex;
  justify-content: flex-end;
}
</style>
<style>
.el-table th.el-table__cell {
  background-color: #fafafa !important;
  color: #666666;
}
</style>
