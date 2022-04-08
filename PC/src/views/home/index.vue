<template>
  <div class="main-container1">
    <div class="containerBox">
      <div class="title">运营管理</div>
      <div class="left-top">
        <div class="icontfonts" @click="award">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-wodejiangpin"></use>
          </svg>
          <div class="name">奖品管理</div>
        </div>
        <div class="icontfonts" @click="project">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-icon_jifenguanli"></use>
          </svg>
          <div class="name">积分项目管理</div>
        </div>
        <div class="icontfonts" @click="order">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shenbaoguanli"></use>
          </svg>
          <div class="name">订单管理</div>
        </div>
        <div class="icontfonts" @click="admin">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-quanxianguanli-mianxing"></use>
          </svg>
          <div class="name">权限管理</div>
        </div>
        <div class="icontfonts" @click="declare">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shenbaochaxun"></use>
          </svg>
          <div class="name">积分申报记录</div>
        </div>
        <div class="icontfonts" @click="exchange">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-duihuanjilu"></use>
          </svg>
          <div class="name">积分兑换记录</div>
        </div>
        <div class="icontfonts" @click="tongji">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-tongji"></use>
          </svg>
          <div class="name">员工积分统计</div>
        </div>
      </div>
    </div>
    <div class="containerBox">
      <div class="title">待处理事项</div>
      <div class="right-top">
        <div class="icontfonts" @click="daichuli">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-daibanshixiang"></use>
          </svg>
          <el-badge :value="number" prop="number" class="item">
            <span class="name">待处理订单</span>
          </el-badge>
        </div>
      </div>
    </div>
    <div class="containerBox">
      <div class="left-bottom">
        <div class="title">积分项目统计</div>
        <div
          id="chart1"
          style="width: 100%; height: 300px"
          class="chart1"
        ></div>
      </div>
    </div>
    <div class="containerBox">
      <div class="right-bottom">
        <div class="title">部门积分统计</div>
        <div
          id="chart2"
          style="width: 100%; height: 300px"
          class="chart2"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import { getEcharts, toDo } from "@/api/home";
