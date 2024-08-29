const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");
const { dependencies } = require("./package.json");

module.exports = {
  entry: "./src/setup/index.ts",
  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:3001",
    //   },
    // },
    proxy: [
      {
        context: ["/api"],
        target: "http://localhost:3001",
        secure: false,
      },
    ],
    historyApiFallback: true,
    port: 3003,
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.(ts|js|tsx|jsx)x?$/,
        exclude: ["/node_modules/", "/styles/"],
        include: ["/react-table"],
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.(ts|tsx)?$/,
        exclude: ["/node_modules/", "/styles/"],
        use: ["ts-loader"],
      },

      {
        // add source-map support
        enforce: "pre",
        test: /\.js$/,
        exclude: ["/node_modules/", "/styles/"],
        loader: "source-map-loader",
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "svg-url-loader",
            options: {
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "order_remote",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        "./Order": "./src/remote/Order",
        "./Style": "./src/styles/App.scss",
      },
      shared: {
        ...dependencies,
        react: {
          singleton: true,
          eager: true,
          requiredVersion: dependencies["react"],
        },
        "react-dom": {
          singleton: true,
          eager: true,
          requiredVersion: dependencies["react-dom"],
        },
        "react-router-dom": {
          singleton: true,
          eager: true,
          requiredVersion: dependencies["react-router-dom"],
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".scss"],
  },
  target: "web",
  // add source-map support
  devtool: "source-map",
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};
