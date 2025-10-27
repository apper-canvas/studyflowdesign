import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { toast } from "react-toastify";
import { format } from "date-fns";

const AssignmentForm = ({ assignment, courses, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    dueDate: "",
    priority: "medium",
    status: "pending",
    weight: 10,
    grade: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title || "",
        description: assignment.description || "",
        courseId: assignment.courseId || "",
        dueDate: assignment.dueDate ? format(new Date(assignment.dueDate), "yyyy-MM-dd'T'HH:mm") : "",
        priority: assignment.priority || "medium",
        status: assignment.status || "pending",
        weight: assignment.weight || 10,
        grade: assignment.grade || ""
      });
    } else if (courses.length > 0) {
      setFormData(prev => ({
        ...prev,
        courseId: courses[0].Id.toString()
      }));
    }
  }, [assignment, courses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.courseId || !formData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
        weight: parseInt(formData.weight),
        grade: formData.grade ? parseFloat(formData.grade) : null
      };
      
      await onSubmit(submitData);
      toast.success(assignment ? "Assignment updated successfully!" : "Assignment created successfully!");
    } catch (error) {
      toast.error("Failed to save assignment");
    } finally {
      setLoading(false);
    }
  };

  if (courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">You need to create at least one course before adding assignments.</p>
        <Button onClick={onCancel}>Close</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Assignment Title *"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Programming Assignment 1"
            required
          />
        </div>

        <Select
          label="Course *"
          value={formData.courseId}
          onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
          required
        >
          <option value="">Select a course</option>
          {courses.map(course => (
            <option key={course.Id} value={course.Id.toString()}>
              {course.name} ({course.code})
            </option>
          ))}
        </Select>

        <Input
          label="Due Date & Time *"
          type="datetime-local"
          value={formData.dueDate}
          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
          required
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Assignment details..."
          rows={3}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Select
          label="Priority"
          value={formData.priority}
          onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>

        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </Select>

        <Input
          label="Weight (%)"
          type="number"
          min="1"
          max="100"
          value={formData.weight}
          onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
          placeholder="10"
        />
      </div>

      {formData.status === "completed" && (
        <Input
          label="Grade (%)"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={formData.grade}
          onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
          placeholder="85.5"
        />
      )}

      <div className="flex items-center justify-end space-x-3 pt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          {assignment ? "Update Assignment" : "Create Assignment"}
        </Button>
      </div>
    </form>
  );
};

export default AssignmentForm;