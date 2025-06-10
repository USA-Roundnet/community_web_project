const Memberships = () => (
    <div className="mt-8 p-8 space-y-4">
        <h2 className="text-xl font-bold text-blue-900">Memberships</h2>
        <ul className="space-y-2">
            <li className="bg-blue-50 rounded-lg px-4 py-2 shadow flex items-center justify-between">
                <span>NYC Roundnet Club</span>
                <div className="flex flex-col items-end">
                    <span className="text-green-600 font-semibold">Active</span>
                    <span className="text-gray-500 text-sm">
                        Expires: 2025-12-31
                    </span>
                </div>
            </li>
            <li className="bg-blue-50 rounded-lg px-4 py-2 shadow flex items-center justify-between">
                <span>USA Roundnet Association</span>
                <div className="flex flex-col items-end">
                    <span className="text-red-500 font-semibold">Expired</span>
                    <span className="text-gray-500 text-sm">
                        Expires: 2023-06-30
                    </span>
                </div>
            </li>
        </ul>
    </div>
);

export default Memberships;
