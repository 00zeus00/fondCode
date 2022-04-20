<template>
  <el-container>
    <!-- main-主体区域 -->
    <el-main>
      <!-- header-搜索栏区域 -->
      <el-header class="header">
        <el-button type="primary" class="batch" @click="handleAlldeclare('Y')"
          >批量同意</el-button
        >
        <el-button type="primary" class="batch" @click="handleAlldeclare('N')"
          >批量驳回</el-button
        >
        <el-container class="check">
          <el-form
            :rules="rules"
            label-width="80px"
            :model="queryParams"
            @keyup.enter.native="search"
            @submit.native.prevent
          >
            <!-- <el-form-item label="部门名称" prop="departmentId">
              <el-select
                v-model="queryParams.departmentId"
                placeholder="请选择"
              >
                <el-option label="钢铁" value="1"></el-option>
                <el-option label="产业" value="2"></el-option>
                <el-option label="运营" value="3"></el-option>
                <el-option label="财务" value="4"></el-option>
                <el-option label="技术中心" value="5"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="姓名" prop="name">
              <el-input
                v-model="queryParams.name"
                @keydown.native="keydown($event)"
                placeholder="请输入姓名"
              ></el-input>
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
      <el-table
        ref="multipleTable"
        :data="tableData"
        :border="true"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          label="全选"
          align="center"
          width="50"
          :selectable="selecttable"
        >
        </el-table-column>
        <el-table-column
          prop="applyId"
          label="申报编码"
          align="center"
          width="150"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="employeeId"
          label="员工编码"
          align="center"
          width="150"
        >
        </el-table-column>
        <!-- <el-table-column
          prop="departmentId"
          label="部门"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.departmentId | statusFilterDep }}
          </template>
        </el-table-column> -->
        <el-table-column prop="name" label="姓名" align="center">
        </el-table-column>
        <el-table-column
          prop="telephone"
          label="联系电话"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="typeId"
          label="项目类别"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.typeId | statusFilterTyp }}
          </template>
        </el-table-column>
        <el-table-column
          prop="itemDescribe"
          label="项目描述"
          align="center"
          width="150"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column prop="score" label="积分" align="center">
        </el-table-column>
        <el-table-column
          prop="isApprove"
          label="状态"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.isApprove | statusFilterSta }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="120">
          <template slot-scope="scope">
            <el-link
              type="success"
              :disabled="
                scope.row.isApprove === 'Y' || scope.row.isApprove === 'N'
              "
              @click="handleAgree(scope.row, 'Y')"
              >同意</el-link
            >
            <el-divider direction="vertical"></el-divider>
            <el-link
              type="danger"
              :disabled="
                scope.row.isApprove === 'N' || scope.row.isApprove === 'Y'
              "
              @click="handleDisAgree(scope.row, 'N')"
              >驳回</el-link
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.PageNo"
        :page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 30]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-main>
  </el-container>
</template>
<script>
import {
  getAllData,
  agreeDeclare,
  disagreeDeclare,
  dealAllDeclare,
} from "@/api/declare";
import { parseGeoJSON } from "echarts";
import { status } from "nprogress";
export default {
  data() {
    const validName = (rule, value, callback) => {
      var reg = /[^\u4e00-\u9fa5]/;
      if (reg.test(value)) {
        callback(new Error("请输入中文字符"));
      } else {
        callback();
      }
    };
    return {
      queryParams: {
        employeeId: null,
        departmentId: null,
        name: null,
        typeId: null,
        pageSize: 10,
        PageNo: 1,
      },
      rules: {
        name: [
          {
            trigger: ["change"],
            validator: validName,
          },
        ],
      },
      total: null,
      tableData: [],
      batchId: [],
      scoreApplyRecordListRequest: [],
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
    statusFilterTyp(status) {
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
    statusFilterSta(status) {
      const statusMap = {
        Y: "已同意",
        N: "已驳回",
        D: "待审核",
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
        departmentId: null,
        name: null,
        typeId: null,
        PageNo: 1,
        pageSize: 10,
      };
      this.getList();
    },
    // 单个同意
    handleAgree(row, sta) {
      this.$confirm("确定要执行该操作吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // agreeDeclare({ applyId: row.applyId, isApprove: sta });
          const params = {
            employeeId: row.employeeId,
            applyId: row.applyId,
            score: row.score,
            isApprove: sta,
          };
          agreeDeclare(params)
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
              // this.$message.error("操作失败");
              console.log(err);
            });
        })
        .catch((err) => {
          // this.$message.error("操作失败");
          console.log(err);
        });
    },
    // 单个驳回
    handleDisAgree(row, sta) {
      this.$confirm("确定要执行该操作吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // disagreeDeclare({ applyId: row.applyId, isApprove: sta });
          const params = { applyId: row.applyId, isApprove: sta };
          disagreeDeclare(params)
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
              // this.$message.error("操作失败");
              console.log(err);
            });
        })
        .catch((err) => {
          // this.$message.error("操作失败");
          console.log(err);
        });
    },
    // 批量同意与驳回
    handleAlldeclare(sta) {
      if (this.batchId.length <= 0) {
        this.$message.error("请先勾选");
      } else {
        this.$confirm("是否确认进行该操作?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            const params = {
              batchTag: sta,
              scoreApplyRecordListRequest: this.scoreApplyRecordListRequest,
            };
            dealAllDeclare(params)
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
                // this.$message.error("操作失败");
                console.log(err);
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              // message: "操作失败",
            });
          });
      }
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
      this.batchId = selection.map((item) => item.id);
      this.scoreApplyRecordListRequest = selection;
      console.log(this.batchId);
    },
    // 分页
    handleSizeChange(pageSize) {
      console.log(pageSize);
      this.queryParams.pageSize = pageSize;
      this.getList();
    },
    handleCurrentChange(PageNo) {
      this.queryParams.PageNo = PageNo;
      this.getList();
    },
    // 禁用多选框
    selecttable(row, index) {
      return row.isApprove === "D";
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
  .batch {
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
.el-input__inner[data-v-46d345c3] {
  height: 40px;
  width: 95%;
}
.el-table th.el-table__cell {
  background-color: #fafafa !important;
  color: #666666;
}
</style>
