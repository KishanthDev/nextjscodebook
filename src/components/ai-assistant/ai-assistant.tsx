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

const assistants = ["Nexa", "Luma", "AssistIQ", "Milo"];
const users = ["user1", "user2", "user3", "user4"];
const pairs: UserPair[] = assistants.map((ai, i) => ({ user: users[i], ai }));

export default function AIAssistantPage() {
    const { messages, inputs, setInputs, sendMessage } = useMQTTChat(pairs, brokerUrl, "ai");

    return (
        <Accordion type="single" collapsible className="w-full">
            {pairs.map(({ ai }) => (
                <AccordionItem key={ai} value={ai}>
                    <AccordionTrigger>{ai}</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2">
                        <ChatWindow messages={messages[ai] || []} />
                        <div className="flex mt-2">
                            <input
                                value={inputs[ai] || ""}
                                onChange={(e) => setInputs((prev) => ({ ...prev, [ai]: e.target.value }))}
                                className="border p-1 flex-1"
                            />
                            <button
                                onClick={() => sendMessage(ai)}
                                className="bg-green-500 text-white p-1 ml-2 rounded"
                            >
                                Send
                            </button>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
