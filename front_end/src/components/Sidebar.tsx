function Sidebar() {
    return (
        <div className="w-64 h-full bg-gray-800 text-white p-4">
            <h2 className="text-xl font-bold mb-4">Sidebar</h2>
            <ul>
                <li className="mb-2"><a href="#" className="hover:underline">Home</a></li>
                <li className="mb-2"><a href="#" className="hover:underline">Profile</a></li>
                <li className="mb-2"><a href="#" className="hover:underline">Settings</a></li>
                <li className="mb-2"><a href="#" className="hover:underline">Logout</a></li>
            </ul>
        </div>
    );
}
export default Sidebar;