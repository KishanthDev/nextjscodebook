type Props = {
  replies: string[];
  onSelect: (reply: string) => void;
};

export default function SmartReplies({ replies, onSelect }: Props) {
  return (
    <>
      {replies.map((reply, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(reply)}
          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg 
                     hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100"
        >
          {reply}
        </button>
      ))}
    </>
  );
}
