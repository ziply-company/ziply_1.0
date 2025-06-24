import React from "react";

export default function InventoryPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col items-center justify-center w-full p-8">
            <div className="bg-white rounded-xl shadow-lg p-10 max-w-2xl w-full">
                <h1 className="text-4xl font-bold text-blue-700 mb-4 text-center">
                    Inventory
                </h1>
                <p className="text-gray-600 text-center mb-8">
                    Manage and track your inventory items here.
                </p>
                <div className="flex flex-col gap-4">
                    <div className="bg-blue-100 rounded-lg p-4 flex items-center justify-between">
                        <span className="font-medium text-blue-800">Sample Item 1</span>
                        <span className="text-sm text-blue-600">In Stock: 25</span>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-4 flex items-center justify-between">
                        <span className="font-medium text-blue-800">Sample Item 2</span>
                        <span className="text-sm text-blue-600">In Stock: 12</span>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-4 flex items-center justify-between">
                        <span className="font-medium text-blue-800">Sample Item 3</span>
                        <span className="text-sm text-blue-600">In Stock: 7</span>
                    </div>
                </div>
                <button className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
                    Add New Item
                </button>
            </div>
        </main>
    );
}
