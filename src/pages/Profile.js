import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (!user) {
        return <div className="p-4">Please log in to view your profile.</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <div className="bg-white p-4 rounded shadow">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </div>
        </div>
    );
};

export default Profile;