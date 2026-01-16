import type { ConversationWithUser } from "../api/api";

interface UserListItemProps {
  id: string;
  username: string;
  isOnline?: boolean;
  isSelected?: boolean;
  lastSeen: string;
  variant?: 'conversation' | 'search';
  onClick: (id: string | null) => void;
  conversationId: string;
  onSelectSearchUser: (user: ConversationWithUser | null) => void;
}

export const UserListItem = ({
  id,
  username,
  isOnline,
  isSelected = false,
  variant = 'conversation',
  onClick,
  onSelectSearchUser,
  lastSeen,
  conversationId
}: UserListItemProps) => {
  const gradientColors = variant === 'conversation' 
    ? 'from-green-400 to-blue-500' 
    : 'from-purple-400 to-pink-500';

  return (
    <button
      onClick={
        variant == 'conversation' || conversationId ? (
          () => { 
            onSelectSearchUser(null)
            onClick(id) 
          }
        ) : (
          () => { 
           if(conversationId !== "") {
            console.log("RIGHT");
            
            onClick(id)
            onSelectSearchUser(null)
            return;
           }
           console.log("WRNG", conversationId);
           
          onClick(null)
          onSelectSearchUser({
          user_data: {
              username: username,
              id: id,
            last_seen: lastSeen,
            conversation_id: "",
          },
          is_online: isOnline ? (isOnline) : (false)
          })}
        )
      }
      className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-700 transition-colors cursor-pointer ${
        isSelected ? 'bg-gray-700 border-l-4 border-blue-500' : ''
      }`}
    >
      <div className="relative">
        <div className={`w-10 h-10 bg-gradient-to-br ${gradientColors} rounded-full flex items-center justify-center text-white font-semibold`}>
          {username.charAt(0).toUpperCase()}
        </div>
        
        {variant === 'conversation' && isOnline !== undefined && (
          <div 
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
              isOnline ? 'bg-blue-500' : 'bg-gray-500'
            }`}
          />
        )}
      </div>

      <div className="flex-1 text-left">
        <p className="font-medium text-sm">{username}</p>
      </div>
    </button>
  );
};