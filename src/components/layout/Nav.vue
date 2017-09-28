<style lang='sass'>
  @import '../../styles/components/layout/nav';
</style>

<template>
	<div class='nav'>
	  <div class='nav-title'>
      <div class='fn-con'>
        <span class="glyphicon glyphicon-th-large fn-icon" aria-hidden="true"></span>
        <span>功能</span>
      </div>
    </div>

    <ul class='nav-items'>
      <li v-link='{ path: "/publish" }'><span>写文章</span></li>
      <li v-link='{ path: "/postList" }'><span>文章列表</span></li>
      <li v-link='{ path: "/trash" }'><span>草稿箱</span></li>
      <li v-link='{ path: "/history" }'><span>历史文章</span></li>
    </ul>
	</div>
</template>

<script>
</script>