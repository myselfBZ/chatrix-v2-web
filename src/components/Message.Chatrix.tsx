import { useEffect, useRef } from "react";
import type { TextMessage } from "./hook/UseChat";
import { 
  formatMessageTime, 
  AnimatedClock, 
  CheckIcon, 
  DoubleCheckIcon, 
  playTickSound, 
  playIncomingSound 
} from "./MessageUtilts";

export const Message = ({ message, isNew }: { message: TextMessage; isNew?: boolean }) => {
  const isOutgoing = message.outgoing;
  const isPending = message.state === 'pending';
  const isDelivered = message.state === 'delivered';
  const isRead = message.state === 'read';
  const prevStateRef = useRef(message.state);
  const hasPlayedIncomingSound = useRef(false);

  // Sound logic for status changes
  useEffect(() => {
    if (prevStateRef.current === 'pending' && message.state === 'delivered') {
      playTickSound();
    }
    prevStateRef.current = message.state;
  }, [message.state]);

  // Sound logic for new incoming messages
  useEffect(() => {
    if (isNew && !isOutgoing && !hasPlayedIncomingSound.current) {
      playIncomingSound();
      hasPlayedIncomingSound.current = true;
    }
  }, [isNew, isOutgoing]);

  return (
    <div className={`flex w-full ${isOutgoing ? 'justify-end' : 'justify-start'} mb-2 ${isNew ? 'animate-slideUp' : 'animate-fadeIn'}`}>
      
      {/* 1. The Container: max-w ensures it doesn't hit the screen edge.
          2. min-w-0 is the MAGIC here. It forces flex children to respect max-width 
             even if they contain a single long word like "aaaaaa...".
      */}
      <div className={`max-w-[85%] sm:max-w-[70%] min-w-0 flex flex-col ${isOutgoing ? 'items-end' : 'items-start'}`}>
        
        {/* Message Bubble Container */}
        <div className={`relative rounded-2xl px-3 py-1.5 shadow-sm ${
          isOutgoing 
            ? 'bg-blue-600 text-white rounded-br-sm' 
            : 'bg-gray-800 text-gray-100 rounded-bl-sm'
        }`}>
          
          {/* Using flex-wrap + justify-end allows the timestamp to 
              sit nicely at the end of the text.
          */}
          <div className="flex flex-wrap justify-end items-end gap-x-2 min-w-0">
            
            {/* The Content:
                - break-all: Forces the line to break exactly where the container ends.
                - whitespace-pre-wrap: Keeps the Shift+Enter newlines.
            */}
            <p className="text-[15px] leading-relaxed text-left break-all whitespace-pre-wrap flex-1 min-w-0">
              {message.content}
            </p>

            {/* Timestamp & Status Icons */}
            <div className={`flex items-center gap-1 text-[10px] select-none h-4 mb-[2px] flex-shrink-0 ${
              isOutgoing ? 'text-blue-100/80' : 'text-gray-400'
            }`}>
              {isPending ? (
                <AnimatedClock className="w-3 h-3" />
              ) : (
                <>
                  {formatMessageTime(message.created_at)}
                  {isOutgoing && (
                    isRead ? (
                      <DoubleCheckIcon className="text-blue-200" />
                    ) : isDelivered ? (
                      <CheckIcon className="text-blue-100/80" />
                    ) : null
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export const MessageSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 animate-pulse w-full">

      <div className="flex justify-start">
        <div className="flex flex-col items-start w-full">
          <div className="h-10 bg-gray-800 rounded-2xl rounded-bl-sm w-[65%]" />
        </div>
      </div>

      <div className="flex justify-end">
        <div className="flex flex-col items-end w-full">
          <div className="h-10 bg-gray-700 rounded-2xl rounded-br-sm w-[30%]" />
        </div>
      </div>

      <div className="flex justify-start">
        <div className="flex flex-col items-start w-full">
          <div className="h-16 bg-gray-800 rounded-2xl rounded-bl-sm w-[80%]" />
        </div>
      </div>

      <div className="flex justify-end">
        <div className="flex flex-col items-end w-full">
          <div className="h-10 bg-gray-700 rounded-2xl rounded-br-sm w-[50%]" />
        </div>
      </div>
      
      <div className="flex justify-start">
        <div className="flex flex-col items-start w-full">
          <div className="h-10 bg-gray-800 rounded-2xl rounded-bl-sm w-[20%]" />
        </div>
      </div>
    </div>
  );
};