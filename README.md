# Vue-Navigation

[TOC]

## API 文档

### NavigationActions

内置五种action 类型，每种类型对应不同的页面切换动作：

* `BACK: string`：返回上一个路由状态
* `INIT: string`：初始化navigator 的路由状态
* `NAVIGATE: string`：导航到另一个页面
* `RESET: string`：用新的路由状态替换当前的路由状态
* `SET_PARAMS: string`：修改当前页面的参数

对应以上的action 类型，还提供了相对的action 构造函数：

* `back(payload: ?Object): NavigationAction`
* `init(payload: ?Object): NavigationAction`
* `navigate(payload: ?Object): NavigationAction`
* `reset(payload: ?Object): NavigationAction`
* `setParams(payload: ?Object): NavigationAction`

所谓的构造函数，其实就是接受一个payload 对象，然后将对应的action 类型以`type` 属性注入到payload 中，举个例子：

```javascript
// 创建一个navigate action
let navigationAction = NavigationActions.navigate({routeName: 'profile'})

assert.equal(navigation.type === NavigationActions.NAVIGATE)
assert.equal(navigation.routeName === 'profile')
```

#### NavigationAction

每个action 构造函数返回的对象定义为`NavigationAction` 类型，结构类似：

```javascript
{
  type: Navigations.NAVIGATE,
  ...payload
}
```

### StackNavigator()

用于定义一个堆栈型的Navigator，方法定义：

```javascript
function StackNavigator(RouteConfigs: Object, StackNavigatorConfig: ?Object): VueComponent {}
```

#### RouteConfigs 

RouteConfigs 定义的是Navigator 的页面名称与页面配置，形如：

```javascript
StackNavigator({
  // 定义一个名为Profile 的页面
  Profile: {
    // 使用screen 属性定义页面内容
    // `ProfileScreen` 为一个标准的Vue 组件对象
    screen: ProrileScreen
  }
})
```

#### StackNavigatorConfig

暂时用于Navigator 的初始化配置，包括：

* `initialRouteName`：navigator 的初始页面
* `initialRouteParams`：navigator 初始页面的初始参数

#### 返回

StackNavigator 函数调用返回的navigator 实例，是一个符合Vue 组件规范的对象，即，该实例亦可当作Vue 组件来使用，这点极大的方便了定义嵌套路由的实现。我们需要关注下实例对象中的两个属性：

* `navigatorConfig`：即传入StackNavigator 函数的StackNavigatorConfig 参数；
* `router`：一个StackRouter 实例；

### StackRouter()

用于生成一个堆栈型的路由管理器，方法定义：

```javascript
function StackRouter(routeConfigMap: Object, stackConfig: ?Object): NavigationRouter {}
```

在StackNavigator 内部正是使用StackRouter 来生成路由管理器的，可以说，StackNavigator 与StackRouter 是配套使用的。

#### routeConfigMap

即传入StackNavigator 函数的RouteConfigs 参数。即路由页面的配置。

#### stackConfig

相当于传入StackNavigator 函数的StackNavigatorConfig 对象参数的子集，只包涵：

- `initialRouteName`
- `initialRouteParams`

#### NavigationRouter

StackRouter 函数返回一个NavigationRouter 类型的对象，对象包涵了一些可以用于修改路由状态的api：

* `getComponentForState(state: NavigationState): VueComponent`：获取路由中active 状态的组件；
* `getComponentForRouteName(routeName: string): VueComponent`：根据页面名称获取组件；
* `getStateForAction(action: NavigationAction, state?: NavigationState): ?NavigationState`：按传入的action 值更改state 值并返回；该方法为navigation 中操作路由状态最核心的方法，有篇幅会详细解释；
* `getPathAndParamsForState(state: NavigationState): NavigatinPathAndParam`：根据路由中active 的组件拼装其path 与参数；
* `getActionForPathAndParams(pathToResolve: string): NavigationAction`：传入页面url，返回action；

### Navigation Prop

每个从navigator 进入的页面的初始化阶段都会以props 的形式传入`navigation` 对象。

这个对象提供了方法和属性来完成页面间切换与参数设置。`navigation`对象包含以下属性：

