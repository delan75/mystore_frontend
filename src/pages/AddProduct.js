import React from 'react';
import ProductForm from '../components/ProductForm';

const AddProduct = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <ProductForm />
            </div>
        </div>
    );
};

export default AddProduct;