module.exports =  {
  entry: {
    'wagtailnewsimage': './frontend/index.js',
  },
  output: {
    path: __dirname + '/wagtailnewsimage/static/wagtailnewsimage/js/',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          },
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    modules: [
      'frontend',
      'node_modules',
    ]
  },
};