* `state: NavigationState`：navigation 当前的路由状态；
* `dispatch(action: NavigationAction): boolean`：根据传入的action 修改navigation 的路由状态，进而触发页面切换或参数更改；
* `navigate(routeName: string, params?: Object, action: ?NavigationAction): boolean`：切换页面到指定routeName；
* `setParams(params: Object): boolean` ：设置当前页面参数；
* `goBack(key?: string): boolean`：返回上一个页面；

上述的`dispatch`、`navigate`、`setParams`、`goBack` 都会影响navigation 的路由状态。但最核心的是`dispatch` 方法，其他的在实现上都是在调用`dispatch` 方法。举个例子：

```javascript
// 假设的场景是在某个页面组件中进行：

// ---------------------
this.navigation.navigate('profile')
// 等同于
this.navigation.dispatch(NavigationActions.navigate({routeName: 'profile'}))


// ---------------------
this.navigation.goBack()
// 等同于
this.navigation.dispatch(NavigationActions.back())


// ---------------------
this.navigation.setParams({name: 'foo'})
// 等同于
this.navigation.dispatch(NavigationActions.setParams({params: {name: 'foo'}}))
```

### NavigationState

每个页面都可以通过以下代码访问当前navigator 的路由状态：`this.navigation.state`。

路由状态的结构类似于：

```json
{
  routeName: 'profile',
  key: 'main0',
  params: { hello: 'word' }
}
```

当页面切换时带有参数，就可以参考上面的结构访问：`this.navigation.state.params`。

若navigator 的screen 是一个嵌套路由，则screen 的路由状态的结构稍有不同，类似于：

```json
{
  routeName: 'nestedNavigator',
  key: 'main0',
  params: { hello: 'word' },
  routes: [{
    routeName: 'profile',
    key: 'init_1'
  }, {
    routeName: 'photo',
    key: 'init_2'
  }],
  index: 1
}
```

差别在于多了两个属性：

* `routes: Array<NavigationState>`：子路由状态；
* `index: number`：active 状态的子理由索引；

**一个正确使用Vue-Navigation 来托管模块页面的应用，其runtime 中应该只存在一个根的页面路由状态树，通过routes 来引用子路由状态。**

## NavigationAction Payload

上文提到，Vue-Navigation 共内置了五种action，相应地存在五种NavigationAction。

开发者通过调用页面内的`navigation` 对象中的`dispatch`、`navigate`、`setParams`、`goBack` 方法将NavigationAction 类型对象传入StackRouter.getStateForAction() 。router 会根据不同的action 种类来对路由状态进行修改。

下面说明下，不同类型的action，其NavigationAction 结构组成：

### Navigate

基本结构：

* `type: string`：值为`Navigation/NAVIGATE`
* `routeName: string`：页面名称；
* `params: ?Object`：页面参数；
* `action: ?NavigationAction`：用于对嵌套路由的子action；

有两种分发Navigate action 的方式：

```javascript
// 1. 组件内使用navigation.navigate 分发
this.navigation.navigate(routeName: string, params: ?Object, action: ?NavigationAction)

// 2. 组件内使用navigation.dispatch 分发
this.navigation.dispatch({
  type: 'Navigation/NAVIGATE',
  routeName: string,
  params: ?Object,
  action: ?NavigationAction
})
```

### Back

基本结构：

- `type: string`：值为`Navigation/BACK`
- `key?: string`：若指定key 值，则Vue-Navigation 会回退到所指定key 的页面

有两种分发Navigate action 的方式：

```javascript
// 1. 组件内使用navigation.goBack 分发
this.navigation.goBack(key?: string)

// 2. 组件内使用navigation.dispatch 分发
this.navigation.dispatch({
  type: 'Navigation/BACK',
  key?: string
})
```

### SetParams

基本结构：

- `type: string`：值为`Navigation/SET_PARAMS`
- `key: string`：指定要设置参数的页面key

有两种分发Navigate action 的方式：

```javascript
// 1. 组件内使用navigation.setParams 分发
// 这种方式只能设置当前页的参数，且不需要显式传入key
this.navigation.setParams(params: Object)

// 2. 组件内使用navigation.dispatch 分发
this.navigation.dispatch({
  type: 'Navigation/SET_PARAMS',
  key: string
})
```

