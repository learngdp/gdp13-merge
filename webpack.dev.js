const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const concat = require('concat');

const result = concat(
        ['./src/js/lib.import.js',
            './src/js/index.js',
            './src/js/commons.js',
            './src/js/utils-app.js',
            './src/js/tab-app.js'
        ],
        './src/concatened.js')
    .then(result => merge(common, {
        mode: 'development',
        watch: true,
        devtool: 'inline-source-map',
        devServer: {
            contentBase: './dist',
            hot: true
        },
        plugins: [
            new BundleAnalyzerPlugin({
                openAnalyzer: false,
                defaultSizes: 'gzip'
            })
        ]
    }));

module.exports = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(result);
            reject((err) => console.log(err));
        }, 10);
    });
};