import React, { useState, useEffect } from "react";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";
import CalendarView from "@/components/organisms/CalendarView";
import FloatingActionButton from "@/components/organisms/FloatingActionButton";
import Modal from "@/components/molecules/Modal";
import AssignmentForm from "@/components/organisms/AssignmentForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const Calendar = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ]);
      
      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      setError("Failed to load calendar data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAssignment = async (assignmentData) => {
    try {
      const newAssignment = await assignmentService.create(assignmentData);
      setAssignments(prev => [...prev, newAssignment]);
      setShowAssignmentModal(false);
} catch (error) {
      console.error('Error adding assignment:', error);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Academic Calendar</h1>
        <p className="text-gray-600">View your assignments and course schedule</p>
      </div>

      {/* Calendar */}
      <CalendarView assignments={assignments} courses={courses} />

      {/* Floating Action Button */}
      {courses.length > 0 && (
        <FloatingActionButton 
          onClick={() => setShowAssignmentModal(true)}
          icon="Plus"
        />
      )}

      {/* Add Assignment Modal */}
      <Modal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        title="Add New Assignment"
        size="lg"
      >
        <AssignmentForm
          courses={courses}
          onSubmit={handleAddAssignment}
          onCancel={() => setShowAssignmentModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Calendar;