<script setup>
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components'
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
])
</script>

<template>
  <page-container title="数据分析">
    <div class="main"></div>
    <div class="flex">
      <div class="channel"></div>
      <div class="state"></div>
    </div>
  </page-container>
</template>

<style lang="scss" scoped>
.main {
  margin: 0 auto;
  height: 350px;
  width: 1000px;
  border: 1px solid pink;
}
.flex {
  //   margin-top: 50px;
  display: flex;
  justify-content: space-between;
  .channel {
    width: 300px;
    height: 300px;
    border: 1px solid skyblue;
  }
  .state {
    width: 300px;
    height: 300px;
    border: 1px solid orange;
  }
}
</style>
