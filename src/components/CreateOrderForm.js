import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCurrency } from '../context/CurrencyContext';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import '../styles/CreateOrderForm.css';

const CreateOrderForm = ({ onOrderCreated, onCancel }) => {
    const { accessToken } = useAuth();
    const { formatPriceSync, selectedCurrency } = useCurrency();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderItems, setOrderItems] = useState([{ product_id: '', quantity: 1 }]);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/store/products/', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: { page_size: 100 } // Get more products at once
                });

                // Only include available products
                const availableProducts = response.data.results.filter(product => product.is_available);
                setProducts(availableProducts);
                setFilteredProducts(availableProducts);
            } catch (error) {
                console.error('Failed to fetch products:', error);
                toast.error('Failed to load products. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchProducts();
        }
    }, [accessToken]);

    // Filter products based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredProducts(products);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(term) ||
                product.sku?.toLowerCase().includes(term) ||
                product.description?.toLowerCase().includes(term)
            );
            setFilteredProducts(filtered);
        }
    }, [searchTerm, products]);

    // Add a new item row
    const addItem = () => {
        setOrderItems([...orderItems, { product_id: '', quantity: 1 }]);
    };

    // Remove an item row
    const removeItem = (index) => {
        if (orderItems.length > 1) {
            const updatedItems = [...orderItems];
            updatedItems.splice(index, 1);
            setOrderItems(updatedItems);
        }
    };

    // Handle item change
    const handleItemChange = (index, field, value) => {
        const updatedItems = [...orderItems];

        if (field === 'quantity') {
            // Ensure quantity is a positive integer
            value = Math.max(1, parseInt(value) || 1);
        }

        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setOrderItems(updatedItems);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const hasEmptyProduct = orderItems.some(item => !item.product_id);
        if (hasEmptyProduct) {
            toast.error('Please select a product for each item');
            return;
        }

        try {
            setSubmitting(true);

            // Format the payload
            const payload = {
                items: orderItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity
                }))
            };

            // Submit the order
            const response = await axios.post('/orders/', payload, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            toast.success('Order created successfully!');

            // Call the callback with the new order
            if (onOrderCreated) {
                onOrderCreated(response.data);
            }
        } catch (error) {
            console.error('Failed to create order:', error);

            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else if (error.response?.data?.details) {
                // Handle validation errors
                const errorMessages = Object.values(error.response.data.details)
                    .flat()
                    .join(', ');
                toast.error(`Validation error: ${errorMessages}`);
            } else {
                toast.error('Failed to create order. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Get product details by ID
    const getProductById = (productId) => {
        return products.find(product => product.id === productId);
    };

    // Calculate total price
    const calculateTotal = () => {
        return orderItems.reduce((total, item) => {
            const product = getProductById(item.product_id);
            const price = product ? parseFloat(product.price) : 0;
            return total + (price * item.quantity);
        }, 0).toFixed(2);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                </div>
                <p>Loading products...</p>
            </div>
        );
    }

    return (
        <div className="create-order-form">
            <div className="form-header">
                <h2>Create New Order</h2>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search products by name, SKU, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <i className="fas fa-search search-icon"></i>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="order-items">
                    <div className="item-header">
                        <div className="item-product">Product</div>
                        <div className="item-quantity">Quantity</div>
                        <div className="item-price">Price</div>
                        <div className="item-total">Total</div>
                        <div className="item-actions">Actions</div>
                    </div>

                    {orderItems.map((item, index) => {
                        const product = getProductById(item.product_id);
                        const price = product ? parseFloat(product.price) : 0;
                        const itemTotal = price * item.quantity;

                        return (
                            <div key={index} className="item-row">
                                <div className="item-product">
                                    <select
                                        value={item.product_id}
                                        onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Select a product</option>
                                        {filteredProducts.map(product => (
                                            <option key={product.id} value={product.id}>
                                                {product.name} (SKU: {product.sku || 'N/A'})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="item-quantity">
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="item-price">
                                    {selectedCurrency ? formatPriceSync(price) : 'Loading...'}
                                </div>
                                <div className="item-total">
                                    {selectedCurrency ? formatPriceSync(itemTotal) : 'Loading...'}
                                </div>
                                <div className="item-actions">
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="btn-remove"
                                        disabled={orderItems.length === 1}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <div className="add-item-row">
                        <button
                            type="button"
                            onClick={addItem}
                            className="btn-add-item"
                        >
                            <i className="fas fa-plus"></i> Add Item
                        </button>
                    </div>
                </div>

                <div className="order-summary">
                    <div className="summary-row">
                        <div className="summary-label">Total:</div>
                        <div className="summary-value">{selectedCurrency ? formatPriceSync(calculateTotal()) : 'Loading...'}</div>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn-cancel"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={submitting}
                    >
                        {submitting ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i> Creating Order...
                            </>
                        ) : (
                            'Create Order'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateOrderForm;
