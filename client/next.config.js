module.expores = {
  webpackDevMiddleware: (config) => {
    // Pull all changes every 300 seconds, to avoid hot reload issues.
    config.watchOptions.pull = 300;
    return config;
  },
};
