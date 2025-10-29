const path = require('path'); // Path is needed for the output directory
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const deps = require('./package.json').dependencies;

// Convert module.exports to a function to access the command line arguments (argv)
module.exports = (env, argv) => {
  // Determine if the build mode is production
  const isProduction = argv.mode === 'production';
  console.log(`[CREDIT CARD MFE CONFIG] Building in ${argv.mode} mode.`);

  // Define dynamic publicPath:
  // Local (Development): Use the local port 8081
  const devPath = 'http://localhost:8081/'; 
  
  // Production (Vercel): Use the root-relative path
  // Assumes the deployment URL for this MFE is poc-webpack-repo4.vercel.app/
  // const prodPath = '/credit-card-mfe-1/';
  const prodPath = '/';

  const publicPath = isProduction ? prodPath : devPath;
  
  return {
    entry: './src/index.js', 
    // Remove the explicit 'mode: development' line
    
    devServer: {
      port: 8081,
      open: true,
    },
    
    output: {
      // 🟢 FIX 1: Define the path to write the final build files
      path: path.resolve(__dirname, 'dist'),
      
      // 🟢 FIX 2: Set the dynamic public path
      publicPath: publicPath,
    },
    
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react', '@babel/preset-env'],
            },
          },
        },
      ],
    },
    
    plugins: [
      new ModuleFederationPlugin({
        name: 'creditCardMFE1',
        filename: 'remoteEntry.js',
        exposes: {
          './CreditCardComponent': './src/CreditCardMFE.jsx',
        },
        shared: {
          // CRITICAL FIX FOR ISOLATION: Setting eager: true loads the dependency immediately
          react: {
            singleton: true,
            requiredVersion: deps.react,
            eager: true,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: deps['react-dom'],
            eager: true,
          },
          redux: {
            singleton: true,
            requiredVersion: deps.redux,
            eager: true,
          },
          'react-redux': {
            singleton: true,
            requiredVersion: deps['react-redux'],
            eager: true,
          },
        },
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
    ],
  };
};