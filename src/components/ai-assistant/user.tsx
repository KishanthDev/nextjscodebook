'use client';
import { useMQTTChat, UserPair } from "./useMQTT";
import { ChatWindow } from "./ChatWindow";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/registry/new-york-v4/ui/accordion";

const brokerUrl = "ws://broker.hivemq.com:8000/mqtt";

const userPairs: UserPair[] = [
    { user: "user1", ai: "Nexa" },
    { user: "user2", ai: "Luma" },
    { user: "user3", ai: "AssistIQ" },
    { user: "user4", ai: "Milo" },
];

export default function UserPage() {
    const { messages, inputs, setInputs, sendMessage } = useMQTTChat(userPairs, brokerUrl, "user");

    return (
        <div className="grid grid-cols-2 gap-4 p-4 items-start">
            {userPairs.map(({ user, ai }) => (
                <Accordion key={user} type="multiple" className="border rounded p-2 h-full">
                    <AccordionItem value={user} className="flex flex-col h-full">
                        <AccordionTrigger className="flex justify-between items-center">
                            {user}
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-2 mt-2 h-[350px]">
                            <ChatWindow messages={messages[user] || []} />
                            <div className="flex mt-2">
                                <input
                                    value={inputs[user] || ""}
                                    onChange={(e) =>
                                        setInputs((prev) => ({ ...prev, [user]: e.target.value }))
                                    }
                                    className="border p-1 flex-1 rounded"
                                />
                                <button
                                    onClick={() => sendMessage(user)}
                                    className="bg-blue-500 text-white p-1 ml-2 rounded"
                                >
                                    Send
                                </button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            ))}
        </div>
    );
}
