# webpack

>https://blog.csdn.net/qq_40028324/article/details/81130353

## npm

`install`可简写为`i`

`--global`可简写为`-g`,全局安装

`--save-dev`可简写为`-D`(这个命令是用于把配置添加到package.json的开发环境配置列表中

`--save`可简写为`-S`   生产环境

网上统一的观念是

    devDependencies用于本地环境开发时候。
    dependencies用户发布环境

其实看名字我也知道是这个意思，我觉得没解释情况。
devDependencies是只会在开发环境下依赖的模块，生产环境不会被打入包内。通过NODE_ENV=developement或NODE_ENV=production指定开发还是生产环境。

而dependencies依赖的包不仅开发环境能使用，生产环境也能使用。其实这句话是重点，按照这个观念很容易决定安装模块时是使用--save还是--save-dev。

```
npm安装依赖
【npm install xxx】利用 npm 安装xxx依赖到当前命令行所在目录
【npm install xxx -g】利用npm安装全局依赖xxx
【npm install xxx –save】 安装并写入package.json的”dependencies”中
【npm install xxx –save-dev】安装并写入package.json的”devDependencies”中
 

npm删除依赖
【npm uninstall xxx】删除xxx依赖
【npm uninstall xxx -g】删除全局依赖xxx
```

## 安装

首先我们创建一个目录，初始化 npm，然后在本地安装webpack，接着安装 webpack-cli（此工具用于在命令行中运行 webpack）：

```
mkdir webpack-demo && cd webpack-demo  //新建一个文件夹
npm init -y    //初始化npm，生成package.json文件
npm install webpack webpack-cli --save-dev
```

## 配置文件

新建一个webpack.config.js文件，书写webpack的配置

```
webpack --config webpack.config.js      

如果 webpack.config.js 存在，则 webpack 命令将默认选择使用它。我们在这里使用 --config 选项只是向你表明，可以传递任何名称的配置文件。这对于需要拆分成多个文件的复杂配置是非常有用。
```

------

```
  {
    "name": "webpack-demo",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack"      //我们可以设置一个快捷方式。在 package.json 添加
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "webpack": "^4.0.1",
      "webpack-cli": "^2.0.9",
      "lodash": "^4.17.5"
    }
  }
```

现在，可以使用 `npm run build` 命令，来启用webpack 打包。

## entry入口

```
entry: {   //对象的格式配置入口，满足多页应用
    app: path.join(__dirname, 'src/index.js')
  },
```

###  __dirname 

> Node.js 中 __dirname 和 ./ 的区别

Node.js 中，`__dirname` 总是指向被执行 js 文件的绝对路径，所以当你在 `/d1/d2/myscript.js` 文件中写了 `__dirname`， 它的值就是 `/d1/d2` 。

相反，`./`  会返回你执行 node 命令的路径，例如你的工作路径。

有一个特殊情况是在 `require()` 中使用 `./` 时，这时的路径就会是含有 `require()` 的脚本文件的相对路径。

###  path.resolve()和path.join()

> node  的path模块中 path.resolve()和path.join()的区别

一、path模块的引入。

直接引用。node中自带的模块

const path = require('path');

二、path.join(path1，path2，path3.......)

  作用：将路径片段使用特定的分隔符（window：\）连接起来形成路径，并规范化生成的路径。若任意一个路径片段类型错误，会报错。

```
const path = require('path');

let myPath = path.join(__dirname,'/img/so');

let myPath2 = path.join(__dirname,'./img/so');

let myPath3=path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');

console.log(__dirname);    //    G:\000发票\vue2_vvschool

console.log(myPath);     //      G:\000发票\vue2_vvschool\img\so

console.log(myPath2);    //      G:\000发票\vue2_vvschool\img\so

console.log(myPath3);   //       \foo\bar\baz\asdf
```

三、path.resolve([from...],to)

作用：把一个路径或路径片段的序列解析为一个绝对路径。相当于执行cd操作。

/被解析为根目录。

```
const path = require('path');

let myPath = path.resolve(__dirname,'/img/so');

let myPath2 = path.resolve(__dirname,'./img/so');

let myPath3=path.resolve('/foo/bar', './baz');

let myPath4=path.resolve('/foo/bar', '/tmp/file/');

console.log(__dirname);  //           G:\000发票\vue2_vvschool

console.log(myPath);  //             G:\img\so

console.log(myPath2);  //             G:\000发票\vue2_vvschool\img\so

console.log(myPath3);  //             G:\foo\bar\baz

console.log(myPath4);  //             G:\tmp\file

```

### vendor

>https://www.jianshu.com/p/55404376b26e

一般情况下，使用此属性的目的是为了方便开发调试，或者是部署到服务器时提高应用的访问速度。在webpack 的打包此文件过程中通常会根据文件的内容计算出一个hash值，并将该值加到文件名中，并配置一个长达一年的缓存控制。之所以这么做，是因为vendor.js中的内容基本上很少更新，当我们根据业务需求修改相关逻辑代码并重新生成入口文件时（比如app.js），vendor.js仍然在浏览器的缓存中，这时用户只需要重新下载新的入口文件即可。

## output出口

>https://www.jianshu.com/p/042d0d088020

#### filename

webpack会为每个生成的Chunk取一个名称，Chunk的名称和Entry的配置有关：

1. 如果entry是一个string或者array，就只会生成一个chunk，这个chunk的名称是main;
2. 如果entry是一个object，就可能出现多个chunk，这时chunk的名称是object键值对里键的名称

然而，当通过多个入口起点(entry point)、代码拆分(code splitting)或各种插件(plugin)创建多个 bundle，应该使用以下一种替换方式，来赋予每个 bundle 一个唯一的名称……
使用入口名称：

```
output:{
     filename: "[name].bundle.js"
}
```

使用内部 chunk id

```
output:{
    filename: "[id].bundle.js"
}

```

使用每次构建过程中，唯一的 hash 生成

```
output:{
filename: "[name].[hash].bundle.js"
}

```

使用基于每个 chunk 内容的 hash：

```
output:{
filename: "[chunkhash].bundle.js"
}
```

上面介绍的 id、name、hash、chunkhash等都是webpack内置变量，

id是唯一标示，不会重复，从0开始，

name 是模块名称，是你自己起的，在配置路由懒加载的时候可以自己命名

#### chunkFilename

官网解释：此选项决定了非入口(non-entry) chunk 文件的名称，
什么场景需要呢？
在按需加载（异步）模块的时候，也就是路由懒加载，这样的文件是没有被列在entry中的，
比如

```
{
    entry: {
        "index": "pages/index.jsx"
    },
    output: {
         filename: "[name].min.js",
        chunkFilename: "[name].min.js"
    }
}
const myModel = r => require.ensure([], () => r(require('./myVue.vue')), 'myModel')
```

上面的例子，通过filename输出的是index.min.js
异步加载的模块是要以文件形式加载哦，所以这时生成的文件名是以chunkname配置的，通过chunkFilename输出的是myModel.min.js
所以chunkFilename也很重要哦！！！

#### path

path是配置输出文件存放在本地的目录，**字符串类型**，**是绝对路径**

```
output:{
    path: path.resolve(__dirname, 'dist/assets')
}
```

#### publicPath

- 默认值：空字符串[

> webpack 提供一个非常有用的配置，该配置能帮助你为项目中的所有资源指定一个基础路径，它被称为公共路径(publicPath)。

其实这里说的所有资源的基础路径是指项目中引用css，js，img等资源时候的一个基础路径，这个基础路径要配合具体资源中指定的路径使用，所以其实打包后资源的访问路径可以用如下公式表示：

```
静态资源最终访问路径 = output.publicPath + 资源loader或插件等配置路径
```

例如

```
output.publicPath = '/dist/'

// image
options: {
 	name: 'img/[name].[ext]?[hash]'
}

// 最终图片的访问路径为
output.publicPath + 'img/[name].[ext]?[hash]' = '/dist/img/[name].[ext]?[hash]'

// js output.filename
output: {
	filename: '[name].js'
}
// 最终js的访问路径为
output.publicPath + '[name].js' = '/dist/[name].js'

// extract-text-webpack-plugin css
new ExtractTextPlugin({
	filename: 'style.[chunkhash].css'
})
// 最终css的访问路径为
output.publicPath + 'style.[chunkhash].css' = '/dist/style.[chunkhash].css'
```

对构建出的资源进行异步加载（图片，文件），该选项的值是以 runtime(运行时) 或 loader(载入时) 所创建的每个 URL 为前缀。因此，在多数情况下，此选项的值都会以/结束。
默认值是一个空字符串 ""，即相对路径，配置错误会导致404
简单说，就是静态文件托管在cdn上
举个栗子：
如果你这么配置：

```
output:{
    filename:'[name]_[chunkhash:8].js',
    publicPath:'https://www.qdtalk.com/assets/'
}
```

打包编译后，html页面就是这样的

```
<script src="https://www.qdtalk.com/assets/a_12345678.js"></script>

```

path 和publicPath都支持字符串模板

## mode

>https://www.jianshu.com/p/a9df5d2a5777

这是在 Webpack4.0 之后新增的内容，目的就是减少部分属性的填写，使 Webpack 更容易上手，无形中减少了一些配置。
这个属性主要就是有两个值 production、development，主要就是声明当前是生产模式还是开发模式，默认为production模式，选择 none 也可以，但是会有一个 warning⚠️。
你可能会有一个疑问，这里只有生产环境和开发环境，那测试环境，预发布环境怎么处理呢？
答：这里所说的生产环境，就是除了开发环境（本地环境）以外的环境，只要往线上走，mode都是production
development 模式下，将侧重于功能调试和优化开发体验，包含如下内容：

1. 浏览器调试工具
2. 开发阶段的详细错误日志和提示
3. 快速和优化的增量构建机制

production 模式下，将侧重于模块体积优化和线上部署：

1. 开启所有的优化代码
2. 更小的 bundle 大小
3. 去除掉只在开发阶段运行的代码
4. Scope hoisting 和 Tree-shaking
5. 自动启用 uglifyjs 对代码进行压缩

```
const webpack = require('webpack');
const path = require('path');
let  env=process.env.NODE_ENV=="development"?"development":"production";
const config = {
    mode: env,
}
module.exports = config;
```

mode也支持命令行

```
"scripts": {
  "dev": "webpack --mode development",
  "build": "webpack --mode production"
}
```

## devServer

>https://www.jianshu.com/p/b50f46917234
>
>devServer是用来提高开发效率的，不是用devServer来做打包的，它提供了一些配置项，可以用于改变devServer的默认行为，要配置devServer，除了可以在配置文件里通过devServer传入参数，还可以通过命令行传入参数。
>
>⚠️注意！！！只有在通过devServer启动webpack时，配置文件里的devServer才会生效，因为这些参数所对应的功能都是devServer提供的，webpack本身并不认识devServer的配置项。

```
devServer: {
     hot:true,
      historyApiFallback:,
      contentBase:,
      host:,
      port:,
      allowedHosts:,
      disableHostCheck:,
      https:,
      open:,
 }
```

### hot

hot配置是否启用模块的热替换功能，devServer的默认行为是在发现源代码被变更后，通过自动刷新整个页面来做到事实预览，开启hot后，将在不刷新整个页面的情况下通过新模块替换老模块来做到实时预览。

使用方法

hot 有两种使用方法，
1、同过配置文件，具体如下

```
const webpack = require('webpack');
const path = require('path');
let env = process.env.NODE_ENV == "development" ? "development" : "production";
const config = {
  mode: env,
 devServer: {
     hot:true
 }
}
  plugins: [
     new webpack.HotModuleReplacementPlugin(), //热加载插件
  ],
module.exports = config;
```

需要引入一个plugins:webpack.HotModuleReplacementPlugin()

你如果通过--hot配置，就会自动引用webpack.HotModuleReplacementPlugin这插件，所以我们不建议这么配置hot，麻烦

用第二种
2、通过命令行
在package.json中的script中处理

```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "NODE_ENV=development  webpack-dev-server --config  webpack.develop.config.js --hot",
  },
```

如上在start中添加--hot即可，省去了繁琐的配置

### host

配置devServer服务监听的地址，例如如果想让局域网内的其他用户访问自己的设备，可以将host配置为自己本机的IP地址，
分享一个可以自动获取本地ip地址的方法

```
const webpack = require('webpack');
const path = require('path');
let env = process.env.NODE_ENV == "development" ? "development" : "production";
const os = require('os')
// 动态获取 host || 也可在package.json中配置 HOST （--host 0.0.0.0)
let arr = []
let HOST
for (let key in os.networkInterfaces()) {
  os.networkInterfaces()[key].forEach((item) => {
    if (item.family === 'IPv4' && item.address.indexOf('192.168.') !== -1) {
      arr.push(item.address)
    }
  })
}
HOST = arr[0]

const config = {
  mode: env,
 devServer: {
     hot:true,
     hsot:HOST
 }
}
  plugins: [
     new webpack.HotModuleReplacementPlugin(), //热加载插件
  ],
module.exports = config;
```

通过命令行也是可以的

```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "NODE_ENV=development  webpack-dev-server --config  webpack.develop.config.js --hot --host 0.0.0.0",
  },
```

host的默认地址是127.0.0.1

### port

这个没什么说的了就是端口号，默认是8080，如果占用就换成8081或者1234，都可以

### open

open 在devServer启动且第一次构建完成时，自动用我们的系统的默认浏览器去打开要开发的网页，
使用方法
可在配置文件中使用

```
 devServer: {
     open:true
 }
}

```

也可以在命令行中使用

```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "NODE_ENV=development  webpack-dev-server --config  webpack.develop.config.js --hot --open --host 0.0.0.0",
  },
```

### proxy

>解决开发环境的跨域问题

使用一:

```
mmodule.exports = {
    //...
    devServer: {
        proxy: {
            '/api': 'http://localhost:3000'
        }
    }
};
```

请求到 `/api/xxx` 现在会被代理到请求 `http://localhost:3000/api/xxx`, 例如 `/api/user` 现在会被代理到请求 `http://localhost:3000/api/user`

使用二

如果你想要代码多个路径代理到同一个target下, 你可以使用由一个或多个「具有 context 属性的对象」构成的数组：

```
module.exports = {
    //...
    devServer: {
        proxy: [{
            context: ['/auth', '/api'],
            target: 'http://localhost:3000',
        }]
    }
};
```

使用三:

如果你不想始终传递 /api ，则需要重写路径：

```
module.exports = {
    //...
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                pathRewrite: {'^/api' : ''}
            }
        }
    }
};
```

请求到 /api/xxx 现在会被代理到请求 `http://localhost:3000/xxx`, 例如 /api/user 现在会被代理到请求 `http://localhost:3000/user`

使用四:

默认情况下，不接受运行在 HTTPS 上，且使用了无效证书的后端服务器。如果你想要接受，只要设置 `secure: false` 就行。修改配置如下：

```
module.exports = {
    //...
    devServer: {
        proxy: {
            '/api': {
                target: 'https://other-server.example.com',
                secure: false
            }
        }
    }
};
```

使用五:

有时你不想代理所有的请求。可以基于一个函数的返回值绕过代理。
在函数中你可以访问请求体、响应体和代理选项。必须返回 false 或路径，来跳过代理请求。

例如：对于浏览器请求，你想要提供一个 HTML 页面，但是对于 API 请求则保持代理。你可以这样做：

```
module.exports = {
  //...
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                bypass: function(req, res, proxyOptions) {
                    if (req.headers.accept.indexOf('html') !== -1) {
                        console.log('Skipping proxy for browser request.');
                        return '/index.html';
                    }
                }
            }
        }
    }   
};
```

解决跨域原理

上面的参数列表中有一个`changeOrigin`参数, 是一个布尔值, 设置为true, 本地就会虚拟一个服务器接收你的请求并代你发送该请求

```
module.exports = {
    //...
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            }
        }
    }
};
```

vue-cli中proxyTable配置接口地址代理示例

修改 `config/index.js`

```
module.exports = {
    dev: {
    // 静态资源文件夹
    assetsSubDirectory: 'static',
    // 发布路径
    assetsPublicPath: '/',

    // 代理配置表，在这里可以配置特定的请求代理到对应的API接口
    // 使用方法：https://vuejs-templates.github.io/webpack/proxy.html
    proxyTable: {
        // 例如将'localhost:8080/api/xxx'代理到'https://wangyaxing.cn/api/xxx'
        '/api': {
            target: 'https://wangyaxing.cn', // 接口的域名
            secure: false,  // 如果是https接口，需要配置这个参数
            changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        },
        // 例如将'localhost:8080/img/xxx'代理到'https://cdn.wangyaxing.cn/xxx'
        '/img': {
            target: 'https://cdn.wangyaxing.cn', // 接口的域名
            secure: false,  // 如果是https接口，需要配置这个参数
            changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
            pathRewrite: {'^/img': ''}  // pathRewrite 来重写地址，将前缀 '/api' 转为 '/'。
        }
    },
    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 4200, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
}
```

更多参数

`dev-server` 使用了非常强大的 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) , `http-proxy-middleware` 基于 `http-proxy` 实现的，可以查看 http-proxy 的源码和文档:[https://github.com/nodejitsu/...](https://github.com/nodejitsu/node-http-proxy) 。

```
target：要使用url模块解析的url字符串
forward：要使用url模块解析的url字符串
agent：要传递给http（s）.request的对象（请参阅Node的https代理和http代理对象）
ssl：要传递给https.createServer（）的对象
ws：true / false，是否代理websockets
xfwd：true / false，添加x-forward标头
secure：true / false，是否验证SSL Certs
toProxy：true / false，传递绝对URL作为路径（对代理代理很有用）
prependPath：true / false，默认值：true - 指定是否要将目标的路径添加到代理路径
ignorePath：true / false，默认值：false - 指定是否要忽略传入请求的代理路径（注意：如果需要，您必须附加/手动）。
localAddress：要为传出连接绑定的本地接口字符串
changeOrigin：true / false，默认值：false - 将主机标头的原点更改为目标URL
```

## module

### postcss

#### 什么是postcss

postcss 一种对css编译的工具，类似babel对js的处理，常见的功能如：

1  . 使用下一代css语法

2 . 自动补全浏览器前缀

3 . 自动把px代为转换成 [rem](https://www.jianshu.com/p/171bc2b1ed98)

4 . css 代码压缩等等

postcss 只是一个工具，本身不会对css操作，它通过插件实现功能，`autoprefixer` 就是其一。

#### 与 less sass 的区别

less sass 是`预处理器`，用来支持扩充css语法。

postcss 既不是预处理器也不是后处理器，其功能比较广泛，而且重要的一点是，postcss可以和less/sass结合使用

![img](https://upload-images.jianshu.io/upload_images/12224162-6518e0d012724194?imageMogr2/auto-orient/strip%7CimageView2/2/w/532)

#### 关于取舍

虽然可以结合less/sass使用，但是它们还是有很多重复功能，用其中一个基本就 ok 了。

以下是个人总结：

- postcss 鼓励开发者使用规范的CSS原生语法编写源代码，支持未来的css语法，就像babel支持ES6，而且高版本的谷歌浏览器已支持部分语法
- less、sass 扩展了原生的东西，它把css作为一个子集，这意味这它比原生更强大，但是迟早会和原生的功能重复，比如css变量定义高版本的谷歌已经支持，再比如js现在的 `require` 和 `import`。
- 可以结合使用

#### 如何使用

这里只说在webpack里集成使用，首先需要 loader

1 . 安装

```
cnpm install postcss-loader --save-dev

```

2 . webpack配置

一般与其他loader配合使用

配合时注意loader的顺序（从下面开始加载）

```
rules: [
    {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'style-loader',
            },
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1,
                }
            },
            {
                loader: 'postcss-loader'
            }
        ]
    }
]
```

3 . postcss配置

项目根目录新建 `postcss.config.js` 文件，所有使用到的插件都需在这里配置，空配置项时配置`xx:{}`

```
module.exports = {
    plugins: {
        'autoprefixer': {
            browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9', // React doesn't support IE8 anyway
            ],
            flexbox: 'no-2009',
        },
        'postcss-px-to-viewport': {
            viewportWidth: 750, 
            viewportHeight: 1334,
            unitPrecision: 3,
            viewportUnit: 'vw',
            selectorBlackList: ['.ignore', '.hairlines'], 
            minPixelValue: 1,
            mediaQuery: false 
        },
        'postcss-aspect-ratio-mini': {},
        'postcss-write-svg': {
            utf8: false
        },
        'postcss-cssnext': {},
        'postcss-viewport-units': {}
    }
}
```

注：也可以在webpack中配置

### 常用的postcss插件

------

#### autoprefixer

前缀补全，全自动的，无需多说

安装：`cnpm install autoprefixer --save-dev`

#### postcss-cssnext

使用下个版本的css语法，语法见**cssnext (css4)语法**

安装：`cnpm install postcss-cssnext --save-dev`

> 别忘了在`postcss.config.js`配置：`'postcss-cssnext':{}`

> cssnext包含了 autoprefixer ，都安装会报错，如下：

```
Warning: postcss-cssnext found a duplicate plugin ('autoprefixer') in your postcss plugins. This might be inefficient. You should remove 'autoprefixer' from your postcss plugin list since it's already included by postcss-cssnext.

```

#### postcss-pxtorem

把px转换成rem

安装：`cnpm install postcss-pxtorem --save-dev`

配置项：

```
{
    rootValue: 16, //你在html节点设的font-size大小
    unitPrecision: 5, //转rem精确到小数点多少位
    propList: ['font', 'font-size', 'line-height', 'letter-spacing'],//指定转换成rem的属性，支持 * ！
    selectorBlackList: [],// str/reg 指定不转换的选择器，str时包含字段即匹配
    replace: true,
    mediaQuery: false, //媒体查询内的px是否转换
    minPixelValue: 0 //小于指定数值的px不转换
}

```

特殊技巧:不转换成rem

px检测区分大小写，也就是说Px/PX/pX不会被转换，可以用这个方式避免转换成rem

#### cssnext (css4)语法

cssnext 和 css4 并不是一个东西，cssnext使用下个版本css的草案语法

### url-loader

> 文件处理
>
> https://www.jianshu.com/p/3429cd456982

## optimization

提取公共代码

>https://segmentfault.com/a/1190000017066322?utm_source=tag-newest

### minimize

如果mode是production类型，minimize的默认值是true，执行默认压缩，

minimizer

当然如果想使用第三方的压缩插件也可以在optimization.minimizer的数组列表中进行配置

### SplitChunksPlugin

从webpack4开始官方移除了commonchunk插件，改用了optimization属性进行更加灵活的配置，这也应该是从V3升级到V4的代码修改过程中最为复杂的一部分，下面的代码即是optimize.splitChunks 中的一些配置参考

一些常用配置如下

```
splitChunks: {
    chunks: "async”,//默认作用于异步chunk，值为all/initial/async/function(chunk),值为function时第一个参数为遍历所有入口chunk时的chunk模块，chunk._modules为chunk所有依赖的模块，通过chunk的名字和所有依赖模块的resource可以自由配置,会抽取所有满足条件chunk的公有模块，以及模块的所有依赖模块，包括css
    minSize: 30000,  //表示在压缩前的最小模块大小,默认值是30kb
    minChunks: 1,  // 表示被引用次数，默认为1；
    maxAsyncRequests: 5,  //所有异步请求不得超过5个
    maxInitialRequests: 3,  //初始话并行请求不得超过3个
   automaticNameDelimiter:'~',//名称分隔符，默认是~
    name: true,  //打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔
    cacheGroups: { //设置缓存组用来抽取满足不同规则的chunk,下面以生成common为例
       common: {
         name: 'common',  //抽取的chunk的名字
         chunks(chunk) { //同外层的参数配置，覆盖外层的chunks，以chunk为维度进行抽取
         },
         test(module, chunks) {  //可以为字符串，正则表达式，函数，以module为维度进行抽取，只要是满足条件的module都会被抽取到该common的chunk中，为函数时第一个参数是遍历到的每一个模块，第二个参数是每一个引用到该模块的chunks数组。自己尝试过程中发现不能提取出css，待进一步验证。
         },
        priority: 10,  //优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中
       minChunks: 2,  //最少被几个chunk引用
       reuseExistingChunk: true，//  如果该chunk中引用了已经被抽取的chunk，直接引用该chunk，不会重复打包代码
       enforce: true  // 如果cacheGroup中没有设置minSize，则据此判断是否使用上层的minSize，true：则使用0，false：使用上层minSize
       }
    }
}

```

1. chunks: 表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为async;
2. minSize: 表示在压缩前的最小模块大小，默认是30kb；
3. minChunks: 表示被引用次数，默认为1；
4. maxAsyncRequests: 最大的按需(异步)加载次数，默认为1；
5. maxInitialRequests: 最大的初始化加载次数，默认为1；
6. name: 拆分出来块的名字(Chunk Names)，默认由块名和hash值自动生成，如果是true，将自动生成基于块和缓存组键的名称。如果是字符串或函数将允许您使用自定义名称。如果名称与入口点名称匹配，则入口点将被删除。
7. automaticNameDelimiter:'',名称分隔符，默认是
8. cacheGroups: 缓存组。

### runtimeChunk

假设一个使用动态导入的情况(使用import())，在`app.js`动态导入`component.js`

```
const app = () =>import('./component').then();
```

build之后，产生3个包。

- `0.01e47fe5.js`
- `main.xxx.js`
- `runtime.xxx.js`

其中`runtime`，用于管理被分出来的包。下面就是一个`runtimeChunk`的截图，可以看到chunkId这些东西。

```
...
function jsonpScriptSrc(chunkId) {
/******/         return __webpack_require__.p + "" + ({}[chunkId]||chunkId) + "." + {"0":"01e47fe5"}[chunkId] + ".bundle.js"
/******/     }
...
```

如果采用这种分包策略

1. 当更改`app`的时候`runtime`与（被分出的动态加载的代码）`0.01e47fe5.js`的`名称(hash)`不会改变，main的`名称(hash)`会改变。
2. 当更改`component.js`，`main`的`名称(hash)`不会改变，`runtime`与 (动态加载的代码) `0.01e47fe5.js`的名称(hash)会改变。

## plugins

loaders是在打包构建过程中用来处理源文件的（JSX，Scss，Less..），一次处理一个，插件并不直接操作单个文件，它直接对整个构建过程其作用。

### VueLoaderPlugin

>//使用Vue-loader 15.*之后的版本，都是需要VueLoaderPlugin的,

```
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
plugins: [
    new VueLoaderPlugin(),     //使用Vue-loader 15.*之后的版本，都是需要VueLoaderPlugin的,
    new HtmlWebpackPlugin({
      title:'vue_vvschool'
    })    //动态生产html文件
  ]
```

### html-webpack-plugin

>https://segmentfault.com/a/1190000013883242?utm_source=tag-newest

plugin是什么

plugin是用于扩展webpack的功能，各种各样的plugin几乎可以让webpack做任何与构建相关的事情。
plugin的配置很简单，plugins配置项接收一个数组，数组里的每一项都是一个要使用的plugin的实例，plugin需要的参数通过构造函数传入。
举个栗子

```
const HtmlWebpackPlugin = require('html-webpack-plugin')
  plugins: [
    new HtmlWebpackPlugin({ // 打包输出HTML
      title: 'Hello World app',
      minify: { // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true// 压缩内联css
      },
      filename: 'index.html',
      template: 'index.html'
    }),
  ]
```

使用plugin的难点在于plugin本身的配置项，而不是如何在webpack中引入plugin，几乎所有webpack无法直接实现的功能，都能找到开源的plugin去解决，我们要做的就是去找更据自己的需要找出相应的plugin。

title

生成html文件的标题

filename

输出的html的文件名称

template

html模板所在的文件路径
根据自己的指定的模板文件来生成特定的 html 文件。这里的模板类型可以是任意你喜欢的模板，可以是 html, jade, ejs, hbs, 等等，但是要注意的是，使用自定义的模板文件时，需要提前安装对应的 loader， 否则webpack不能正确解析。
如果你设置的 title 和 filename于模板中发生了冲突，那么以你的title 和 filename 的配置值为准。

inject

注入选项。有四个选项值 true, body, head, false.

1. true：默认值，script标签位于html文件的 body 底部
2. body：script标签位于html文件的 body 底部（同 true）
3. head：script 标签位于 head 标签内
4. false：不插入生成的 js 文件，只是单纯的生成一个 html 文件（这个几乎不会用到的）

chunks

chunks主要用于多入口文件，当你有多个入口文件，那就回编译后生成多个打包后的文件，那么chunks 就能选择你要使用那些js文件

```
entry: {
    index: path.resolve(__dirname, './src/index.js'),
    devor: path.resolve(__dirname, './src/devor.js'),
    main: path.resolve(__dirname, './src/main.js')
}

plugins: [
    new httpWebpackPlugin({
        chunks: ['index','main']
    })
]

```

那么编译后：

```
<script type=text/javascript src="index.js"></script>
<script type=text/javascript src="main.js"></script>

```

而如果没有指定 chunks 选项，默认会全部引用。

excludeChunks

排除掉一些js

```
entry: {
    index: path.resolve(__dirname, './src/index.js'),
    devor: path.resolve(__dirname, './src/devor.js'),
    main: path.resolve(__dirname, './src/main.js')
}

plugins: [
    new httpWebpackPlugin({
     excludeChunks: ['devor.js']
    })
]
```

那么编译后：

```
<script type=text/javascript src="index.js"></script>
<script type=text/javascript src="main.js"></script>
```

### mini-css-extract-plugin

> css分离
>
> https://blog.csdn.net/qq_34832846/article/details/88527280

# webpack面试题

>https://cloud.tencent.com/developer/article/1356611
>
>https://www.jianshu.com/p/bb1e76edc71e

## 1. webpack3和webpack4的区别

1.1. mode/–mode参数
新增了mode/--mode参数来表示是开发还是生产（development/production）
production 侧重于打包后的文件大小，development侧重于goujiansud
1.2. 移除loaders，必须使用rules（在3版本的时候loaders和rules 是共存的但是到4的时候只允许使用rules）
1.3. 移除了CommonsChunkPlugin (提取公共代码)，用optimization.splitChunks和optimization.runtimeChunk来代替
1.4. 支持es6的方式导入JSON文件，并且可以过滤无用的代码

从webpack4开始官方移除了commonchunk插件，改用了optimization属性进行更加灵活的配置

```
let jsonData = require('./data.json')
import jsonData from './data.json'
import { first } from './data.json' // 打包时只会把first相关的打进去

```

1.5. 升级happypack插件（happypack可以进行多线程加速打包）
1.6.  ExtractTextWebpackPlugin调整，建议选用新的CSS文件提取kiii插件mini-css-extract-plugin，production模式，增加  minimizer



# 问题

1.多页代码分割

2.ui组件异步加载

3.多页的代码缓存