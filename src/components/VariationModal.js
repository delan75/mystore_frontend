import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import AttributeModal from './AttributeModal';

const VariationModal = ({ onClose, onSave, productId }) => {
    const { accessToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [attributes, setAttributes] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState([]);
    const [price, setPrice] = useState('');
    const [sku, setSku] = useState('');
    const [stock, setStock] = useState(0);
    const [barcode, setBarcode] = useState('');
    const [barcodeType, setBarcodeType] = useState('UPC');
    const [showAttributeModal, setShowAttributeModal] = useState(false);
    const [variationPreview, setVariationPreview] = useState({});

    // Fetch available attributes when modal opens
    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                setLoading(true);
                const response = await axios.get('store/attributes/', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                // For each attribute, fetch its values
                const attributesWithValues = await Promise.all(
                    response.data.map(async (attribute) => {
                        const valuesResponse = await axios.get(`store/attributes/${attribute.id}/values/`, {
                            headers: { Authorization: `Bearer ${accessToken}` }
                        });
                        return {
                            ...attribute,
                            values: valuesResponse.data
                        };
                    })
                );

                setAttributes(attributesWithValues);

                // Initialize selectedAttributes with the first attribute if available
                if (attributesWithValues.length > 0) {
                    setSelectedAttributes([{
                        attributeId: attributesWithValues[0].id,
                        valueId: null
                    }]);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching attributes:', error);
                toast.error('Failed to load attributes');
                setLoading(false);
            }
        };

        fetchAttributes();
    }, [accessToken]);

    const handleAttributeSelect = (index, attributeId) => {
        const updatedAttributes = [...selectedAttributes];
        updatedAttributes[index].attributeId = attributeId;
        updatedAttributes[index].valueId = null; // Reset value when attribute changes
        setSelectedAttributes(updatedAttributes);

        // Update variation preview (will clear the value for this attribute)
        updateVariationPreview(updatedAttributes);
    };

    // Handle saving a new attribute
    const handleAttributeSave = (newAttribute) => {
        setAttributes([...attributes, newAttribute]);
        setShowAttributeModal(false);
        toast.success(`Attribute "${newAttribute.name}" created with ${newAttribute.values.length} values`);
    };

    const handleValueSelect = (index, valueId) => {
        const updatedAttributes = [...selectedAttributes];
        updatedAttributes[index].valueId = valueId;
        setSelectedAttributes(updatedAttributes);

        // Update variation preview
        updateVariationPreview(updatedAttributes);
    };

    // Update the variation preview based on selected attributes
    const updateVariationPreview = (selectedAttrs = selectedAttributes) => {
        const preview = {};

        selectedAttrs.forEach(attr => {
            if (attr.attributeId && attr.valueId) {
                const attribute = attributes.find(a => a.id === attr.attributeId);
                if (attribute) {
                    const value = attribute.values.find(v => v.id === attr.valueId);
                    if (value) {
                        preview[attribute.name] = value.value;
                    }
                }
            }
        });

        setVariationPreview(preview);
    };

    const addAttributeSelection = () => {
        // Find an attribute that hasn't been selected yet
        const usedAttributeIds = selectedAttributes.map(attr => attr.attributeId);
        const availableAttributes = attributes.filter(attr => !usedAttributeIds.includes(attr.id));

        if (availableAttributes.length > 0) {
            setSelectedAttributes([
                ...selectedAttributes,
                {
                    attributeId: availableAttributes[0].id,
                    valueId: null
                }
            ]);
        } else {
            toast.info('All available attributes have been added');
        }
    };

    const removeAttributeSelection = (index) => {
        const updatedAttributes = [...selectedAttributes];
        updatedAttributes.splice(index, 1);
        setSelectedAttributes(updatedAttributes);
    };

    const handleSubmit = () => {
        // Validate that all attributes have values selected
        const hasEmptyValues = selectedAttributes.some(attr => !attr.valueId);
        if (hasEmptyValues) {
            toast.error('Please select values for all attributes');
            return;
        }

        // Create variation object
        const variation = {
            price: price || null,
            stock: stock || 0,
            sku: sku || null,
            is_active: true,
            attribute_values: selectedAttributes.map(attr => attr.valueId),
            barcode: barcode || null,
            barcode_type: barcodeType || 'UPC'
        };

        onSave(variation);
    };

    return (
        <div className="variation-modal" onClick={onClose}>
            <div className="variation-modal-content" onClick={e => e.stopPropagation()}>
                <div className="variation-modal-header">
                    <h3>Add Product Variation</h3>
                    <button className="variation-modal-close" onClick={onClose}>
                        &times;
                    </button>
                </div>

                {loading ? (
                    <div className="p-4 flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : (
                    <div className="p-4">
                        {attributes.length === 0 ? (
                            <div className="text-center py-4">
                                <p className="text-gray-500 mb-4">No attributes found. Please create attributes first.</p>
                                <button
                                    type="button"
                                    onClick={() => setShowAttributeModal(true)}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <i className="fas fa-plus mr-1"></i> Create New Attribute
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-sm font-medium text-gray-700">Variation Attributes</h4>
                                        <button
                                            type="button"
                                            onClick={() => setShowAttributeModal(true)}
                                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <i className="fas fa-plus mr-1"></i> New Attribute
                                        </button>
                                    </div>

                                    {/* Variation Preview */}
                                    {Object.keys(variationPreview).length > 0 && (
                                        <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
                                            <h5 className="text-xs font-medium text-gray-500 mb-2">VARIATION PREVIEW</h5>
                                            <div className="flex flex-wrap gap-1">
                                                {Object.entries(variationPreview).map(([key, value]) => (
                                                    <span key={key} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {key}: {value}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedAttributes.map((selectedAttr, index) => (
                                        <div key={index} className="flex space-x-2 mb-2">
                                            <div className="flex-1">
                                                <select
                                                    value={selectedAttr.attributeId || ''}
                                                    onChange={(e) => handleAttributeSelect(index, parseInt(e.target.value))}
                                                    className="form-select block w-full"
                                                    disabled={selectedAttributes.length > 1 && index < selectedAttributes.length - 1}
                                                >
                                                    <option value="" disabled>Select Attribute</option>
                                                    {attributes.map(attr => (
                                                        <option
                                                            key={attr.id}
                                                            value={attr.id}
                                                            disabled={selectedAttributes.some(
                                                                (sa, i) => i !== index && sa.attributeId === attr.id
                                                            )}
                                                        >
                                                            {attr.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex-1">
                                                <select
                                                    value={selectedAttr.valueId || ''}
                                                    onChange={(e) => handleValueSelect(index, parseInt(e.target.value))}
                                                    className="form-select block w-full"
                                                    disabled={!selectedAttr.attributeId}
                                                >
                                                    <option value="" disabled>Select Value</option>
                                                    {selectedAttr.attributeId &&
                                                        attributes
                                                            .find(attr => attr.id === selectedAttr.attributeId)?.values
                                                            .map(val => (
                                                                <option key={val.id} value={val.id}>
                                                                    {val.value}
                                                                </option>
                                                            ))
                                                    }
                                                </select>
                                            </div>
                                            <div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeAttributeSelection(index)}
                                                    className="text-red-600 hover:text-red-900"
                                                    disabled={selectedAttributes.length === 1}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {selectedAttributes.length < attributes.length && (
                                        <button
                                            type="button"
                                            onClick={addAttributeSelection}
                                            className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <i className="fas fa-plus mr-1"></i> Add Attribute
                                        </button>
                                    )}
                                </div>

                                <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Variation Details</h4>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">$</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    className="form-input block w-full pl-7"
                                                    placeholder="0.00"
                                                    step="0.01"
                                                    min="0"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Leave empty to use main product price
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                                            <input
                                                type="text"
                                                value={sku}
                                                onChange={(e) => setSku(e.target.value)}
                                                className="form-input block w-full"
                                                placeholder="Variation SKU (optional)"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Auto-generated if left empty
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                                            <input
                                                type="number"
                                                value={stock}
                                                onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                                                className="form-input block w-full"
                                                placeholder="0"
                                                min="0"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Number of items in stock
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Barcode (Optional)</label>
                                            <div className="flex space-x-2">
                                                <input
                                                    type="text"
                                                    value={barcode}
                                                    onChange={(e) => setBarcode(e.target.value)}
                                                    className="form-input block w-full"
                                                    placeholder="Barcode number"
                                                />
                                                <select
                                                    value={barcodeType}
                                                    onChange={(e) => setBarcodeType(e.target.value)}
                                                    className="form-select"
                                                >
                                                    <option value="UPC">UPC</option>
                                                    <option value="EAN">EAN</option>
                                                    <option value="ISBN">ISBN</option>
                                                    <option value="QR">QR</option>
                                                    <option value="OTHER">Other</option>
                                                </select>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                For inventory tracking
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {!loading && attributes.length > 0 && (
                    <div className="variation-modal-footer">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Add Variation
                        </button>
                    </div>
                )}
            </div>

            {/* Attribute Modal */}
            {showAttributeModal && (
                <AttributeModal
                    onClose={() => setShowAttributeModal(false)}
                    onSave={handleAttributeSave}
                />
            )}
        </div>
    );
};

export default VariationModal;
