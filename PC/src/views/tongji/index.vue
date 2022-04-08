<template>
  <el-container>
    <!-- main-主体区域 -->
    <el-main>
      <!-- header-搜索栏区域 -->
      <el-header class="header">
        <el-container class="check">
          <el-form label-width="80px" :model="queryParams">
            <el-form-item label="员工编码">
              <el-input
                v-model="queryParams.employeeId"
                placeholder="请输入员工编码"
              ></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="employeeName">
              <el-input
                v-model="queryParams.employeeName"
                placeholder="请输入姓名"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="部门名称">
              <el-select v-model="queryParams.deptId" placeholder="请选择">
                <el-option label="钢铁" :value="1"></el-option>
                <el-option label="产业" :value="2"></el-option>
                <el-option label="运营" :value="3"></el-option>
                <el-option label="财务" :value="4"></el-option>
                <el-option label="技术中心" :value="5"></el-option>
              </el-select>
            </el-form-item> -->
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
          prop="employeeId"
          label="员工编码"
          align="center"
          width="200"
        >
        </el-table-column>
        <!-- <el-table-column
          prop="deptId"
          label="部门"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.deptId | statusFilterDep }}
          </template>
        </el-table-column> -->
        <el-table-column prop="employeeName" label="姓名" align="center">
        </el-table-column>
        <el-table-column
          prop="employeeTel"
          label="联系电话"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="totalScore" label="累计积分" align="center">
        </el-table-column>
        <el-table-column prop="usedScore" label="已兑换积分" align="center">
        </el-table-column>
        <el-table-column prop="leftScore" label="可兑换积分" align="center">
        </el-table-column>
        <el-table-column prop="frozenScore" label="冻结积分" align="center">
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="openfrozedialog(scope.row)"
              >冻结</el-link
            >
            <!-- @click="dialogForm = true -->
            <el-divider direction="vertical"></el-divider>
            <el-link type="primary" @click="openunfrozedialog(scope.row)"
              >解冻</el-link
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 冻结弹窗 -->
      <el-dialog title="冻结积分窗口" :visible.sync="dialogFrozenVisible">
        <el-form :model="frozenForm" :rules="rules" ref="frozenform">
          <el-form-item
            label="可冻结积分"
            prop="leftScore"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="frozenForm.leftScore"
              autocomplete="off"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="拟冻结积分"
            prop="frozenScore"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="frozenForm.frozenScore"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="原因描述"
            prop="freezeDescription"
            :label-width="formLabelWidth"
          >
            <el-input
              type="textarea"
              :rows="2"
              v-model="frozenForm.freezeDescription"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFrozenVisible = false">取 消</el-button>
          <el-button type="primary" @click="frozenSubmit('frozenform')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!-- 解冻弹窗 -->
      <el-dialog title="解冻积分窗口" :visible.sync="dialogUnFrozenVisible">
        <el-form :model="unfrozenForm" :rules="rules" ref="unfrozenform">
          <el-form-item
            label="可解冻积分"
            prop="frozenScore"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="unfrozenForm.frozenScore"
              autocomplete="off"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="拟解冻积分"
            prop="unfreezeScore"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="unfrozenForm.unfreezeScore"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="原因描述"
            prop="unfreezeDescription"
            :label-width="formLabelWidth"
          >
            <el-input
              type="textarea"
              :rows="2"
              v-model="unfrozenForm.unfreezeDescription"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUnFrozenVisible = false">取 消</el-button>
          <el-button type="primary" @click="unfrozenSubmit('unfrozenform')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pageNo"
        :page-size="queryParams.size"
        :page-sizes="[10, 20, 30]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-main>
  </el-container>
</template>
<script>
import { getAllData, getFrozen, getUnFrozen } from "@/api/tongji";
export default {
  data() {
    // const validPriceNumber = (rule, value, callback) => {
    //   let numberReg = /^\d+$|^\d+[.]?\d+$/;
    //   if (value !== "") {
    //     if (!numberReg.test(value)) {
    //       callback(new Error("请输入数字"));
    //     } else if (
    //       value > this.form.totalScore * 1 ||
    //       value > this.form.leftScore * 1
    //     ) {
    //       callback(new Error("请输入正确的分值"));
    //     }
    //   } else {
    //     callback(new Error("请输入值"));
    //   }
    // };
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
        employeeId: null,
        employeeName: null,
        deptId: null,
        pageNo: 1,
        pageSize: 10,
      },
      tableData: [],
      total: null,
      dialogFrozenVisible: false,
      dialogUnFrozenVisible: false,
      frozenForm: {
        leftScore: "",
        frozenScore: "",
        freezeDescription: "",
      },
      unfrozenForm: {
        frozenScore: "",
        unfreezeScore: "",
        unfreezeDescription: "",
      },
      formLabelWidth: "100px",
      rules: {
        freezeDescription: [
          { required: true, message: "请输入原因描述", trigger: "blur" },
        ],
        unfreezeDescription: [
          { required: true, message: "请输入原因描述", trigger: "blur" },
        ],
        frozenScore: [
          {
            required: true,
            message: "请输入要冻结积分",
            trigger: "blur",
            validator: validPriceNumber,
          },
        ],
        unfrozenScore: [
          {
            required: true,
            message: "请输入要解冻积分",
            trigger: "blur",
            validator: validPriceNumber,
          },
        ],
      },
    };
  },
  filters: {
    statusFilterDep(status) {
      const statusMap = {
        1: "钢铁",
        2: "产业",
        3: "运营",
        4: "财务",
        5: "技术中心",
      };
      return statusMap[status];
    },
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
            this.tableData = res.data.records;
            this.total = res.data.total * 1;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //冻结积分
    openfrozedialog(row) {
      this.dialogFrozenVisible = true;
      this.frozenForm.leftScore = row.leftScore;
      // this.form.frozen = "";
    },
    frozenSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          getFrozen(this.form).then((res) => {
            console.log(res);
            if (res.success) {
              this.$message({
                type: "success",
                message: res.message,
              });
              this.$refs[formName].resetFields();
              this.dialogFrozenVisible = false;
              this.getList();
            } else {
              this.$message({
                type: "error",
                message: res.message,
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    //解冻积分
    openunfrozedialog(row) {
      this.dialogUnFrozenVisible = true;
      this.unfrozenForm.leftScore = row.leftScore;
    },
    unfrozenSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          getUnFrozen(this.form).then((res) => {
            console.log(res);
            if (res.success) {
              this.$message({
                type: "success",
                message: res.message,
              });
              this.$refs[formName].resetFields();
              this.dialogUnFrozenVisible = false;
              this.getList();
            } else {
              this.$message({
                type: "error",
                message: res.message,
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 搜索
    search() {
      this.getList();
    },
    // 重置
    reset() {
      this.queryParams = {
        employeeId: null,
        employeeName: null,
        deptId: null,
        currentPage: 1,
        size: 10,
      };
      this.getList();
    },

    // 分页
    handleSizeChange(size) {
      console.log(size);
      this.queryParams.size = size;
      this.getList();
    },
    handleCurrentChange(pageNo) {
      this.queryParams.pageNo = pageNo;
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
.el-input--medium .el-input__inner {
  height: 36px;
  line-height: 36px;
  width: 80%;
}
.el-textarea__inner {
  width: 80%;
}
</style>
