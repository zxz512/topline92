<template>
  <div class="block">
    <span class="demonstration"></span>
    <el-carousel height="620px">
      <el-carousel-item v-for="item in 4" :key="item">
        <h3 class="small">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
  </div>

</template>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.35;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
background-image: url('../login/10.jpg');
background-size:cover;
background-position:center center;

  }
  .el-carousel__item:nth-child(2n+1) {
     background-image: url('../login/6.jpg');
background-size:cover;
background-position:center center;
  }

   .el-carousel__item:nth-last-child(3){
     background-image: url('../login/17.jpg');
background-size:cover;
background-position:center center;
  }
  .el-carousel__item:nth-last-child(4){
     background-image: url('../login/02.jpg');
background-size:cover;
background-position:center center;
  }

</style>
