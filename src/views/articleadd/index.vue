<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>发表文章</span>
    </div>
    <el-form ref="addFormRef" :model="addForm" label-width="100px" :rules="addFormRules">
      <el-form-item label="标题" prop="title">
        <el-input v-model="addForm.title"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <!-- quill-editor最后编译变成许多html标签，它们身上没有data-v-xx的属性 -->
        <quill-editor v-model="addForm.content"></quill-editor>
      </el-form-item>
      <el-form-item label="封面">
        <!-- el-radio-group是el-radio单选按钮的父标签，可以统一设置v-model或change事件等 -->
        <el-radio-group v-model="addForm.cover.type">
          <el-radio :label="1">单图</el-radio>
          <el-radio :label="3">三图</el-radio>
          <el-radio :label="0">无图</el-radio>
          <el-radio :label="-1">自动</el-radio>
        </el-radio-group>
        <ul>
          <!-- 把item序号信息当做参数传递给showDialog,可以获得到的信息分别为 1 2 3 -->
          <li class="uploadbox" v-for="item in covernum" :key="item" @click="showDialog(item)">
            <span>点击图标选择图片</span>
            <img v-if="addForm.cover.images[item-1]" :src="addForm.cover.images[item-1]" alt="">
            <div v-else class="el-icon-picture-outline"></div>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="频道" prop="channel_id">
        <!-- 给channel子组件声明一个事件 -->
        <channel @slt="selectHandler"></channel>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addarticle(false)">发布</el-button>
        <el-button @click="addarticle(true)">存入草稿</el-button>
      </el-form-item>
    </el-form>

    <!-- @close是对话框的关闭事件，任何条件关闭对话框，都会执行该事件 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="60%" @close="clearImage">
      <!-- 标签切换效果 -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first">
          <!-- 素材图片列表展示 -->
          <ul>
            <li class="image-box" v-for="item in imageList" :key="item.id">
              <img :src="item.url" alt="没有图片" @click="clkImage" />
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <el-button type="primary">上传图片</el-button>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="imageOK">确 定</el-button>
      </span>
    </el-dialog>

    <!-- <el-dialog
      title="提示"
      :visible.sync="dialogVisible"  // 设定对话框是否显示
      width="30%" // 对话框宽度限制
      :before-close="handleClose" // 关闭前的回调处理
      >
      <span>这是一段信息</span> // 对话框主体内容(匿名插槽体现)
      <span slot="footer" class="dialog-footer"> // (命名插槽)
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>-->
  </el-card>
</template>

<script>
// 对频道“独立组件”做 导入、注册、使用
import Channel from '@/components/channel.vue'

