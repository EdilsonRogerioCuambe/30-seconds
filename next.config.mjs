/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp3)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '/_next/static/sounds/',
          outputPath: 'static/sounds/',
        },
      },
    })
    return config
  },
}

export default nextConfig
