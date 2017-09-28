<style lang='sass'>
  @import '../../styles/components/module/confirmDialog';
</style>

<template>
  <div class='confirm-dialog' v-show='showDialog'>
    <i class='arrow arrow-in'></i>
    <i class='arrow arrow-out'></i>
    <div class='confirm-body'>{{ content }}</div>
    <div class='confirm-btns'>
      <a href='javascript:void(0)' @click='showDialog = false'>取消</a>
      <a href='javascript:void(0)' @click='submit'>确定</a>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    data () {
      return {
        content: ''
      }
    },

    props: {
      showDialog: {
        type: Boolean,
        required: true,
        twoWay: true
      }
    },

    events: {
      setDialogPos (data) {
        let dialogEle = $(this.$el)
        let parentEle = $(data.ele)
        let offsetParentEle = parentEle.offset()

        this.submitType = data.type
        this.content = data.content

        dialogEle.css({
          left: offsetParentEle.left + parentEle.width() / 2 - dialogEle.width() / 2,
          top: offsetParentEle.top + parentEle.height() / 2 - 40
        })

      }
    },

    methods: {
      submit () {
        this.$dispatch('submitDelete', this.submitType)
      }
    }
  }
</script>