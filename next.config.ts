import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/apply",
        destination: "https://airtable.com/appaxqJfxht7OronH/pag3FYwDukcF9syiu/form",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
