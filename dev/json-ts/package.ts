// TypeScript representation of package.json for developer reference
const pkg = {
  name: "pelada-final",
  private: true,
  version: "0.0.0",
  type: "module",
  scripts: {
    dev: "vite",
    "dev:server": "nodemon server/index.js --watch server",
    "dev:full": "concurrently \"npm run dev\" \"npm run dev:server\"",
    build: "vite build",
    lint: "eslint .",
    preview: "vite preview",
    "start:server": "node server/index.js"
  },
  dependencies: {
    react: "^19.2.0",
    "react-dom": "^19.2.0",
    express: "^4.18.2",
    "better-sqlite3": "^8.4.0",
    cors: "^2.8.5",
    "body-parser": "^1.20.2"
  },
  devDependencies: {
    nodemon: "^2.0.22",
    concurrently: "^8.2.0",
    "@eslint/js": "^9.39.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    eslint: "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    globals: "^16.5.0",
    vite: "npm:rolldown-vite@7.2.5"
  },
  overrides: {
    vite: "npm:rolldown-vite@7.2.5"
  }
}

export default pkg