export default {
  data() {
    return {
      number: "",
      tableData: [],
      xAxisdata: [],
      yAxisdata: [],
      dataList: [],
      obj: {
        pageNo: "1",
        pageSize: "10000000",
      },
      option: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
            // shadowStyle: {
            //   // 阴影样式  若选择 type 为 line的类型，可设置线条样式 lineStyle
            //   color: "rgba(88,101,137,0.3)",
            //   width: "auto",
            //   type: "default",
            // },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [],
            // axisTick: {
            //   alignWithLabel: true,
            // },
            axisTick: {
              alignWithLabel: true,
              interval: 0,
              rotate: -30,
              margin: -15,
            },
            axisLabel: {
              interval: 0,
              rotate: 40,
              formatter: function (value, index) {
                // console.log(value);
                if (value == "1") {
                  return "主动行为";
                } else if (value == "2") {
                  return "参与管理";
                } else if (value == "3") {
                  return "共同成长";
                } else if (value == "4") {
                  return "责任与担当";
                } else if (value == "5") {
                  return "主人翁意识";
                } else if (value == "6") {
                  return "企业认同";
                } else if (value == "7") {
                  return "个人成长";
                } else if (value == "8") {
                  return "特定任务";
                } else {
                  return "其他";
                }
              },
            },
          },
        ],

        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "项目积分",
            type: "bar",
            barWidth: "50%",
            data: [],
            itemStyle: {
              color: "#7EABF6",
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.getWait();
    this.getEchartData1();
    this.getEchartData2();
    // setTimeout(() => {
    //   this.getEchartData1();
    //   this.getEchartData2();
    // }, 500);
  },
  methods: {
    getWait() {
      toDo(this.number).then((res) => {
        console.log(res);
        this.number = res.data;
      });
    },
    getEchartData1() {
      getEcharts(this.obj).then((res) => {
        this.tableData = res.data.records;
        // console.log(this.tableData);
        this.tableData.forEach((item, index) => {
          // console.log(item, item.typeId);
          if (this.xAxisdata.indexOf(item.typeId) == -1) {
            this.xAxisdata.push(item.typeId);
            this.dataList.push({
              type: item.typeId,
              number: Number(item.score),
            });
          } else {
            this.dataList[this.xAxisdata.indexOf(item.typeId)].number += Number(
              item.score
            );
          }
          // console.log(this.xAxisdata, this.dataList);
        });

        this.xAxisdata.sort(function (a, b) {
          return a - b;
        });
        for (let i = 0; i < this.xAxisdata.length; i++) {
          for (let n = 0; n < this.dataList.length; n++) {
            if (this.xAxisdata[i] == this.dataList[n].type) {
              this.yAxisdata.push(this.dataList[n].number);
            }
          }
        }
        // console.log("yAxisdata", this.yAxisdata);
        // this.dataList.forEach((item, index) => {
        //   // this.xAxisdata.push(item.type)
        //   this.yAxisdata.push(item.number);
        // });

        let myChart = this.$echarts.init(document.getElementById("chart1"));
        this.option.xAxis[0].data = this.xAxisdata;
        this.option.series[0].data = this.yAxisdata;
        myChart.setOption(this.option);

        // // var roseCharts = document.getElementById("chart1");
        // // var myChart = echarts.init(roseCharts);
        // var option = {
        //   tooltip: {
        //     trigger: "axis",
        //     axisPointer: {
        //       // 坐标轴指示器，坐标轴触发有效
        //       type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
        //     },
        //   },
        //   grid: {
        //     left: "3%",
        //     right: "4%",
        //     bottom: "3%",
        //     containLabel: true,
        //   },

        //   xAxis: [
        //     {
        //       type: "category",
        //       // data: ["项目一", "项目二", "项目三", "项目四", "项目五"],
        //       data: this.dataList.xAxis.data,
        //       axisTick: {
        //         alignWithLabel: true,
        //       },
        //     },
        //   ],

        //   yAxis: [
        //     {
        //       type: "value",
        //     },
        //   ],
        //   series: [
        //     {
        //       name: "项目积分",
        //       type: "bar",
        //       barWidth: "30%",
        //       // data: [10, 52, 200, 334, 554],
        //       data: this.dataList.series[0].data,
        //     },
        //   ],
        // };
        // myChart.setOption(option);
      });
    },
    getEchartData2() {
      // let myChart = this.$echarts.init(document.getElementById("myChart"));
      var roseCharts = document.getElementById("chart2");
      var myChart = echarts.init(roseCharts);
      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "1%",
          containLabel: true,
        },
        // 图例
        legend: {
          data: ["部门一", "部门二"],
        },
        xAxis: [
          {
            type: "category",
            data: ["第一季度", "第二季度", "第三季度", "第四季度"],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "部门一",
            type: "bar",
            barWidth: "30%",
            data: [30, 72, 600, 434],
          },
          {
            name: "部门二",
            type: "bar",
            barWidth: "30%",
            data: [10, 52, 200, 334],
          },
        ],
      };
      myChart.setOption(option);
    },
    award() {
      window.sessionStorage.clear();
      this.$router.push("/award");
    },
    project() {
      window.sessionStorage.clear();
      this.$router.push("/project");
    },
    order() {
      window.sessionStorage.clear();
      this.$router.push("/order");
    },
    declare() {
      window.sessionStorage.clear();
      this.$router.push("/declare");
    },
    exchange() {
      window.sessionStorage.clear();
      this.$router.push("/exchange");
    },
    admin() {
      window.sessionStorage.clear();
      this.$router.push("/admin");
    },
    tongji() {
      window.sessionStorage.clear();
      this.$router.push("/tongji");
    },
    daichuli() {
      window.sessionStorage.clear();
      this.$router.push("/order");
    },

    company(url) {
      window.open(url, "_blank");
    },
  },
};
</script>
<style lang="scss" scoped>
.main-container1 {
  background-color: #f0f8fa;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  .containerBox {
    width: 46%;
    height: 400px;
    background: #fff;
    margin: 30px 2%;
    padding: 20px 40px;
    box-sizing: border-box;
    box-shadow: 2px 2px 2px 2px #f7f7f7;
  }
  // .containerBox1 {
  //   width: 45%;
  //   height: 400px;
  //   margin: 30px 32%;
  //   padding: 20px 40px;
  //   box-sizing: border-box;
  //   background: #fff;
  //   box-shadow: 2px 2px 2px 2px #f7f7f7;
  // }
  .title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 30px;
  }
  .left-top {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .icontfonts {
      width: 25%;
      margin: 30px 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      .name {
        display: flex;
        align-items: center;
        justify-items: center;
        margin-top: 10px;
      }
      .icon {
        width: 45px;
        height: 45px;
      }
    }
  }
  .right-top {
    .icontfonts {
      width: 25%;
      margin: 50px 1%;
      display: flex;
      // flex-direction: column;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      .name {
        display: flex;
        align-items: center;
        justify-items: center;
        // margin-top: 10px;
        // margin-left: 20px;
      }
      .icon {
        width: 50px;
        height: 50px;
      }
    }
  }
  .left-bottom {
    .chart1 {
      height: auto;
    }
  }
}
</style>
<style>
.el-badge__content {
  background-color: #f56c6c;
  border-radius: 10px;
  color: #fff;
  display: inline-block;
  font-size: 14px !important;
  height: 22px !important;
  line-height: 22px !important;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #fff;
}
.el-menu-item {
  font-size: 16px;
}
.el-badge__content.is-fixed {
  position: absolute;
  top: -10px;
  right: 0px;
}
</style>
