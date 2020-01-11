<template>
  <!--卡片区-->
  <el-card class="box-card">
    <!--命名插槽，头部内容设置-->
    <div slot="header" class="clearfix">
      <span>账户信息</span>
    </div>
    <!--匿名插槽，卡片主体内容-->
    <div class="text item cardbody">
      <div id="lt">
        <el-form ref="accountFormRef" :model="accountForm" label-width="100px" :rules="accountFormRules">
          <el-form-item label="用户名：" prop="name">
            <el-input v-model="accountForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：">
            <el-input v-model="accountForm.mobile" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="accountForm.email"></el-input>
          </el-form-item>
          <el-form-item label="简介：">
            <el-input type="textarea" v-model="accountForm.intro"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editAccount()">更新账户</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div id="rt">头像展示区域</div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'Account',
  data () {
    return {
      accountForm: {
        // 各个成员来自api参考【2.4 编辑用户资料】
        id: '', // id
        name: '', // 名称
        mobile: '', // 手机号码
        email: '', // 邮箱
        intro: '' // 简介
      },
      // 表单校验
      accountFormRules: {
        name: [
          { required: true, message: '名字必填' },
          // 后端要求title长度介于1-7个字符
          {
            min: 1,
            max: 7,
            message: '名字长度介于1-7个字符之间'
          }
        ],
        email: [
          { required: true, message: '邮箱必填' },
          { type: 'email', message: '邮箱格式不正确' }
        ]
      }
    }
  },
  created () {
    this.getAccountInfo()
  },
  methods: {
    // 更新账户信息
    editAccount () {
      // 校验表单
      this.$refs.accountFormRef.validate(valid => {
        if (!valid) { return false }
        // axios带着更新好的账户信息请求服务器端存储
        // get(获取)/post(添加)/put(修改)/delete(删除)
        // patch(修改)
        // put: 对“全部”表单域项目进行修改
        // patch: 对“部分”表单域项目进行修改
        // get“请求字符串”参数通过params传递，params设置参数会在url地址中体现 ?x=y&x=y....
        // 其他请求方式传递的参数都是data(浏览器地址栏看不见该参数)
        let pro = this.$http({
          url: '/mp/v1_0/user/profile',
          method: 'patch',
          data: this.accountForm
        })
        pro
          .then(result => {
            // console.log(result)
            // 成功提示
            this.$message.success('更新成功！')
          })
          .catch(err => {
            return this.$message.error('更新账户信息失败：' + err)
          })
      })
    },

    // 获得账户的基本信息
    getAccountInfo () {
      let pro = this.$http({
        url: '/mp/v1_0/user/profile',
        method: 'get'
      })
      pro
        .then(result => {
          console.log(result)
          // 把获得好的账户信息赋予给 accountForm
          this.accountForm = result.data.data
        })
        .catch(err => {
          return this.$message.error('获得账户信息失败：' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
// 给表单 和 头像区域做布局样式设计
.cardbody {
  display: flex;
  justify-content: space-between;
  #lt {
    width: 40%;
    background-color: pink;
  }
  #rt {
    width: 30%;
    background-color: lightgreen;
  }
}
</style>
