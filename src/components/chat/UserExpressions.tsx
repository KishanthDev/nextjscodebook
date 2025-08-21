type Props = {
  expressions: string[];
  onSelect: (expr: string) => void;
};

export default function UserExpressions({ expressions, onSelect }: Props) {
  return (
    <>
      {expressions.map((expr, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(expr)}
          className="bg-green-100 text-green-800 px-3 py-1 rounded-lg 
                     hover:bg-green-200 dark:bg-green-900 dark:text-green-100"
        >
          {expr}
        </button>
      ))}
    </>
  );
}
