const TerserWebpackPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoPrefixPlugin = require("autoprefixer");
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin")
  .default;
const WebpackModuleNoModulePlugin = require("@hydrophobefireman/module-nomodule");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cfg = require("./.babelrc");
const { autoPrefixCSS } = require("catom/css");

const mode = process.env.NODE_ENV;

const isProd = mode === "production";

function prodOrDev(a, b) {
  return isProd ? a : b;
}

const jsLoaderOptions = (isLegacy) => ({
  test: /\.(m?js|tsx?)$/,
  exclude: /(node_modules\/(?!(@hydrophobefireman|statedrive)))|(injectables)/,
  use: {
    loader: "babel-loader",
    options: cfg.env[isLegacy ? "legacy" : "modern"],
  },
});
const cssLoaderOptions = {
  test: /\.css$/,
  use: [
    { loader: MiniCssExtractPlugin.loader },
    {
      loader: "css-loader",
    },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: { plugins: [autoPrefixPlugin()] },
      },
    },
  ],
};
const contentLoaderOptions = {
  test: /\.(png|jpg|gif|ico|svg)$/,
  use: [{ loader: "url-loader", options: { fallback: "file-loader" } }],
};
function getEnvObject(isLegacy) {
  const prod = !isLegacy;
  return {
    arrowFunction: prod,
    const: prod,
    destructuring: prod,
    forOf: prod,
    dynamicImport: prod,
    module: prod,
  };
}
function getCfg(isLegacy) {
  return {
    cache: {
      type: "memory",
    },
    devServer: {
      contentBase: `${__dirname}/docs`,
      compress: !0,
      port: 4200,
      historyApiFallback: true,
    },
    module: {
      rules: [
        jsLoaderOptions(isLegacy),
        cssLoaderOptions,
        contentLoaderOptions,
      ],
    },
    entry: `${__dirname}/src/App.tsx`,
    output: {
      environment: getEnvObject(isLegacy),
      path: `${__dirname}/docs/`,
      filename: `${isLegacy ? "legacy" : "es6"}/[name]-[contenthash].js`,
    },
    resolve: { extensions: [".ts", ".tsx", ".js", ".json"] },
    mode,
    optimization: {
      concatenateModules: false,
      minimizer: prodOrDev([new TerserWebpackPlugin({ parallel: true })], []),
      splitChunks: {
        chunks: "all",
      },
      runtimeChunk: "single",
    },
    plugins: [
      new HtmlWebpackPlugin({
        templateParameters: async function templateParametersGenerator(
          compilation,
          files,
          tags,
          options
        ) {
          let css = "";
          css = await autoPrefixCSS();
          return {
            compilation,
            webpackConfig: compilation.options,
            htmlWebpackPlugin: {
              tags,
              files,
              options: Object.assign(options, {
                css,
              }),
            },
          };
        },
        inject: "body",
        template: `${__dirname}/index.html`,
        xhtml: !0,
        favicon: "./favicon.ico",
        minify: prodOrDev(
          {
            collapseBooleanAttributes: !0,
            collapseWhitespace: !0,
            html5: !0,
            minifyCSS: !0,
            removeEmptyAttributes: !0,
            removeRedundantAttributes: !0,
          },
          !1
        ),
      }),
      new MiniCssExtractPlugin({}),
      isProd &&
        new OptimizeCSSAssetsPlugin({ cssProcessor: require("cssnano") }),
      isProd && new HTMLInlineCSSWebpackPlugin({}),
      new WebpackModuleNoModulePlugin(isLegacy ? "legacy" : "modern"),
    ].filter(Boolean),
  };
}

module.exports = isProd ? [getCfg(false), getCfg(true)] : getCfg(false);
