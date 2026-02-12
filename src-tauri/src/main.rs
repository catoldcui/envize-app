// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;

fn main() {
    // Set up PATH to include common locations where envize might be installed
    setup_envize_path();
    envizeapp_lib::run()
}

fn setup_envize_path() {
    // Get current PATH
    let current_path = env::var("PATH").unwrap_or_default();
    
    // Common paths where envize might be installed
    let envize_paths = [
        "/opt/homebrew/bin",           // Homebrew on Apple Silicon
        "/usr/local/bin",              // Homebrew on Intel Mac / Linux
        "/home/linuxbrew/.linuxbrew/bin", // Linuxbrew
        "/usr/bin",                    // Standard Linux
    ];
    
    // Build new PATH with envize paths prepended
    let mut new_path = String::new();
    for path in &envize_paths {
        if !current_path.contains(path) {
            if !new_path.is_empty() {
                new_path.push(':');
            }
            new_path.push_str(path);
        }
    }
    
    // Append existing PATH
    if !new_path.is_empty() {
        new_path.push(':');
        new_path.push_str(&current_path);
        env::set_var("PATH", new_path);
    }
}
