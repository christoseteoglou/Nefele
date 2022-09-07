/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  serverRuntimeConfig: {
    secret: 'INz36dXCxb0NghFnNqarMqPas6e0eEuqOeZ8RNFXg7tdN73ZirFO7eyL4o4UrA1',
    cryptoRounds: 1,
    // mongoURI: 'mongodb://mongo:27017/nefele'
    mongoURI: 'mongodb://mongo:27017/nefele-dev'
  }
}

module.exports = nextConfig
