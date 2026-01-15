export const ChatHeader = ({ 
  myName, 
  connected, 
}: { 
  myName: string, 
  connected: boolean, 
}) => {

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
      {/* Left Side: Brand & Status (Same as before) */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
              <div 
                className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg border border-gray-700 transition-all hover:ring-2 hover:ring-blue-400/50 cursor-pointer"
                >
                <span className="text-white font-bold uppercase text-lg select-none">
                  {myName.charAt(0)}
                </span>
            </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-whitet">{myName}</h1>
          <div className="flex items-center gap-1.5">
            {connected ? (
              <>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                  Network Live
                </p>
              </>
            ) : (
              <>
                <div className="w-2 h-2 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                  Connecting
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};