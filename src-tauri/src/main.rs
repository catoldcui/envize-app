// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // Fix PATH on macOS/Linux so we can find binaries installed via nvm, homebrew, etc.
    // GUI apps don't inherit the user's shell PATH, so this runs a login shell to get it.
    let _ = fix_path_env::fix();
    envizeapp_lib::run()
}
