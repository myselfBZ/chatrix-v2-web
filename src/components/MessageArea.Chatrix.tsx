import type { ConversationWithUser } from "../api/api";
import { Message, MessageSkeleton } from "./Message.Chatrix";
import { useEffect, useRef } from "react";
import type { TextMessage } from "./hook/UseChat";


export const MessagesArea = ({ 
  messages, 
  selectedUser, 
  loadingHistory
}: { 
  messages: TextMessage[]; 
  selectedUser: ConversationWithUser | null;
  loadingHistory: boolean
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
 const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  
  // Helper to format time as 14:05
  const formatTime = (d: Date) => {
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Strip time from "now" and "target" to compare full days
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diffInDays = Math.floor((startOfToday.getTime() - startOfTarget.getTime()) / (1000 * 60 * 60 * 24));

  // 1. If it happened today -> "14:05"
  if (diffInDays === 0) {
    return formatTime(date);
  }

  // 2. If it happened yesterday -> "yesterday 14:05"
  if (diffInDays === 1) {
    return `yesterday ${formatTime(date)}`;
  }

  // 3. If it happened more than 1 day ago -> "MM/DD/YYYY"
  return date.toLocaleDateString(); 
};
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-gray-900 h-full overflow-hidden">
      {/* Header - shrink-0 keeps it from disappearing */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between shrink-0 z-10 cursor-pointer">
        <div className="flex items-center gap-3">
          {selectedUser && (
            <>
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {selectedUser.user_data.username.charAt(0).toUpperCase()}
                </div>
                {/* Optional: Add the dot here too for consistency */}
                <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-gray-900 ${
                  selectedUser.is_online ? 'bg-blue-500' : 'bg-gray-500'
                }`} />
              </div>

              <div className="flex flex-col leading-tight">
                <span className="font-medium text-white">
                  {selectedUser.user_data.username}
                </span>
                
                {selectedUser.is_online ? (
                  <span className="text-[11px] font-medium text-blue-400">
                    online
                  </span>
                ) : (
                  <span className="text-[11px] text-gray-400">
                    {selectedUser.user_data.last_seen 
                      ? `last seen ${formatDate(selectedUser.user_data.last_seen)}`
                      : 'offline'}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* 1. This is the scrollable viewport */}
        <div className="flex-1 overflow-y-auto min-h-0 px-6">
          <div className="flex flex-col justify-end min-h-full py-6">
            
            {loadingHistory ? (
              /* SHOW SKELETONS */
              <MessageSkeleton />
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No messages yet. Start a conversation!</p>
              </div>
            ) : (
              /* SHOW REAL MESSAGES */
              <div className="flex flex-col gap-2">
                {messages.map((msg, i) => (
                  <Message key={i} message={msg} isNew={i === messages.length - 1} />
                ))}
                <div ref={messagesEndRef} className="h-px" />
              </div>
            )}
            
          </div>
        </div>
    </div>
  );
};