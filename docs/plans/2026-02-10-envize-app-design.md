# envizeApp Design

A lightweight Tauri + React + Tailwind desktop app providing a GUI for the [envize](https://www.npmjs.com/package/envize) CLI. macOS is the primary target; Tauri enables future cross-platform support.

## Scope

- Global profiles only (`~/.envize/`) for the initial version.
- All interactions go through the `envize` CLI (shelling out via Tauri's `Command` API), except reading/writing profile file content for the editor.

## UX: Single-Screen Layout

**Left sidebar:**
- List of all global profiles, each with a toggle to activate/deactivate.
- Clicking a profile selects it for viewing/editing in the main panel.
- `+` button at bottom: popover to create an empty profile or choose from a template (`envize templates`).
- `-` button at bottom: deletes the selected profile with confirmation (`envize rm <name>`).

**Main panel:**
- Selected profile's name, description, and tags at the top.
- Editable key-value rows for environment variables, with inline add/delete.

**Bottom bar:**
- Collapsed "Active Environment" strip showing resolved variables with source attribution, expandable.

## CLI Command Mapping

| Action | Command |
|--------|---------|
| List profiles | `envize ls --json --global` |
| List templates | `envize templates --json` |
| Create empty profile | `envize create <name> --global` |
| Create from template | `envize init --template <name> --global` |
| Delete profile | `envize rm <name>` |
| Read profile content | Read `~/.envize/profiles/<name>` via Tauri fs |
| Save profile edits | Write `~/.envize/profiles/<name>` via Tauri fs |
| Activate/deactivate | `envize use <active profiles...> --global` |
| Get active status | `envize status --json` |
| Get resolved env with sources | `envize explain --json` |

State refreshes on app focus and after any mutating action.

## Project Structure

```
envizeApp/
├── src-tauri/
│   ├── src/
│   │   └── main.rs             # Tauri commands (shell out to envize CLI)
│   ├── Cargo.toml
│   └── tauri.conf.json
├── src/
│   ├── App.tsx                 # Single-screen layout
│   ├── components/
│   │   ├── Sidebar.tsx         # Profile list + toggles + add/remove buttons
│   │   ├── ProfileEditor.tsx   # Key-value editor for selected profile
│   │   └── StatusBar.tsx       # Collapsed active environment bar
│   ├── hooks/
│   │   └── useEnvize.ts        # Hook wrapping Tauri invoke calls to envize CLI
│   ├── lib/
│   │   └── parser.ts           # Parse/serialize dotenv format with metadata headers
│   ├── main.tsx
│   └── index.css               # Tailwind setup
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Tech Stack

- **Shell**: Tauri v2 (Rust backend)
- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Build**: Vite
- **Testing**: Vitest + React Testing Library (tests as `*.test.ts(x)` alongside source)

## Profile File Format

Dotenv format with optional metadata headers, parsed/serialized by `parser.ts`:

```bash
# @description My API keys for development
# @tags dev, api

API_KEY=sk-abc123
API_URL=https://api.example.com
```
