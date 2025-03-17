/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login", // Redirect root to login
        permanent: true, // HTTP 308 Permanent Redirect
      },
    ];
  },
};

export default nextConfig;
