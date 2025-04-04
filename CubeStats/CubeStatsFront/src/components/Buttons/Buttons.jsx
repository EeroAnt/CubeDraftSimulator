import "./Buttons.css";

export const NavBarButton = ({ title, onClick, modeType, modeTarget }) => {
  const className =
    (typeof modeType === "string" && modeType === modeTarget) ||
    (typeof modeType === "object" && !modeType.includes(modeTarget))
      ? "bg-blue-800 text-white px-4 py-2 rounded"
      : "bg-blue-500 text-white px-4 py-2 rounded";
  return (
    <button onClick={onClick} className={className}>
      {title}
    </button>
  );
};
export const Button = ({ title, onClick, modeType, modeTarget }) => {
  const className =
    (typeof modeType === "string" && modeType === modeTarget) ||
    (typeof modeType === "object" && !modeType.includes(modeTarget))
      ? "bg-gray-500 text-white px-4 py-2 rounded"
      : "bg-blue-500 text-white px-4 py-2 rounded";
  return (
    <button onClick={onClick} className={className}>
      {title}
    </button>
  );
};


export const ButtonWithDropdownMenu = ({
  title,
  items,
  onClick,
  state,
  onClickChild,
  modeType,
  modeTarget,
}) => {
  const className =
    modeType === modeTarget
      ? "bg-blue-800 text-white px-4 py-2 rounded h-10 flex items-center justify-center gap-1"
      : "bg-blue-500 text-white px-4 py-2 rounded h-10 flex items-center justify-center gap-1";
  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className={className}
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={onClick}
        >
          {title}
          <svg
            className="size-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            data-slot="icon"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {state && (
        <div
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          {items.map((item, index) => (
            <a
              key={index}
              className="block px-4 py-2 text-sm text-gray-700"
              role="menuitem"
              tabIndex="-1"
              onClick={() => onClickChild(item)}
              id={`menu-item-${index}`}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
