<style lang='sass'>
  .tooltips-con {
    position: absolute;
    display: inline-block;
    background: #F9F9F9;
    border: 1px solid #e6e6e6;

    i.arrow {
      position: absolute;
      top: 0;
      left: 50%;
      margin-left: -11px;
      margin-top: -10px;
      display: inline-block;
      width: 0;
      height: 0;
      border-width: 10px;
      border-style: dashed;
      border-color: transparent;
      border-top-width: 0;
      border-bottom-color: #e6e6e6;
      border-bottom-style: solid;
    }

    i.arrow-out {
      border-bottom-color: #F9F9F9;
      top: 1px;
    }

    span {
      display: inline-block;
      padding: 7px 16px 10px 16px;
      font-size: 12px;
      color: #333;
    }
  }
</style>

<template>
  <div class='tooltips-con' v-show='show'>
    <i class='arrow arrow-in'></i>
    <i class='arrow arrow-out'></i>
    <span>该链接已被复制到剪贴板</span>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    props: {
      show: {
        type: Boolean,
        required: true,
        twoWay: true
      },
      hideTime: {
        type: Number,
        required: true,
        twoWay: true
      }
    },
    events: {
      setTooltips (data) {
        let self = this
        let dialogEle = $(this.$el)
        let parentEle = $(data.ele)
        let offsetParentEle = parentEle.offset()

        dialogEle.css({
          left: offsetParentEle.left + parentEle.width() / 2 - dialogEle.width() / 2,
          top: offsetParentEle.top + parentEle.height() / 2 - 26
        })

        if (!self.show) {
          let t = setTimeout(function () {
            self.show = false
            clearTimeout(t)
          }, self.hideTime)
        }
      }
    }
  }
</script>