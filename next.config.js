const embedderFiles = [
  './models/**/*',
  './node_modules/onnxruntime-node/package.json',
  './node_modules/onnxruntime-node/dist/**/*',
  // CPU runtime only; on linux x64 the postinstall can also download ~300 MB of CUDA libraries.
  './node_modules/onnxruntime-node/bin/napi-v*/linux/x64/libonnxruntime.so.1',
  './node_modules/onnxruntime-node/bin/napi-v*/linux/x64/onnxruntime_binding.node',
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    unoptimized: true
  },
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [{ source: '/alijr/:path*', destination: '/twin', permanent: true }];
  },
  experimental: {
    serverComponentsExternalPackages: ['@huggingface/transformers', 'onnxruntime-node', 'sharp'],
    // Transformers.js loads onnxruntime-node via createRequire, which file tracing can't follow.
    outputFileTracingIncludes: {
      '/api/chat': embedderFiles,
      '/api/alijr/tools': embedderFiles,
      '/api/alijr/explore': embedderFiles,
    },
    // Vercel functions run on linux x64; the other prebuilt ONNX binaries would blow the 250 MB limit.
    outputFileTracingExcludes: {
      '*': [
        'node_modules/onnxruntime-node/bin/napi-v*/darwin/**',
        'node_modules/onnxruntime-node/bin/napi-v*/win32/**',
        'node_modules/onnxruntime-node/bin/napi-v*/linux/arm64/**',
        'node_modules/onnxruntime-node/bin/napi-v*/linux/x64/libonnxruntime_providers_*',
        'node_modules/onnxruntime-web/**',
        'node_modules/@img/**/darwin*/**',
      ],
    },
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
}

module.exports = nextConfig
