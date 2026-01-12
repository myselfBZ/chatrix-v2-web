import type { ConversationWithUser } from "../api/api";


export const Sidebar = ({ 
  conversations, 
  selectedUser, 
  onSelectUser 
}: { 
  conversations: ConversationWithUser[]; 
  selectedUser: ConversationWithUser | null; 
  onSelectUser: (id: string) => void;
}) => (
  <div className="bg-gray-800 border-r border-gray-700 w-64 flex flex-col">
    <div className="flex-1 overflow-y-auto">
  {conversations.map((user) => (
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
            user.is_online  ? 'bg-blue-500' : 'bg-gray-500'
          }`}
        />
      </div>

      <div className="flex-1 text-left">
        <p className="font-medium text-sm">{user.user_data.username}</p>
        {/* "Online" text removed */}
      </div>
    </button>
  ))}
</div>
  </div>
);