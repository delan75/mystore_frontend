import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Settings = () => {
    const [settings, setSettings] = useState({
        darkMode: false,
        notifications: true,
        language: 'english',
        timezone: 'UTC',
    });

    const handleToggle = (setting) => {
        setSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        // Implement API call to save settings
        toast.success('Settings saved successfully');
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Application Settings</h2>
                
                <div className="space-y-4">
                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between py-2 border-b">
                        <div>
                            <h3 className="font-medium">Dark Mode</h3>
                            <p className="text-sm text-gray-600">Switch between light and dark themes</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={settings.darkMode}
                                onChange={() => handleToggle('darkMode')}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1ab188]"></div>
                        </label>
                    </div>
                    
                    {/* Notifications Toggle */}
                    <div className="flex items-center justify-between py-2 border-b">
                        <div>
                            <h3 className="font-medium">Notifications</h3>
                            <p className="text-sm text-gray-600">Enable or disable in-app notifications</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={settings.notifications}
                                onChange={() => handleToggle('notifications')}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1ab188]"></div>
                        </label>
                    </div>
                    
                    {/* Language Selector */}
                    <div className="py-2 border-b">
                        <h3 className="font-medium mb-1">Language</h3>
                        <p className="text-sm text-gray-600 mb-2">Select your preferred language</p>
                        <select
                            name="language"
                            value={settings.language}
                            onChange={handleChange}
                            className="block w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="english">English</option>
                            <option value="spanish">Spanish</option>
                            <option value="french">French</option>
                            <option value="german">German</option>
                            <option value="chinese">Chinese</option>
                        </select>
                    </div>
                    
                    {/* Timezone Selector */}
                    <div className="py-2 border-b">
                        <h3 className="font-medium mb-1">Timezone</h3>
                        <p className="text-sm text-gray-600 mb-2">Select your timezone</p>
                        <select
                            name="timezone"
                            value={settings.timezone}
                            onChange={handleChange}
                            className="block w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="UTC">UTC (Coordinated Universal Time)</option>
                            <option value="EST">EST (Eastern Standard Time)</option>
                            <option value="CST">CST (Central Standard Time)</option>
                            <option value="MST">MST (Mountain Standard Time)</option>
                            <option value="PST">PST (Pacific Standard Time)</option>
                        </select>
                    </div>
                </div>
                
                <div className="mt-6">
                    <button
                        onClick={handleSave}
                        className="bg-[#1ab188] hover:bg-[#179b77] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
