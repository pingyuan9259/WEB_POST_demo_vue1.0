<style lang='sass'>
  @import '../../styles/components/layout/content';
</style>
<template>
	<div class='content'>
		<div class='main'>
			<navbar></navbar>
      <router-view></router-view>
		</div>
	</div>
</template>

<script>
  import Navbar from './Nav'

  export default {
    components: { Navbar }
  }

</script>
