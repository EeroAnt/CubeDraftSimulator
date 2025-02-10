import "./NavBar.css";

export function NavBar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">CubeStats</div>
        <div className="space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Home
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            About
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
}
