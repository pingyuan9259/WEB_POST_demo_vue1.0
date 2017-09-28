<style lang='sass'>
  .content-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 60px;
    bottom: 70px;
  }
</style>

<template>
  <phead></phead>
  <div class='content-container'>
    <content></content>
    <pfoot></pfoot>
  </div>
</template>

<script>
  import Phead from '../layout/Header'
  import Content from '../layout/Content'
  import Pfoot from '../layout/Footer'

  export default {
    components: { Phead, Content, Pfoot }
  }
</script>
