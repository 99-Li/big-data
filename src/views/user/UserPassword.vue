<!-- 重置密码 -->
<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { userUpdatePasswordService } from '@/api/user.js'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
const formRef = ref('')
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})
const checkDifferent = (rule, value, callback) => {
  if (value === pwdForm.value.old_pwd) {
    callback(new Error('原密码和新密码不能一样!'))
  } else {
    callback()
  }
}

const checkPasswords = (rule, value, callback) => {
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error('新密码和确认密码不一样!'))
  } else {
    callback()
  }
}

const rules = {
  old_pwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度为6-15位', trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度为6-15位', trigger: 'blur' },
    { validator: checkDifferent, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度为6-15位', trigger: 'blur' },
    { validator: checkPasswords, trigger: 'blur' }
  ]
}
const userStore = useUserStore()
const router = useRouter()
const updatePwd = async () => {
  // 先做预校验
  await formRef.value.validate()
  await userUpdatePasswordService(pwdForm.value)
  ElMessage.success('修改密码成功')

  // 密码修改成功后，需要退出重新登录
  // 1. 清空本地存储的 token 和 个人信息
  userStore.removeToken()
  userStore.setUser({})

  // 拦截登录
  router.push('/login')
}
const resetForm = () => {
  // 重置密码
  formRef.value.resetFields()
}
</script>
<template>
  <page-container title="重置密码">
    <!-- 表单部分 -->
    <el-row>
      <el-col :span="12">
        <el-form
          :model="pwdForm"
          :rules="rules"
          ref="formRef"
          label-width="100px"
          size="large"
        >
          <el-form-item label="原密码" prop="old_pwd">
            <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new_pwd">
            <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="re_pwd">
            <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="updatePwd" type="primary">修改密码</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>
