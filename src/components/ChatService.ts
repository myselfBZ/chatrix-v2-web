export type MessageTypes = { type: "SET_NAME"; message: { name: string; clients: string[] } }
  | { type: "CHAT"; message : { 
      from: string; 
      content: string, 
      to: string;
      id: string;
      created_at: string;
  } }
  | { type: "ONLINE_PRESENCE", message : {user_id : string} }
  | { type: "OFFLINE_STATUS", message : {user_id : string; last_seen: string;} }
  | {type: "WELCOME", message: {}}
  | { type: "ERR", message: { reason: string; code: number; } }
  | { type: "ACK_MSG_DELIVERED", message : {
      reciever_id: string;
      temp_id: string;
      created_at: string;
      id: string;
  } }
  | { type: "MSG_READ", message: { conversation_id: string, message_ids: string[] } }


export type MessageCallback = (data: MessageTypes) => void;

class ChatService {
  private reconnectAttempts = 0;
  private maxReconnectDelay = 30000; // Max 30 seconds
  private ws: WebSocket | null = null;
  private onMessageCallback: MessageCallback | null = null;

  connect(url: string, onOpen: () => void, onClose: () => void) {
    this.ws = new WebSocket(url);
    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      onOpen()
    };
    this.ws.onclose = (event: CloseEvent) => { 
      onClose()
      if(!event.wasClean) {
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), this.maxReconnectDelay);
        
        console.warn(`Abrupt close. Retrying in ${delay}ms... (Attempt ${this.reconnectAttempts + 1})`);
  
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect(url, onOpen, onClose);
        }, delay);
      }
      
    };
    
    this.ws.onmessage = (event) => {
      if (this.onMessageCallback) {
        const data: MessageTypes = JSON.parse(event.data);
        this.onMessageCallback(data);
      }
    };
  }

  onMessage(callback: MessageCallback) {
    this.onMessageCallback = callback;
  }

  send(type: string, payload: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, message: payload })); 
    }
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
  }
}

export const chatService = new ChatService();