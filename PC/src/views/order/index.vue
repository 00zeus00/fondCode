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
            <el-form-item label="收货人">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input
                v-model="queryParams.telephone"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="交易状态">
              <el-select
                v-model="queryParams.orderTransaction"
                placeholder="请选择"
              >
                <el-option label="待发货" :value="0"></el-option>
                <el-option label="已发货" :value="1"></el-option>
                <el-option label="已收货" :value="2"></el-option>
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
      <el-table ref="multipleTable" :data="tableData" :border="true">
        <!-- @selection-change="handleSelectionChange" -->
        <el-table-column
          prop="orderId"
          label="订单编号"
          align="center"
          width="260"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="awardName"
          label="奖品信息"
          align="center"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="orderTransaction"
          label="交易状态"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.orderTransaction | statusFilter }}
          </template>
        </el-table-column>
        <el-table-column label="收货信息" align="center" min-width="300">
          <el-table-column prop="name" label="收货人"> </el-table-column>
          <el-table-column prop="telephone" label="联系电话"> </el-table-column>
          <el-table-column
            prop="orderAddress"
            label="收货地址"
            min-width="120"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="getWay"
          label="自提/物流"
          align="center"
          width="100"
        >
        </el-table-column>
        <el-table-column label="操作" min-width="100" align="center">
          <template slot-scope="scope">
            <el-link
              v-if="scope.row.getWay == '自提'"
              type="primary"
              size="mini"
              @click="confirm(scope.row, 2)"
              >确认收货</el-link
            >
            <!-- <el-link
              v-if="
                scope.row.getWay == '物流'
              "
              type="primary"
              size="mini"
              @click="wuinfo(scope.row, scope.$index)"
              > 
              {{scope.row.orderTransaction == 0?'填写物流信息':`物流公司：${scope.row.expressCom} 单号：${scope.row.expressCode}`  }}  </el-link

              > {{scope.row.orderTransaction == 0?'填写物流信息':'物流公司：'+scope.row.expressCom + scope.row.expressCode }}  </el-link
            > -->
            <el-link
              v-if="
                scope.row.getWay == '物流' && scope.row.orderTransaction == 0
              "
              type="primary"
              size="mini"
              @click="wuinfo(scope.row, scope.$index)"
              >填写物流信息</el-link
            >
            <span
              v-if="
                scope.row.getWay == '物流' && scope.row.orderTransaction == 1
              "
              >物流公司：{{ scope.row.expressCom }}<br />快递单号：{{
                scope.row.expressCode
              }}</span
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
      <!-- 弹框 -->
      <el-dialog
        title="物流信息"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item
            label="物流公司"
            prop="expressCom"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="form.expressCom"
              autocomplete="off"
              placeholder="请输入物流公司"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="物流单号"
            prop="expressCode"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="form.expressCode"
              autocomplete="off"
              placeholder="请输入物流单号"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="visible = submit('form')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import { getAllData, wuliu, orderState } from "@/api/order";
export default {
  data() {
    return {
      queryParams: {
        name: null,
        number: null,
        orderTransaction: null, //0
        pageSize: 10,
        pageNo: 1,
      },
      tableData: [],
      total: null,
      // 物流弹框
      dialogFormVisible: false,
      form: {
        orderId: "",
        expressCom: "",
        expressCode: "",
      },
      formLabelWidth: "80px",
      itemobj: {},
      itemobjindex: 0,
      rules: {
        expressCom: [
          { required: true, message: "还没有写物流公司哦！", trigger: "blur" },
        ],
        expressCode: [
          { required: true, message: "还没有写物流单号哦！", trigger: "blur" },
        ],
      },
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "待发货",
        1: "已发货",
        2: "已收货",
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
        name: null,
        number: null,
        orderTransaction: null,
        currentPage: 1,
        pageSize: 10,
      };
      this.getList();
    },
    // 物流弹窗
    wuinfo(row, index) {
      this.itemobj = row;
      this.itemobjindex = index;
      this.dialogFormVisible = true;
    },
    // 弹窗提交按钮
    submit(formName) {
      var that = this;
      this.form.orderId = this.itemobj.orderId;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          wuliu(this.form)
            .then((res) => {
              this.$message.success("操作成功");
              // that.changeState(1);
              this.dialogFormVisible = false;
              this.getList();
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("填写失败！！！");
          return false;
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 改变交易状态
    changeState(sta) {
      let data = {
        orderId: this.itemobj.orderId,
        orderTransaction: sta,
      };
      orderState(data)
        .then((res) => {
          if (res.success) {
            this.$message.success("操作成功");
            this.$set(this.tableData[this.itemobjindex], sta);
            // console.log(11111111111111);
            // this.$set(this.tableData[this.itemobjindex],'content', 'TIANXIEWULIU');
            // this.$set(this.tableData.expressCom);
            // console.log(222222222222222222222);
            this.$refs.ruleForm.resetFields();
            // console.log(3333333333333333);
            this.dialogFormVisible = false;
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
    confirm(row, sta) {
      var that = this;
      this.$confirm("确定要执行该操作吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          // that.changeState({ id: row.id, orderTransaction: parseInt(sta) });
          that.changeState(2);
        })
        .catch((err) => {
          this.$message.error("操作失败");
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
.el-table thead.is-group th.el-table__cell {
  background: #f5f7fa;
}
.el-input__inner[data-v-007ed227] {
  height: 40px;
  width: 95%;
}
</style>
