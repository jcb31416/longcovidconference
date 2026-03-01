// next.config.mjs      ←  ES-module version

const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        destination: "https://regeneratics.com/edu/conf_lcdd_mar2026",
        permanent: false, // true = 308, false = 307
      },
    ];
  },
};


export default nextConfig;
