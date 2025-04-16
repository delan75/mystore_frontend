import React from 'react';

const PrivacyCenter = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Privacy Center</h1>
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Privacy Settings</h2>
                
                <div className="mb-4">
                    <div className="flex items-center justify-between py-2 border-b">
                        <div>
                            <h3 className="font-medium">Email Notifications</h3>
                            <p className="text-sm text-gray-600">Receive email updates about your account activity</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1ab188]"></div>
                        </label>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b">
                        <div>
                            <h3 className="font-medium">Marketing Communications</h3>
                            <p className="text-sm text-gray-600">Receive marketing emails about products and services</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1ab188]"></div>
                        </label>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b">
                        <div>
                            <h3 className="font-medium">Data Sharing</h3>
                            <p className="text-sm text-gray-600">Allow us to share your data with trusted partners</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1ab188]"></div>
                        </label>
                    </div>
                </div>
                
                <h2 className="text-xl font-semibold mb-2 mt-6">Data Management</h2>
                <div className="space-y-4">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full text-left">
                        Download My Data
                    </button>
                    <button className="bg-red-100 hover:bg-red-200 text-red-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full text-left">
                        Delete My Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyCenter;
