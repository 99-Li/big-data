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
  pagesize: 999, // 当页所需要的数据条数
  cate_id: '',
  state: ''
})

const params1 = ref({
  pagenum: 1, // 当前页面数
  pagesize: 999, // 当页所需要的数据条数
  cate_id: '',
  state: '草稿'
})

// 柱状图数据定义
const AllChannel = ref([])
const AllArticles = ref([])
const editorName = ref([])
const editorArticle = ref([])
const editorArticles = ref([])
const publishArticle = ref([])

// 基于准备好的dom，初始化echarts实例
onMounted(async () => {
  try {
    loading.value = true
    const resC = await artGetArticleListService()
    const resA = await artGetArticleListsService(params.value)
    // 获取每个分类下的草稿状态的文章-start
    const resE = await artGetArticleListsService(params1.value)
    editorName.value = resE.data.data.map((index) => index.cate_name)
    console.log(editorName.value)

    editorArticle.value = resC.data.data.map((index) => ({
      value: 0, //文章数(总) 草稿
      name: index.cate_name // 分类名
    }))
    // 循环数据，获取每个文章分类下的文章数量
    for (let i = 0; i < editorName.value.length; i++) {
      const name = editorName.value[i]
      for (let j = 0; j < editorArticle.value.length; j++) {
        if (editorArticle.value[j].name === name) {
          editorArticle.value[j].value -= 1
        }
      }
    }
    console.log(editorArticle.value)
    // 获取每个分类下的草稿状态的文章-end

    resA.data.data.map((item) => {
      if (item.state === '已发布') stateY.value += 1
      else stateN.value += 1
    })
    AllChannel.value = resC.data.data.map((index) => index.cate_name)
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
    // 每个文章分类下的文章总数获取
    AllArticles.value = data.value.map((index) => index.value)
    editorArticles.value = editorArticle.value.map((index) =>
      index.value === 0 ? '' : index.value
    )

    publishArticle.value = AllArticles.value.map(
      (value, index) => value + editorArticles.value[index]
    )
    console.log(publishArticle.value)
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
        name: 'channel',
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
        name: 'state',
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

  // 柱状图
  // 需要拿到的数据有，
  // 1.所有分类的名称 AllChannel
  // 2.每个分类的发布文章数（已发布 + 草稿）AllArticles
  // 3.每个分类的状态为草稿的文章数 editorArticles
  // 4.每个分类的状态为已发布的文章数（2 - 3） publishArticle
  console.log(AllChannel)
  var myChartA = echarts.init(document.querySelector('.main'))

  var optionAll = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['已发布', '草稿', '文章数']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'value'
      }
    ],
    yAxis: [
      {
        type: 'category',
        axisTick: {
          show: false
        },
        data: AllChannel.value
      }
    ],
    series: [
      {
        name: '已发布',
        type: 'bar',
        label: {
          show: true,
          position: 'inside'
        },
        emphasis: {
          focus: 'series'
        },
        data: publishArticle.value
      },
      {
        name: '文章数',
        type: 'bar',
        stack: 'Total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: AllArticles.value
      },
      {
        name: '草稿',
        type: 'bar',
        stack: 'Total',
        label: {
          show: true,
          position: 'left'
        },
        emphasis: {
          focus: 'series'
        },
        data: editorArticles.value
      }
    ]
  }

  myChartA.setOption(optionAll)
})
</script>

<template>
  <page-container title="数据分析">
    <div class="flex" v-loading="loading">
      <div class="channel"></div>
      <div class="main"></div>
      <div class="state"></div>
    </div>
    <h2>文章总数据 ~ <span>一览表</span></h2>
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
h2 {
  text-align: center;
  text-indent: -4em;
  span {
    color: skyblue;
  }
}
</style>
