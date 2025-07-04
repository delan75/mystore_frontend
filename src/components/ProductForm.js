import React, { useState, useEffect, useRef } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import debounce from 'lodash/debounce';
import { useLocation, useNavigate } from 'react-router-dom';
import VariationModal from './VariationModal';
import AttributeModal from './AttributeModal';
import '../styles/ProductForm.css';

const ProductForm = () => {
    const { accessToken } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Product state
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        slug: '',
        sku: '',
        barcode: '',
        barcode_type: 'UPC',
        primary_image: null,
        primary_image_preview: null,
        gallery_images: [],
        gallery_previews: [],
        has_variations: false,
        variations: []
    });

    // UI state
    const [isDraft, setIsDraft] = useState(true);
    const [draftId, setDraftId] = useState(null);
    const [autoSaveStatus, setAutoSaveStatus] = useState('idle'); // 'idle', 'saving', 'saved', 'error'
    const [showVariationModal, setShowVariationModal] = useState(false);
    const [showAttributeModal, setShowAttributeModal] = useState(false);
    const [attributes, setAttributes] = useState([]);
    const [activeTab, setActiveTab] = useState('simple'); // 'simple' or 'advanced'
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [categoryError, setCategoryError] = useState(null);

    // Feature toggles
    const [enabledFeatures, setEnabledFeatures] = useState({
        barcode: false,
        gallery: false,
        variations: false
    });

    // Fetch categories when component mounts
    useEffect(() => {
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Toggle feature on/off
    const toggleFeature = (feature) => {
        setEnabledFeatures(prev => ({
            ...prev,
            [feature]: !prev[feature]
        }));
    };

    // Fetch categories from the backend
    const fetchCategories = async () => {
        try {
            setIsLoadingCategories(true);
            setCategoryError(null);

            // Use the store/categories/ endpoint to get all categories
            const response = await axios.get('store/categories/', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            // Get all categories from the response
            const allCategories = response.data.results || response.data;
            console.log('All categories:', allCategories);

            // Set the categories state with all categories
            setCategories(allCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategoryError('Failed to load categories. Please try again later.');
            toast.error('Failed to load categories');
        } finally {
            setIsLoadingCategories(false);
        }
    };

    // Generate slug from product name
    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-')     // Replace spaces with hyphens
            .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
            .trim();                  // Trim leading/trailing spaces
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        const updatedProduct = { ...product, [name]: newValue };

        // Auto-generate slug when product name changes
        if (name === 'name' && value) {
            updatedProduct.slug = generateSlug(value);
        }

        setProduct(updatedProduct);

        // Handle label animation
        const fieldWrap = e.target.closest('.field-wrap');
        const label = fieldWrap ? fieldWrap.querySelector('label') : null;

        if (label) {
            if (value === '') {
                label.classList.remove('active', 'highlight');
            } else {
                label.classList.add('active', 'highlight');
            }
        }

        if (isDraft) {
            setAutoSaveStatus('saving');
            debouncedSave(updatedProduct);
        }
    };

    // Handle input focus for label animation
    const handleInputFocus = (e) => {
        const fieldWrap = e.target.closest('.field-wrap');
        const label = fieldWrap ? fieldWrap.querySelector('label') : null;

        if (label) {
            label.classList.add('active');
        }
    };

    // Handle input blur for label animation
    const handleInputBlur = (e) => {
        const fieldWrap = e.target.closest('.field-wrap');
        const label = fieldWrap ? fieldWrap.querySelector('label') : null;

        if (label && e.target.value === '') {
            label.classList.remove('active', 'highlight');
        } else if (label) {
            label.classList.remove('highlight');
        }
    };

    // Handle primary image upload
    const handlePrimaryImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProduct({
                    ...product,
                    primary_image: file,
                    primary_image_preview: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle gallery images upload
    const handleGalleryImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newGalleryImages = [...product.gallery_images, ...files];

            // Create preview URLs for the new images
            const newPreviews = [];
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result);
                    if (newPreviews.length === files.length) {
                        setProduct({
                            ...product,
                            gallery_images: newGalleryImages,
                            gallery_previews: [...product.gallery_previews, ...newPreviews]
                        });
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    // Remove a gallery image
    const removeGalleryImage = (index) => {
        const updatedImages = [...product.gallery_images];
        const updatedPreviews = [...product.gallery_previews];

        updatedImages.splice(index, 1);
        updatedPreviews.splice(index, 1);

        setProduct({
            ...product,
            gallery_images: updatedImages,
            gallery_previews: updatedPreviews
        });
    };

    // Auto-save draft with debounce
    const debouncedSave = useRef(
        debounce(async (productData) => {
            try {
                if (!productData.name) {
                    return; // Don't save if name is empty
                }

                let url = 'store/products/draft/';
                let method = 'post';

                if (draftId) {
                    url = `store/products/draft/${draftId}/`;
                    method = 'put';
                }

                const response = await axios[method](url, productData, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                if (!draftId && response.data.id) {
                    setDraftId(response.data.id);
                }

                setAutoSaveStatus('saved');

                // Reset to idle after 2 seconds
                setTimeout(() => {
                    setAutoSaveStatus('idle');
                }, 2000);

            } catch (error) {
                console.error('Error auto-saving draft:', error);
                setAutoSaveStatus('error');
            }
        }, 1000)
    ).current;

    // Save as draft explicitly
    const saveDraft = async () => {
        try {
            setAutoSaveStatus('saving');

            let url = 'store/products/draft/';
            let method = 'post';

            if (draftId) {
                url = `store/products/draft/${draftId}/`;
                method = 'put';
            }

            const response = await axios[method](url, product, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (!draftId && response.data.id) {
                setDraftId(response.data.id);
            }

            // Upload primary image if exists
            if (product.primary_image && draftId) {
                const formData = new FormData();
                formData.append('image', product.primary_image);
                formData.append('is_primary', 'true');

                await axios.post(`store/products/${draftId}/images/`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            }

            // Upload gallery images if any
            if (product.gallery_images.length > 0 && draftId) {
                for (const image of product.gallery_images) {
                    const formData = new FormData();
                    formData.append('image', image);
                    formData.append('is_primary', 'false');

                    await axios.post(`store/products/${draftId}/images/`,
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    );
                }
            }

            setAutoSaveStatus('saved');
            toast.success('Draft saved successfully');

            // Reset to idle after 2 seconds
            setTimeout(() => {
                setAutoSaveStatus('idle');
            }, 2000);

        } catch (error) {
            console.error('Error saving draft:', error);
            setAutoSaveStatus('error');
            toast.error('Failed to save draft');
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        handlePublish();
    };

    // Publish product
    const handlePublish = async () => {
        try {
            // Validate required fields
            if (!product.name || !product.price || !product.category) {
                toast.error('Please fill in all required fields');
                return;
            }

            // If we already have a draft, publish it
            if (draftId) {
                await axios.post(`store/products/draft/${draftId}/publish/`, {}, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                toast.success('Product published successfully');
                setIsDraft(false);
                navigate('/products');
            } else {
                // Create a new draft first
                const response = await axios.post('store/products/draft/', product, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                const newDraftId = response.data.id;

                // Upload primary image if exists
                if (product.primary_image) {
                    const formData = new FormData();
                    formData.append('image', product.primary_image);
                    formData.append('is_primary', 'true');

                    await axios.post(`store/products/${newDraftId}/images/`,
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    );
                }

                // Now publish the draft
                await axios.post(`store/products/draft/${newDraftId}/publish/`, {}, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                toast.success('Product published successfully');
                setIsDraft(false);

                // Reset form and redirect to products page
                setProduct({
                    name: '',
                    description: '',
                    price: '',
                    category: '',
                    image_url: '',
                    is_available: false,
                    slug: '',
                    sku: '',
                    barcode: '',
                    barcode_type: 'UPC',
                    has_variations: false,
                    variations: []
                });
                setDraftId(null);
                navigate('/products');
            }
        } catch (error) {
            console.error('Error publishing product:', error);
            if (error.response?.data?.error) {
                toast.error(`Failed to publish: ${error.response.data.error}`);
            } else {
                toast.error('Failed to publish product. Please ensure all required fields are filled.');
            }
        }
    };

    return (
        <div className="product-form bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">
                {isDraft ? 'Create New Product (Draft)' : 'Create New Product'}
            </h2>

            {/* Auto-save indicator */}
            {isDraft && (
                <div className={`autosave-indicator ${autoSaveStatus}`}>
                    {autoSaveStatus === 'idle' && draftId && (
                        <><i className="fas fa-check-circle"></i> Draft saved</>
                    )}
                    {autoSaveStatus === 'saving' && (
                        <><i className="fas fa-spinner fa-spin"></i> Saving draft...</>
                    )}
                    {autoSaveStatus === 'saved' && (
                        <><i className="fas fa-check-circle"></i> Draft saved</>
                    )}
                    {autoSaveStatus === 'error' && (
                        <><i className="fas fa-exclamation-circle"></i> Error saving draft</>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="product-form-tabs">
                    <div
                        className={`product-form-tab ${activeTab === 'simple' ? 'active' : ''}`}
                        onClick={() => setActiveTab('simple')}
                    >
                        Simple Product
                    </div>
                    <div
                        className={`product-form-tab ${activeTab === 'advanced' ? 'active' : ''}`}
                        onClick={() => setActiveTab('advanced')}
                    >
                        Advanced Features
                    </div>
                </div>

                {/* Simple Product Tab */}
                <div className={`product-form-tab-content ${activeTab === 'simple' ? 'active' : ''}`}>
                    <section>
                        <div className="product-form-row">
                            {/* Left Column */}
                            <div className="product-form-column">
                                <div className="field-wrap">
                                    <label className={product.name ? 'active' : ''}>
                                        Product Name<span className="req">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={product.name}
                                        onChange={handleInputChange}
                                        onFocus={handleInputFocus}
                                        onBlur={handleInputBlur}
                                        className="form-input block w-full"
                                        required
                                    />
                                </div>

                                <div className="field-wrap">
                                    <label className={product.price ? 'active' : ''}>
                                        Price<span className="req">*</span>
                                    </label>
                                    <div className="relative">
                                        {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">R</span>
                                        </div> */}
                                        <input
                                            type="number"
                                            name="price"
                                            value={product.price}
                                            onChange={handleInputChange}
                                            onFocus={handleInputFocus}
                                            onBlur={handleInputBlur}
                                            className="form-input block w-full pl-7"
                                            step="0.01"
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="field-wrap">
                                    <label className={product.category ? 'active' : ''}>
                                        Select Category<span className="req">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={product.category}
                                        onChange={handleInputChange}
                                        onFocus={handleInputFocus}
                                        onBlur={handleInputBlur}
                                        className="form-select block w-full"
                                        required
                                        disabled={isLoadingCategories}
                                    >
                                        <option value="" disabled>
                                            {isLoadingCategories ? 'Loading categories...' : ''}
                                        </option>
                                        {categories.length > 0 ? (
                                            categories.map((category) => (
                                                <option key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </option>
                                            ))
                                        ) : (
                                            categoryError ? (
                                                <option value="" disabled>Error loading categories</option>
                                            ) : null
                                        )}
                                    </select>
                                    {categoryError && (
                                        <p className="text-xs text-red-500 mt-1">{categoryError}</p>
                                    )}
                                </div>

                                <div className="field-wrap">
                                    <label className={product.slug ? 'active' : ''}>
                                        Slug
                                    </label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={product.slug}
                                        onChange={handleInputChange}
                                        onFocus={handleInputFocus}
                                        onBlur={handleInputBlur}
                                        className="form-input block w-full"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Used in product URLs (auto-generated from product name)
                                    </p>
                                </div>
                            </div>

                            {/* Right Column - Images */}
                            <div className="product-form-column">
                                <div className="image-field-wrap">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Primary Product Image</p>
                                    <div className="file-input-container">
                                        <input
                                            type="file"
                                            id="primary-image"
                                            accept="image/*"
                                            onChange={handlePrimaryImageChange}
                                            className="file-input"
                                        />
                                        <label htmlFor="primary-image" className="file-input-label">
                                            <div className="upload-icon">
                                                <i className="fas fa-cloud-upload-alt"></i>
                                            </div>
                                            <div className="upload-text">
                                                {product.primary_image ? 'Change Image' : 'Select Image'}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                This will be set as the primary product image
                                            </p>
                                        </label>
                                    </div>
                                </div>

                                {product.primary_image_preview && (
                                    <div className="image-preview-container">
                                        <div className="image-preview-item">
                                            <img
                                                src={product.primary_image_preview}
                                                alt="Primary product"
                                            />
                                            <button
                                                type="button"
                                                className="image-preview-remove"
                                                onClick={() => {
                                                    setProduct({
                                                        ...product,
                                                        primary_image: null,
                                                        primary_image_preview: null
                                                    });
                                                }}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="product-form-row">
                            <div className="product-form-column full-width">
                                <div className="field-wrap">
                                    <label className={product.description ? 'active' : ''}>
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={product.description}
                                        onChange={handleInputChange}
                                        onFocus={handleInputFocus}
                                        onBlur={handleInputBlur}
                                        className="form-textarea block w-full"
                                        rows="4"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Advanced Features Tab */}
                <div className={`product-form-tab-content ${activeTab === 'advanced' ? 'active' : ''}`}>
                    <section>
                        <div className="product-form-row">
                            <div className="product-form-column">
                                {/* SKU Feature (always visible) */}
                                <div className="field-wrap">
                                    <label className={product.sku ? 'active' : ''}>
                                        SKU (Stock Keeping Unit)
                                    </label>
                                    <input
                                        type="text"
                                        name="sku"
                                        value={product.sku}
                                        onChange={handleInputChange}
                                        onFocus={handleInputFocus}
                                        onBlur={handleInputBlur}
                                        className="form-input block w-full"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        SKU will be auto-generated by the backend if not provided
                                    </p>
                                </div>

                                {/* Barcode Feature */}
                                <div className="mb-4">
                                    <div className="checkbox-wrap mb-2">
                                        <input
                                            type="checkbox"
                                            id="enable-barcode"
                                            checked={enabledFeatures.barcode}
                                            onChange={() => toggleFeature('barcode')}
                                        />
                                        <label htmlFor="enable-barcode">Enable Barcode</label>
                                    </div>

                                    {enabledFeatures.barcode && (
                                        <div className="pl-6 border-l-2 border-indigo-100">
                                            <div className="field-wrap">
                                                <label className={product.barcode ? 'active' : ''}>
                                                    Barcode
                                                </label>
                                                <input
                                                    type="text"
                                                    name="barcode"
                                                    value={product.barcode}
                                                    onChange={handleInputChange}
                                                    onFocus={handleInputFocus}
                                                    onBlur={handleInputBlur}
                                                    className="form-input block w-full"
                                                />
                                            </div>
                                            <div className="field-wrap">
                                                <label className={product.barcode_type ? 'active' : ''}>
                                                    Barcode Type
                                                </label>
                                                <select
                                                    name="barcode_type"
                                                    value={product.barcode_type}
                                                    onChange={handleInputChange}
                                                    onFocus={handleInputFocus}
                                                    onBlur={handleInputBlur}
                                                    className="form-select block w-full"
                                                >
                                                    <option value="UPC">UPC</option>
                                                    <option value="EAN">EAN</option>
                                                    <option value="ISBN">ISBN</option>
                                                    <option value="QR">QR</option>
                                                    <option value="OTHER">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="product-form-column">
                                {/* Image Gallery Feature */}
                                <div className="mb-4">
                                    <div className="checkbox-wrap mb-2">
                                        <input
                                            type="checkbox"
                                            id="enable-gallery"
                                            checked={enabledFeatures.gallery}
                                            onChange={() => toggleFeature('gallery')}
                                        />
                                        <label htmlFor="enable-gallery">Enable Image Gallery</label>
                                    </div>

                                    <p className="text-xs text-gray-500 mb-2">
                                        Allow multiple product images to be displayed in a gallery
                                    </p>
                                </div>

                                {enabledFeatures.gallery && (
                                    <div className="image-field-wrap mt-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Product Gallery Images</p>
                                        <div className="file-input-container">
                                            <input
                                                type="file"
                                                id="gallery-images"
                                                accept="image/*"
                                                onChange={handleGalleryImagesChange}
                                                className="file-input"
                                                multiple
                                            />
                                            <label htmlFor="gallery-images" className="file-input-label">
                                                <div className="upload-icon">
                                                    <i className="fas fa-images"></i>
                                                </div>
                                                <div className="upload-text">
                                                    Add Gallery Images
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Add multiple images to showcase your product
                                                </p>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {product.gallery_previews.length > 0 && (
                                    <div className="image-preview-container">
                                        {product.gallery_previews.map((preview, index) => (
                                            <div key={index} className="image-preview-item">
                                                <img
                                                    src={preview}
                                                    alt={`Gallery ${index + 1}`}
                                                />
                                                <button
                                                    type="button"
                                                    className="image-preview-remove"
                                                    onClick={() => removeGalleryImage(index)}
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Form Actions */}
                <div className="form-actions mt-6">
                    <div>
                        {isDraft && draftId && (
                            <span className="text-sm text-gray-500">
                                Draft ID: {draftId}
                            </span>
                        )}
                    </div>
                    <div className="form-actions-right">
                        {isDraft && (
                            <button
                                type="button"
                                onClick={saveDraft}
                                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
                            >
                                Save as Draft
                            </button>
                        )}
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                        >
                            Publish Product
                        </button>
                    </div>
                </div>
            </form>

            {/* Modals */}
            {showVariationModal && (
                <VariationModal
                    productId={draftId}
                    onClose={() => setShowVariationModal(false)}
                    onSave={(newVariation) => {
                        const updatedVariations = [...product.variations, newVariation];
                        setProduct({...product, variations: updatedVariations});
                        setShowVariationModal(false);
                    }}
                    attributes={attributes}
                />
            )}

            {/* Attribute Modal */}
            {showAttributeModal && (
                <AttributeModal
                    onClose={() => setShowAttributeModal(false)}
                    onSave={(newAttribute) => {
                        setAttributes([...attributes, newAttribute]);
                        setShowAttributeModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default ProductForm;
