import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const CLIENT_PORT = Number(process.env.VITE_PORT || "3004");
  const ALLOWED_HOSTS = process.env.VITE_ALLOWED_HOSTS
    ? process.env.VITE_ALLOWED_HOSTS.split(",")
    : [];

  return defineConfig({
    plugins: [react()],
    server: {
      port: CLIENT_PORT,
      allowedHosts: ALLOWED_HOSTS,
    },
    define: {
      "process.env": {},
    },
  });
};
