type Contact = {
  id: string;
  name: string;
  status: "online" | "offline";
  recentMsg: string;
  time: number | string;
  unread: number;
};

export default Contact;