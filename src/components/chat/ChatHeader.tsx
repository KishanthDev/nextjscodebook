import { CircleUser } from "lucide-react";
import clsx from "clsx";
import Contact from "../../../types/Contact";

const statusColor = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  busy: "bg-red-500",
};

export default function ChatHeader({ contact }: { contact: Contact | null }) {
  return (
    <div className="flex h-14 items-center justify-between border-b px-4 dark:border-zinc-700">
      {contact ? (
        <div className="flex items-center gap-3">
          <div className="relative">
            <CircleUser className="h-8 w-8 text-gray-600 dark:text-gray-300" />
            <span
              className={clsx(
                "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-black",
                statusColor[contact.status],
              )}
            />
          </div>
          <span className="text-lg font-semibold">{contact.name}</span>
        </div>
      ) : (
        <h3 className="text-lg text-gray-400">Select a conversation</h3>
      )}
    </div>
  );
}