// 导入富文本编辑器的css样式文件
// vue-quill-editor 是构建在quill基础之上的(是进一步的封装)
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入富文本编辑器的组件模块
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'ArticleAdd',
  computed: {
    covernum () {
      // 设计选择框显示个数
      // type>0  ========= type值
      // type<=0 ==========0 值
      if (this.addForm.cover.type > 0) {
        return this.addForm.cover.type
      }
      return 0
    }
  },
  components: {
    // 富文本编辑器的组件模块做注册
    quillEditor,
    Channel // 频道
  },
  data () {
    return {
      materialUrl: '', // 记录选中的素材图片url地址的(临时接收)
      xu: 0, // 记录选择框序号 0第一个   1第二个   2第三个
      activeName: 'first', // 默认激活标签
      // 获得素材图片的条件
      querycdt: {
        collect: false, // 非收藏的
        page: 1, // 页码
        per_page: 12 // 条数
      },
      imageList: [], // 图片列表

      dialogVisible: false, // 对话框是否显示 true/false
      // 添加文章表单数据对象
      addForm: {
        title: '', // 文章标题
        content: '', // 文章内容
        // 文章封面
        cover: {
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: [] // 封面图片 路径名集合
        },
        channel_id: '' // 频道
      },
      // 表单校验规则
      addFormRules: {
        title: [
          { required: true, message: '标题必填' },
          // 后端要求title长度介于5-30个字符
          {
            min: 5,
            max: 30,
            message: '标题长度介于5-30个字符'
          }
        ],
        content: [{ required: true, message: '内容必填' }],
        channel_id: [{ required: true, message: '频道必选' }]
      }
    }
  },
  created () {
    // 获得素材图片列表
    this.getImageList()
  },
  methods: {
    // 给选中的图片做初始化清除工作
    clearImage () {
      // 选中图片的高亮 边框清除
      let lis = document.querySelectorAll('.image-box')
      for (var i = 0; i < lis.length; i++) {
        lis[i].style.border = ''
      }
      // 选中图片的materialUrl地址清除
      this.materialUrl = ''
    },

    // 确定选择当前图片了
    imageOK () {
      // 判断是否选中图片
      if (this.materialUrl) {
        // 把选择好的图片的地址赋予给 addForm.cover.images里边
        // materialUrl------->addForm.cover.images['url','url','url']
        this.addForm.cover.images[this.xu] = this.materialUrl
        // 关闭对话框
        this.dialogVisible = false
      } else {
        this.$message.error('没有想要的照片吗？')
      }
    },
    // 素材图片被单击选中
    clkImage (evt) {
      // evt:事件对象
      // console.log(evt) // MouseEvent
      // evt.target: 目标被单击的dom的img对象
      // evt.target.parentNode // 获得父级li标签对象
      // 给li设置border边框效果

      // 全部项目的border都清除
      let lis = document.querySelectorAll('.image-box')
      for (var i = 0; i < lis.length; i++) {
        lis[i].style.border = ''
      }

      // 当前选中项目的border给设置好
      let nowli = evt.target.parentNode
      nowli.style.border = '7px solid orange'
      // 把选中图片的url地址赋予给materialUrl成员
      this.materialUrl = evt.target.src
    },

    // 获得图片列表
    getImageList () {
      let pro = this.$http({
        url: '/mp/v1_0/user/images',
        method: 'get',
        params: this.querycdt
      })
      pro
        .then(result => {
          // console.log(result)
          // imageList接收素材图片
          this.imageList = result.data.data.results
        })
        .catch(err => {
          return this.$message.error('获得图片列表失败：' + err)
        })
    },

    // 显示对话框
    showDialog (n) {
      this.xu = n - 1 // 选择框序号是从0开始的，要减一操作
      this.dialogVisible = true
    },

    // 声明事件方法，用于接收子组件channel传递过来的频道id
    // id:频道子组件传递过来的选中的频道id
    selectHandler (id) {
      // 把id赋值给addForm.channel_id
      this.addForm.channel_id = id
    },

    // 发表文章
    // @flag: false发布   true草稿
    addarticle (flag) {
      // 表单整体校验
      this.$refs.addFormRef.validate(valid => {
        // 校验失败停止后续执行
        if (!valid) {
          return false
        }

        // 继续
        // axios
        let pro = this.$http({
          url: '/mp/v1_0/articles',
          method: 'post',
          data: this.addForm, // 表单数据
          params: { draft: flag } // 请求字符串数据url?draft=true
        })
        pro
          .then(result => {
            this.$message.success('发布文章成功！')
            // console.log(result)
            // 跳转到列表页面
            this.$router.push({ name: 'article' })
          })
          .catch(err => {
            return this.$message.error('发布文章失败：' + err)
          })
      })
    }
  }
}
</script>

<style lang="less" scoped>
/*控制富文本编辑器的高度样式*/
// .ql-editor{height:200px;}  // 编译变为.ql-editor[data-v-494db270] { height: 200px; } 失效的

/*使用深度作用选择器
  /deep/深度作用选择器作用： 前边的会关联data-v-xx属性，而后边的不会关联
*/
// 对话框素材图片列表相关css样式
.image-box {
  list-style: none;
  width: 200px;
  height: 140px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  cursor: pointer;
  box-sizing: border-box;
  img {
    width: 100%;
    height: 100%;
  }
}
.quill-editor /deep/ .ql-editor {
  height: 200px;
}
.box-card{background-color:rgba(255, 255, 255,0.2);}
// 上述样式解析完毕：.quill-editor[data-v-494db270] .ql-editor{height:200px;}
.uploadbox {
  list-style: none;
  width: 200px;
  height: 200px;
  margin: 10px;
  float: left;
  cursor: pointer;
  border: 1px solid #eee;
  span {
    width: 200px;
    height: 50px;
    line-height: 50px;
    display: block;
    text-align: center;
  }
  div {
    width: 200px;
    height: 150px;
    font-size: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
  img{
    width: 200px;
    height: 150px;
  }
}
</style>
