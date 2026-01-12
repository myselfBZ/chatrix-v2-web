import { Send } from "lucide-react";
import { useState } from "react";

export const InputArea = ({ 
  inputData, 
  setInputData, 
  onSend, 
  disabled 
}: { 
  inputData: string; 
  setInputData: (value: string) => void; 
  onSend: () => void; 
  disabled: boolean;
}) => {
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!disabled && inputData.trim()) {
      setIsSending(true);
      setTimeout(() => {
        onSend();
        setIsSending(false);
      }, 300);
    }
  };

  return (
    <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
      <div className="flex gap-3">
        <input
          type="text"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !disabled && handleSend()}
          placeholder="Type a message..."
          disabled={disabled}
          className={`flex-1 px-4 py-3 bg-gray-700 rounded-full border border-gray-600 focus:outline-none focus:border-blue-500 disabled:opacity-50 transition-all ${
            isSending ? 'animate-shrink' : ''
          }`}
        />
        <button
          onClick={handleSend}
          disabled={disabled}
          className={`w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
            isSending ? 'animate-pulse scale-95' : ''
          }`}
        >
          <Send size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};