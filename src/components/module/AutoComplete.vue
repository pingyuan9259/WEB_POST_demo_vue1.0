<style lang='sass'>
  .auto-complete {
    display: inline-block;
  }
  @import '../../styles/components/module/autoComplete';
</style>

<template>
  <div class='auto-complete'>
    <input type='text' v-model='itemName' class='item-input'>
    <a class='ac-list' href='javascript:void(0)' @click='toggleShowItems'>
      <i></i>
    </a>
    <ul class='ac-items' v-show='showItems'>
      <li v-for='item in items' v-show='!items[$index].hidden' @click='chooseItem(item.bbsId, item.bbsName)'>
        <img v-lazy='item.bbsAvatar || "//o4a7cbihz.qnssl.com/cover/035aa23a-9da0-4dfe-8a1e-b5a5f60057ce"' alt=''>
        <span>{{ item.bbsName }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      items: {
        type: Array
      },
      editData: {
        type: Object
      }
    },
    data () {
      return {
        itemName: '',
        showItems: false,
        choosing: false
      }
    },
    watch: {
      itemName () {
        this.search()
      },
      'items + editData': {
        handler () {
          if (!this.editData || !this.editData.title || this.items.length === 0) { // title必须存在，以此为判断条件
            return
          }
          if (this.loaded) {
            return
          }
          this.loaded = true
          for (let i = 0, len = this.items.length; i < len; i++) {
            if (this.items[i].bbsId === this.editData.bbsId) {
              this.choosing = true
              this.itemName = this.items[i].bbsName
              setTimeout(function () {
                self.choosing = false
              }, 0)
            }
          }
        },
        deep: true
      }
    },
    methods: {
      chooseItem (id, name) {
        let self = this
        this.choosing = true
        this.itemName = name
        this.$dispatch('pushBbsId', {
          id: id
        })
        this.showItems = false
        setTimeout(function () {
          self.choosing = false
        }, 0)
      },
      toggleShowItems () {
        this.showItems = !this.showItems
      },
      search () {
        if (this.choosing) {
          return
        }
        for (let i = 0, len = this.items.length; i < len; i++) {
          if (!this.itemName) {
            this.items.$set(i, Object.assign({}, this.items[i], { hidden: false }))
            continue
          }
          if (this.items[i].bbsName.indexOf(this.itemName) !== -1) {
            this.items.$set(i, Object.assign({}, this.items[i], { hidden: false }))
          } else {
            this.items.$set(i, Object.assign({}, this.items[i], { hidden: true }))
          }
        }
        this.showItems = true
      }
    }
  }
</script>