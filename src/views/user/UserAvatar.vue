<!-- 更换头像 -->
<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { userUpdateAvatarService } from '@/api/user.js'
import { ref } from 'vue'
// 基于store的数据，初始化imageUrl的初始值
import { useUserStore } from '@/stores'
const userStore = useUserStore()
const imageUrl = ref(userStore.user.user_pic)
// 绑定el-upload框和选择图片按钮，点击选择图片出现文件选择
const uploadRef = ref()

const onSelectFile = (uploadFile) => {
  //   console.log(uploadFile)
  // imageUrl.value = URL.createObjectURL(uploadFile.raw) // 预览
  // 预览方式二：
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    imageUrl.value = reader.result
  }
}
// 上传更新头像
const onAvatar = async () => {
  // 发送请求更新头像
  await userUpdateAvatarService(imageUrl.value)
  // userStore 重新渲染
  userStore.getUser()
  ElMessage.success('头像更新成功')
}
</script>

<template>
  <page-container title="更换头像">
    <el-upload
      ref="uploadRef"
      class="avatar-uploader"
      :show-file-list="false"
      :auto-upload="false"
      :on-change="onSelectFile"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <!-- 绑定点击事件 uploadRef.$el.querySelector('input').click() -->
    <el-button
      @click="uploadRef.$el.querySelector('input').click()"
      type="primary"
      :icon="Plus"
      size="large"
      >选择图片</el-button
    >
    <el-button type="success" :icon="Upload" size="large" @click="onAvatar"
      >上传头像</el-button
    >
  </page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  margin-bottom: 15px;
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
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
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
