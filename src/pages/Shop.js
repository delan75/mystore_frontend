import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCurrency } from '../context/CurrencyContext';
import PriceDisplay from '../components/PriceDisplay';

const Shop = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    // Currency conversion is handled by PriceDisplay component
    const [filters, setFilters] = useState({
        category: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'price',
        sortOrder: 'asc',
        search: '',
        page: 1,
        page_size: 12
    });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const fetchProducts = async (resetProducts = true) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: resetProducts ? 1 : filters.page,
                page_size: filters.page_size,
                sort_by: filters.sortBy,
                sort_order: filters.sortOrder,
                search: filters.search,
                ...(filters.category && { category: filters.category }),
                ...(filters.minPrice && { min_price: filters.minPrice }),
                ...(filters.maxPrice && { max_price: filters.maxPrice })
            });

            const response = await axios.get(`http://localhost:8000/store/shop/?${params}`);

            if (resetProducts) {
                setProducts(response.data.results || []);
                setFilters(prev => ({ ...prev, page: 1 }));
            } else {
                setProducts(prev => [...prev, ...(response.data.results || [])]);
                setFilters(prev => ({ ...prev, page: prev.page + 1 }));
            }

            setHasMore(!!response.data.next);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch products');
            setLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchProducts(true);
    }, []); // Initial load - fetchProducts is intentionally omitted from deps to avoid infinite loop

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts(true);
    };

    const applyFilters = () => {
        fetchProducts(true);
    };

    const handleAddToCart = (product) => {
        if (!user) {
            toast.info('Please login to add items to cart');
            navigate('/auth');
            return;
        }
        toast.success(`${product.name} added to cart`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Search Bar */}
            <div className="w-full bg-white shadow-sm sticky top-0 z-20 px-4 py-3">
                <div className="max-w-7xl mx-auto">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            name="search"
                            placeholder="Search products..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={filters.search}
                            onChange={handleFilterChange}
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Search
                        </button>
                        <button
                            type="button"
                            className="md:hidden px-4 py-2 border border-gray-300 rounded-lg"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>

            <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 py-6 gap-6">
                {/* Filters Sidebar */}
                <div className={`md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
                    <div className="bg-white rounded-lg shadow p-6 space-y-6 sticky top-20">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sort By</h3>
                            <div className="space-y-2">
                                {[
                                    { label: 'Price: Low to High', value: 'price-asc' },
                                    { label: 'Price: High to Low', value: 'price-desc' },
                                    { label: 'Newest First', value: 'date_created-desc' }
                                ].map((option) => (
                                    <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sort"
                                            value={option.value}
                                            checked={`${filters.sortBy}-${filters.sortOrder}` === option.value}
                                            onChange={(e) => {
                                                const [sortBy, sortOrder] = e.target.value.split('-');
                                                setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                                                fetchProducts(true);
                                            }}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-700">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Minimum Price
                                    </label>
                                    <input
                                        type="number"
                                        name="minPrice"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={filters.minPrice}
                                        onChange={handleFilterChange}
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Maximum Price
                                    </label>
                                    <input
                                        type="number"
                                        name="maxPrice"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={filters.maxPrice}
                                        onChange={handleFilterChange}
                                        placeholder="Max"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={applyFilters}
                                className="w-full mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    {loading && products.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map(product => (
                                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                        <img
                                            src={product.image_url || 'https://via.placeholder.com/300'}
                                            alt={product.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                                            <p className="text-xl font-bold text-blue-600 mb-4">
                                                <PriceDisplay price={product.price} options={{ className: 'product-price' }} />
                                            </p>
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {hasMore && (
                                <div className="mt-8 text-center">
                                    <button
                                        onClick={() => fetchProducts(false)}
                                        className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                        disabled={loading}
                                    >
                                        {loading ? 'Loading...' : 'Load More Products'}
                                    </button>
                                </div>
                            )}

                            {products.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-600">No products found matching your criteria.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;

