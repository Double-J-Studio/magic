// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_sql::{Migration, MigrationKind};
use std::fs::{self, File};
use std::io::copy;
use reqwest;
use chrono::Utc;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn write_image(image_url: &str, app: tauri::AppHandle) -> String {
    let img_dir = format!("{}/images", app.path_resolver().app_local_data_dir().unwrap().to_string_lossy());
    if !fs::metadata(img_dir.clone()).is_ok() {
        match fs::create_dir(img_dir.clone()) {
            Ok(_) => println!("Directory {} created successfully", img_dir.clone()),
            Err(e) => eprintln!("Error creating directory {}", e)
        }
    }

    let timestamp = Utc::now();
    let timestamp_str = timestamp.format("%Y-%m-%d_%H-%M-%S").to_string();
    let filename = format!("{}/img-{}.png", img_dir, timestamp_str);
    let response = reqwest::blocking::get(image_url);
    match response {
        Ok(mut response) => {
            if response.status().is_success() {
                let mut file = File::create(filename.clone()).expect("Failed to create file");

                match copy(&mut response, &mut file) {
                    Ok(_) => println!("Image saved successfully"),
                    Err(e) => eprintln!("Error saving image: {}", e),
                }
            } else {
                eprintln!("Error: {}", response.status());
            }
        }
        Err(e) => eprintln!("Error fetching image: {}", e),
    }

    filename
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
        Migration {
            version: 3,
            description: "add imageUrls to messages table",
            sql: "ALTER TABLE messages
            ADD COLUMN imageUrls TEXT DEFAULT '';

            ",
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet,write_image])
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_sql::Builder::default().add_migrations("sqlite::magic.db", migrations).build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
