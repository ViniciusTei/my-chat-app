import { ChatMessage, ChatSession } from "@/types";

export default class IndexedDB {
  private name: string
  private version: number

  constructor(name: string, version: number) {
    this.name = name
    this.version = version
  }

  async init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.name, this.version);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;

        // Tabela de conversas
        if (!db.objectStoreNames.contains("chat-sessions")) {
          db.createObjectStore("chat-sessions", { keyPath: "id", autoIncrement: true });
        }

        // Tabela de mensagens
        if (!db.objectStoreNames.contains("messages")) {
          const messagesStore = db.createObjectStore("messages", { keyPath: "id", autoIncrement: true });
          messagesStore.createIndex("session_id", "session_id", { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async createConversation(db: IDBDatabase, title = "Nova Conversa"): Promise<Omit<ChatSession, 'messages'>> {
    const tx = db.transaction("chat-sessions", "readwrite");
    const store = tx.objectStore("chat-sessions");

    return new Promise((resolve, reject) => {
      const chatSession = { title, createdAt: Date.now(), lastUpdated: Date.now() };
      const request = store.add(chatSession);
      request.onsuccess = () => resolve({ ...chatSession, id: request.result as number });
      request.onerror = () => reject(request.error);
    });
  }

  async saveMessage(db: IDBDatabase, chat_session_id: number, role: string, content: string): Promise<ChatMessage> {
    const tx = db.transaction("messages", "readwrite");
    const store = tx.objectStore("messages");

    return new Promise((resolve, reject) => {
      const message = { chat_session_id, role, content, timestamp: Date.now() }
      const request = store.add(message);
      request.onsuccess = () => resolve({ ...message, id: request.result as number } as ChatMessage);
      request.onerror = () => reject(request.error);
    });
  }

  async getMessages(db: IDBDatabase, chat_session_id: string) {
    const tx = db.transaction("messages", "readonly");
    const store = tx.objectStore("messages");
    const index = store.index("session_id");

    return new Promise((resolve, reject) => {
      const request = index.getAll(chat_session_id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getChatSessions(db: IDBDatabase): Promise<ChatSession[]> {
    const tx = db.transaction("chat-sessions", "readonly");
    const store = tx.objectStore("chat-sessions");

    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}
