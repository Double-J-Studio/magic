// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_sql::{Migration, MigrationKind};
use reqwest;
use base64::{Engine as _, engine::general_purpose};
use std::process::Command;
use std::str;
use serde::Serialize;


#[tauri::command]
fn toggle_window(window: tauri::Window) {
  if window.is_focused().expect("error while getting window state") {
    window.hide().expect("error while hiding window");
  } else {
    window.show().expect("error while showing window");
    window.set_focus().expect("error while focus window");
  }

}

#[tauri::command]
fn write_image(image_url: &str) -> String {
    let mut base64_image:String = String::from("");
    let response = reqwest::blocking::get(image_url);
    match response {
        Ok(response) => {
            if response.status().is_success() {
                let image_data = response.bytes().expect("Failed to read image data");
                base64_image = general_purpose::STANDARD.encode(&image_data);
                base64_image = format!("data:image/jpeg;base64,{}", base64_image);
            } else {
                eprintln!("Error: {}", response.status());
            }
        }
        Err(e) => eprintln!("Error fetching image: {}", e),
    }

    base64_image
}

#[tauri::command]
fn get_ollama_version() -> String {
    let output = match Command::new("ollama")
    .arg("-v").output() {
        Ok(output) => output,
        Err(error) => {
            println!("command failed error {}", error);
            return String::from("")
        },
    };

    if output.status.success() {
        return str::from_utf8(&output.stdout).expect("command output to string convert failed").trim().to_string()
    } else {
        println!("command status failed {}", String::from_utf8_lossy(&output.stderr));
        return String::from("")
    }
}

#[derive(Serialize)]
struct Model {
    id:String,
    name:String,
    size:String,
    modified:String,
}

#[tauri::command]
fn get_ollama_models() -> Vec<Model> {
    let mut models: Vec<Model> = Vec::new();

    let output = match Command::new("ollama").arg("list").output() {
        Ok(output) => output,
        Err(error) => {
            println!("command failed error {}", error);
            return models
        },
    };
    
    if output.status.success() {
        let models_text = str::from_utf8(&output.stdout).expect("command output to string convert failed").trim().to_string();
        for line in models_text.lines().skip(1) {
            let fields: Vec<&str> = line.split("\t").collect();
            
            let name = fields[0].trim().to_string();
            let id = fields[1].trim().to_string();
            let size = fields[2].trim().to_string();
            let modified = fields[3..].join(" ");

            let model = Model {
                id,
                name,
                size,
                modified
            };
            models.push(model);
        }
        return models
    } else {
        return models
    }
}

// #[tokio::main]
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
        Migration {
            version: 4,
            description: "add imageUrl1 to messages table",
            sql: "ALTER TABLE messages
            ADD COLUMN imageUrl1 TEXT DEFAULT '';

            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "delete imageUrls in messages table",
            sql: "
            CREATE TABLE messages_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversationId INTEGER NOT NULL,
                model TEXT DEFAULT '',
                role TEXT  DEFAULT '',
                content TEXT NOT NULL,
                imageUrl1 TEXT DEFAULT '',
                createdAt NUMERIC DEFAULT CURRENT_TIMESTAMP
            );
            
            INSERT INTO messages_new (conversationId, model, role, content, imageUrl1, createdAt)
                SELECT conversationId, model, role, content, imageUrl1, createdAt FROM messages;
            
            DROP TABLE messages;
            
            ALTER TABLE messages_new RENAME TO messages;

            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 6,
            description: "create images table",
            sql: "
            CREATE TABLE images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                messageId INTEGER,
                url TEXT DEFAULT '',
                createdAt NUMERIC DEFAULT CURRENT_TIMESTAMP
            );

            ",
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![write_image,toggle_window,get_ollama_version,get_ollama_models])
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_sql::Builder::default().add_migrations("sqlite:magic.db", migrations).build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
