<!-- 文章分类 -->
<script setup>
// import PageContainer from '@/components/PageContainer.vue'
import { artGetArticleListService } from '@/api/article.js'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelEdit from './components/ChannelEdit.vue'
const channelList = ref([])
// 加载
const loading = ref(false)
// 弹层相关
const dialog = ref()

const getChannelList = async () => {
  loading.value = true
  const res = await artGetArticleListService()
  channelList.value = res.data.data
  loading.value = false

  console.log(channelList.value)
}
getChannelList()
// 添加分类按钮
const onAddChannel = () => {
  dialog.value.open({})
}
// 表格操作的编辑和删除按钮
const onEditChannel = (row) => {
  dialog.value.open(row)
  console.log(row)
}

const onDeleteChannel = (row, $index) => {
  console.log(row, $index)
  // 用接口去删除
  // channelList.value = channelList.value.filter((item) => item.id !== row.id)
}
</script>
<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button type="primary" plain @click="onAddChannel">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="180"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row, $index }">
          <el-button
            :icon="Edit"
            type="primary"
            circle
            plain
            @click="onEditChannel(row, $index)"
          ></el-button>
          <el-button
            :icon="Delete"
            type="danger"
            circle
            plain
            @click="onDeleteChannel(row, $index)"
          ></el-button>
        </template>
      </el-table-column>
      <!-- 当表格数据为空时，显示el-empty样式 -->
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <channel-edit ref="dialog"></channel-edit>
  </page-container>
</template>

<style lang="scss" scoped></style>
