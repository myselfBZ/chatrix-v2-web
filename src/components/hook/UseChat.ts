import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService } from '../ChatService';
import { useAuth } from '../Auth/AuthContex';
import { getConversations, type ConversationWithUser } from '../../api/api';

type MessageStore = Record<string, TextMessage[]>;

export type TextMessage = {
  content: string;
  outgoing: boolean;
  created_at:         string;
  id:                 string;
  is_read:            boolean;
  temp_id:            string;
  state?:             "pending" | "delivered" | "read"
}


export const useChat = (url: string) => {
  const { token, user } = useAuth()
  const [connected, setConnected] = useState(false);
  const [myName, setMyName] = useState("");
  const [conversations, setConversations] = useState<ConversationWithUser[]>([]);
  const conversationsRef = useRef<ConversationWithUser[]>([])
  const [messages, setMessages] = useState<MessageStore>({});
  const [conversationLoading, setConversationLoading] = useState<boolean>(true)

  const getMessages = (contact: string) => {
    const contactMessages = messages[contact]
    if (contactMessages) return contactMessages;
    return []
  }

  const addOutGoingMessage = (contactId: string, text: TextMessage) => {
      setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), text],
    }));
  }

  const addMessageToStore = (contactId: string, text: TextMessage) => {
  setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), text],
    }));
  };

  useEffect(() => {
    conversationsRef.current = conversations
  }, [conversations])

  useEffect(() => {
    const loadConversations = async () => {
      if (!token) return;
      // TODO catch the errors here
      const resp = await getConversations({token: token})
      setConversations(resp.data)
      setConversationLoading(false)
    }

    chatService.connect(
      url,
      () => { 
        chatService.send("AUTH", { token })
      },
      () => { 
        setConnected(false)
      }
    );


    chatService.onMessage((data) => {
      switch (data.type) {
        case "CHAT":
          addMessageToStore(data.message.from, {
            outgoing: false,
            content: data.message.content,
            created_at: data.message.created_at,
            id: data.message.id,
            // no uuids for incoming messages
            temp_id: "",
            // later okay?
            is_read: false,
          })
          break;
        case "ONLINE_PRESENCE":
          setConversations((prev) => {
            // Use .map to create a brand new array reference
            return prev.map((conv) => {
              if (conv.user_data.id === data.message.user_id) {
                return {
                  ...conv,
                  is_online: true, 
                  user_data: {
                    ...conv.user_data,
                  }
                };
              }
              return conv;
            });
          });
          break;
        case "OFFLINE_STATUS":
          setConversations((prev) => {
            // Use .map to create a brand new array reference
            return prev.map((conv) => {
              if (conv.user_data.id === data.message.user_id) {
                return {
                  ...conv,
                  is_online: false, 
                  user_data: {
                    ...conv.user_data,
                    last_seen: data.message.last_seen
                  }
                };
              }
              return conv;
            });
          });
          break;
        case "WELCOME":
          if(user) {
            setConnected(true) 
            setMyName(user.username)
            loadConversations()
          }
          break;
        case "ERR":
          if(data.message.code === 401) {
            chatService.disconnect()
            return
          }
          // TODO
          console.log("error", data.message.reason);
          break;
        case "ACK_MSG_DELIVERED":
          setMessages((prev) => {
            const msgs = prev[data.message.reciever_id] || []

            
            const updated = msgs.map((m) => {
              if(m.outgoing && m.temp_id && m.temp_id === data.message.temp_id) {
                m.state = "delivered"
                return {
                  ...m,
                  created_at: data.message.created_at,
                  id: data.message.id
                }
              }
              return m
            })

            
            return {
              ...prev,
              [data.message.reciever_id]: updated
            }
          })
          break;
        case "MSG_READ":
          setMessages((prev) => {
    // Look at the REF, not the state variable
    const currentConvos = conversationsRef.current;
    
    const partner = currentConvos.find(
      c => c.user_data.conversation_id === data.message.conversation_id
    );
    
    const partnerId = partner?.user_data.id;

    if (!partnerId) {
      console.error("Could not find partner for convo:", data.message.conversation_id);
      return prev;
    }

    // Now update your messages state as usual...
    const idSet = new Set(data.message.message_ids);
    return {
      ...prev,
      [partnerId]: (prev[partnerId] || []).map(m => 
        idSet.has(m.id) ? { ...m, is_read: true, state: "read" } : m
      )
    };
  });
  break;
      }
    });
    
    
    return () => {
      chatService.disconnect();
    };
  }, [url]);

  const sendMessage = useCallback((to: string, from: string, content: string) => {
    const temp_id = crypto.randomUUID()
    
    chatService.send("CHAT", { 
      to, 
      from, 
      content,
      temp_id
    });
    addOutGoingMessage(to , {
      outgoing: true,
      content: content,
      temp_id: temp_id,
      // server's part
      id: "",
      is_read: false,
      created_at: "",
      state: "pending"
    })
  }, []);

  const sendMarkReadEvent = (conversation_id: string, msg_owner_id : string) => {
    chatService.send("MARK_READ", {
        conversation_id,
        msg_owner_id,
    })
  }

  return { 
    connected, 
    myName, 
    conversations,
    getMessages,
    sendMessage,
    setMessages,
    addOutGoingMessage,
    sendMarkReadEvent,
    conversationLoading
    };
};