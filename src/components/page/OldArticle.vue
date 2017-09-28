<style lang='sass'>
  @import '../../styles/components/page/OldArticle';
</style>

<template>
	<div class="history-article">
    <div class='article-head'>
      <span class='article-tip'>历史文章<span v-show='pageTotal > 0'>（{{pageTotal}}条）</span></span>
      <!-- <span class='article-tip article-warning'>因文章系统升级，历史文章数据仅保留至 2017-08-15 ，请及时备份！</span> -->
    </div>
    <div class="article-list">
      <ul class='article-list-head'>
        <li class='article-list-cover'>文章封面</li>
        <li class='article-list-title'>文章标题</li>
        <li class='article-list-create-time'>发表时间</li>
        <li class='article-list-read-count'>阅读数</li>
      </ul>
      <ul class="article-item" v-for="item in articleList">
        <li class="article-cover">
          <img :src="item.cover + '?imageMogr2/thumbnail/40x'" alt="文章封面">
        </li>
        <li class="article-title">
          <a href='{{ host }}/post_detail.html?id={{ item.post_id }}' target='_blank'>
            <span>{{ item.title }}</span>
          </a>
        </li>
        <li class="article-time">
          <span>{{ item.publish_at | dateFormat 'YYYY年MM月DD日' }}</span>
        </li>
        <li class="article-pv">
          <span>{{ item.pv_count }}</span>
        </li>
      </ul>
      <div class='no-article' v-show='articleList.length === 0'>
        <img src='../../public/imgs/noPost.png' alt=''>
        <div class='empty-txt'>您还没有发布过文章~</div>
      </div>
      <!-- 分页组件，需要传入总页数 pageCount，与对应的页序数 pageIndex，然后在父组件用 watch 去监听 pageIndex 来进行翻页 -->
      <pagination
        :page-count.sync='pageCount'
        :page-index.sync='pageIndex'></pagination>
    </div>
  </div>
</template>
<script>
  import Pagination from '../module/Pagination'
  import Request from '../../util/request'
  import { H5_HOST } from '../../configs/page'
  import { APP_ENV } from '../../configs/app'

  const ENV = APP_ENV === 'pro' ? '' : '-' + APP_ENV

  export default {
    data () {
      return {
        pageCount: 0,
        pageIndex: 1,
        pageSize: 8,
        pageTotal: 0,
        articleList: [],
        host: H5_HOST
      }
    },
    components: { Pagination },
    created () {
      this.getList()
      this.pageIndex = (this.$route.query && +this.$route.query.p) || 1
    },
    watch: {
      pageIndex () {
        let path = location.pathname.substr(1)
        this.$route.router.go(path + '?p=' + this.pageIndex || 1)
        this.getList()
      }
    },
    methods: {
      getList () {
        let self = this
        Request.get({
          url: `//api-saas${ENV}.tinfinite.com/v3/official-account/post/my-post?page=${this.pageIndex}&limit=${this.pageSize}&publish_status=1`
        }, true).then((res) => {
          if (res.code === 1) {
            self.pageTotal = res.result.paging.total
            self.pageCount = res.result.paging.total_page
            self.articleList = res.result.posts
          }
        })
      }
    }
  }
</script>