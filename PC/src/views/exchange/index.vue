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
      <el-table ref="multipleTable" :data="tableData" :border="true">
        <!-- @selection-change="handleSelectionChange" -->
        <el-table-column
          prop="exchangeId"
          label="兑换编码"
          align="center"
          width="280"
        >
        </el-table-column>
        <el-table-column
          prop="employeeId"
          label="员工编码"
          align="center"
          width="280"
        >
        </el-table-column>
        <!-- <el-table-column
          prop="departmentId"
          label="部门"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.departmentId | statusFilter }}
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
          prop="awardName"
          label="奖品名称"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="consumedScore" label="可消耗积分" align="center">
        </el-table-column>
        <el-table-column
          prop="currentConsumptionScore"
          label="本次消耗积分"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="remainedScore" label="剩余积分" align="center">
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
    </el-main>
  </el-container>
</template>
<script>
import { getAllData } from "@/api/exchange";
export default {
  data() {
    return {
      queryParams: {
        employeeId: null,
        departmentId: null,
        name: null,
        pageSize: 10,
        pageNo: 1,
      },
      total: null,
      tableData: [],
    };
  },
  filters: {
    statusFilter(status) {
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
        employeeId: null,
        departmentId: null,
        name: null,
        pageNo: 1,
        pageSize: 10,
      };
      this.getList();
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
.el-input__inner[data-v-2a5bc780] {
  height: 40px;
  width: 95%;
}
</style>
