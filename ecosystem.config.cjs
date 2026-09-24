// PM2 process file. Build first (`pnpm build`), then:
//   pm2 start ecosystem.config.cjs
//   pm2 save && pm2 startup   # persist across reboots
//
// Deploy flow on the server:
//   git pull
//   pnpm install --frozen-lockfile
//   pnpm build
//   pm2 reload ecosystem.config.cjs --update-env

module.exports = {
  apps: [
    {
      name: "website",
      cwd: __dirname,

      // Runs the production server built by `next build`.
      // Using the resolved binary (not `pnpm start`) avoids spawning an
      // extra pnpm process on top of the Node one PM2 already manages.
      script: "node_modules/next/dist/bin/next",
      args: "start --port 3000",
      interpreter: "node",

      // Next's server is stateless per request, so cluster mode is safe;
      // start at 1 and raise once you've confirmed the single instance
      // behaves as expected under load.
      instances: 1,
      exec_mode: "fork",

      autorestart: true,
      max_restarts: 10,
      min_uptime: "20s",
      max_memory_restart: "400M",

      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },

      out_file: "logs/out.log",
      error_file: "logs/error.log",
      merge_logs: true,
      time: true,
    },
  ],
};
