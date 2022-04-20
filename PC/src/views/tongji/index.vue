<template>
  <el-container>
    <!-- main-主体区域 -->
    <el-main>
      <!-- header-搜索栏区域 -->
      <el-header class="header">
        <el-container class="check">
          <el-form
            label-width="80px"
            :model="queryParams"
            @keyup.enter.native="search"
            @submit.native.prevent
          >
            <el-form-item label="员工编码">
              <el-input
                v-model="queryParams.employeeId"
                @keydown.native="keydown($event)"
                placeholder="请输入员工编码"
              ></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="employeeName">
              <el-input
                v-model="queryParams.employeeName"
                @keydown.native="keydown($event)"
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
        <el-table-column prop="freezeScore" label="冻结积分" align="center">
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-link type="danger" @click="openfrozedialog(scope.row)"
              >冻结</el-link
            >
            <!-- @click="dialogForm = true -->
            <el-divider direction="vertical"></el-divider>
            <el-link type="success" @click="openunfrozedialog(scope.row)"
              >解冻</el-link
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 冻结弹窗 -->
      <el-dialog
        title="冻结积分窗口"
        :visible.sync="dialogFrozenVisible"
        :close-on-click-modal="false"
      >
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
            prop="freezeScore"
            :label-width="formLabelWidth"
          >
            <el-input
              v-if="frozenForm.leftScore > 0"
              v-model="frozenForm.freezeScore"
              autocomplete="off"
            ></el-input>
            <el-input
              v-if="frozenForm.leftScore <= 0"
              :disabled="true"
              v-model="frozenForm.freezeScore"
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
      <el-dialog
        title="解冻积分窗口"
        :visible.sync="dialogUnFrozenVisible"
        :close-on-click-modal="false"
      >
        <el-form :model="unfrozenForm" :rules="rules" ref="unfrozenform">
          <el-form-item
            label="可解冻积分"
            prop="freezeScore"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="unfrozenForm.freezeScore"
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
              v-if="unfrozenForm.freezeScore > 0"
              v-model="unfrozenForm.unfreezeScore"
              autocomplete="off"
            ></el-input>
            <el-input
              v-if="unfrozenForm.freezeScore <= 0"
              v-model="unfrozenForm.unfreezeScore"
              :disabled="true"
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
import { number } from "echarts";
export default {
  data() {
    const validPriceForzen = (rule, value, callback) => {
      // value = parseInt("value");
      let numberReg = /^\d+$|^\d+[.]?\d+$/;
      // console.log("value==", value, typeof value);
      let number = parseInt(this.frozenForm.leftScore) - parseInt(value);
      // console.log("number==", number, typeof number);
      if (value !== "") {
        if (!numberReg.test(value)) {
          callback(new Error("请输入数字"));
        } else {
          if (number < 0) {
            callback(new Error("分值不足"));
          } else {
            callback();
          }
        }
      } else {
        callback(new Error("请输入值"));
      }
    };
    const validPriceUnforzen = (rule, value, callback) => {
      let numberReg = /^\d+$|^\d+[.]?\d+$/;

      let number = parseInt(this.unfrozenForm.freezeScore) - parseInt(value);
      console.log("number==", number, typeof number);
      if (value !== "") {
        if (!numberReg.test(value)) {
          callback(new Error("请输入数字"));
        } else {
          if (number < 0) {
            callback(new Error("分值不足"));
          } else {
            callback();
          }
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
        employeeId: "",
        leftScore: null,
        freezeScore: null,
        freezeDescription: "",
      },
      unfrozenForm: {
        employeeId: "",
        freezeScore: null,
        unfreezeScore: null,
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
        freezeScore: [
          {
            required: true,
            trigger: "blur",
            validator: validPriceForzen,
          },
        ],
        unfreezeScore: [
          {
            required: true,
            trigger: "blur",
            validator: validPriceUnforzen,
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
      this.frozenForm.employeeId = row.employeeId;
      this.frozenForm.freezeScore = "";
      this.frozenForm.freezeDescription = "";
    },
    frozenSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          getFrozen(this.frozenForm).then((res) => {
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
              this.$nextTick(() => {
                this.$refs[formName].resetFields();
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
      this.unfrozenForm.freezeScore = row.freezeScore;
      this.unfrozenForm.employeeId = row.employeeId;
      this.unfrozenForm.unfreezeScore = "";
      this.unfrozenForm.unfreezeDescription = "";
    },
    unfrozenSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          getUnFrozen(this.unfrozenForm).then((res) => {
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
              this.$refs[formName].resetFields();
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
    // 禁止输入空格
    keydown(e) {
      if (e.keyCode == 32) {
        e.returnValue = false;
      }
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
.el-table th.el-table__cell {
  background-color: #fafafa !important;
  color: #666666;
}
.el-textarea__inner {
  width: 80%;
}
</style>
