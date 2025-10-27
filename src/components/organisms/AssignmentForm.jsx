import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const AssignmentForm = ({ assignment, courses, onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
title_c: "",
    description_c: "",
    course_id_c: "",
    due_date_c: "",
    priority_c: "medium",
    status_c: "pending",
    weight_c: 10,
    grade_c: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assignment) {
      setFormData({
title_c: assignment.title_c || "",
        description_c: assignment.description_c || "",
        course_id_c: assignment.course_id_c || "",
        due_date_c: assignment.due_date_c ? format(new Date(assignment.due_date_c), "yyyy-MM-dd'T'HH:mm") : "",
        priority_c: assignment.priority_c || "medium",
        status_c: assignment.status_c || "pending",
        weight_c: assignment.weight_c || 10,
        grade_c: assignment.grade_c || ""
      });
    }
  }, [assignment, courses]);

useEffect(() => {
    if (courses.length > 0 && !formData.course_id_c) {
      setFormData(prev => ({
        ...prev,
        course_id_c: courses[0].Id.toString()
      }));
    }
  }, [courses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
if (!formData.title_c.trim() || !formData.course_id_c || !formData.due_date_c) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        due_date_c: new Date(formData.due_date_c).toISOString(),
        weight_c: parseInt(formData.weight_c),
        grade_c: formData.grade_c ? parseFloat(formData.grade_c) : null
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
value={formData.title_c}
            onChange={(e) => setFormData(prev => ({ ...prev, title_c: e.target.value }))}
            placeholder="Midterm Essay"
            required
          />
        </div>

        <Select
          label="Course *"
          value={formData.course_id_c}
          onChange={(e) => setFormData(prev => ({ ...prev, course_id_c: e.target.value }))}
          disabled={courses.length === 0}
        >
          {courses.length === 0 ? (
            <option value="">No courses available</option>
          ) : (
            courses.map(course => (
              <option key={course.Id} value={course.Id}>
              {course.name_c} ({course.code_c})
            </option>
            ))
          )}
        </Select>

        <Input
          label="Due Date *"
          type="datetime-local"
          value={formData.due_date_c}
          onChange={(e) => setFormData(prev => ({ ...prev, due_date_c: e.target.value }))}
          required
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            rows="4"
          value={formData.description_c}
            onChange={(e) => setFormData(prev => ({ ...prev, description_c: e.target.value }))}
            placeholder="Assignment details and requirements..."
          />
        </div>

<Select
          label="Priority"
          value={formData.priority_c}
          onChange={(e) => setFormData(prev => ({ ...prev, priority_c: e.target.value }))}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Select
label="Status"
          value={formData.status_c}
          onChange={(e) => setFormData(prev => ({ ...prev, status_c: e.target.value }))}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </Select>

        <Input
          label="Weight (%)"
          type="number"
          min="1"
          max="100"
value={formData.weight_c}
          onChange={(e) => setFormData(prev => ({ ...prev, weight_c: e.target.value }))}
        />
      </div>
      </div>

      {/* Grade Input - Only show if status is completed */}
      {formData.status_c === "completed" && (
        <Input
          label="Grade (%)"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={formData.grade_c}
          onChange={(e) => setFormData(prev => ({ ...prev, grade_c: e.target.value }))}
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