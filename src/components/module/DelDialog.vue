<style lang='sass'>
  @import '../../styles/components/module/delDialog';
</style>

<template>
  <div class='delete-item {{type}}' v-show='showDel'>
    <div class='delete-mask'></div>
    <div class='delete-con'>
      <div class='delete-header'>删除提示</div>
      <div class='delete-body'>
        <div class='delete-tip' v-show='showDeleteTip'>确认删除该文章？</div>
        <div class='delete-desc'>点击删除后将会永久删除，不可恢复。</div>
        <div class='delete-success' v-show='showDeleteSuccess'>
          <i></i>
          <div>删除成功</div>
        </div>
      </div>
      <div class='delete-footer' v-show='showDeleteTip'>
        <a href="javascript:void(0)" @click='showDel = false'>取消</a>
        <a href="javascript:void(0)" @click='deletePost'>确定</a>
      </div>
    </div>
  </div>
</template>

<script>
  
  export default {
    data () {
      return {
        showDeleteTip: true,
        showDeleteSuccess: false
      }
    },
    props: {
      type: {
        type: String,
        required: true
      },
      showDel: {
        type: Boolean,
        required: true,
        twoWay: true
      },
      postId: {
        type: String,
        required: true
      }
    },
    methods: {
      deletePost () {
        this.$dispatch('delete', this.postId)
      }
    }
  }

</script>