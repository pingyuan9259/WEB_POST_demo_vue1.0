<style lang="sass">
  @import '../../styles/components/page/noMember';
</style>

<template>
  <div class="member-page">
    <div class="box">
      <div v-if="App.isXSDX">
        <div class="no-member" v-if="noMember">
          <div class="logo">
            <img :src="App.logo | https" alt="" />
            <p :style="App.font">{{ App.name }}</p>
          </div>
          <div class="tip">
            抱歉，写作平台暂只对<span>会员</span>开放
          </div>
          <p class="describe">“一群以自我升级为乐的人构成的社群，这里的人尊重知识、持有耐心、崇尚主动、拒绝抱怨、不易被情绪左右，以持续进步为荣。”</p>
          <!-- <p class="knowWe"><a href="//mp.weixin.qq.com/s?__biz=MzAwMDgyMTA3Mg==&mid=502571217&idx=1&sn=69a717703795e5e32748ae85f6b93645" target="_blank">了解我们<span>&gt;&gt;&gt;</span></a></p> -->
          <!-- <a class="toMember" href="//detail.koudaitong.com/show/goods?alias=3nvc3pef35c6r&redirect_count=1&sf=wx_sm" target="_blank">成为会员</a> -->
          <p class="back"><a href="//b.xinshengdaxue.com">{{ App.name }}</a></p>
        </div>
        <div class="no-verify" v-if="noVerify">
          <div class="logo">
            <img :src="App.logo | https" alt="" />
            <p :style="App.font">{{ App.name }}</p>
          </div>
          <div class="tip">
            <span>抱歉，请先</span>
            <span class="bold">绑定手机号</span>
          </div>
          <p class="describe">“新生大学是一个真实的学习成长社区。为了保护社区友好、理性、认真的交流氛围，我们需要您在发表内容前先绑定手机号。”</p>
          <p class="step step-title">绑定手机号步骤如下：</p>
          <p class="step"> 1）点开新生大学APP内菜单栏中的【我】</p>
          <p class="step"> 2）点击【绑定手机号】</p>
          <p class="step"> 3）根据页面提示操作即可</p>
          <p class="step-help">如果出现问题可以与新生大学团队联系</p>
          <p class="back step-back"><a href="//b.xinshengdaxue.com">{{ App.name }}</a></p>
        </div>
      </div>
      <div v-else >
        <div class="tip" style="font-size: 30px;">
          抱歉，写作平台暂不对外开放
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { APP_KEY } from '../../configs/app'
  import AppMap from '../../configs/appMap'

  export default {
    data () {
      return {
        App: AppMap[APP_KEY],
        noMember: false,
        noVerify: false
      }
    },
    props: {
      status: {
        type: Number
      },
      member: {
        type: Number
      }
    },
    created () {
      if (this.member && this.status !== 1) {
        this.noVerify = true
      } else if (!this.member) {
        this.noMember = true
      }
    }
  }
</script>
