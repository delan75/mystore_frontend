import React, { useState } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import debounce from 'lodash/debounce';

const ProductForm = () => {
    const { accessToken } = useAuth();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image_url: '',
        is_available: false,
        slug: ''
    });
    const [isDraft, setIsDraft] = useState(true);
    const [draftId, setDraftId] = useState(null);

    // Debounced auto-save function
    const debouncedSave = debounce(async (productData) => {
        if (!productData.name) return; // Don't save if name is empty

        try {
            const url = draftId
                ? `store/products/${draftId}/`
                : 'store/products/';

            const method = draftId ? 'put' : 'post';

            const response = await axios[method](url,
                { ...productData, is_available: false },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            if (!draftId) {
                setDraftId(response.data.id);
                toast.info('Draft saved automatically');
            }
        } catch (error) {
            toast.error('Failed to save draft');
        }
    }, 2000);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedProduct = { ...product, [name]: value };
        setProduct(updatedProduct);

        if (isDraft) {
            debouncedSave(updatedProduct);
        }
    };

    const handlePublish = async () => {
        try {
            const url = draftId
                ? `store/products/${draftId}/`
                : 'store/products/';

            const method = draftId ? 'put' : 'post';

            await axios[method](url,
                { ...product, is_available: true },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            toast.success('Product published successfully');
            setIsDraft(false);

            // Reset form
            setProduct({
                name: '',
                description: '',
                price: '',
                category: '',
                image_url: '',
                is_available: false,
                slug: ''
            });
            setDraftId(null);
        } catch (error) {
            toast.error('Failed to publish product');
        }
    };

    return (
        <div className="form bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">
                {isDraft ? 'Create New Product (Draft)' : 'Create New Product'}
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleInputChange}
                        className="form-input mt-1 block w-full"
                        placeholder="Enter product name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleInputChange}
                        className="form-textarea mt-1 block w-full"
                        rows="4"
                        placeholder="Enter product description"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleInputChange}
                        className="form-input mt-1 block w-full"
                        placeholder="Enter price"
                        step="0.01"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                        type="text"
                        name="category"
                        value={product.category}
                        onChange={handleInputChange}
                        className="form-input mt-1 block w-full"
                        placeholder="Enter category"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                        type="text"
                        name="image_url"
                        value={product.image_url}
                        onChange={handleInputChange}
                        className="form-input mt-1 block w-full"
                        placeholder="Enter image URL"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                    <input
                        type="text"
                        name="slug"
                        value={product.slug}
                        onChange={handleInputChange}
                        className="form-input mt-1 block w-full"
                        placeholder="Enter product slug"
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    {isDraft && (
                        <button
                            onClick={handlePublish}
                            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                        >
                            Publish Product
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductForm;
