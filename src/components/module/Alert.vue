<style lang="sass">
  .cover-wrap {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 666;
    background: rgba(0, 0, 0, 0.6);
  }
  .shut {
    background-color: #04bab1;
    border-color: #04bab1;
    color: #fff;
  }
  .shut:hover {
    background-color: #009ea6;
    color: #fff;
    border-color: #009ea6;
  }
</style>
<template>
  <!-- Modal -->
  <div class="cover-wrap" v-show="showAlert">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" @click="showAlert = false"><span>&times;</span></button>
          <h4 class="modal-title" id="myModalLabel">提示</h4>
        </div>
        <div class="modal-body">
          {{ alertContent }}
        </div>
        <div class="modal-footer">
          <a href="javascript:void(0)" class="btn btn-default shut" @click="showAlert = false">取消</a>
          <a href="javascript:void(0)" class="btn btn-default btn-enter" @click='confirm'>确定</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    data () {
      return {
        showDialog: false
      }
    },
    props: {
      showAlert: {
        type: Boolean,
        required: true
      },
      sign: {
        type: String,
        required: true
      },
      alertContent: {
        type: String,
        required: true
      }
    },
    methods: {
      confirm () {
        if (!this.sign) {
          this.sign = 'rich'
        }
        if (this.sign === 'mkdn') {
          $('.markdown').val('')
          this.$dispatch('toRich')
        }
        if (this.sign === 'rich') {
          this.$dispatch('toMarkdown')
          $('.simditor-body').html('<p><br></p>')
        }
        this.showAlert = false
      }
    }
  }
</script>