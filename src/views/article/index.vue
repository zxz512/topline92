<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <!-- 绘制form表单相关 -->
      <el-form ref="searchFormRef" :model="searchForm" label-width="100px">
        <el-form-item label="文章状态：">
          <el-radio v-model="searchForm.status" label>全部</el-radio>
          <el-radio v-model="searchForm.status" :label=" 0 ">草稿</el-radio>
          <el-radio v-model="searchForm.status" :label=" 1 ">待审核</el-radio>
          <el-radio v-model="searchForm.status" :label=" 2 ">审核通过</el-radio>
          <el-radio v-model="searchForm.status" :label=" 3 ">审核失败</el-radio>
        </el-form-item>
        <el-form-item label="频道列表：">
          <el-select v-model="searchForm.channel_id" placeholder="请选择"  clearable>

            <el-option
              v-for="item in channelList"
              :key="item.id"
              :label="item.name"
              :value="item.id" ></el-option>

          </el-select>
        </el-form-item>
        <el-form-item label="时间选择：">
          <el-date-picker
            v-model="timetotime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            >
          </el-date-picker>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  // 每个组件都要设置一个唯一属性值的name属性，好处：在devtools里边方便寻找当前的组件
  name: 'Article',

  // 监听器设置
  watch: {
    // 被检测的成员: function (newV, oldV) {
    //   // newV:数据变化后样子
    //   // oldV:数据变化前样子
    // }
    // 被检测成员一般就是data成员,它们的名称保持一致
    timetotime: function (newV) {
      // 把接收到的时间信息一分为二给到 begin_pubdate 和 end_pubdate
      if (newV) {
        this.searchForm.begin_pubdate = newV[0]
        this.searchForm.end_pubdate = newV[1]
      } else {
        // 清除时间信息
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
    }
  },

  data () {
    return {
      channelList: [], // 频道列表
      timetotime: '', // 时间范围临时接收成员
      // 检索表单数据对象
      searchForm: {
        begin_pubdate: '', // 开始时间
        end_pubdate: '', // 结束时间
        channel_id: '', // 频道id
        status: '' // 文章状态，''-全部, 0-草稿，1-待审核，2-审核通过，3-审核失败
      }
    }
  },
  created () {
    // 获得频道
    this.getChannelList()
  },
  methods: {
    // 获得真实频道列表数据
    getChannelList () {
      let pro = this.$http({
        url: '/mp/v1_0/channels',
        method: 'get'
      })
      pro
        .then(result => {
          // console.log(result)
          // data接收频道数据
          this.channelList = result.data.data.channels
        })
        .catch(err => {
          return this.$message.error('获得频道失败：' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
