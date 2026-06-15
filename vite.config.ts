import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    base: "./",
    build: {
        outDir: "build",
    },
    server: {
        port: 3000,
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/setupTests.ts",
        css: true,
        passWithNoTests: true,
        coverage: {
            provider: "istanbul",
            include: ["src/**/*.{ts,tsx}"],
            exclude: [
                "src/**/*.test.{ts,tsx}",
                "src/setupTests.ts",
                "src/vite-env.d.ts",
                "src/interface.ts",
                "src/index.tsx",
            ],
        },
    },
});
