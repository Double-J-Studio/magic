// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_sql::{Migration, MigrationKind};
use reqwest;
use base64::{Engine as _, engine::{general_purpose}};
use std::process::{Command};
use std::str;
use warp::{reply::with_header, Filter,sse::Event};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use reqwest::Client;
use warp::hyper::HeaderMap;
use std::convert::Infallible;
use futures_util::{StreamExt};
use warp::http::header::{HeaderValue,ACCESS_CONTROL_ALLOW_ORIGIN,ACCESS_CONTROL_ALLOW_METHODS,ACCESS_CONTROL_ALLOW_HEADERS};
use async_stream::stream;


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
        .setup(|app| {
            tauri::async_runtime::spawn(async move {
                let options_route = warp::options()
                    .map(|| {
                        warp::reply::with_status(
                    warp::reply::with_header(
                        warp::reply::with_header(
                            warp::reply::with_header(
                                "OK",
                                ACCESS_CONTROL_ALLOW_ORIGIN,
                                HeaderValue::from_static("*")
                                ),
                        ACCESS_CONTROL_ALLOW_METHODS,
                        HeaderValue::from_static("GET, POST, PUT, PATCH, DELETE, OPTIONS")
                                ),
                        ACCESS_CONTROL_ALLOW_HEADERS,
                        HeaderValue::from_static("*")
                            ),
                    warp::http::StatusCode::OK
                        )
                    }
                );
                    
                let proxy_post = warp::post()
                    .and(warp::query::<Url>())
                    .and(warp::body::json())
                    .and(warp::header::headers_cloned())
                    .and_then(stream_proxy_handler);

                let routes = options_route.or(proxy_post);
                
                warp::serve(routes).run(([127, 0, 0, 1], 17771)).await;
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(Deserialize, Serialize)]
struct MessageBody {
    role: String,
    content: String,
}

#[derive(Deserialize, Serialize)]
struct RequestBody {
    model: String,
    messages: Vec<MessageBody>,
    #[serde(skip_serializing_if = "Option::is_none")]
    max_tokens: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    stream: Option<bool>,
}

#[derive(Deserialize)]
struct Url {
    url: String,
}

async fn stream_proxy_handler(
    url: Url,
    body: Option<Value>,
    headers: HeaderMap,
) -> Result<impl warp::Reply, Infallible> {
    let client = Client::new();

    let mut request_builder = client.post(url.url).json(&body.unwrap_or_default());
    let reqwest_headers = convert_to_reqwest_headers(headers)?;
for (key, value) in reqwest_headers.iter() {
    if key == "content-length" || key == "host" || key == "accept-language" || key == "accept-encoding" {
        continue
    }

    request_builder = request_builder.header(key, value.clone());
}
    let response = request_builder.send().await.unwrap();
    let event_stream = stream! {
        let mut stream = response.bytes_stream();

        while let Some(chunk) = stream.next().await {
            match chunk {
                Ok(bytes) => {
                    let data = String::from_utf8_lossy(&bytes);
                    let data_str = data.to_string();
                    for line in data_str.lines() {
                        if line.starts_with("data") {
                            let d = line.replace("data:", "");

                            yield Ok::<_, Infallible>(Event::default().data(d));
                            
                        } else if line.starts_with("event") {
                            let e = line.replace("event:", "");
                            yield Ok::<_, Infallible>(Event::default().event(e));
                            
                        } else {
                            if line.trim() == "" {
                                continue
                            }

                            yield Ok::<_, Infallible>(Event::default().data(format!(" {}", line)));
                        }
                    }
                }
                Err(e) => {
                    eprintln!("Error while reading response chunk: {}", e);
                    break;
                }
            }
        }
    };

    let reply = warp::sse::reply(warp::sse::keep_alive().stream(event_stream));
    let response = with_header(reply, ACCESS_CONTROL_ALLOW_ORIGIN, "*");

    Ok(response)
}

fn convert_to_reqwest_headers(
    hyper_headers: HeaderMap,
) -> Result<reqwest::header::HeaderMap, Infallible> {
    let mut reqwest_headers = reqwest::header::HeaderMap::new();;

    for (key, value) in hyper_headers.iter() {
        let reqwest_key = reqwest::header::HeaderName::from_bytes(key.as_str().as_bytes())
            .unwrap();

        let reqwest_value = reqwest::header::HeaderValue::from_bytes(value.as_bytes())
            .unwrap();

        reqwest_headers.insert(reqwest_key, reqwest_value);
    }

    Ok(reqwest_headers)
}
