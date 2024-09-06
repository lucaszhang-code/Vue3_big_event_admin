<script setup lang="ts">
import PageContainer from '@/components/PageContainer.vue'
import ChannelSelect from '@/views/article/components/ChannelSelect.vue'
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { artDeleteService, artGetListService } from '@/api/article'
import { formatTime } from '@/utils/format'
import ArticleEdit from '@/views/article/components/ArticleEdit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const articleList = ref([])
const total = ref(0)
let isLoading = ref(false)

let params = ref({
  pagenum: 1, // 当前生效的每页条数
  pagesize: 5,
  cate_id: '',
  state: ''
})

const articleRef = ref()

const onAddArticle = () => {
  articleRef.value.open({})
}
// 编辑逻辑
const onEditArticle = (row: any) => {
  articleRef.value.open(row)
}

const onDeleteArticle = async (row: any) => {
  await ElMessageBox.confirm('是否要删除此文章？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDeleteService(row.id)
  await getArticleList()
  ElMessage.success('删除成功')
}

const getArticleList = async () => {
  isLoading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  isLoading.value = false
}

getArticleList()

// 分页逻辑

// 只要每页条数变化了，原本访问的页意义不大
// 重新从第一页渲染
const onSizeChange = (size) => {
  params.value.pagesize = size
  params.value.pagenum = 1
  getArticleList()
}

const onCurrentChange = (page) => {
  params.value.pagenum = page
  getArticleList()
}

// 按照最新的条件去搜索
const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}

const onReset = () => {
  params.value = {
    pagenum: 1, // 当前生效的每页条数
    pagesize: 5,
    cate_id: '',
    state: ''
  }
  getArticleList()
}

// 添加变成成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，最好渲染最后一页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage // 更新成最大页码数
  }
  getArticleList()
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button @click="onAddArticle">添加文章</el-button>
    </template>
    <!--    表单区域-->
    <el-form inline>
      <el-form-item label="文章分类">
        <ChannelSelect v-model="params.cate_id"></ChannelSelect>
      </el-form-item>

      <el-form-item label="发布状态">
        <el-select style="min-width: 200px" v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
        <!--        后台通过中文发布的-->
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button type="danger" @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!--    表格区域-->
    <el-table :data="articleList" v-loading="isLoading">
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      s
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            circle
            plain
            :icon="Edit"
            type="primary"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            circle
            plain
            :icon="Delete"
            type="danger"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--     分页-->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
  </page-container>

  <!--  抽屉-->
  <ArticleEdit @success="onSuccess" ref="articleRef"></ArticleEdit>
</template>

<style scoped lang="scss"></style>
