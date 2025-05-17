type Contact = {
  id: number;
  name: string;
  status: "online" | "offline";
  recentMsg: string;
  time: string;
  unread: number;
};

export default Contact;