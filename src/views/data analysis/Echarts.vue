<script setup>
import * as echarts from 'echarts'
import { onMounted } from 'vue'
import {
  artGetArticleListService,
  artGetArticleListsService
} from '@/api/article.js'
import { ref } from 'vue'
// 加载
const loading = ref(false)
const data = ref([])
const count = ref([])
// 定义状态为已发布和草稿的总数量
const stateY = ref(0)
const stateN = ref(0)
// 定义请求参数对象
const params = ref({
  pagenum: 1, // 当前页面数
  // 目前数据有多条，超过了5，因为没有设置页面跳转，只能最多显示5条
  pagesize: 999, // 当页所需要的数据条数
  cate_id: '',
  state: ''
})

// 基于准备好的dom，初始化echarts实例
onMounted(async () => {
  try {
    loading.value = true
    const resC = await artGetArticleListService()
    const resA = await artGetArticleListsService(params.value)

    resA.data.data.map((item) => {
      if (item.state === '已发布') stateY.value += 1
      else stateN.value += 1
    })
    count.value = resA.data.data.map((item) => item.cate_name)
    // 文章分类数据初始值
    data.value = resC.data.data.map((index) => ({
      value: 0, //文章数(总) 草稿 + 已发布
      name: index.cate_name // 分类名
    }))
    // 循环数据，获取每个文章分类下的文章数量
    for (let i = 0; i < count.value.length; i++) {
      const name = count.value[i]
      for (let j = 0; j < data.value.length; j++) {
        if (data.value[j].name === name) {
          data.value[j].value += 1
        }
      }
    }
    loading.value = false
  } catch (error) {
    console.log(error)
  }

  // 生成饼状图的数据
  // 饼图分类
  const myChartC = echarts.init(document.querySelector('.channel'))

  const optionC = {
    title: {
      text: '文章分类数据详情',
      subtext: '仅统计不同分类文章数量',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: data.value.map((item) => ({
          value: item.value,
          name: item.name
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  myChartC.setOption(optionC)

  var myChartS = echarts.init(document.querySelector('.state'))

  var optionS = {
    title: {
      text: '文章管理数据详情',
      subtext: '统计文章状态',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [
          { value: stateY.value, name: '已发布' },
          { value: stateN.value, name: '草稿' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  myChartS.setOption(optionS)
})
</script>

<template>
  <page-container title="数据分析">
    <div class="flex">
      <div class="channel" v-loading="loading"></div>
      <div class="main">柱状图</div>
      <div class="state" v-loading="loading"></div>
    </div>
  </page-container>
</template>

<style lang="scss" scoped>
.flex {
  //   margin-top: 50px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  .main {
    margin-top: 75px;
    height: 500px;
    width: 800px;
    border: 1px solid pink;
  }
  .channel,
  .state {
    margin-top: 170px;
    padding-top: 25px;
    padding-left: 25px;
    width: 400px;
    height: 300px;
  }
}
</style>
