<!-- 文章分类 -->
<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import {
  artGetArticleListsService,
  artDelArticleService
} from '@/api/article.js'
import { formatTime } from '@/utils/format.js'
import ArticleEdit from './components/ArticleEdit.vue'
const articleList = ref([]) // 文章列表
const total = ref(0) // 总条数
const loading = ref(false) // 加载

// 定义请求参数对象
const params = ref({
  pagenum: 1, // 当前页面数
  // 目前数据有多条，超过了5，因为没有设置页面跳转，只能最多显示5条
  pagesize: 10, // 当页所需要的数据条数
  cate_id: '',
  state: ''
})

// 基于params参数，获取文章列表
const getArticleLists = async () => {
  loading.value = true
  const res = await artGetArticleListsService(params.value)
  console.log(res.data.data)

  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getArticleLists()

const articleEditRef = ref()
// 添加 - 传空对象
const onAddArticle = () => {
  articleEditRef.value.open({})
}

// 编辑 - 传对象
const onEditArticle = (row) => {
  // console.log(row)
  articleEditRef.value.open(row)
}

// 删除
const onDeleteArticle = async (row) => {
  await ElMessageBox.confirm('你确认要删除这个文章吗？', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDelArticleService(row.id)
  ElMessage.success('删除成功')
  getArticleLists()
}

// 添加或者编辑 成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，最好渲染最后一页
    // Math.cell 向上取整求最大页面数
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    // 更新成最大页面数，再渲染
    params.value.pagenum = lastPage
    getArticleLists()
  } else {
    // 如果是编辑，之间渲染当前页即可
    getArticleLists()
  }
}

// 分页逻辑相关函数
const handleSizeChange = (size) => {
  // console.log('当前每页条数', size)
  // 重新从第一页渲染
  params.value.pagenum = 1
  params.value.pagesize = size
  // 基于最新的当前页 和 每页条数, 渲染数据
  getArticleLists()
}

const handleCurrentChange = (page) => {
  // console.log('页码变化了', page)
  // 更新当前页
  params.value.pagenum = page
  // 基于最新的当前页, 渲染数据
  getArticleLists()
}

// 表单 - 搜索功能
// 按照最新的条件, 重新检索, 从第一页开始展示
const search = () => {
  params.value.pagenum = 1
  getArticleLists()
}

// 表单 - 重置功能
// 将筛选条件清空,重新检索, 从第一页开始展示
const reset = () => {
  params.value.state = ''
  params.value.cate_id = ''
  params.value.pagenum = 1
  getArticleLists()
}
</script>
<template>
  <PageContainer title="文章管理">
    <template #extra>
      <el-button @click="onAddArticle" type="primary" plain>添加文章</el-button>
    </template>
    <!-- 表单区域 -->
    <!-- :inline="true" 表单元素一行显示 -->
    <el-form :inline="true">
      <!-- label 展示给用户看的，value 收集起来提交给后台的 -->
      <!-- v-model:modelValue="" :modelValue可以省略 传给子的是modelValue属性 -->
      <el-form-item label="文章分类">
        <channel-select v-model="params.cate_id"></channel-select>
      </el-form-item>

      <el-form-item label="发布状态">
        <!-- 这里后台标记发布状态，就是通过中文标记的，已发布 / 草稿 -->
        <el-select v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="search" type="primary">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <!-- 不能从prop中之间引用 formatTime(pub_date) -->
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <!-- 利用作用域插槽 row 可以获取当前行的数据 -->
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            type="primary"
            circle
            plain
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            type="danger"
            circle
            plain
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <div class="demonstration"></div>
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[5, 10, 15, 20]"
      :background="true"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
    <!-- 添加编辑的抽屉 -->
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
  </PageContainer>
</template>

<style lang="scss" scoped></style>
