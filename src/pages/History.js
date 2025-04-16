import React from 'react';

const History = () => {
    // Sample history data
    const activityHistory = [
        { id: 1, type: 'login', description: 'Logged in from Chrome on Windows', date: '2023-06-15 14:30:45' },
        { id: 2, type: 'order', description: 'Placed order #12345', date: '2023-06-14 10:15:22' },
        { id: 3, type: 'profile', description: 'Updated profile information', date: '2023-06-10 09:45:12' },
        { id: 4, type: 'login', description: 'Logged in from Safari on macOS', date: '2023-06-08 16:20:33' },
        { id: 5, type: 'order', description: 'Placed order #12340', date: '2023-06-05 11:05:18' },
    ];

    const getActivityIcon = (type) => {
        switch (type) {
            case 'login':
                return <i className="fas fa-sign-in-alt text-blue-500"></i>;
            case 'order':
                return <i className="fas fa-shopping-cart text-green-500"></i>;
            case 'profile':
                return <i className="fas fa-user-edit text-purple-500"></i>;
            default:
                return <i className="fas fa-info-circle text-gray-500"></i>;
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Activity History</h1>
            <div className="bg-white p-4 rounded shadow">
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Recent Activity</h2>
                    <button className="text-[#1ab188] hover:text-[#179b77]">
                        <i className="fas fa-download mr-1"></i> Export
                    </button>
                </div>
                
                <div className="space-y-4">
                    {activityHistory.map((activity) => (
                        <div key={activity.id} className="flex items-start p-3 border-b">
                            <div className="mr-4 mt-1">
                                {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1">
                                <div className="font-medium">{activity.description}</div>
                                <div className="text-sm text-gray-500">{new Date(activity.date).toLocaleString()}</div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-4 text-center">
                    <button className="text-[#1ab188] hover:text-[#179b77]">
                        Load More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default History;
