<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { userRegisterService, userLoginService } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const isRegister = ref(true)
const form = ref() // 绑定form
const formModel = ref({
  // 注册
  username: '',
  password: '',
  repassword: ''
})

// 整个表单的校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'change' }, // 非空校验
    { min: 5, max: 20, message: '用户名必须是5-20位', trigger: 'blur' } // 长度校验
  ],
  password: [
    { required: true, message: '请输入用户名', trigger: 'change' },
    {
      pattern: /^.{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请输入用户名', trigger: 'change' },
    {
      pattern: /^.{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        // rule当前校验规则的相关信息， value所校验的表单元素目前的表单值，
        if (value !== formModel.value.password)
          callback(new Error('两次输入的密码不相等'))
        else callback()
      },
      trigger: 'blur'
    }
  ]
}

const register = async () => {
  // 注册成功之前进行校验
  await form.value.validate()
  console.log('开始注册请求')
  await userRegisterService(formModel.value)
  ElMessage.success('注册成功')
  isRegister.value = false
}

// 切换时重置表单内容
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})

const router = useRouter()

const login = async () => {
  await form.value.validate()
  console.log('开始登录')
  const res = await userLoginService(formModel.value)
  console.log('登录成功', res)
  useUserStore().setToken(res.data.token)
  ElMessage.success('登录成功')
  await router.push('/')
}
</script>

<template>
  <el-row class="login-page">
    <!--    row表示一行，一行分成24列
    (1) :span="12" 代表在一行中，占12份(50%)
    (2) :span="6"  表示在一行中，占6份(25%)
    (3) :offset="3" 表示在一行中，左侧margin份数
    
    el-form 整个表单组件
    el-form-item 表单的一行
    el-input 表单元素（输入框）

    2.校验相关
    (1) el-from => :model="ruleForm 绑定的整个form的数据对象 {xxx. xxx. xxx}
    (2) el-form => :rules="rules" 绑定的是整个rules规则对象 {xxx, xxx, xxx}
    (3) 表单元素 => v-model="ruleForm.xxx"给表单绑定form子属性
    (4) prop配置生效的是哪个校验规则(和rules中对应的字段对应)
    -->
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <el-form
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
        :model="formModel"
        :rules="rules"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="请输入用户名"
            v-model="formModel.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            v-model="formModel.password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
            v-model="formModel.repassword"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="button"
            type="primary"
            @click="register"
            auto-insert-space
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回</el-link
          >
        </el-form-item>
      </el-form>
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="请输入用户名"
            v-model="formModel.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            v-model="formModel.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            class="button"
            type="primary"
            auto-insert-space
            @click="login"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →</el-link
          >
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;

  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
