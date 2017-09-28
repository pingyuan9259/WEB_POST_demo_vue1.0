<style lang='sass'>
  @import '../../styles/components/page/postList';
</style>

<template>
  <div class='posts-con'>
    <div class='posts-head'>
      <span class='head-tip'>已发布的文章<span v-show='showPageTotal'>（{{ pageTotal}}条）</span></span>
    </div>

    <div class='posts-list-con'>
      <div class='posts-lists'>
        <ul class='posts-lists-con'>
          <li>
            <ul class='posts-lists-head'>
              <li class='post-title'>频道</li>
              <li class='post-title'>文章标题</li>
              <li class='post-create-time'>发表时间</li>
              <li class='post-read-count'>阅读数</li>
              <li class='post-handle'>操作</li>
            </ul>
          </li>

          <li class='loading-posts' v-show='showLoading'>
            <img src='../../public/imgs/loading.gif' alt=''>
            <div class='loading-txt'>正在加载...</div>
          </li>

          <li class='empty-posts' v-show='showEmpty'>
            <img src='../../public/imgs/noPost.png' alt=''>
            <div class='empty-txt'>{{ emptyTxt }}</div>
          </li>

          <li data-id='{{ item.comment_id }}' v-for='item in postList'>
            <ul class='posts-lists-item'>
              <li class='post-title'>
                <span class='post-detail-content'>{{ item.bbsName }}</span>
              </li>
              <li class='post-title'>
                <a href='{{ host }}/post_detail.html?post_id={{ item.id }}' target='_blank'>
                  <div class='post-detail-con'>
                    <span class='post-detail-content'>{{ item.title }}</span>
                  </div>
                </a>
              </li>
              <li class='post-create-time'>
                <div>{{ item.publishedAt | dateFormat 'HH:mm:ss' }}</div>
                <div>{{ item.publishedAt | dateFormat 'YYYY年MM月DD日' }}</div>
              </li>
              <li class="post-read-count">
                <span>{{ item.pvCount }}</span>
              </li>
              <li class='post-handle'>
                <!-- <a class='btn' href='/edit/{{ item.id }}#update' target='_blank'>修改</a> -->
                <a class='btn' href='javascript:void(0)' @click='openDeleteDialog($index, item.id, "post", "确认删除这篇文章？")'>删除</a>
              </li>
            </ul>
          </li>
        </ul>
        <!-- 分页组件，需要传入总页数 pageCount，与对应的页序数 pageIndex，然后在父组件用 watch 去监听 pageIndex 来进行翻页 -->
        <pagination
          :page-count.sync='pageCount'
          :page-index.sync='pageIndex'></pagination>
        <confirm-dialog
          :show-dialog.sync='showConfirmDialog'></confirm-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Pagination from '../module/Pagination'
  import ConfirmDialog from '../module/ConfirmDialog'
  import Request from '../../util/request'
  import Dom from '../../util/dom'
  import { DETAIL_HOST } from '../../configs/page'
  import { APP_ENV } from '../../configs/app'
  import Cookie from '../../util/cookie'
  import qs from 'qs'

  export default {
    data () {
      return {
        pageIndex: 1,
        pageSize: 8,
        pageCount: 0, // 总页数
        pageTotal: 0, // 总条数
        postList: null,
        delClass: 'published',
        showPageTotal: false,
        showLoading: true,
        showEmpty: false,
        showConfirmDialog: false,
        // showRestSearch: false,
        postIdConfirmDialog: '',
        emptyTxt: '您还没有发布过动态~',
        host: DETAIL_HOST,
        isAdmin: false
      }
    },

    watch: {
      pageIndex () {
        let path = location.pathname.substr(1)
        this.$route.router.go(path + '?p=' + this.pageIndex || 1)
        this.getList()
      }
    },

    components: { Pagination, ConfirmDialog },

    events: {
      submitDelete (type) {
        this.deletePost(this.postIdConfirmDialog)
      }
    },

    created () {
      this.isAdmin = window.localStorage.getItem('is_admin') === '1' ? 1 : 0
      this.pageIndex = (this.$route.query && +this.$route.query.p) || 1
    },

    ready () {
      this.getList()
    },

    methods: {

      getList (keyWords) {
        let self = this
        let userKey = APP_ENV === 'pro' ? '_user_id' : '_user_id_' + APP_ENV
        let userId = Cookie.getCookie(userKey)
        Request.get({
          url: `/v3/bbs/my-article?page=${this.pageIndex}&limit=${this.pageSize}&status=1&user_id=${userId}`
        }).then((res) => {
          let posts = res.result.rows

          self.showLoading = false

          if (posts.length === 0) {
            self.showEmpty = true

            if (keyWords) {
              self.emptyTxt = '没有搜到相关文章~'
            } else {
              self.emptyTxt = '您还没有发布动态~'
            }

            self.pageTotal = 0
            self.pageCount = 0
            self.postList = []
            self.showPageTotal = false
            return
          }

          self.showEmpty = false
          self.pageTotal = res.result.total
          self.pageCount = parseInt(res.result.total / self.pageSize, 10)
          self.postList = posts

          self.showPageTotal = true

          Dom.scrollTop()
        })
      },

      showDelDialog (index) {
        this.postList[index].del = true
      },

      openDeleteDialog (index, post_id, type, content) {
        this.showConfirmDialog = true
        this.indexConfirmDialog = index
        this.postIdConfirmDialog = post_id
        this.$broadcast('setDialogPos', {
          ele: event.target,
          type: type,
          content: content
        })
      },

      deletePost (postId) {
        let self = this
        let data = {
          post_id: postId
        }
        Request.post({
          url: '/v3/bbs/delete-post',
          data: qs.stringify(data, { arrayFormat: 'brackets', json: true}),
          contentType: 'application/x-www-form-urlencoded'
        }).then((res) => {
          self.getList()
          self.showConfirmDialog = false
        })
      }
    }
  }
</script>