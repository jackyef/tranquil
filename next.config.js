const withOffline = require('next-offline');
const withPreact = require('next-plugin-preact');
const { flowRight } = require('./src/utils/flow.js');

const config = {
  target: 'serverless',

  /* regular next.js config options here */
  workboxOpts: {
    swDest: 'static/service-worker.js',

    runtimeCaching: [
      {
        urlPattern: /.(png|jpg|jpeg|webp|svg|wav|mp3)$/,
        handler: 'CacheFirst',
      },
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'offlineCache',
          expiration: {
            maxEntries: 200,
          },
        },
      },
    ],
  },
};

module.exports = flowRight(withOffline, withPreact)(config);
