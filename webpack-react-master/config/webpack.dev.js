const merge = require('webpack-merge');  // 引入webpack-merge功能模块
const common = require('../webpack.config.js'); // 引入webpack.config.js

module.exports = merge(common, {   // 将webpack.config.js合并到当前文件
    devServer: {
        contentBase: "./dist", // 本地服务器所加载文件的目录
        port: "8018",   // 设置端口号为8018
        inline: true, // 文件修改后实时刷新
        historyApiFallback: true, //不跳转
        hot: true , // 热更新
        proxy: {
            '/': {
                target: 'http://localhost:8018', // 你项目的本地服务地址
                bypass: function(req, res, proxyOptions) {
                    const userAgent = req.headers['user-agent'];
                    if (req.headers.accept.indexOf('html') !== -1) {
                        // 根据访问终端返回模板
                        if (/mobile/i.test(userAgent) && !/iPad/i.test(userAgent)) {
                            return '/index.mobile.html';
                        }
                        return '/index.html';
                    }
                },
            },
        },
    },
    plugins: [
    ]
});

