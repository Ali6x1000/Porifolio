const embedderFiles = [
  './models/**/*',
  './node_modules/onnxruntime-node/package.json',
  './node_modules/onnxruntime-node/dist/**/*',
  './node_modules/onnxruntime-node/bin/napi-v*/linux/x64/**/*',
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    unoptimized: true
  },
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  experimental: {
    serverComponentsExternalPackages: ['@huggingface/transformers', 'onnxruntime-node', 'sharp'],
    // Transformers.js loads onnxruntime-node via createRequire, which file tracing can't follow.
    outputFileTracingIncludes: {
      '/api/chat': embedderFiles,
      '/api/alijr/tools': embedderFiles,
    },
    // Vercel functions run on linux x64; the other prebuilt ONNX binaries would blow the 250 MB limit.
    outputFileTracingExcludes: {
      '*': [
        'node_modules/onnxruntime-node/bin/napi-v*/darwin/**',
        'node_modules/onnxruntime-node/bin/napi-v*/win32/**',
        'node_modules/onnxruntime-node/bin/napi-v*/linux/arm64/**',
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
