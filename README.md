# EnvizeApp

A desktop application for managing environment variable profiles. EnvizeApp provides an intuitive interface to create, edit, and switch between different environment configurations for your projects.

## 🚀 Features

- **Environment Profiles**: Create and manage multiple environment variable profiles
- **Profile Editor**: Intuitive editor for adding, removing, and modifying environment variables
- **Quick Switching**: Easily switch between different environment profiles
- **Cross-platform**: Runs natively on Windows, macOS, and Linux
- **Secure Storage**: Environment variables stored securely on your local machine
- **Status Monitoring**: Real-time status updates and notifications

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Desktop Framework**: Tauri 2.0
- **Runtime**: Rust
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library

## 📦 Install

> **Requires the `envize` CLI:** `npm install -g envize`

### macOS — Homebrew (recommended)

```bash
brew tap catoldcui/envize
brew install --cask envize-app
```

If macOS blocks the app on first launch, run:

```bash
xattr -cr /Applications/EnvizeApp.app
```

### Direct download

Download the latest binary from the [Releases page](https://github.com/catoldcui/envize-app/releases/latest).

| Platform | File |
|---|---|
| macOS (Apple Silicon) | `EnvizeApp_x.x.x_aarch64.dmg` |
| macOS (Intel) | `EnvizeApp_x.x.x_x64.dmg` |
| Windows | `EnvizeApp_x.x.x_x64-setup.exe` or `.msi` |
| Linux | `EnvizeApp_x.x.x_amd64.AppImage` or `.deb` / `.rpm` |

---

## 📋 Prerequisites (for development)

Before you begin, ensure you have met the following requirements:

- **Node.js** (v18 or higher)
- **Rust** (latest stable)
- **Cargo** (comes with Rust)
- **Git**

### Installing Prerequisites

#### Node.js
Download from [nodejs.org](https://nodejs.org/) or use a package manager:
```bash
# Using Homebrew (macOS)
brew install node

# Using Chocolatey (Windows)
choco install nodejs

# Using apt (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Rust
Install Rust using rustup:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/catoldcui/envize-app.git
cd envize-app
```

2. Install dependencies:
```bash
npm install
```

3. Install Tauri CLI (if not already installed):
```bash
cargo install tauri-cli
```

### Development

To run the application in development mode:

```bash
npm run tauri dev
```

This will start the development server and launch the application window.

### Building

To build the application for production:

```bash
npm run tauri build
```

This will create optimized binaries for your current platform in the `src-tauri/target/release` directory.

## 🧪 Testing

Run the test suite:

```bash
npm run test
```

Or run tests in watch mode:

```bash
npm run test:watch
```

## 🏗️ Project Structure

```
envize-app/
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   │   ├── ProfileEditor.tsx
│   │   ├── Sidebar.tsx
│   │   └── StatusBar.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── useEnvize.ts
│   ├── lib/                # Utility functions
│   ├── types.ts           # Type definitions
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── src-tauri/             # Tauri backend code
│   ├── src/               # Rust source files
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri configuration
├── public/                # Static assets
├── .github/               # GitHub Actions workflows
└── README.md
```

## 🔧 Configuration

The application uses the following configuration files:

- `tauri.conf.json`: Tauri application configuration
- `package.json`: Node.js dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `vite.config.ts`: Vite build configuration
- `tailwind.config.js`: Tailwind CSS configuration

## 📦 Building for Different Platforms

Thanks to Tauri, EnvizeApp can be built for multiple platforms:

### Windows
```bash
npm run tauri build
```

### macOS
```bash
npm run tauri build
```

### Linux
```bash
npm run tauri build
```

The GitHub Actions workflow (`.github/workflows/release.yml`) automates cross-platform builds when you create a version tag.

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 🧪 Running Tests

The project uses Vitest for testing:

```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test -- --coverage
```

## 🚀 Deployment

To deploy a new release:

1. Update the version in `package.json` and `src-tauri/Cargo.toml`
2. Commit your changes
3. Create a Git tag with the version (e.g., `v1.0.0`)
4. Push the tag to GitHub to trigger the release workflow

```bash
git tag v1.0.0
git push origin v1.0.0
```

The GitHub Actions workflow will automatically build the application for all platforms and create a draft release.

## 🐛 Troubleshooting

### Common Issues

**Problem**: Error during build related to Tauri
**Solution**: Ensure you have Rust and the required dependencies installed. Check the [Tauri Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites) for your platform.

**Problem**: Dependencies not installing correctly
**Solution**: Clear the cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Application won't start in development mode
**Solution**: Make sure you're running the command from the project root directory:
```bash
npm run tauri dev
```

**Problem**: macOS shows "EnvizeApp is damaged and can't be opened"
**Solution**: The app is not yet notarized. If you installed via Homebrew, ensure you used `--no-quarantine`. For a direct DMG install, run:
```bash
xattr -cr /Applications/EnvizeApp.app
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Tauri](https://tauri.app/)
- UI components with [React](https://react.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Phosphor Icons](https://phosphoricons.com/)