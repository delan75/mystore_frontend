import React from 'react';

const Support = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Support</h1>
            <div className="bg-white p-4 rounded shadow">
                <p className="mb-4">Need help? Our support team is here to assist you.</p>
                
                <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
                <p className="mb-4">Email: support@mystore.com</p>
                <p className="mb-4">Phone: +1 (555) 123-4567</p>
                
                <h2 className="text-xl font-semibold mb-2">FAQs</h2>
                <div className="mb-3">
                    <h3 className="font-medium">How do I reset my password?</h3>
                    <p>You can reset your password by clicking on the "Forgot Password" link on the login page.</p>
                </div>
                <div className="mb-3">
                    <h3 className="font-medium">How do I track my order?</h3>
                    <p>You can track your order in the Orders section of your account.</p>
                </div>
            </div>
        </div>
    );
};

export default Support;
