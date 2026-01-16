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
    connected, myName, conversations, getMessages, 
    sendMessage, setMessages, sendMarkReadEvent, 
    conversationLoading, setConversations 
  } = useChat(`${import.meta.env.VITE_BACKEND_URL}/ws`);
  
  const { user, token } = useAuth();
  const [textingToId, setTextingToId] = useState<string | null>(null);
  const [selectedSearchUser, setSelectedSearchUser] = useState<ConversationWithUser | null>(null);
  const [inputData, setInputData] = useState('');
  const [msgHistoryLoading, setMsgHistoryLoading] = useState<boolean>(false);

  // --- DERIVED STATE: The "Single Source of Truth" ---
  // If they are in our sidebar, use that. Otherwise, use the search result.
  const activeChat = conversations.find(c => c.user_data.id === textingToId) || selectedSearchUser;

  // 1. FETCH HISTORY EFFECT
  useEffect(() => {
    if (!textingToId || !token || !user) return;

    // Check if this is a brand new person (not in sidebar yet)
    const isNewPeer = !conversations.some(c => c.user_data.id === textingToId);
    
    if (isNewPeer) {
      setMessages(prev => ({ ...prev, [textingToId]: [] }));
      setMsgHistoryLoading(false);
      return;
    }

    const fetchChatHistory = async () => {
      setMsgHistoryLoading(true);
      try {
        const resp = await getMessageHistory({ token, with_id: textingToId });
        const history: TextMessage[] = resp.data?.map((msg: any) => ({
          outgoing: msg.sender_id === user.id,
          content: msg.content,
          created_at: msg.created_at,
          id: msg.id,
          is_read: msg.is_read,
          state: msg.is_read ? "read" : "delivered",
          temp_id: "",
        })) || [];

        setMessages(prev => ({ ...prev, [textingToId]: history }));
      } catch (e: any) {
        if (e.response?.status === 404) {
          setMessages(prev => ({ ...prev, [textingToId]: [] }));
        }
      } finally {
        setMsgHistoryLoading(false);
      }
    };

    fetchChatHistory();
  }, [textingToId, token, user?.id, conversations.length]); // Added conversations.length to react when new peers are added

  // 2. MARK READ EFFECT
  useEffect(() => {
    if (!activeChat || !connected || !textingToId) return;
    if (activeChat.user_data.conversation_id === "NEW") return; // Can't mark read on a chat that doesn't exist in DB

    const unread = getMessages(textingToId).some(m => !m.is_read && !m.outgoing);
    if (unread) {
      sendMarkReadEvent(activeChat.user_data.conversation_id, textingToId);
      setMessages(prev => ({
        ...prev,
        [textingToId]: prev[textingToId].map(m => !m.outgoing ? { ...m, is_read: true } : m)
      }));
    }
  }, [textingToId, getMessages(textingToId || "").length, connected]);

  // 3. HANDLERS
  const handleSend = async () => {
    if (!inputData.trim() || !activeChat || !user || !token) return;

    const targetId = activeChat.user_data.id;
    let currentConvoId = activeChat.user_data.conversation_id;

    // "Judo Move": If conversation doesn't exist yet, create it first
    if (!conversations.some(c => c.user_data.id === targetId)) {
      try {
        const resp = await createConversation({
          token,
          user1: user.id,
          user2: targetId
        });
        currentConvoId = resp.data.id;
        
        // Move them from "Search" to "Sidebar"
        setConversations(prev => [...prev, {
          ...activeChat,
          user_data: { ...activeChat.user_data, conversation_id: currentConvoId }
        }]);
        setSelectedSearchUser(null);
      } catch (err) {
        console.error("Failed to start Chaq-Chaq session", err);
        return;
      }
    }

    sendMessage(targetId, user.id, inputData);
    setInputData('');
  };

  const onSelectFromSidebar = (id: string | null) => {
    setSelectedSearchUser(null);
    setTextingToId(id);
  };

  const onSelectFromSearch = (user: ConversationWithUser) => {
    setSelectedSearchUser(user);
    setTextingToId(user.user_data.id);
  };

  return (
    <div onKeyDown={(e) => e.key === 'Escape' && onSelectFromSidebar(null)} 
         className="fixed inset-0 bg-gray-900 text-gray-100 flex flex-col">
      <ChatHeader connected={connected} myName={myName} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          onSelectSearchUser={onSelectFromSearch}
          conversations={conversations} 
          selectedUser={activeChat}
          onSelectUser={onSelectFromSidebar}
          conversationLoading={conversationLoading}
        />
        
        {activeChat ? (
          <div className="flex-1 flex flex-col">
            <MessagesArea 
              loadingHistory={msgHistoryLoading}
              messages={getMessages(activeChat.user_data.id)} 
              selectedUser={activeChat}
            />
            <InputArea 
              inputData={inputData}
              setInputData={setInputData}
              onSend={handleSend}
              disabled={!connected}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a contact to start Chaq-Chaq
          </div>
        )}
      </div>
    </div>
  );
};