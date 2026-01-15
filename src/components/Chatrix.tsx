import { useEffect, useState } from "react";
import { useChat, type TextMessage } from "./hook/UseChat";
import { ChatHeader } from "./Header.Chatrix";
import { Sidebar } from "./SideBar.Chatrix";
import { MessagesArea } from "./MessageArea.Chatrix";
import { InputArea } from "./InputArea.Chatrix";
import { useAuth } from "./Auth/AuthContex";
import { createConversation, getMessageHistory, type ConversationWithUser } from "../api/api";


export const Chatrix = () => {
  const { 
    connected, 
    myName, 
    conversations, 
    getMessages, 
    sendMessage, 
    setMessages,
    sendMarkReadEvent,
    conversationLoading,
    setConversations
  } = useChat(`${import.meta.env.VITE_BACKEND_URL}/ws`);
  const {user, token} = useAuth();
  const [textingTo, setTextingTo] = useState<ConversationWithUser | null>(null);
  const [inputData, setInputData] = useState('');
  const [msgHistoryLoading, setMsgHistoryLoading] = useState<boolean>(true)
  const textingToId = textingTo?.user_data.id
  useEffect(() => {
    if(!textingTo || !token || !user) return;
    setMsgHistoryLoading(true)
    
    const fetchChatHistory = async () => {
      try {
        const resp = await getMessageHistory({
          token: token,
          with_id: textingTo.user_data.id
        })
        const history : TextMessage[] = resp.data?.map((msg) => {
          return {
            outgoing: msg.sender_id == user.id,
            content: msg.content,
            created_at: msg.created_at,
            id: msg.id,
            is_read: msg.is_read,
            state: msg.is_read ? ( "read") : ("delivered"),
            temp_id: "",
          }
        })
  
        setMessages(prev => ({
          ...prev, [textingTo.user_data.id]: history
        }))
      } catch(e: any) {        
        // 1. Check if it's a 404 (No history yet)
        // If you use Axios, it's e.response. If you use native Fetch, it might be different.
        const status = e.response?.status;

        if (status === 404) {
          console.log("New conversation! Setting empty array.");          
          setMessages(prev => ({ ...prev, [textingTo.user_data.id]: [] }));
        } else {
          // 2. It's a real error (500, Network Down, etc.)
          // Maybe show a toast or a small error message in the chat area
          console.log("Server error or timeout.");
        }
      } finally {
        setMsgHistoryLoading(false)
      }
    }

    fetchChatHistory()

  }, [textingTo])

  useEffect(() => {
    // 1. Only run if we have an active chat and are connected
    if (!textingTo || !textingToId || !connected) return;

    const currentMessages = getMessages(textingToId);
    
    // 2. Check if there are any UNREAD messages that were SENT BY THE OTHER PERSON
    const hasUnread = currentMessages.some(m => !m.is_read && !m.outgoing);

    if (hasUnread) {
      // 3. Tell the Server
      sendMarkReadEvent(textingTo.user_data.conversation_id, textingToId);

      // 4. Optimistically update local UI so the "Unread" UI goes away instantly
      setMessages(prev => ({
        ...prev,
        [textingToId]: prev[textingToId].map(m => 
          !m.outgoing ? { ...m, is_read: true } : m
        )
      }));
    }
  }, [textingTo, getMessages(textingToId ? (textingToId) : ("")).length, connected]); 
  

  useEffect(() => {
    if (!textingTo) return;

    const updated = conversations.find(
      c => c.user_data.id === textingTo.user_data.id
    );

    if (updated && updated !== textingTo) {
      setTextingTo(updated);
    }
  } , [conversations]);

  const handleSend = async () => {
    if (inputData.trim() && textingTo && user && textingToId && token) {
      if(!textingTo.user_data.conversation_id) {
        const resp = await createConversation({
          token: token,
          user1: user.id,
          user2: textingToId
        })
        setConversations(prev => [...prev, {
          user_data: {...textingTo.user_data, conversation_id: resp.data.id},
          is_online: textingTo.is_online
        }])
      }
      sendMessage(textingToId, user.id, inputData);
      setInputData('');
    }
  };

  const handleEscape = (event: React.KeyboardEvent) => {
    if (event.key == 'Escape' && textingTo) {
      setTextingTo(null)
    }
  }

  return (
    <div 
    onKeyDown={handleEscape}
    className="fixed inset-0  bg-gray-900 text-gray-100 flex flex-col">
      <ChatHeader connected={connected} myName={myName} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          conversationLoading={conversationLoading}
          conversations={conversations} 
          selectedUser={textingTo}
          onSelectUser={setTextingTo}
        />
        {
          textingTo ? (
          <div className="flex-1 flex flex-col">
            <MessagesArea 
              loadingHistory={msgHistoryLoading}
              messages={getMessages( (textingToId) ? ( textingTo.user_data.id) : ( "" ))} 
              selectedUser={textingTo}
            />
            <InputArea 
              inputData={inputData}
              setInputData={setInputData}
              onSend={handleSend}
              disabled={!connected || !textingTo}
            />
          </div>

          ) : (
            null
          )
        }
      </div>
    </div>
  );
};
