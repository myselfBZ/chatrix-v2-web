const UserListSkeleton = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="w-full px-4 py-3 flex items-center gap-3 animate-pulse"
        >
          {/* Avatar Skeleton */}
          <div className="relative">
            <div className="w-10 h-10 bg-gray-700 rounded-full" />
            {/* Status Indicator Skeleton */}
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-gray-600 border-2 border-gray-800" />
          </div>

          {/* Username Skeleton */}
          <div className="flex-1">
            <div className="h-4 bg-gray-700 rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserListSkeleton;