# sharedcn

![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)

## 🚀 Introduction

**sharedcn** is a modern platform for sharing code snippets and reusable components. It enables developers to quickly save, share, and reuse small pieces of code or entire UI components with ease. Whether you want to collaborate with teammates or archive your own snippets, sharedcn makes code sharing fast and frictionless.

---

## ✨ Features

- Share code snippets and UI components instantly
- CLI for quick push/pull from your terminal
- Web dashboard for browsing and managing your components
- Public and private sharing
- Multi-file component support
- Dependency tracking
- Modern, aesthetic UI

---

## ⚡ Quick Start

### 1. Install dependencies

```bash
bun install
```

### 2. Run the app

```bash
bun run dev
```

### 3. Use the CLI

```bash
npx sharedcn add <alias>
# or
npx sharedcn push <file1> <file2> --name="my-component" [--description="..."]
```

---

## 🛠️ Usage

- **Add**: Download a component from the server and save it locally.
- **Push**: Upload your local files as a new component to the server.
- **Setup Auth**: Save your API token for authenticated actions.

---

## 🖥️ CLI & API Overview

- See [docs/cli](./app/src/app/docs/cli/page.tsx) for CLI usage
- See [docs/api](./app/src/app/docs/api/page.tsx) for API endpoints

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📄 License

This project is licensed under the [Apache 2.0 License](./LICENSE).
