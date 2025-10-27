import React, { useState } from 'react';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

function StudentForm({ onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: '',
    phone: '',
    parentContact: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.grade && (isNaN(formData.grade) || formData.grade < 0 || formData.grade > 12)) {
      newErrors.grade = 'Grade must be between 0 and 12';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter student name"
          className={errors.name ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="student@example.com"
          className={errors.email ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Grade
        </label>
        <Input
          type="number"
          name="grade"
          value={formData.grade}
          onChange={handleChange}
          placeholder="Enter grade (0-12)"
          min="0"
          max="12"
          className={errors.grade ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.grade && (
          <p className="text-red-500 text-sm mt-1">{errors.grade}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <Input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="(555) 123-4567"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Parent Contact
        </label>
        <Input
          name="parentContact"
          value={formData.parentContact}
          onChange={handleChange}
          placeholder="Parent name or contact info"
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <ApperIcon name="Loader2" size={16} className="animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <ApperIcon name="Plus" size={16} />
              Add Student
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default StudentForm;