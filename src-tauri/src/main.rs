// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_sql::{Migration, MigrationKind};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create conversations table",
            sql: "CREATE TABLE conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                createdAt NUMERIC DEFAULT CURRENT_TIMESTAMP,
                updatedAt NUMERIC 
            );

            CREATE TRIGGER trigger_conversations_updated_at
            AFTER UPDATE ON conversations
            FOR EACH ROW
            BEGIN
                UPDATE conversations
                SET updatedAt = CURRENT_TIMESTAMP
                WHERE id = NEW.id;
            END;
            
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create messages table",
            sql: "CREATE TABLE messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversationId INTEGER NOT NULL,
                model TEXT DEFAULT '',
                role TEXT  DEFAULT '',
                content TEXT NOT NULL,
                createdAt NUMERIC DEFAULT CURRENT_TIMESTAMP
            );
            
            ",
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_sql::Builder::default().add_migrations("sqlite::magic.db", migrations).build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
