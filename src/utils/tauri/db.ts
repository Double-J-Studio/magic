import Database from "tauri-plugin-sql-api";

const database = await Database.load("sqlite:magic.db");

export const db = {
  conversation: {
    insert: insertConversation,
    delete: deleteConversation,
    list: getConversations,
    byId: getConversationById,

    message: {
      insert: insertMessage,
      list: getMessages,
    },
  },

  image: {
    insert: insertImage,
    list: getImages,
  },
};

interface Conversation {
  id: number;
  name: string;
  created_at: string; // YYYY-MM-DD HH:mm:ss
  updated_at?: string; // YYYY-MM-DD HH:mm:ss
}

async function insertConversation(name: string) {
  return await database.execute(
    "INSERT INTO conversations (name) VALUES ($1)",
    [name]
  );
}

async function deleteConversation(id: Conversation["id"]) {
  await database.execute("DELETE FROM messages where conversationId = $1", [
    id,
  ]);
  await database.execute("DELETE FROM conversations WHERE id = $1", [id]);
}

export async function getConversations(): Promise<Conversation[]> {
  return await database.select(
    "SELECT * FROM conversations ORDER BY createdAt ASC"
  );
}

async function getConversationById(id: number) {
  const result = await database.select(
    "SELECT * FROM conversations WHERE id = $1",
    [id]
  );
  if (Array.isArray(result) && result.length < 1) {
    return null;
  }

  return (result as Conversation[])[0];
}

async function getMessages(conversationId: number): Promise<Message[]> {
  return await database.select(
    "SELECT * FROM messages WHERE conversationId = $1 ORDER BY createdAt ASC",
    [conversationId]
  );
}

interface Message {
  id: number;
  conversationId: number;
  model?: string;
  role: string;
  content: string;
  imageUrl1?: string;
  createdAt: string;
}

type MessageInput = Omit<Message, "id" | "createdAt">;

async function insertMessage({
  conversationId,
  model = "",
  role,
  content,
  imageUrl1 = "",
}: MessageInput) {
  if (role === "assistant" && !model) {
    throw new Error("model is required");
  }

  return await database.execute(
    "INSERT INTO messages (conversationId, model, role, content, imageUrl1) VALUES ($1, $2, $3, $4, $5)",
    [conversationId, model, role, content, imageUrl1]
  );
}

export async function insertImage({
  url,
  messageId,
}: {
  url: string;
  messageId?: number;
}) {
  if (messageId) {
    return await database.execute(
      "INSERT INTO images (url, messageId) VALUES($1, $2)",
      [url, messageId]
    );
  }

  return await database.execute("INSERT INTO images (url) VALUES($1)", [url]);
}

export interface Image {
  id: number;
  messageId?: number;
  url: string;
  createdAt: string;
}

export async function getImages(): Promise<Image[]> {
  return await database.select("SELECT * FROM images ORDER BY createdAt ASC");
}
