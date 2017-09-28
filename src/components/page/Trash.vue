<style lang='sass'>
  @import '../../styles/components/page/trash';
</style>

<template>
  <div class='trash-con'>
    <div class='trash-head'>
      <span class='trash-tip'>草稿箱<span v-show='showPageTotal'>（{{pageTotal}}条）</span></span>

      <span v-show="showChangeBtn" class="change-list" title="切换" @click="ChangeList"></span>
    </div>
    <div class='trash-list'>
      <div class='loading-posts' v-show='showLoading'>
        <img src='../../public/imgs/loading.gif' alt=''>
        <div class='loading-txt'>正在加载...</div>
      </div>
      <div class='empty-posts' v-show='showEmpty'>
        <img src='../../public/imgs/noTrash.png' alt=''>
        <div class='empty-txt'>草稿箱里什么都没有~</div>
      </div>
      <div class="post-lists" v-show='showList'>
        <ul class='list-con2'>
          <li class="post-lists-title">
            <ul class='posts-lists-head'>
              <li class='post-cover'>频道</li>
              <li class='post-title'>文章标题</li>
              <li class='post-create-time'>保存时间</li>
              <li class='post-handle'>操作</li>
            </ul>
          </li>

          <li v-for='item in postList' :class='{"right": (($index + 1) % 2) == 0}'>
            <a href='{{ host }}/post_detail.html?post_id={{ item.id }}' target='_blank' class='list-content'>
              <div class='list-img'>
                <span class='list-title'>{{ item.bbsName }}</span>
              </div>
              <div class='list-title'>{{ item.title }}</div>
            </a>
            <div class='list-datetime'>
              {{ item.createdAt | dateFormat 'HH:mm:ss' }}<br/>
              {{ item.createdAt | dateFormat 'YYYY年MM月DD日' }}
            </div>
            <div class='list-btns'>
              <div class='btns-con'>
                <a href='/edit/{{ item.id }}' target='_blank' class='btn edit-btn' title='编辑'></a>
                <a href='{{ host }}/post_detail.html?post_id={{ item.id }}' target='_blank' class='btn preview-btn' title='预览'></a>
                <a href='javascript:void(0)' class='btn share-btn' data-clipboard-text='{{ host }}/post_detail.html?post_id={{ item.id }}' title='分享' @click='openTooltips'></a>
                <a href='javascript:void(0)' class='btn delete-btn' title='删除' @click='openDeleteDialog($index, item.id, "post", "确认删除这篇文章？删除后不可恢复！")'></a>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- 分页组件，需要传入总页数 pageCount，与对应的页序数 pageIndex，然后在父组件用 watch 去监听 pageIndex 来进行翻页 -->
      <pagination
        v-show="showPage"
        :page-count.sync='pageCount'
        :page-index.sync='pageIndex'></pagination>
      </div>
      <tooltips
        :show.sync='showTooltips'
        :hide-time.once='tipHideTime'></tooltips>
      <confirm-dialog
        :show-dialog.sync='showConfirmDialog'></confirm-dialog>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import Clipboard from 'clipboard'
  import Pagination from '../module/Pagination'
  import DelDialog from '../module/DelDialog'
  import Request from '../../util/request'
  import Tooltips from '../module/Tooltips'
  import { DETAIL_HOST } from '../../configs/page'
  import ConfirmDialog from '../module/ConfirmDialog'
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
        delClass: 'trash',
        showTooltips: false,
        showPageTotal: false,
        tipHideTime: 2000,
        showLoading: true,
        showEmpty: false,
        showPage: false,
        showList: false,
        showConfirmDialog: false,
        postIdConfirmDialog: '',
        host: DETAIL_HOST
      }
    },

    watch: {
      pageIndex () {
        let path = location.pathname.substr(1)
        this.$route.router.go(path + '?p=' + this.pageIndex || 1)
        this.getList()
      }
    },

    created () {
      this.pageIndex = +this.$route.query.p || 1

      let clipboard = new Clipboard('.share-btn')
      clipboard.on('error', (e) => {
        console && console.error('Action:', e.action)
        console && console.error('Trigger:', e.trigger)
      })
    },

    ready () {
      this.getList()
      let t = setInterval(function () {
        let type = localStorage.getItem('post-edit-type')
        if (type === 'publish') {
          clearInterval(t)
          localStorage.setItem('post-edit-type', '')
          location.href = '/postList'
        } else if (type === 'save') {
          localStorage.setItem('post-edit-type', '')
          location.href = '/trash'
        }
      }, 1000)
    },

    components: { Pagination, DelDialog, Tooltips, ConfirmDialog },

    events: {
      delete (postId) {
        this.deletePost(postId)
      },
      submitDelete (type) {
        this.deletePost(this.postIdConfirmDialog)
      }
    },

    methods: {
      getList () {
        let self = this
        let userKey = APP_ENV === 'pro' ? '_user_id' : '_user_id_' + APP_ENV
        let userId = Cookie.getCookie(userKey)
        Request.get({
          url: `/v3/bbs/my-article?page=${this.pageIndex}&limit=${this.pageSize}&status=2&user_id=${userId}`
        }).then((res) => {
          let posts = res.result.rows

          self.showLoading = false

          if (posts.length === 0) {
            self.showEmpty = true
            self.showPageTotal = false
            self.showList = false
            self.showPage = false
            self.showList = false
            self.postList = []
            return
          }

          self.pageTotal = res.result.total
          self.pageCount = parseInt(res.result.total / self.pageSize, 10)
          self.postList = self.dealPosts(posts)

          self.showPageTotal = true
          self.showPage = true
          self.showList = true
        })
      },

      dealPosts (posts) {
        for (let item of posts) {
          item.del = false
        }
        return posts
      },

      showDelDialog (index) {
        this.postList[index].del = true
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
      },

      openTooltips () {
        let target = event.target
        let ele = target
        this.showTooltips = true

        if (!$(target).hasClass('btn')) {
          ele = $(target).parent()[0]
        }

        this.$broadcast('setTooltips', {
          ele: ele
        })
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
      }
    }
  }
</script>