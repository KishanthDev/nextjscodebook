import { Skeleton } from "@/ui/skeleton";

export default function ContactListSkeleton() {
  return (
    <div className="border-r border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-gray-300 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
        <Skeleton className="h-6 w-6 rounded-md" />
      </div>

      <h2 className="px-6 pt-4 text-xl font-normal text-blue-500">Chats</h2>

      <div className="overflow-y-auto scrollbar-hide">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 border-b border-gray-300 dark:border-zinc-800"
          >
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-10" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-[140px]" />
                <Skeleton className="h-4 w-5 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
