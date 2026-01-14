import type { ConversationWithUser } from "../api/api";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

export const Sidebar = ({ 
  conversations, 
  selectedUser, 
  onSelectUser 
}: { 
  conversations: ConversationWithUser[]; 
  selectedUser: ConversationWithUser | null; 
  onSelectUser: (id: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const filteredConversations = conversations.filter(user =>
    user.user_data.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFocused) {
        setIsFocused(false);
        setSearchQuery("");
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isFocused]);

  const handleClear = () => {
    setSearchQuery("");
    setIsFocused(false);
  };

  return (
    <div className="bg-gray-800 border-r border-gray-700 w-64 flex flex-col">
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-gray-700 text-white pl-10 pr-10 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
          {isFocused && (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                handleClear();
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-gray-600 hover:bg-gray-500 flex items-center justify-center transition-colors"
            >
              <X className="w-3 h-3 text-gray-300" />
            </button>
          )}
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto relative">
        {isFocused && searchQuery === "" ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Search something...</p>
          </div>
        ) : (
          filteredConversations.map((user) => (
            <button
              key={user.user_data.id}
              onClick={() => onSelectUser(user.user_data.id)}
              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-700 transition-colors cursor-pointer ${
                selectedUser?.user_data.id === user.user_data.id ? 'bg-gray-700 border-l-4 border-blue-500' : ''
              }`}
            >
              {/* Container for Avatar + Status Indicator */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.user_data.username.charAt(0).toUpperCase()}
                </div>
                
                {/* Status Indicator Circle */}
                <div 
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
                    user.is_online ? 'bg-blue-500' : 'bg-gray-500'
                  }`}
                />
              </div>

              <div className="flex-1 text-left">
                <p className="font-medium text-sm">{user.user_data.username}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};