<style lang='sass'>
  .content-container {
    position: absolute;
    width: 100%;
    top: 60px;
    bottom: 70px;
  }
</style>

<template>
  <phead></phead>
  <div class='content-container'>
    <post-edit></post-edit>
    <pfoot></pfoot>
  </div>
</template>

<script>
  import Phead from '../layout/Header'
  import PostEdit from '../page/PostEdit'
  import Pfoot from '../layout/Footer'

  export default {
    components: { Phead, PostEdit, Pfoot }
  }
</script>
