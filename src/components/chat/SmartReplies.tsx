type Props = {
  replies: string[];
  onSelect: (reply: string) => void;
};

export default function SmartReplies({ replies, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar">
      {replies.map((reply, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(reply)}
          className="px-3 py-1 rounded-full bg-blue-500 text-white text-sm whitespace-nowrap hover:bg-blue-600 transition"
        >
          {reply}
        </button>
      ))}
    </div>
  );
}
