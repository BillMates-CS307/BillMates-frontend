/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig : {JWT_TOKEN : "password"}
}

module.exports = nextConfig
