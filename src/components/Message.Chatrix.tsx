import type { TextMessage } from "./UseChat";

export const Message = ({ message, isNew }: { message: TextMessage; isNew?: boolean }) => {
  const isOutgoing = message.outgoing
  /*const isSystem = message.startsWith('✓') || message.startsWith('✗');
  
  if (isSystem) {
    return (
      <div className="flex justify-center my-2 animate-fadeIn shrink-0">
        <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full text-center">
          {message}
        </span>
      </div>
    );
  }*/
  
  return (
    <div className={`flex w-full ${isOutgoing ? 'justify-end' : 'justify-start'} mb-4 ${isNew ? 'animate-slideUp' : 'animate-fadeIn'}`}>
      <div className={`max-w-[80%] sm:max-w-[70%] flex flex-col ${isOutgoing ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-2 shadow-sm ${
          isOutgoing 
            ? 'bg-blue-600 text-white rounded-br-sm' 
            : 'bg-gray-800 text-gray-100 rounded-bl-sm'
        }`}>
          <p className="text-sm leading-relaxed text-left break-words whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
};