const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://homefood-backend-cmnf.onrender.com',
      changeOrigin: true,
    })
  );
};