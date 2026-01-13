import { useEffect, useRef } from "react";
import type { TextMessage } from "./UseChat";
import { formatMessageTime, AnimatedClock, CheckIcon, playTickSound, playIncomingSound } from "./MessageUtilts";



export const Message = ({ message, isNew }: { message: TextMessage; isNew?: boolean }) => {
  const isOutgoing = message.outgoing;
  const isPending = message.state === 'pending';
  const isDelivered = message.state === 'delivered';
  const prevStateRef = useRef(message.state);
  const hasPlayedIncomingSound = useRef(false);

  // Play sound when message is delivered
  useEffect(() => {
    if (prevStateRef.current === 'pending' && message.state === 'delivered') {
      playTickSound();
    }
    prevStateRef.current = message.state;
  }, [message.state]);

  // Play sound for new incoming messages
  useEffect(() => {
    if (isNew && !isOutgoing && !hasPlayedIncomingSound.current) {
      playIncomingSound();
      hasPlayedIncomingSound.current = true;
    }
  }, [isNew, isOutgoing]);

  return (
    <div className={`flex w-full ${isOutgoing ? 'justify-end' : 'justify-start'} mb-2 ${isNew ? 'animate-slideUp' : 'animate-fadeIn'}`}>
      <div className={`max-w-[35ch] flex flex-col ${isOutgoing ? 'items-end' : 'items-start'}`}>
        
        {/* Message Bubble Container */}
        <div className={`relative rounded-2xl px-3 py-1.5 shadow-sm ${
          isOutgoing 
            ? 'bg-blue-600 text-white rounded-br-sm' 
            : 'bg-gray-800 text-gray-100 rounded-bl-sm'
        }`}>
          
          {/* Content with inline timestamp */}
          <p className="text-[15px] leading-relaxed text-left break-words whitespace-pre-wrap inline">
            {message.content}
            <span className={`text-[10px] ml-2 select-none inline-block align-bottom ${
              isOutgoing ? 'text-blue-100/80' : 'text-gray-400'
            }`}>
              {isPending ? (
                <AnimatedClock className={isOutgoing ? 'text-blue-100/80' : 'text-gray-400'} />
              ) : (
                <>
                  {formatMessageTime(message.created_at)}
                  {isDelivered && isOutgoing && (
                    <CheckIcon className={`ml-1 ${isOutgoing ? 'text-blue-100/80' : 'text-gray-400'}`} />
                  )}
                </>
              )}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export const MessageSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 animate-pulse w-full">
      {/* Received Message - Medium */}
      <div className="flex justify-start">
        <div className="flex flex-col items-start w-full">
          <div className="h-10 bg-gray-800 rounded-2xl rounded-bl-sm w-[65%]" />
        </div>
      </div>

      {/* Sent Message - Short & Sharp */}
      <div className="flex justify-end">
        <div className="flex flex-col items-end w-full">
          <div className="h-10 bg-gray-700 rounded-2xl rounded-br-sm w-[30%]" />
        </div>
      </div>

      {/* Received Message - Long/Multilined */}
      <div className="flex justify-start">
        <div className="flex flex-col items-start w-full">
          <div className="h-16 bg-gray-800 rounded-2xl rounded-bl-sm w-[80%]" />
        </div>
      </div>

      {/* Sent Message - Medium */}
      <div className="flex justify-end">
        <div className="flex flex-col items-end w-full">
          <div className="h-10 bg-gray-700 rounded-2xl rounded-br-sm w-[50%]" />
        </div>
      </div>
      
      {/* Received Message - Tiny */}
      <div className="flex justify-start">
        <div className="flex flex-col items-start w-full">
          <div className="h-10 bg-gray-800 rounded-2xl rounded-bl-sm w-[20%]" />
        </div>
      </div>
    </div>
  );
};