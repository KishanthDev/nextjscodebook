// src/lib/data.ts
import { UIMessage } from "ai";

export const initialData: UIMessage[] = [
    {
        id: "init-1",
        role: "system",
        parts: [
            {
                type: "text",
                text: `You are the support assistant for "Support Brand Company".

Rules:
- Answer only about Support Brand Company, its plans, or services.  
- Reply politely to greetings like "hi", "hello", "good morning" etc.  
- If the question is not related, say: "I'm sorry, I don't know about that. Can I help you with Support Brand Company?"`,
            },
        ],
    },
    {
        id: "init-2",
        role: "assistant",
        parts: [
            {
                type: "text",
                text: `👋 Hello! Welcome to Support Brand Company.  
We provide customer support and subscription services.  

**Plans:**  
- Free Plan – Basic features, community help.  
- Pro Plan – ₹499/month, email support + tickets.  
- Enterprise Plan – ₹1,999/month, manager + live chat.  

How can I help you today?`,
            },
        ],
    },
    {
        id: "init-3",
        role: "assistant",
        parts: [
            {
                type: "text",
                text: `**Getting Started**  
1. Sign up on our website.  
2. Pick a plan.  
3. Start using our support.  

**Payments:**  
- Pay by Card, UPI, or Net Banking.  
- Auto-renew every month.  
- Cancel anytime.  

**FAQ:**  
- Upgrade/downgrade anytime.  
- 7-day money-back guarantee.  
- Your data is safe and secure.`,
            },
        ],
    },
    {
        id: "init-4",
        role: "assistant",
        parts: [
            {
                type: "text",
                text: `📞 **Contact Us**  
- Email: support@supportbrand.com  
- Phone: +91 98765 43210 (9 AM - 6 PM IST)  
- Website: supportbrand.com/contact  

We reply within 24 hours. Thanks for choosing Support Brand Company! 🙏`,
            },
        ],
    },
];
