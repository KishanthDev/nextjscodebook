import { CircleUser, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/ui/dropdown-menu";
import { Button } from "@/ui/button";
import clsx from "clsx";
import Contact from "@/types/Contact";
import { useUserStatus } from "@/stores/useUserStatus";

type Props = {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelect: (contact: Contact) => void;
  userStatus: "online" | "offline";
};

const statusColor: Record<"online" | "offline", string> = {
  online: "bg-green-500",
  offline: "bg-red-500",
};

export default function ContactList({ contacts, selectedContact, onSelect, userStatus }: Props) {
  const { toggleAcceptChats } = useUserStatus();

  return (
    <div className="border-r border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-gray-300 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <CircleUser className="h-9 w-9 text-gray-600 dark:text-gray-300" />
            <span
              className={clsx(
                "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-black",
                statusColor[userStatus]
              )}
            />
          </div>
          <div>
            <div className="text-sm font-medium text-black dark:text-white">Zoey</div>
            <div className="text-xs text-gray-500 dark:text-white">{userStatus.charAt(0).toUpperCase() + userStatus.slice(1)}</div>
          </div>
        </div>

        {/* Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuItem
              onClick={toggleAcceptChats}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <span className={clsx("h-2.5 w-2.5 rounded-full", statusColor[userStatus === "online" ? "offline" : "online"])} />
              Set {userStatus === "online" ? "Offline" : "Online"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Contact list */}
      <h2 className="px-6 pt-4 text-xl font-normal text-blue-500">Chats</h2>
      <div className="overflow-y-auto scrollbar-hide">
        {contacts.length === 0 ? (
          <div className="p-3 text-gray-500 dark:text-gray-400">No contacts available</div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => onSelect(contact)}
              className={clsx(
                "flex cursor-pointer items-center gap-3 p-3 hover:bg-gray-200 dark:hover:bg-zinc-700",
                selectedContact?.id === contact.id && "bg-gray-200 shadow dark:bg-zinc-700",
                "border-b border-gray-300 dark:border-zinc-800"
              )}
            >
              <div className="relative">
                <CircleUser className="h-10 w-10 text-gray-600 dark:text-gray-300" />
                <span
                  className={clsx(
                    "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-black",
                    statusColor[contact.status]
                  )}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{contact.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{contact.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="w-[140px] truncate text-sm text-gray-600 dark:text-white">
                    {contact.recentMsg}
                  </span>
                  {contact.unread > 0 && (
                    <span className="ml-2 rounded-full bg-green-500 px-2 text-xs text-white">{contact.unread}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}