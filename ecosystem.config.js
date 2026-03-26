module.exports = {
  apps: [
    {
      name: "analytics-api",
      script: "dist/main.js",
      cwd: "/home/pi/analytics/API",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "256M",
      env: {
        NODE_ENV: "production",
        PORT: 4200,
      },
    },
    {
      name: "analytics-front",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      cwd: "/home/pi/analytics/frontend",
      autorestart: true,
      watch: false,
      max_memory_restart: "256M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
