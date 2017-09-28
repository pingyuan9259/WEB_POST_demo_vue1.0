<style lang='sass'>
  @import '../../styles/components/layout/footer';
</style>

<template>
  <div class='footer'>
    <span>{{ appName }} © 2015-2016</span>
  </div>
</template>

<script>
  import { APP_KEY } from '../../configs/app'
  import APP_MAP from '../../configs/appMap'
  export default {
    data () {
      return {
        appName: APP_MAP[APP_KEY].name
      }
    }
  }
</script>
