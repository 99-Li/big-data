<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import ChannelSelect from './ChannelSelect.vue'

// 富文本编辑器 VueQuill 导包
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

import {
  artPublishArticleService,
  artGetArticleDetailsService,
  artArticleUpdateService
} from '@/api/article.js'

import { baseURL } from '@/utils/request.js'
import axios from 'axios'
const visibleDrawer = ref(false) // 控制抽屉的显示隐藏
const formModel = ref({
  title: '', // 标题
  cate_id: '', // 分类id
  cover_img: '', // 文章封面图片 - file 对象
  content: '', // 文章内容
  state: '' // 文章状态
})
const formRef = ref()
// 图片上传相关
const imageUrl = ref('')

// 文件上传
const onSelectFile = (uploadFile) => {
  //   console.log(uploadFile)
  imageUrl.value = URL.createObjectURL(uploadFile.raw) // 预览
  formModel.value.cover_img = uploadFile.raw
}

// 通过open,基于open传来的参数,区分添加还是编辑
// open调用后,可以打开抽屉
const editorRef = ref()
const open = async (row) => {
  visibleDrawer.value = true
  //   console.log(row)
  if (row.id) {
    // 需要基于 row.id 发送请求,获取编辑对应的详情数据,进行回显
    const res = await artGetArticleDetailsService(row.id)
    formModel.value = res.data.data
    // 图片需要单独处理
    imageUrl.value = baseURL + formModel.value.cover_img
    // 注意：提交给后台，需要的数据格式，是file对象格式
    // 需要将网络图片地址 => 转换成 file对象， 存储起来,将来用于提交
    const file = await imageUrlToFileObject(
      imageUrl.value,
      formModel.value.cover_img
    )
    formModel.value.cover_img = file
  } else {
    formModel.value = {
      title: '', // 标题
      cate_id: '', // 分类id
      cover_img: '', // 文章封面图片 - file 对象
      content: '', // 文章内容
      state: '' // 文章状态
    } // 基于默认的数据, 设置 form 数据
    // 图片上传img地址，富文本编辑器内容 => 需要手动重置
    imageUrl.value = ''
    editorRef.value.setHTML('')
  }
}
// 将网络图片地址转换为 File 对象的函数
async function imageUrlToFileObject(imageUrl, filename) {
  try {
    // 使用 Axios 下载图片数据
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    })

    // 将下载的数据转换成 Blob 对象
    const blob = new Blob([response.data], {
      type: response.headers['content-type']
    })

    // 创建 File 对象
    const file = new File([blob], filename, {
      type: response.headers['content-type']
    })

    return file
  } catch (error) {
    console.error('Error converting image URL to File object', error)
    return null
  }
}

// 文章发布点击事件
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  // 将已发布还是草稿状态，存入 formModel
  formModel.value.state = state

  // 注：当前接口：需要的是 formData 对象
  // 将普通对象 => 转换成 => formData对象
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }

  // 发请求
  if (formModel.value.id) {
    // 编辑操作
    await artArticleUpdateService(fd)
    ElMessage.success('修改成功')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    // 添加操作
    await artPublishArticleService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    // 通知到父组件，添加成功了
    emit('success', 'add')
  }
}

defineExpose({
  open
})
</script>

<template>
  <!-- 添加文章 - 抽屉 -->
  <!-- direction 控制抽屉的打开位置
     left to right 左到右 简写: ltr
     right to left 右到左       rtl
     top to bottom 上到下       ttb
     bottom to top 下到上       btt
       不设置, 默认是从右到左 rtl
  -->
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <!-- 此处需要关闭 element-plus 的自动上传,不需要配置 action 等参数
             只需要做前端的本地预览图片即可,无需在提交前上传图标
             语法: URL.createObjectURL(...) 创建本地预览的地址,来预览
        -->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            theme="snow"
            content-type="html"
            v-model:content="formModel.content"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
// 图片预览样式
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
// 富文本编辑器样式
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
