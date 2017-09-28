<style lang='sass'>
  @import '../../styles/components/page/comment';
</style>

<template>
  <div class='comments-con'>
    <div class='comments-head'>
      <span class='head-tip'>留言管理</span>
    </div>
    <div class='comments-nav'>
      <ul>
        <li v-link='{ name: "commentList" }'>留言列表</li>
        <li v-link='{ name: "commentPost", params: { id: 123 }}'>文章列表</li>
      </ul>
    </div>
    <div class='comments-body'>
      <router-view></router-view>
    </div>
  </div>
</template>