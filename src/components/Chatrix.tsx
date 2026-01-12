import { useEffect, useState } from "react";
import { useChat } from "./UseChat";
import { ChatHeader } from "./Header.Chatrix";
import { Sidebar } from "./SideBar.Chatrix";
import { MessagesArea } from "./MessageArea.Chatrix";
import { InputArea } from "./InputArea.Chatrix";
import { useAuth } from "./Auth/AuthContex";
import { getMessageHistory } from "../api/api";
import type { TextMessage } from "./UseChat";

export const Chatrix = () => {
  const { 
    connected, 
    myName, 
    conversations, 
    getMessages, 
    sendMessage, 
    setMessages 
  } = useChat(`${import.meta.env.VITE_BACKEND_URL}/ws`);
  const {user, token} = useAuth();
  const [textingToId, setTextingToId] = useState<string | null>(null);
  const [inputData, setInputData] = useState('');

  const [msgHistoryLoading, setMsgHistoryLoading] = useState<boolean>(true)
  
  const textingTo = conversations.find(c => c.user_data.id === textingToId) || null;
  
  useEffect(() => {
    if(!textingToId || !token || !user) return;
    setMsgHistoryLoading(true)
    const fetchChatHistory = async () => {
      const resp = await getMessageHistory({
        token: token,
        with_id: textingToId
      })
      const history : TextMessage[] = resp.data.map((msg) => {
        return {
          outgoing: msg.sender_id == user.id,
          content: msg.content
        }
      })

      setMessages(prev => ({
        ...prev, [textingToId]: history
      }))
      setMsgHistoryLoading(false)
    }

    fetchChatHistory()

  }, [textingToId])
  
  const handleSend = () => {
    if (inputData.trim() && textingTo && user && textingToId) {
      sendMessage(textingToId, user.id, inputData);
      setInputData('');
    }
  };

  const handleEscape = (event: React.KeyboardEvent) => {
    if (event.key == 'Escape' && textingTo) {
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
          conversations={conversations} 
          selectedUser={textingTo}
          onSelectUser={setTextingToId}
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
