import type { ConversationWithUser } from "../api/api";
import { useState, useEffect } from "react";
import { SearchBar } from "./SearchBar";
import { UserListItem } from "./UserListItem";
import { EmptyState } from "./EmptyState";
import { useUserSearch } from "./hook/userUserSearch";
import UserListSkeleton from "./UserListSkeleton";
import { useAuth } from "./Auth/AuthContex";

export const Sidebar = ({ 
  conversations, 
  selectedUser, 
  onSelectUser,
  conversationLoading,
  onSelectSearchUser
}: { 
  conversations: ConversationWithUser[]; 
  selectedUser: ConversationWithUser | null; 
  onSelectUser: (id: string | null) => void;
  conversationLoading: boolean;
  onSelectSearchUser: (user: ConversationWithUser | null) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  
  const { token } = useAuth();
  // TODO: SHOULD BE A BETTER WAY OF DOING IT
  const { results: searchResults, isSearching } = useUserSearch(searchQuery, token!);
  
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

  const isSearchMode = searchQuery.trim() !== '';
  const displayUsers = isSearchMode ? searchResults : filteredConversations;
  const isLoading = isSearchMode ? isSearching : conversationLoading;

  const getEmptyMessage = () => {
    if (isFocused && searchQuery === "") return "Search something...";
    if (searchQuery) return "No users found";
    return "No conversations yet";
  };

  return (
    <div className="bg-gray-800 border-r border-gray-700 w-64 flex flex-col">
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onClear={handleClear}
        isFocused={isFocused}
        placeholder="Search users..."
      />

      {isLoading ? (
        <UserListSkeleton />
      ) : (
        <div className="flex-1 overflow-y-auto relative">
          {displayUsers.length === 0 ? (
            <EmptyState message={getEmptyMessage()} />
          ) : isSearchMode ? (
            searchResults.map((user) => (
              <UserListItem
                onSelectSearchUser={onSelectSearchUser}
                lastSeen={user.last_seen}
                conversationId=""
                key={user.id}
                id={user.id}
                username={user.username}
                onClick={onSelectUser}
                isOnline={user.is_online}
                variant="search"
              />
            ))
          ) : (
            filteredConversations.map((user) => (
              <UserListItem
                onSelectSearchUser={onSelectSearchUser}
                lastSeen={user.user_data.last_seen}
                conversationId={user.user_data.conversation_id}
                key={user.user_data.id}
                id={user.user_data.id}
                username={user.user_data.username}
                isOnline={user.is_online}
                isSelected={selectedUser?.user_data.id === user.user_data.id}
                onClick={onSelectUser}
                variant="conversation"
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};