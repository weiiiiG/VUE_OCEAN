<template>
  <el-dialog
    :model-value="visible"
    title="登录系统"
    width="420px"
    :close-on-click-modal="false"
    @close="$emit('close')"
  >
    <el-form label-position="top">
      <el-form-item label="用户名">
        <el-input :model-value="username" placeholder="请输入用户名" @update:model-value="$emit('update:username', $event)" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          :model-value="password"
          type="password"
          show-password
          placeholder="请输入密码"
          @update:model-value="$emit('update:password', $event)"
        />
      </el-form-item>
      <div class="login-dialog__hint">
        当前为前端登录占位流程，后续可直接替换为真实后端认证接口。
      </div>
    </el-form>
    <template #footer>
      <div class="login-dialog__footer">
        <el-button @click="$emit('close')">取消</el-button>
        <el-button type="primary" @click="$emit('confirm')">登录</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  username: string
  password: string
}>()

defineEmits<{
  close: []
  confirm: []
  'update:username': [value: string]
  'update:password': [value: string]
}>()
</script>

<style scoped lang="scss">
.login-dialog__hint {
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(37, 108, 198, 0.08);
  color: #58739b;
  font-size: 13px;
}

.login-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
