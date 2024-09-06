<script setup lang="ts">
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { userGetInfoService, userUpdateInfoService } from '@/api/user'
import { ElMessage } from 'element-plus'

const {
  user: { username, nickname, email, id }
} = useUserStore()

const userInfo = ref({ username, nickname, email, id })

const formRef = ref()

// 配置规则
const rules = {
  nickname: [
    { required: true, message: '昵称请勿为空', trigger: 'blur' },
    { min: 3, max: 10, message: '昵称长度应为3到10位', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '邮箱请勿为空', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '邮箱格式不正确',
      trigger: 'blur'
    }
  ]
}

const onSubmit = async () => {
  const valid = await formRef.value.validate()
  if (valid) {
    await userUpdateInfoService(userInfo.value)
    await useUserStore().getUser()
    ElMessage.success('修改成功')
  }
}
</script>

<template>
  <PageContainer title="基本资料">
    <el-row>
      <el-col :span="12">
        <el-form
          label-width="100px"
          size="large"
          :model="userInfo"
          :rules="rules"
          ref="formRef"
        >
          <el-form-item label="登录名称">
            <el-input :model-value="userInfo.username" disabled></el-input>
          </el-form-item>

          <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="userInfo.nickname"></el-input>
          </el-form-item>

          <el-form-item label="用户邮箱" prop="Email">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="onSubmit" type="primary">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </PageContainer>
</template>

<style scoped></style>
