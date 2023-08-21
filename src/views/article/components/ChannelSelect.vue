<script setup>
import { artGetArticleListService } from '@/api/article.js'
import { ref } from 'vue'
// 父传子，子接收
defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: {
    type: String
  }
})

// 子传父，子发送
const emit = defineEmits(['update:modelValue'])

const channelList = ref([])
const getChannelList = async () => {
  const res = await artGetArticleListService()
  channelList.value = res.data.data
  console.log(channelList.value)
}
getChannelList()
</script>

<template>
  <!-- 子获取数据 绑定数据 :modelValue="modelValue" -->
  <!-- 子返回数据，传给父 @update:modelValue="emit('update:modelValue', $event)" -->
  <!-- cid只是个命名 与modelValue一致 -->
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :style="{ width }"
  >
    <el-option
      v-for="item in channelList"
      :key="item.id"
      :label="item.cate_name"
      :value="item.id"
    ></el-option>
  </el-select>
</template>
