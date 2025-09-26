type Contact = {
  id: string;
  name: string;
  status: "online" | "offline";
  recentMsg: string;
  time: number | string;
  unread: number;
  lastMsgTime?: number; // For sorting contacts by last message time
};

export default Contact;