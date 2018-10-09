const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: './src/app.js',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    inline: true,
    historyApiFallback: true,
    port: 8008
  }, //這邊就是要用webpack-dev-server配置的話，就要加入告訴server要去哪裡找文件
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    })//每次打包完自動產生一個新的html覆蓋舊的
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
    // (__dirname,'dist')的意思是，在現在的路徑中去尋找 dist 這個資料夾，並把它當成 url //
  },
  module: {
     rules: [   //告訴webpack遇到不同類型檔案的時候，應該要用哪個loder處理
      {
         test: /\.css$/,
         use: [
           'style-loader',
           'css-loader'
         ]
       },
       {
         test: /\.(png|svg|jpg|gif)$/,
         use: [
           'file-loader'
         ]
       },
       {
         test: /\.(woff|woff2|eot|ttf|otf)$/,
         use: [
           'file-loader'
         ]
       },

      // {
      //   enforce: "pre",
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   loader: "eslint-loader",
      //   options: {
      //     failOnError: false,
      //     emitError: true
      //   }
      // },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader:"babel-loader"
      }
     ]
   }
};
