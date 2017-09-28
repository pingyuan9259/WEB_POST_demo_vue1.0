<style lang='sass'>
  .upload-input {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
  }
</style>

<template>
  <input type='file' class='upload-input' v-on:change='upload'>
</template>

<script>
  import $ from 'jquery'

  export default {
    props: {
      overStatus: {
        type: Boolean,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    },

    methods: {
      upload () {
        let self = this
        let file = self.$el.files[0]

        if (file === null || file === '') {
          window.alert('请选择要上传的图片!')
          return
        }
        let allImgExt = '.jpg|.jpeg|.gif|.bmp|.png|'
        let extName = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
        if (allImgExt.indexOf(extName + '|') === -1) {
          let errMsg = '该文件类型不允许上传。请上传 ' + allImgExt + ' 类型的文件，当前文件类型为' + extName
          window.alert(errMsg)
          return
        }

        let data = new FormData()
        let url = self.url

        data.append('cover', file)

        if (file) {
          self.$dispatch('uploadBefore')
        }

        $.ajax({
          url: url,
          type: 'POST',
          data: data,
          cache: false,
          contentType: false,
          processData: false,
          success: function (res) {
            if (res.code !== 1) {
              throw new Error('response code: ' + res.code)
            }
            self.$dispatch('uploadCoverComplete', res.result)
          },
          fail: function (error) {
            console.log(error)
            self.$dispatch('uploadFail')
          }
        })
      }
    }
  }

</script>