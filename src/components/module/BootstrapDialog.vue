<style type="text/css">
  .btn-enter2 {
    background-color: #04bab1;
    border-color: #04bab1;
  }
  .btn-enter2:hover {
    background-color: #00AFA6;
    border: 1px solid #00AFA6;
    color: #fff;
  }
  .dialog-cover {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 111;
  }
  .modal-body {
    max-height: 80vh;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .modal-body img {
    max-width: 568px;
  }
</style>
<template>
  <!-- bootstrap模态框 -->
  <div v-show="showDialog" class="dialog-cover">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" @click='close'><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">预览</h4>
        </div>
        <div class="modal-body dialog-content nongshuoshu-body">
          {{ dialogContent }}
        </div>
        <div class="modal-footer">
          <a href="javascript:void(0)" class="btn btn-primary btn-enter2" @click='close'>确定</a>
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
      showDialog: {
        type: Boolean,
        required: true
      }
    },
    methods: {
      close () {
        $('body').css('overflow', 'auto')
        this.showDialog = false
      }
    }
  }
</script>