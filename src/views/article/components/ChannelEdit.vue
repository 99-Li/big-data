<script setup>
import { ref } from 'vue'
import { artUpdateChannelService, artAddChannelService } from '@/api/article.js'

const dialogVisible = ref(false)
// 预校验
const formRef = ref()
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
// 弹层规则
const rules = {
  cate_name: [
    // 非空校验，报错提示，失焦触发
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    // 非空字符，字符长度为1-10位, 错误提示， 失焦触发
    {
      pattern: /^\S{1,10}$/,
      message: '分类名称必须是 1-10 位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    // 非空校验，报错提示，失焦触发
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    // 正则规则：[a-zA-Z0-9] 包含字母和数字的类型
    // 字符长度为1 - 10位, 错误提示， 失焦触发
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类名称必须是 1-15 位 的字母或数字',
      trigger: 'blur'
    }
  ]
}
// 直接渲染到页面，无需刷新页面
const emit = defineEmits(['success'])
const onSubmit = async () => {
  // 预校验 validate
  await formRef.value.validate()
  // 判断是否有id来区分编辑和添加
  const isEdit = formModel.value.id
  if (isEdit) {
    // 编辑分类
    await artUpdateChannelService(formModel.value)
    ElMessage.success('修改成功')
  } else {
    // 添加分类
    await artAddChannelService(formModel.value)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  emit('success')
}

const open = (row) => {
  console.log(row)
  dialogVisible.value = true
  // 将传入的数据赋到formModel.value里 ...row将row元素全部导入
  formModel.value = { ...row }
}

// 向外暴露
defineExpose({
  open
})
</script>

<template>
  <!-- 修改不同按钮点击后的弹层标题，可根据formModel里面有没有id来判断 
    1.有 编辑分类  2.无 添加分类 -->
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <!-- label可以为input前添加描述 -->
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          v-model="formModel.cate_name"
          placeholder="请输入分类名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          v-model="formModel.cate_alias"
          placeholder="请输入分类别名"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
