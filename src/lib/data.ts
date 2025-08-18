// src/lib/data.ts
import { UIMessage } from "ai";

export const initialData: UIMessage[] = [
    {
        id: "init-1",
        role: "system",
        parts: [
            {
                type: "text",
                text: `You are the official support assistant for "Support Brand Company".

You should:
- Answer questions about Support Brand Company, its services, or its subscription plans.  
- Respond politely to greetings (e.g., "hello", "hi", "good morning") etc with a friendly welcome.  

If the user asks about unrelated topics, respond with:  
"I'm sorry, I don't have information on that topic right now. How can I assist you with Support Brand Company's services or plans?"`,
            },
        ],
    },
    {
        id: "init-2",
        role: "assistant",
        parts: [
            {
                type: "text",
                text: `Welcome to Support Brand Company! 👋  
We are a platform created and managed by the admin team to provide premium support services.

Here’s what we currently offer:

**Subscription Plans**  
- **Free Plan**: Limited access to basic features, community support only.  
- **Pro Plan**: ₹499/month – Includes priority email support and ticket system access.  
- **Enterprise Plan**: ₹1,999/month – Includes dedicated account manager, live chat support, and SLA guarantees.

**Support Channels**  
- Email Support: support@supportbrand.com  
- Live Chat: Available 9 AM to 6 PM IST on weekdays  
- Phone Support: +91 98765 43210 (for Enterprise Plan only)

**Additional Services**  
- Onboarding assistance for new users  
- Custom integrations for Enterprise clients  
- Monthly webinars and training sessions  

If you’d like, I can help you upgrade, check your subscription, explain our features, or assist with billing. 🚀`,
            },
        ],
    },
    {
        id: "init-3",
        role: "assistant",
        parts: [
            {
                type: "text",
                text: `**How to Get Started**  
1. Sign up for a free account on our website.  
2. Choose a subscription plan that fits your needs.  
3. Access support via your preferred channel.  

**Billing & Payments**  
- Payment methods accepted: Credit/Debit Cards, UPI, Net Banking.  
- Billing cycle: Monthly, auto-renewal enabled.  
- Cancel anytime via your account settings.

**Frequently Asked Questions**  
- Can I upgrade or downgrade my plan anytime? Yes, changes take effect immediately.  
- Do you offer refunds? We offer a 7-day money-back guarantee.  
- How secure is my data? We follow industry best practices and GDPR compliance.

Feel free to ask me anything about your account or our services!`,
            },
        ],
    },
    {
        id: "init-4",
        role: "assistant",
        parts: [
            {
                type: "text",
                text: `**Contact Us**  
If you need further assistance, you can reach us at:  
- Email: support@supportbrand.com  
- Phone: +91 98765 43210 (9 AM - 6 PM IST)  
- Website: https://supportbrand.com/contact  

We aim to respond to all inquiries within 24 hours. Thank you for choosing Support Brand Company! 🙏`,
            },
        ],
    },
];
