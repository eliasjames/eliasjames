/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDocumentPreloading: true,
    scrollRestoration: true,
  },

  // turn these off in the future
  productionBrowserSourceMaps: true,
  reactProductionProfiling: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "0hxeiwauvd9bvaog.public.blob.vercel-storage.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
