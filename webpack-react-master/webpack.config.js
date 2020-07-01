const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const MinCssExtractPlugin = require( "mini-css-extract-plugin" );   // 将css代码提取为独立文件的插件
const OptimizeCssAssetsWebpackPlugin = require( "optimize-css-assets-webpack-plugin" );     // css模块资源优化插件
const env = process.env.NODE_ENV　!== "production";  // 判断node运行环境
console.log(env);
console.log(process.env.NODE_ENV);


module.exports = {
    entry: {
        pc: path.join(__dirname, "/src/page/pc/index.js"),
        mobile: path.join(__dirname, "/src/page/mobile/index.js")
    },  // 入口文件
    output: {
        path: path.join(__dirname, "/dist"), //打包后的文件存放的地方
        filename: "js/[name]-[hash:6].js" ,           //打包后输出文件的文件名
        chunkFilename: "js/[name]-[hash:6].js" ,        //按需加载（异步）模块的文件
        // publicPath: "/"
    },
    module: {
        rules:[
            {
                include: [path.resolve(__dirname, 'src')],        // 限制打包范围，提高打包速度
                exclude: /node_modules/,                          // 排除node_modules文件夹
                test: /\.css$/,                       // 正则匹配以.css结尾的文件
                use: [
                    // 当配置MinCssExtractPlugin.loader后， loader: "style-loader"  无需配置
                    //  "style-loader",将处理结束的css代码存储在js中，运行时嵌入`<style>`后挂载到html页面上
                    {
                        loader: MinCssExtractPlugin.loader,
                        options: {
                            // 这里可以指定一个 publicPath
                            // 默认使用 webpackOptions.output中的publicPath
                            // publicPath的配置，和plugins中设置的filename和chunkFilename的名字有关
                            // 如果打包后，background属性中的图片显示不出来，请检查publicPath的配置是否有误
                            publicPath: '../',
                            modules: true
                        },
                    },     // 将处理后的CSS代码提取为独立的CSS文件
                    'css-loader',
                    'postcss-loader'
                ] ,  // 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
            },
            {
                test: /\.(scss|sass)$/,   // 正则匹配以.scss和.sass结尾的文件
                use: [
                    { loader: MinCssExtractPlugin.loader},
                    'css-loader',
                    'sass-loader','postcss-loader']
            },
            {
                test: /\.less$/,
                use: [
                    { loader: MinCssExtractPlugin.loader},
                    'css-loader', 'less-loader','postcss-loader']
            },
            {                             // jsx配置
                test: /(\.jsx|\.js)$/,
                use:[ {                    // 注意use选择如果有多项配置，可写成这种对象形式
                    loader: "babel-loader"
                }],
                exclude: /node_modules/
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                    {
                        // 构建工具通过url-loader来优化项目中对于资源的引用路径，并设定大小限制，当资源的体积小于limit时将其直接进行Base64转换后嵌入引用文件，
                        // 体积大于limit时可通过fallback参数指定的loader进行处理。
                        // 打包后可以看到小于8k的资源被直接内嵌进了CSS文件而没有生成独立的资源文件
                        loader:'url-loader',
                        options:{
                            limit:8129,
                            fallback:'file-loader',
                            name: '[name].[hash:7].[ext]',
                            outputPath: 'images'
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        outputPath:'images'
                    }
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, './dist/index.html'), // 最后生成的文件名
            template: path.resolve(__dirname, './src/page/pc/index.html'),
            chunks: [ 'vendor', 'pc','common','runtime~pc'], // 注入打包后的js文件
            inject: true,
        }),
        // 移动端
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, './dist/index.mobile.html'), // 最后生成的文件名
            template: path.resolve(__dirname, './src/page/mobile/index.html'),
            chunks: ['vendor', 'mobile','common','runtime~mobile'],
            inject: true,
        }),
        new webpack.HotModuleReplacementPlugin() ,// 热更新插件 ,HotModuleReplacementPlugin是webpack模块自带的
        new MinCssExtractPlugin( {
            //为抽取出的独立的CSS文件设置配置参数
            filename: "css/[name].css"
        } ),
    ],
    optimization: {
        //抽离出公共的代码common包
        //vendor缓存的
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'all', // 必须三选一： "initial" | "all" | "async"(默认就是异步)
                    name: 'common',
                    minSize: 0, // 最小尺寸，默认0,
                    minChunks: 2, // 最小 chunk ，默认1
                    maxInitialRequests: 5 // 最大初始化请求书，默认1
                },
                vendor: {
                    test: /node_modules/, // 正则规则验证，如果符合就提取 chunk
                    chunks: 'all', // 必须三选一： "initial" | "all" | "async"(默认就是异步)
                    name: 'vendor', // 要缓存的 分隔出来的 chunk 名称
                    priority: 10, // 缓存组优先级
                    enforce: true
                }
            }
        },
        runtimeChunk: true
    }
    // 提取公共模块，包括第三方库和自定义工具库等
    // optimization: {
    //     // 找到chunk中共享的模块,取出来生成单独的chunk
    //     splitChunks: {
    //          chunks: "all", // async表示抽取异步模块，all表示对所有模块生效，initial表示对同步模块生效
    //          cacheGroups: {
    //              vendors: {
    //                  // 抽离第三方插件
    //                  test: /[\\/]node_modules[\\/]/, // 指定是node_modules下的第三方包
    //                  name: "vendors",
    //                  priority: -10 // 抽取优先级
    //              },
    //              commons: {
    //                  // 抽离自定义工具库
    //                  name: "common",
    //                  priority: -20, // 将引用模块分离成新代码文件的最小体积
    //                  minChunks: 2, // 表示将引用模块如不同文件引用了多少次，才能分离生成新chunk
    //                  minSize: 0
    //              }
    //          }
    //     },
    //     // 为 webpack 运行时代码创建单独的chunk
    //     runtimeChunk: { name: "manifest" },
    //     // 对生成的CSS文件进行代码压缩 mode='production'时生效
    //     minimizer: [ new OptimizeCssAssetsWebpackPlugin() ]
    // },
};

