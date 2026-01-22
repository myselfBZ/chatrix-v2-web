export const TypingIndicator = () => {
  return (
    <div className="flex gap-3 mb-2">
      <div className="inline-flex items-center gap-2 px-4 py-3 bg-gray-800 rounded-2xl rounded-tl-sm border border-gray-700/50">
        <div className="flex gap-1.5">
          <span 
            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{ 
              animationDelay: '0ms', 
              animationDuration: '1.4s',
              animationTimingFunction: 'ease-in-out'
            }}
          />
          <span 
            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{ 
              animationDelay: '200ms', 
              animationDuration: '1.4s',
              animationTimingFunction: 'ease-in-out'
            }}
          />
          <span 
            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{ 
              animationDelay: '400ms', 
              animationDuration: '1.4s',
              animationTimingFunction: 'ease-in-out'
            }}
          />
        </div>
      </div>
    </div>
  );}