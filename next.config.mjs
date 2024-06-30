/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    MASTER_ADMIN: process.env.MASTER_ADMIN,
    // NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    WPA_Key: process.env.WPA_Key
  }
}

export default nextConfig;
