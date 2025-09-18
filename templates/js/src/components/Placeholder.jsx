import PropTypes from "prop-types";

export default function Placeholder({ title, position }) {
  return (
    <div
      className={`grid size-full min-h-20 place-items-center border-white/15 text-xs text-white italic after:content-[attr(data-title)] ${
        position === "top" ? "border-b" : "border-t"
      }`}
      data-title={title}
    />
  );
}

Placeholder.propTypes = {
  title: PropTypes.string.isRequired,
  position: PropTypes.oneOf(["top", "bottom"]).isRequired,
};
