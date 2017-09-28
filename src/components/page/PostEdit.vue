<style lang='sass'>
  .post-edit-con {
    width: 100%;
    padding: 35px 0  35px;
    background-color: #E6E6E6;

    .publish-con {
      float: none;
      margin: 0 auto;
      -webkit-box-shadow:0 0 20px #bbb;
      -moz-box-shadow:0 0 20px #bbb;
      box-shadow:0 0 20px #bbb;
    }
  }
</style>

<template>
  <div class='post-edit-con'>
    <publish :head-tip.once='tip' :edit-data.sync='editData'></publish>
  </div>

</template>

<script>
  import Publish from './Publish'
  import Request from '../../util/request'

  export default {
    data () {
      return {
        tip: '草稿箱',
        editData: {
          title: '',             // 标题
          author: '',            // 作者
          html: '',              // 正文
          digestContent: '',     // 摘要
          cover: '',             // 封面
          insert_cover: 0        // 是否插入封面到正文
        }
      }
    },
    components: { Publish },
    created () {
      let hash = window.location.hash
      if (hash && hash === '#update') {
        this.tip = '修改文章'
      }
      this.getPost()
    },
    methods: {
      getPost () {
        let self = this
        let postId = this.$route.params.id
        Request.get({
          url: '/v3/bbs/post-details-post?post_id=' + postId
        }).then((res) => {
          self.editData = res.result
        })
      }
    }
  }
</script>