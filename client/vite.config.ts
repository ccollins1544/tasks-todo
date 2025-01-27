import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const CLIENT_PORT = Number(process.env.VITE_PORT || "3004");

  return defineConfig({
    plugins: [react()],
    server: {
      port: CLIENT_PORT,
    },
    define: {
      "process.env": {},
    },
  });
};
