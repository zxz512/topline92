<template>
  <el-container background-color="gray" >
<el-aside :width="isCollapse?'65px':'200px'" >
   <el-menu text-color="black" active-text-color="#ffd04b" :collapse="isCollapse"  :collapse-transition="false" router>
      <el-menu-item index="/home"  :style="{width:isCollapse?'65px':'200px'}">
        <i class="el-icon-location"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu index="2" :style="{width:isCollapse?'65px':'200px'}">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>内容管理</span>
        </template>
        <el-menu-item index="/articleadd">发布文章</el-menu-item>
        <el-menu-item index="/article">文章列表</el-menu-item>
        <el-menu-item index="5">评论列表</el-menu-item>
       <el-menu-item index="/material">素材管理</el-menu-item>
      </el-submenu>
      <el-menu-item index="7" :style="{width:isCollapse?'65px':'200px'}">
        <i class="el-icon-document"></i>
        <span slot="title">粉丝管理</span>
      </el-menu-item>
      <el-menu-item index="/account" :style="{width:isCollapse?'65px':'200px'}">
        <i class="el-icon-setting"></i>
        <span slot="title">账户管理</span>
      </el-menu-item>
       <el-menu-item index="/date" :style="{width:isCollapse?'65px':'200px'}">
        <i class="el-icon-date"></i>
        <span slot="title">当前日期显示</span>
      </el-menu-item>
      <el-menu-item index="/photo" :style="{width:isCollapse?'65px':'200px'}">
        <i class="el-icon-picture"></i>
        <span slot="title">照片墙</span>
      </el-menu-item>

    </el-menu>
</el-aside>
    <el-container>
  <el-header>
  <div id="lt">

<i
  slot="prefix"
  :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"
  style="cursor:pointer;"
  @click="isCollapse=!isCollapse"
></i>

    <span style="color:red ;font-size:25px">2020鼠年大吉，平安喜乐</span>
       <i class="iconfont" style="font-size:30px;margin-left:15px;color:red">&#xe654;</i>
  </div>

  <div id="rt">
    <el-input type="text" placeholder="请输入搜索的文章内容" style="width:300px;">
      <i slot="prefix" class="iconfont" >&#xe606;</i>
    </el-input>
    <span style="margin:0 10px;">消息</span>
    <el-dropdown>
      <span class="el-dropdown-link">
        <img :src="photo" alt width="40" height="40">
        {{name}}
        <i class="iconfont">&#xe67d;</i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>个人信息</el-dropdown-item>
        <el-dropdown-item>github地址</el-dropdown-item>
        <el-dropdown-item @click.native="logout()">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</el-header>
<el-main>
   <!--给子组件设置占位符-->
  <router-view></router-view>
</el-main>
    </el-container>
  </el-container>
</template>
<script>
// 导入公共bus的vue对象
import bus from '@/utils/bus.js'

export default {
  name: 'Home',
  // 计算属性应用
  computed: {
    // 获得账户名称
    name: function () {
      return this.tmpname || JSON.parse(window.sessionStorage.getItem('userinfo')).name
    },
    // 获得账户头像
    photo: function () {
      return this.tmpphoto || JSON.parse(window.sessionStorage.getItem('userinfo')).photo
    }
  },
  data () {
    return {
      // 名称临时成员(用以解决响应式同步更新问题)
      tmpname: '', // 名称
      tmpphoto: '', // 头像
      isCollapse: false // 折叠true、展开false
    }
  },
  created () {
    // 更新名称
    bus.$on('upAccountName', nm => {
      // console.log(nm)
      // 把nm赋值给临时成员tmpname
      this.tmpname = nm
      // nm对sessionStorage数据做更新
      let userinfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
      // 对userinfo对象的单个name项目做更新
      userinfo.name = nm
      // 把更新好的userinfo再回传存储到sessionStorage里边
      window.sessionStorage.setItem('userinfo', JSON.stringify(userinfo))
    })
    // 更新头像
    bus.$on('upAccountPhoto', ph => {
      // 把nm赋值给临时成员tmpname
      this.tmpphoto = ph
      // nm对sessionStorage数据做更新
      let userinfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
      // 对userinfo对象的单个name项目做更新
      userinfo.photo = ph
      // 把更新好的userinfo再回传存储到sessionStorage里边
      window.sessionStorage.setItem('userinfo', JSON.stringify(userinfo))
    })
  },
  methods: {
    // 退出系统
    logout () {
      // 确认
      this.$confirm('确认要退出系统么?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清空sessionStorage数据
        window.sessionStorage.clear()
        // 导航到登录页面
        this.$router.push({ name: 'login' })
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  background-image: url('../login/55.jpg');
  background-size:cover;
background-position:center center;
  height: 100%;
  .el-menu{
     background:rgba(231, 231, 231, 0.3)
  }
  .el-aside {
 background:rgba(231, 231, 231, 0.3)
  }
  .el-header{
    background-color:rgba(255, 255, 255,0.2);
    display: flex;
    justify-content: space-between;
    padding: 0 10px 0 9px;
    min-width: 950px; background-color:rgba(255, 255, 255,0.2);
    display: flex;
    justify-content: space-between;
    padding: 0 10px 0 9px;
    min-width: 950px;
  }
  #lt {
      height: 100%;
      width: 40%;
      background-color: rgba(255, 255, 255,0.2);
      font-size: 20px;
      display: flex;
      align-items: center;
    }
    #rt {
      height: 100%;
      width: 50%;
      background-color: rgba(255, 255, 255,0.2);
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .el-dropdown-link {
        display: flex;
        align-items: center;
      }
    }
  }
  .el-main{
    // background-color:rgb(255, 255, 255,0.2);
  }
</style>