### Reset

基本结构：

- `type: string`：值为`Navigation/RESET`
- `actions: Array<NavigationAction>`：将路由状态替换actions 数组对应的路由状态
- `index: number`：设置路由状态中处于激活状态的页面索引
- `key?: string`：用于跨模块重置指定key 值的嵌套路由状态

只有一种分发Navigate action 的方式：

```javascript
// 组件内使用navigation.dispatch 分发
this.navigation.dispatch({
  type: 'Navigation/RESET',
  key?: string,
  actions: Array<NavigationAction> ,
  index: number
})
```

## 场景用法

下面针对几个常见的业务场景，举些例子来展示如何在您的应用中使用Vue-Navigation。

下面的所有场景都先假设使用同一个路由设置：

```javascript
const Navigation = require('Vue-Navigation')

const loginScreen = {
  name: 'Login',
  template: '<div>Login Screen</div>'
}

const forgetPasswordScreen = {
  name: 'ForgetPassword',
  template: '<div>Forget Password Screen</div>'
}

const registerBasicInfoScreen = {
  name: 'RegisterBasicInfo',
  template: '<div>Register Basic Info Screen</div>'
}

const registerMobileBindingScreen = {
  name: 'RegisterMobileBinding',
  template: '<div>Register Mobile Binding Screen</div>'
}

const registerNavigator = Navigation.StackNavigator({
  BasicInfo: {
    screen: registerBasicInfoScreen
  },
  MobileBinding: {
    screen: registerMobileBindingScreen
  }
})
      
const rootNavigator = Navigation.StackNavigator({
  Login: { screen: loginScreen },
  ForgetPassword: { screen: forgetPasswordScreen },
  Register: { screen: registerNavigator }
}, {
    initialRouteName: 'Login'
})
```

 上面的配置，包括各screen 的逻辑都是很简单的，暂时没加任何页面切换的逻辑。

### 配置主页面

### Login Screen navigate to Register default screen

修改下`loginScreen` 的代码：

```javascript
const loginScreen = {
  name: 'Login',
  template: '<div @click="toRegister">Navigate to Register</div>',
  methods: {
    toRegister: function(evt) {
      this.navigation.navigate('Register')
    }
  }
}
```

在Register navigator 中，`initialRouteName` 的默认值是navigator RouteConfigs 对象的第一个key，即`BasicInfo`。

### Register default screen back to Login Screen

修改下`registerBasicInfoScreen` 的代码：

```javascript
const registerBasicInfoScreen = {
  name: 'RegisterBasicInfo',
  template: '<div @click="backToPrevious">Back to Previous Screen</div>',
  methods: {
    backToPrevious: function(evt) {
      this.navigation.goBack()
    }
  }
}
```

### Login Screen navigate to RegisterMobileBinding Screen

由于`registerMobileBindingScreen` 并不是register navigator 的第一个screen，所以，我们需要使用嵌套action，修改`loginScreen` 的代码：

```javascript
const loginScreen = {
  name: 'Login',
  template: '<div @click="toRegisterMobileBinding">Navigate to Register Mobile Binding</div>',
  methods: {
    toRegisterMobileBinding: function(evt) {
      this.navigation.navigate('Register', null, Navigation.NavigationActions.navigate({routeName: 'MobileBinding'}))
    }
  }
}
```

### Reset to Login Screen

假设用户当前的堆栈历史如下：

Login -> Register（嵌套路由） -> BasicInfo -> MobileBinding

那，当用户在MobileBinding 页面完成手机绑定，我们想将页面切换回登录页，我们想清空Login 之后的堆栈历史，需要跨navigator 使用 `reset action` ，并修改`registerMobileBindingScreen` 的代码：

```javascript
const registerMobileBindingScreen = {
  name: 'RegisterMobileBinding',
  template: '<div @click="resetToLogin">Reset To Screen</div>',
  methods: {
    resetToLogin: function() {
      this.navigation.dispatch(Navigation.NavigationActions.reset({
        key: null,
        actions: [
          Navigation.NavigationActions.navigate({ routeName: 'Login' })
        ],
        index: 0
      }))
    }
  }
}
```