import React, { useState } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import '../styles/AttributeModal.css';

const AttributeModal = ({ onClose, onSave }) => {
    const { accessToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [attribute, setAttribute] = useState({
        name: '',
        description: ''
    });
    const [attributeValues, setAttributeValues] = useState(['']);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAttribute(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleValueChange = (index, value) => {
        const updatedValues = [...attributeValues];
        updatedValues[index] = value;
        setAttributeValues(updatedValues);
        
        // Clear error when user types
        if (errors[`value_${index}`]) {
            setErrors(prev => ({
                ...prev,
                [`value_${index}`]: null
            }));
        }
    };

    const addValueField = () => {
        setAttributeValues([...attributeValues, '']);
    };

    const removeValueField = (index) => {
        const updatedValues = [...attributeValues];
        updatedValues.splice(index, 1);
        setAttributeValues(updatedValues);
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!attribute.name.trim()) {
            newErrors.name = 'Attribute name is required';
        }
        
        attributeValues.forEach((value, index) => {
            if (!value.trim()) {
                newErrors[`value_${index}`] = 'Value cannot be empty';
            }
        });
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        
        try {
            setLoading(true);
            
            // Create the attribute
            const attributeResponse = await axios.post(
                'store/attributes/',
                {
                    name: attribute.name,
                    description: attribute.description || ''
                },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            
            const attributeId = attributeResponse.data.id;
            
            // Create all attribute values
            const valuePromises = attributeValues
                .filter(value => value.trim()) // Filter out empty values
                .map(value => 
                    axios.post(
                        `store/attributes/${attributeId}/values/`,
                        { value },
                        { headers: { Authorization: `Bearer ${accessToken}` } }
                    )
                );
            
            await Promise.all(valuePromises);
            
            toast.success('Attribute created successfully');
            
            // Return the created attribute with its values
            const createdAttribute = {
                ...attributeResponse.data,
                values: await Promise.all(valuePromises).then(responses => 
                    responses.map(res => res.data)
                )
            };
            
            onSave(createdAttribute);
        } catch (error) {
            console.error('Error creating attribute:', error);
            toast.error('Failed to create attribute');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="attribute-modal" onClick={onClose}>
            <div className="attribute-modal-content" onClick={e => e.stopPropagation()}>
                <div className="attribute-modal-header">
                    <h3>Create New Attribute</h3>
                    <button className="attribute-modal-close" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <div className="attribute-modal-body">
                    <div className="form-group">
                        <label>Attribute Name*</label>
                        <input
                            type="text"
                            name="name"
                            value={attribute.name}
                            onChange={handleInputChange}
                            className={`form-input ${errors.name ? 'error' : ''}`}
                            placeholder="e.g., Color, Size, Material"
                        />
                        {errors.name && <div className="error-message">{errors.name}</div>}
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={attribute.description}
                            onChange={handleInputChange}
                            className="form-textarea"
                            placeholder="Optional description of this attribute"
                            rows="2"
                        />
                    </div>

                    <div className="form-group">
                        <label>Attribute Values*</label>
                        <p className="help-text">Add possible values for this attribute (e.g., Red, Blue, Green for Color)</p>
                        
                        {attributeValues.map((value, index) => (
                            <div key={index} className="attribute-value-row">
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => handleValueChange(index, e.target.value)}
                                    className={`form-input ${errors[`value_${index}`] ? 'error' : ''}`}
                                    placeholder={`Value ${index + 1}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeValueField(index)}
                                    className="remove-value-btn"
                                    disabled={attributeValues.length === 1}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                                {errors[`value_${index}`] && <div className="error-message">{errors[`value_${index}`]}</div>}
                            </div>
                        ))}
                        
                        <button
                            type="button"
                            onClick={addValueField}
                            className="add-value-btn"
                        >
                            <i className="fas fa-plus"></i> Add Another Value
                        </button>
                    </div>
                </div>

                <div className="attribute-modal-footer">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-secondary"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i> Creating...
                            </>
                        ) : (
                            'Create Attribute'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttributeModal;
