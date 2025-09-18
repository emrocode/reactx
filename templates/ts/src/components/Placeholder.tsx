interface PlaceholderProps {
  title: string;
  position: "top" | "bottom";
}

export default function Placeholder({ title, position }: PlaceholderProps) {
  return (
    <div
      className={`grid size-full min-h-20 place-items-center border-white/15 text-xs text-white italic after:content-[attr(data-title)] ${
        position === "top" ? "border-b" : "border-t"
      }`}
      data-title={title}
    />
  );
}
