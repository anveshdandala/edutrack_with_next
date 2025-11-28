export default function EditableText({
  value,
  onChange,
  className,
  tagName: Tag = "span",
  placeholder = "Edit...",
  multiline = false,
}) {
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-transparent border-none overflow-hidden outline-none resize-none w-full p-0 m-0 focus:ring-1 focus:ring-blue-300 rounded px-1 transition-colors hover:bg-black/5 ${className}`}
        placeholder={placeholder}
        rows={Math.max(2, Math.ceil(value.length / 80))}
      />
    );
  }

  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-transparent border-none outline-none w-full p-0 m-0 focus:ring-1 focus:ring-blue-300 rounded px-1 transition-colors hover:bg-black/5 ${className}`}
      placeholder={placeholder}
    />
  );
}
