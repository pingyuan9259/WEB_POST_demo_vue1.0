<style lang='sass'>
  @import '../../styles/components/module/pagination';
</style>

<template>
  <div class='pagination' v-show='showPage'>
    <ul>
      <li>
        <a href='javascript:void(0)' @click='prev'>
          <span>&laquo;</span>
        </a>
      </li>
      <li v-for='item in pageItem'>
        <a href='javascript:void(0)' :class='{active: isCurrent(item.v), disabled: item.v === "..."}' @click='jump(item.v)'>{{item.v}}</a>
      </li>
      <li>
        <a href='javascript:void(0)' @click='next'>
          <span>&raquo;</span>
        </a>
      </li>
    </ul>
    <span class='pcount'>共 {{pageCount}} 页</span> <span class='to-page'>到 <input type='text' v-model='pValue' class='page-input' /> 页</span> <a class='page-submit' href="javascript:void(0)" @click='jump(+pValue)'>确定</a>
  </div>
</template>

<script>
  import Dom from '../../util/dom'

  export default {

    props: {
      pageCount: {
        type: Number,
        required: true,
        twoWay: true
      },
      pageIndex: {
        type: Number,
        required: true,
        twoWay: true
      }
    },

    data () {
      return {
        showPage: true,
        pageItem: [],
        initLen: 8,   // 初始化时显示的可操作的页数
        pValue: 1
      }
    },

    created () {
      this._init()
    },

    watch: {
      pageCount () {
        this.pageItem = []
        this._init()
      }
    },

    methods: {
      _init () {
        let endFlag = false

        if (this.pageCount === 0) {
          this.showPage = false
          return
        }
        this.showPage = true
        for (let i = 0; i < this.pageCount; i++) {
          if (i < this.initLen) {
            this.pageItem.push({v: i + 1})
          } else if (!endFlag) {
            endFlag = true
            this.pageItem.push({v: '...'})
          }
        }
      },
      _render () {
        let pIndex = this.pageIndex
        let pCount = this.pageCount
        this.pageItem = []

        if (pIndex <= 5) {
          this._init()
          return
        }
        this.pageItem.push({v: 1}, {v: 2}, {v: '...'})

        if (pCount - pIndex <= 2) {
          pCount === 7 && this.pageItem.pop()
          this.pageItem.push({v: pCount - 4}, {v: pCount - 3}, {v: pCount - 2}, {v: pCount - 1}, {v: pCount})
        } else {
          this.pageItem.push({v: pIndex - 2}, {v: pIndex - 1}, {v: pIndex})
          pCount > pIndex && this.pageItem.push({v: pIndex + 1})
          pCount > pIndex + 1 && this.pageItem.push({v: pIndex + 2})
          pCount > pIndex + 2 && this.pageItem.push({v: '...'})
        }
      },

      isCurrent (index) {
        return index === this.pageIndex
      },
      next () {
        if (this.pageIndex < this.pageCount) {
          this.pageIndex++
          this._render()
          Dom.scrollTop()
        }
      },
      prev () {
        if (this.pageIndex > 1) {
          this.pageIndex--
          this._render()
          Dom.scrollTop()
        }
      },

      jump (index) {
        if (typeof index === 'number') {
          if (index > this.pageCount) {
            window.confirm('超出最大页数')
            return
          }
          this.pageIndex = index
          this._render()
          Dom.scrollTop()
        }
      }
    }
  }

</script>