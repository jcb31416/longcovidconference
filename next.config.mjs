// next.config.mjs      ←  ES-module version

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  // optional: keep cache in memory during dev
  webpack: (config) => {
    config.cache = { type: 'memory' };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dae2shtd2oqpdng5.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

// const nextConfig = {
//   async redirects() {
//     return [
//       {
//         source: "/:path*",
//         destination: "https://regeneratics.com/edu/conf_lcdd_mar2026",
//         permanent: false, // true = 308, false = 307
//       },
//     ];
//   },
// };


export default nextConfig;
