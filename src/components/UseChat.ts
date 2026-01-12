import { useState, useEffect, useCallback } from 'react';
import { chatService } from './ChatService';
import { useAuth } from './Auth/AuthContex';
import { getConversations, type ConversationWithUser } from '../api/api';

type MessageStore = Record<string, TextMessage[]>;

export type TextMessage = {
  content: string;
  outgoing: boolean
}


export const useChat = (url: string) => {
  const { token, user } = useAuth()
  const [connected, setConnected] = useState(false);
  const [myName, setMyName] = useState("");
  const [conversations, setConversations] = useState<ConversationWithUser[]>([]);
  const [messages, setMessages] = useState<MessageStore>({});

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
    const loadConversations = async () => {
      if (!token) return;
      const resp = await getConversations({token: token})
      setConversations(resp.data)
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
        // we ain't gonna need this either
        case "CHAT":
          addMessageToStore(data.message.from, {
            outgoing: false,
            content: data.message.content
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
      }
    });
    
    
    return () => {
      chatService.disconnect();
    };
  }, [url]);

  const sendMessage = useCallback((to: string, from: string, content: string) => {
    chatService.send("CHAT", { to, from, content });
    addOutGoingMessage(to , {
      outgoing: true,
      content: content
    })
  }, []);

  return { 
    connected, 
    myName, 
    conversations,
    getMessages,
    sendMessage,
    setMessages,
    addOutGoingMessage
    };
};