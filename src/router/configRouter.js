export function configRouter (router) {
  router.map({
    // content of main router map
    '/loginContainer': {
      component: (resolve) => {
        require(['../components/app/LoginContainer'], resolve)
      }
    },
    '/publish': {
      component: (resolve) => {
        require(['../components/page/Publish'], resolve)
      }
    },
    '/postList': {
      component: (resolve) => {
        require(['../components/page/PostList'], resolve)
      }
    },
    '/trash': {
      component: (resolve) => {
        require(['../components/page/Trash'], resolve)
      }
    },
    '/edit/:id': {
      component: (resolve) => {
        require(['../components/app/Edit'], resolve)
      }
    },
    '/history': {
      component: (resolve) => {
        require(['../components/page/OldArticle'], resolve)
      }
    }
  })

  router.alias({
    '/': '/postList'
  })

  router.beforeEach((transition) => {
    let params = transition.from.params
    let isPublish = (transition.from.path === '/publish')
    let bOk = (typeof params === 'undefined')
    let bOk_two = false
    if (params) {
      bOk_two = params.contentStatus && params.saveStatus
    }
    if ((isPublish && bOk) || (isPublish && !bOk_two)) {
      if (!confirm('文章还未保存，确定要离开此页?')) {
        transition.abort()
      }
    }
    transition.next()
  })
}
