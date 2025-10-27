import React, { useEffect, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

function StudentForm({ onSubmit, onCancel, isLoading, initialStudent }) {
const [formData, setFormData] = useState({
    name_c: '',
    email_c: '',
    phone_c: '',
    major_c: '',
    year_c: '',
    gpa_c: '',
    enrollment_date_c: ''
  });

  useEffect(() => {
if (initialStudent) {
      setFormData({
        name_c: initialStudent.name_c || '',
        email_c: initialStudent.email_c || '',
        phone_c: initialStudent.phone_c || '',
        major_c: initialStudent.major_c || '',
        year_c: initialStudent.year_c || '',
        gpa_c: initialStudent.gpa_c || '',
        enrollment_date_c: initialStudent.enrollment_date_c || ''
      });
    }
  }, [initialStudent]);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

if (!formData.name_c.trim()) {
      newErrors.name_c = 'Name is required';
    }

    if (!formData.email_c.trim()) {
      newErrors.email_c = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_c)) {
      newErrors.email_c = 'Please enter a valid email address';
    }

    if (formData.year_c && (isNaN(formData.year_c) || formData.year_c < 1 || formData.year_c > 4)) {
      newErrors.year_c = 'Year must be between 1 and 4';
    }
    if (formData.gpa_c && (isNaN(formData.gpa_c) || formData.gpa_c < 0 || formData.gpa_c > 4)) {
      newErrors.gpa_c = 'GPA must be between 0.0 and 4.0';
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
value={formData.name_c}
          onChange={handleChange}
          placeholder="Enter student name"
          className={errors.name_c ? 'border-red-500' : ''}
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
name="email_c"
          value={formData.email_c}
          onChange={handleChange}
          placeholder="student@example.com"
          className={errors.email_c ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

<div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <Input
type="tel"
          name="phone_c"
          value={formData.phone_c}
          onChange={handleChange}
          placeholder="(555) 123-4567"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Major
        </label>
        <Input
name="major_c"
          value={formData.major_c}
          onChange={handleChange}
          placeholder="e.g., Computer Science"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Year
        </label>
        <Input
          type="number"
          name="year"
value={formData.year_c}
          onChange={handleChange}
          placeholder="1-4"
          min="1"
          max="4"
          className={errors.year_c ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.year && (
          <p className="text-red-500 text-sm mt-1">{errors.year}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          GPA
        </label>
        <Input
          type="number"
          name="gpa"
value={formData.gpa_c}
          onChange={handleChange}
          placeholder="0.0-4.0"
          min="0"
          max="4"
          step="0.01"
          className={errors.gpa_c ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.gpa && (
          <p className="text-red-500 text-sm mt-1">{errors.gpa}</p>
        )}
      </div>

<div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Enrollment Date
        </label>
        <Input
          type="date"
name="enrollment_date_c"
          value={formData.enrollment_date_c}
          onChange={handleChange}
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
              Saving...
            </>
          ) : (
            <>
              <ApperIcon name="Save" size={16} />
              Save
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default StudentForm;