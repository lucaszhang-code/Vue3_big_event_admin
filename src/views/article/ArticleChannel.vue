<script setup lang="ts">
import PageContainer from '@/components/PageContainer.vue'
import ChannelEdit from '@/views/article/components/ChannelEdit.vue'
import { artDeleteChannelService, artGetChannelService } from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const channelList = ref([])
const isLoading = ref(false)
const dialog = ref()

const getChannelList = async () => {
  isLoading.value = true
  const res = await artGetChannelService()
  channelList.value = res.data.data
  console.log(channelList.value)
  isLoading.value = false
}

const onAddChannel = () => {
  dialog.value.open({})
}

const onEditChannel = (row, $index) => {
  console.log(row, $index)
  dialog.value.open(row)
}

const onDelChannel = async (row) => {
  console.log(row)
  await ElMessageBox.confirm('你确认要删除该分类吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artDeleteChannelService(row.id)
  ElMessage.success('删除成功')
  await getChannelList()
}

const onSuccess = () => {
  getChannelList()
}

getChannelList()
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button @click="onAddChannel">添加分类</el-button>
    </template>
    <el-table v-loading="isLoading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100" />
      <el-table-column prop="cate_name" label="分类名称" />
      <el-table-column prop="cate_alias" label="分类别名" />
      <el-table-column label="操作" width="100">
        <!--        row是channelList的每一项，$index是下标-->
        <template #default="{ row, $index }">
          <el-button
            plain
            :icon="Edit"
            type="primary"
            circle
            @click="onEditChannel(row, $index)"
          ></el-button>
          <el-button
            plain
            :icon="Delete"
            type="danger"
            circle
            @click="onDelChannel(row, $index)"
          ></el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>

    <ChannelEdit @success="onSuccess" ref="dialog"></ChannelEdit>
  </page-container>
</template>

<style scoped lang="scss"></style>
