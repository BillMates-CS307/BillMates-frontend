/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig : {JWT_TOKEN : "password", LAMBDA_TOKEN : "zpdkwA.2_kLU@zg"},
}

module.exports = nextConfig
