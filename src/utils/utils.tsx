export const highlightText = (text: string, highlight: string) => {
  if (!highlight) return text;

  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={index} className="bg-yellow-300">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};
