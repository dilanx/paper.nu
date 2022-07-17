module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /\.js$/,
            enforce: 'pre',
            use: [
              {
                loader: 'source-map-loader',
                options: {
                  filterSourceMappingUrl: (_, resourcePath) => {
                    return !/\/html-to-image\/.*\.js$/.test(resourcePath);
                  },
                },
              },
            ],
          },
        ],
      },
    },
  },
};
