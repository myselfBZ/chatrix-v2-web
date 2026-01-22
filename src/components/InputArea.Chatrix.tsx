import { Send } from "lucide-react";
import {  useRef, useEffect } from "react";
import { useTyping } from "./hook/UseTyping";

export const InputArea = ({ 
  inputData, 
  setInputData, 
  onSend, 
  disabled,
  sendTypingEvent
}: { 
  inputData: string; 
  setInputData: (value: string) => void; 
  onSend: () => void; 
  disabled: boolean;
  sendTypingEvent: (typing: boolean) => void;  
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useTyping(inputData, sendTypingEvent)

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; 
    }
  }, [inputData]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && inputData.trim()) {
        setInputData(inputData.trim());
        // Use setTimeout to ensure state updates before sending
        setTimeout(() => onSend(), 0);
      }
    }
  };
  return (
    <div className="bg-gray-800 border-t border-gray-700 px-4 py-3 sm:px-6">
      <div className="flex items-end gap-3 max-w-6xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled}
            className={`
              w-full px-4 py-3 bg-gray-700 text-gray-100 rounded-2xl border border-gray-600 
              focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
              disabled:opacity-50 transition-all resize-none overflow-y-auto
              scrollbar-thin scrollbar-thumb-gray-600
            `}
            style={{ minHeight: '46px', maxHeight: '200px' }}
          />
        </div>

        <button
          onClick={onSend}
          disabled={disabled || !inputData.trim()}
          className="
            flex-shrink-0 w-11 h-11 bg-blue-600 hover:bg-blue-700 
            rounded-full flex items-center justify-center 
            disabled:opacity-40 disabled:bg-gray-600 transition-all 
            active:scale-90
          "
        >
          <Send size={18} className="text-white transform translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};