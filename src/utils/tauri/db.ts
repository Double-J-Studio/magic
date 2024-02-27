import Database from "tauri-plugin-sql-api";

const database = await Database.load("sqlite::magic.db");

export const db = {
  conversation: {
    insert: insertConversation,
    list: getConversations,
    byId: getConversationById,

    message: {
      insert: insertMessage,
      list: getMessages,
    },
  },
};

interface Conversation {
  id: number;
  name: string;
  created_at: string; // YYYY-MM-DD HH:mm:ss
  updated_at?: string; // YYYY-MM-DD HH:mm:ss
}

async function insertConversation(name: string) {
  await database.execute("INSERT INTO conversations (name) VALUES ($1)", [
    name,
  ]);
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
  model: string;
  role: string;
  content: string;
  imageUrls?: string; // ,로 구분됨 예) /Users/jj/Library/Application Support/app.doublejstudio.magic/images/img-2024-02-25_15-04-37.png,/Users/jj/Library/Application Support/app.doublejstudio.magic/images/img-2024-02-25_15-04-38.png
  createdAt: string;
}

type MessageInput = Omit<Message, "id" | "createdAt">;

async function insertMessage({
  conversationId,
  model,
  role,
  content,
  imageUrls = "",
}: MessageInput) {
  await database.execute(
    "INSERT INTO messages (conversationId, model, role, content, imageUrls) VALUES ($1, $2, $3, $4, $5)",
    [conversationId, model, role, content, imageUrls]
  );
}
