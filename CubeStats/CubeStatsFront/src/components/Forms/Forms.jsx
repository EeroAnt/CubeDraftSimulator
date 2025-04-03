import "./Forms.css";

export const TextFilter = ({ name, value, onChange }) => {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <label className="text-gray-700 font-semibold">{name}</label>
      <input
        type="text"
        value={value}
        name={name}
        onChange={onChange}
        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500"
      />
    </div>
  );
};
