import { useEffect, useState } from "react";
import { useChat, type TextMessage } from "./hook/UseChat";
import { ChatHeader } from "./Header.Chatrix";
import { Sidebar } from "./SideBar.Chatrix";
import { MessagesArea } from "./MessageArea.Chatrix";
import { InputArea } from "./InputArea.Chatrix";
import { useAuth } from "./Auth/AuthContex";
import { type ConversationWithUser, createConversation, getMessageHistory } from "../api/api";


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
  const [textingToId, setTextingToId] = useState<string | null>(null);
  const [selectedSearchUser, setSelectedSearchUser] = useState<ConversationWithUser | null>(null)
  const [inputData, setInputData] = useState('');
  const [msgHistoryLoading, setMsgHistoryLoading] = useState<boolean>(true)
  const textingTo = conversations.find((conv) => conv.user_data.id === textingToId) || null


useEffect(() => {
  // If it's a search user (not in conversations yet), no history to fetch
  if(selectedSearchUser && !textingTo) {  
    setMsgHistoryLoading(false);
    setMessages(prev => ({ ...prev, [selectedSearchUser.user_data.id]: [] }));
    return;
  }

  if(!textingToId || !textingTo || !token || !user) return;
  
  setMsgHistoryLoading(true);
  
  const fetchChatHistory = async () => {
    try {
      const resp = await getMessageHistory({
        token: token,
        with_id: textingTo.user_data.id
      });
      const history : TextMessage[] = resp.data?.map((msg) => {
        return {
          outgoing: msg.sender_id == user.id,
          content: msg.content,
          created_at: msg.created_at,
          id: msg.id,
          is_read: msg.is_read,
          state: msg.is_read ? ("read") : ("delivered"),
          temp_id: "",
        }
      });

      setMessages(prev => ({
        ...prev, [textingTo.user_data.id]: history
      }));
    } catch(e: any) {        
      const status = e.response?.status;

      if (status === 404) {
        console.log("New conversation! Setting empty array.");          
        setMessages(prev => ({ ...prev, [textingTo.user_data.id]: [] }));
      } else {
        console.log("Server error or timeout.");
      }
    } finally {
      setMsgHistoryLoading(false);
    }
  };

  fetchChatHistory();

}, [textingToId, selectedSearchUser, textingTo, token, user?.id]);

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
  }, [textingToId, getMessages(textingToId ? (textingToId) : ("")).length, connected]); 
  

  const handleSend = async () => {
    if (inputData.trim() && ( textingTo || selectedSearchUser ) && user && token) {
      
      console.log("Hello");
      
      
      if(!textingTo && selectedSearchUser) {
        const resp = await createConversation({
          token: token,
          user1: user.id,
          user2: selectedSearchUser.user_data.id
        })
        setConversations(prev => [...prev, {
          user_data: {...selectedSearchUser.user_data, conversation_id: resp.data.id},
          is_online: selectedSearchUser.is_online
        }])
        setSelectedSearchUser(null)
        setTextingToId(selectedSearchUser.user_data.id)
        sendMessage(selectedSearchUser.user_data.id, user.id, inputData);
        setInputData('');
        return
      }

      if(textingTo) {
        sendMessage(textingTo.user_data.id, user.id, inputData)
        setInputData('')
      }
    }
  };

  const handleEscape = (event: React.KeyboardEvent) => {
    if (event.key == 'Escape' && textingToId) {
      setTextingToId(null)
    }
  }

  return (
    <div 
    onKeyDown={handleEscape}
    className="fixed inset-0  bg-gray-900 text-gray-100 flex flex-col">
      <ChatHeader connected={connected} myName={myName} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          onSelectSearchUser={setSelectedSearchUser}
          conversationLoading={conversationLoading}
          conversations={conversations} 
          selectedUser={textingTo}
          onSelectUser={setTextingToId}
        />
        {
          (textingTo || selectedSearchUser) ? (
          <div className="flex-1 flex flex-col">
            <MessagesArea 
              loadingHistory={msgHistoryLoading}
              messages={getMessages( 
                (textingTo) ? ( textingTo.user_data.id) : ( selectedSearchUser ? (selectedSearchUser.user_data.id) : ("") ) 
              )} 
              selectedUser={textingTo || selectedSearchUser}
            />
            <InputArea 
              inputData={inputData}
              setInputData={setInputData}
              onSend={handleSend}
              disabled={!connected || (!textingTo && !selectedSearchUser)}
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
