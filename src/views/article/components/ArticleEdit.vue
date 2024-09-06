<script setup lang="ts">
import { ref } from 'vue'
import {
  artEditService,
  artGetChannelService,
  artGetDetailService,
  artPublishService
} from '@/api/article'
import ChannelSelect from '@/views/article/components/ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request'
import axios from 'axios'

const defaultForm = {
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
}

// 图片上传相关
const imageUrl = ref('')

const formModel = ref({
  ...defaultForm
})

const visibleDraw = ref(false)
const emit = defineEmits(['success'])

const editorRef = ref()

const open = async (row) => {
  visibleDraw.value = true
  if (row.id) {
    // 需要基于row.id发送请求，获取对象的详细数据
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data
    // 图片需要单独设置
    imageUrl.value = baseURL + res.data.data.cover_img
    // 图片提交给后台时，需要转换相应的格式地址，将字符串转换为file对象，储存起来
    const file = await urlToFile(imageUrl.value, formModel.value.cover_img)
    formModel.value.cover_img = file // 便于提交
  } else {
    // 基于默认数据重置数据,也要重置图片上传和富文本编辑器（手动）
    formModel.value = { ...defaultForm }
    imageUrl.value = ''
    editorRef.value.setHTML('')
  }
}

async function urlToFile(url, fileName) {
  try {
    // 使用 Axios 获取图片的二进制数据
    const response = await axios.get(url, { responseType: 'blob' })

    // 从响应中获取 Blob 对象
    const blob = response.data

    // 创建 File 对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('Error fetching image:', error)
    return null
  }
}

defineExpose({
  open
})

const onSelectFile = (uploadFile) => {
  console.log(uploadFile)
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  formModel.value.cover_img = uploadFile.raw
}

const onPublish = async (state) => {
  formModel.value.state = state

  // 请注意，当前接口是普通对象
  const formData = new FormData()
  for (let key in formModel.value) {
    formData.append(key, formModel.value[key])
  }
  // 发请求
  if (formModel.value.id) {
    console.log('编辑操作')
    await artEditService(formData)
    ElMessage.success('修改成功')
    visibleDraw.value = false
    emit('success', 'edit')
  } else {
    // 添加操作
    await artPublishService(formData)
    ElMessage.success('添加成功')
    visibleDraw.value = false
    // 通知父组件添加成功
    emit('success', 'add')
  }
}
</script>

<template>
  <el-drawer
    v-model="visibleDraw"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <ChannelSelect v-model="formModel.cate_id" width="100%"></ChannelSelect>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <!--        此处需要关闭element plus的自动上传-->
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
            v-model:content="formModel.content"
            contentType="html"
          >
          </quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style scoped lang="scss">
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

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
