import React, { useState, useEffect } from "react";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import CourseGrid from "@/components/organisms/CourseGrid";
import CourseDetail from "@/components/organisms/CourseDetail";
import FloatingActionButton from "@/components/organisms/FloatingActionButton";
import Modal from "@/components/molecules/Modal";
import CourseForm from "@/components/organisms/CourseForm";
import AssignmentForm from "@/components/organisms/AssignmentForm";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal states
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [viewingCourse, setViewingCourse] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await courseService.getAll();
      setCourses(data);
    } catch (err) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (courseData) => {
    try {
      const newCourse = await courseService.create(courseData);
      setCourses(prev => [...prev, newCourse]);
      setShowCourseModal(false);
      setEditingCourse(null);
    } catch (error) {
console.error('Error adding course:', error);
    }
  };

  const handleUpdateCourse = async (courseData) => {
    try {
      const updatedCourse = await courseService.update(editingCourse.Id, courseData);
      setCourses(prev => prev.map(c => c.Id === editingCourse.Id ? updatedCourse : c));
      setShowCourseModal(false);
      setEditingCourse(null);
      
      // Update viewing course if it's the same one being edited
      if (viewingCourse && viewingCourse.Id === editingCourse.Id) {
        setViewingCourse(updatedCourse);
      }
    } catch (error) {
console.error('Error updating course:', error);
    }
  };

  const handleDeleteCourse = async (course) => {
    if (!window.confirm(`Are you sure you want to delete "${course.name}"?`)) {
      return;
    }

    try {
      await courseService.delete(course.Id);
      setCourses(prev => prev.filter(c => c.Id !== course.Id));
      toast.success("Course deleted successfully");
      
      // Close detail view if deleted course was being viewed
      if (viewingCourse && viewingCourse.Id === course.Id) {
        setViewingCourse(null);
      }
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowCourseModal(true);
  };

  const handleViewDetails = (course) => {
    setViewingCourse(course);
  };

  const handleAddAssignment = (course) => {
    setSelectedCourse(course);
    setShowAssignmentModal(true);
  };

  const handleCreateAssignment = async (assignmentData) => {
    try {
      await assignmentService.create(assignmentData);
      setShowAssignmentModal(false);
      setSelectedCourse(null);
} catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleCloseModals = () => {
    setShowCourseModal(false);
    setShowAssignmentModal(false);
    setEditingCourse(null);
    setSelectedCourse(null);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCourses} />;

  // Show course detail view
  if (viewingCourse) {
    return (
      <CourseDetail
        course={viewingCourse}
        onEdit={handleEditCourse}
        onClose={() => setViewingCourse(null)}
        onAddAssignment={handleAddAssignment}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600">Manage your enrolled courses</p>
        </div>
        
        {courses.length > 0 && (
          <Button 
            onClick={() => setShowCourseModal(true)}
            icon="Plus"
          >
            Add Course
          </Button>
        )}
      </div>

      {/* Course Grid */}
      {courses.length === 0 ? (
        <Empty
          title="No courses yet"
          description="Start building your academic schedule by adding your first course."
          actionLabel="Add Course"
          onAction={() => setShowCourseModal(true)}
          icon="BookOpen"
        />
      ) : (
        <CourseGrid
          courses={courses}
          onEdit={handleEditCourse}
          onDelete={handleDeleteCourse}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Floating Action Button */}
      <FloatingActionButton 
        onClick={() => setShowCourseModal(true)}
        icon="Plus"
      />

      {/* Course Modal */}
      <Modal
        isOpen={showCourseModal}
        onClose={handleCloseModals}
        title={editingCourse ? "Edit Course" : "Add New Course"}
        size="lg"
      >
        <CourseForm
          course={editingCourse}
          onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}
          onCancel={handleCloseModals}
        />
      </Modal>

      {/* Assignment Modal */}
      <Modal
        isOpen={showAssignmentModal}
        onClose={handleCloseModals}
        title={`Add Assignment - ${selectedCourse?.name}`}
        size="lg"
      >
        <AssignmentForm
          courses={selectedCourse ? [selectedCourse] : courses}
          onSubmit={handleCreateAssignment}
          onCancel={handleCloseModals}
        />
      </Modal>
    </div>
  );
};

export default Courses;