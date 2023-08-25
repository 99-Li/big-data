<!-- 个人详情  -->
<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import { userUpdateInfoService } from '@/api/user.js'

const formRef = ref()
// 是在使用仓库中数据的初始值(无需响应式) 解构无问题
const {
  user: { username, id, nickname, email },
  getUser
} = useUserStore()
const form = ref({
  id,
  username, //可根据实际情况设置默认值
  nickname,
  email
})

const rules = ref({
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '昵称长度在2-10个非空字符',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱格式',
      trigger: 'blur'
    }
  ]
})

const submitForm = async () => {
  // 等待校验结果
  await formRef.value.validate()
  // 提交修改
  await userUpdateInfoService(form.value)
  // 通知 user 模块，进行数据的更新
  await getUser()
  // 提示用户
  ElMessage.success('修改成功')
}
</script>
<template>
  <page-container title="基本资料">
    <!-- 表单部分 -->

    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="登录名称">
        <el-input
          style="width: 50%"
          v-model="form.username"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input style="width: 50%" v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input style="width: 50%" v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交修改</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>
