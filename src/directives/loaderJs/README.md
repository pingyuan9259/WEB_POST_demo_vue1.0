## 使用
```
  // import directives
  import loaderJs from './directives/loaderJs/index'

  // register directives
  Vue.directive('loader-js', loaderJs)

```

```
  <div v-loader-js scripts='/a.js, /b.js' start='a();'></div>

```

scripts[必填]: 表示外部js依赖，用逗号(,)分割开。

start[必填]: 表示依赖被注入以后的启动代码。

## 原理

指令内部会将所有 scripts 依赖会按编写的顺序请求到内存，然后与 start 启动函数合并，最后直接插入到页面底部进行执行，保证页面按需加载。
