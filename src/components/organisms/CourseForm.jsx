import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { toast } from "react-toastify";

const CourseForm = ({ course, onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
    name_c: "",
    code_c: "",
    instructor_c: "",
    color_c: "#6366f1",
    credits_c: 3,
    semester_c: "Fall 2024",
    schedule_c: [{ day: "Monday", time: "10:00 AM - 11:30 AM" }]
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
if (course) {
      setFormData({
        name_c: course.name_c || "",
        code_c: course.code_c || "",
        instructor_c: course.instructor_c || "",
        color_c: course.color_c || "#6366f1",
        credits_c: course.credits_c || 3,
        semester_c: course.semester_c || "Fall 2024",
        schedule_c: course.schedule_c || [{ day: "Monday", time: "10:00 AM - 11:30 AM" }]
      });
    }
  }, [course]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      toast.success(course ? "Course updated successfully!" : "Course created successfully!");
    } catch (error) {
      toast.error("Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setFormData(prev => ({ ...prev, schedule: newSchedule }));
  };

  const addScheduleSlot = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, { day: "Monday", time: "10:00 AM - 11:30 AM" }]
    }));
  };

  const removeScheduleSlot = (index) => {
    if (formData.schedule.length > 1) {
      setFormData(prev => ({
        ...prev,
        schedule: prev.schedule.filter((_, i) => i !== index)
      }));
    }
  };

  const colorOptions = [
    { value: "#6366f1", label: "Indigo" },
    { value: "#8b5cf6", label: "Purple" },
    { value: "#ec4899", label: "Pink" },
    { value: "#10b981", label: "Green" },
    { value: "#f59e0b", label: "Yellow" },
    { value: "#3b82f6", label: "Blue" },
    { value: "#ef4444", label: "Red" },
    { value: "#6b7280", label: "Gray" }
  ];

  const dayOptions = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  const semesterOptions = [
    "Fall 2024", "Spring 2025", "Summer 2025", "Fall 2025"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Course Name *"
value={formData.name_c}
          onChange={(e) => setFormData(prev => ({ ...prev, name_c: e.target.value }))}
          placeholder="e.g., Computer Science Fundamentals"
          required
        />

        <Input
label="Course Code *"
          value={formData.code_c}
          onChange={(e) => setFormData(prev => ({ ...prev, code_c: e.target.value }))}
          placeholder="e.g., CS 101"
          required
        />
      </div>

      <Input
label="Instructor"
        value={formData.instructor_c}
        onChange={(e) => setFormData(prev => ({ ...prev, instructor_c: e.target.value }))}
        placeholder="e.g., Dr. Sarah Johnson"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Color
          </label>
          <div className="flex items-center space-x-3">
            <div 
className="w-10 h-10 rounded-lg border-2 border-gray-200"
              style={{ backgroundColor: formData.color_c }}
            />
            <Select
              value={formData.color_c}
              onChange={(e) => setFormData(prev => ({ ...prev, color_c: e.target.value }))}
            >
              {colorOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <Select
label="Credits"
          value={formData.credits_c}
          onChange={(e) => setFormData(prev => ({ ...prev, credits_c: parseInt(e.target.value) }))}
        >
          {[1, 2, 3, 4, 5, 6].map(credit => (
            <option key={credit} value={credit}>{credit}</option>
          ))}
        </Select>

        <Select
label="Semester"
          value={formData.semester_c}
          onChange={(e) => setFormData(prev => ({ ...prev, semester_c: e.target.value }))}
        >
          {semesterOptions.map(semester => (
            <option key={semester} value={semester}>{semester}</option>
          ))}
        </Select>
      </div>

      {/* Schedule Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Class Schedule
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addScheduleSlot}
            icon="Plus"
          >
            Add Time Slot
          </Button>
        </div>
        
        <div className="space-y-3">
{formData.schedule_c.map((slot, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Select
                value={slot.day}
                onChange={(e) => handleScheduleChange(index, "day", e.target.value)}
                className="flex-1"
              >
                {dayOptions.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </Select>
              
              <Input
                value={slot.time}
                onChange={(e) => handleScheduleChange(index, "time", e.target.value)}
                placeholder="10:00 AM - 11:30 AM"
                className="flex-2"
              />
              
              {formData.schedule.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeScheduleSlot(index)}
                  icon="X"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                />
              )}
            </div>
          ))}
        </div>
      </div>

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
          {course ? "Update Course" : "Create Course"}
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;