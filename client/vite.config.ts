import { defineConfig } from "vite";
import { config } from "dotenv";
import react from "@vitejs/plugin-react";

// Load environment variables from .env file
config();

const CLIENT_PORT = Number(process.env.VITE_PORT || "3004");
const ALLOWED_HOSTS = process.env.VITE_ALLOWED_HOSTS
  ? process.env.VITE_ALLOWED_HOSTS.split(",")
  : [];

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: CLIENT_PORT,
    allowedHosts: ALLOWED_HOSTS,
  },
  define: {
    "process.env": process.env,
  },
});
