type Props = {
  replies: string[];
  onSelect: (reply: string) => void;
};

// SmartReplies.tsx
export default function SmartReplies({ replies, onSelect }: Props) {
  return (
    <div className="flex gap-2">
      {replies.map((reply, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(reply)}
          className="px-1.5 py-1 rounded-full bg-blue-500 text-white text-xs whitespace-nowrap hover:bg-blue-600 transition"
        >
          {reply}
        </button>
      ))}
    </div>
  );
}

