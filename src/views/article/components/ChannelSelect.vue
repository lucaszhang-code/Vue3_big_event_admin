<script setup lang="ts">
import { artGetChannelService } from '@/api/article'
import { ref } from 'vue'

const channelList = ref([])
defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const getChannelList = async () => {
  const res = await artGetChannelService()
  channelList.value = res.data.data
}

getChannelList()
</script>

<template>
  <el-select
    style="min-width: 200px"
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <!--          label给用户看的，value最终提交给后台的-->
    <el-option
      v-for="channel in channelList"
      :label="channel.cate_name"
      :value="channel.id"
      :key="channel.id"
    ></el-option>
  </el-select>
</template>

<style scoped></style>
