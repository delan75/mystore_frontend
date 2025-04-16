import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Feedback = () => {
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (feedback.trim() === '') {
            toast.error('Please enter your feedback');
            return;
        }
        
        // Implement API call to submit feedback
        toast.success('Thank you for your feedback!');
        setFeedback('');
        setRating(0);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Feedback</h1>
            <div className="bg-white p-4 rounded shadow">
                <p className="mb-4">We value your feedback! Please let us know how we can improve your experience.</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            How would you rate your experience?
                        </label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="text-2xl focus:outline-none"
                                >
                                    <i className={`fas fa-star ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="feedback">
                            Your Feedback
                        </label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="feedback"
                            rows="4"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Tell us what you think..."
                        ></textarea>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-[#1ab188] hover:bg-[#179b77] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Submit Feedback
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Feedback;
