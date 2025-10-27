import React, { useState, useEffect } from "react";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";
import AssignmentTable from "@/components/organisms/AssignmentTable";
import FloatingActionButton from "@/components/organisms/FloatingActionButton";
import Modal from "@/components/molecules/Modal";
import AssignmentForm from "@/components/organisms/AssignmentForm";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal states
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

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
      setError("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (assignmentData) => {
    try {
      const newAssignment = await assignmentService.create(assignmentData);
      setAssignments(prev => [...prev, newAssignment]);
      setShowAssignmentModal(false);
      setEditingAssignment(null);
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateAssignment = async (assignmentData) => {
    try {
      const updatedAssignment = await assignmentService.update(editingAssignment.Id, assignmentData);
      setAssignments(prev => 
        prev.map(a => a.Id === editingAssignment.Id ? updatedAssignment : a)
      );
      setShowAssignmentModal(false);
      setEditingAssignment(null);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteAssignment = async (assignment) => {
    if (!window.confirm(`Are you sure you want to delete "${assignment.title}"?`)) {
      return;
    }

    try {
      await assignmentService.delete(assignment.Id);
      setAssignments(prev => prev.filter(a => a.Id !== assignment.Id));
      toast.success("Assignment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete assignment");
    }
  };

  const handleToggleStatus = async (assignment) => {
    try {
      const newStatus = assignment.status === "pending" ? "completed" : "pending";
      const updatedAssignment = await assignmentService.update(assignment.Id, {
        status: newStatus
      });
      
      setAssignments(prev => 
        prev.map(a => a.Id === assignment.Id ? updatedAssignment : a)
      );
      
      toast.success(`Assignment marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update assignment status");
    }
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setShowAssignmentModal(true);
  };

  const handleCloseModal = () => {
    setShowAssignmentModal(false);
    setEditingAssignment(null);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600">Track and manage all your assignments</p>
        </div>
        
        {assignments.length > 0 && courses.length > 0 && (
          <Button 
            onClick={() => setShowAssignmentModal(true)}
            icon="Plus"
          >
            Add Assignment
          </Button>
        )}
      </div>

      {/* Assignments Table */}
      {assignments.length === 0 ? (
        <Empty
          title="No assignments yet"
          description={courses.length === 0 ? 
            "You need to create courses first before adding assignments." : 
            "Start by adding your first assignment to track your academic progress."
          }
          actionLabel={courses.length === 0 ? "Go to Courses" : "Add Assignment"}
          onAction={() => {
            if (courses.length === 0) {
              window.location.href = "/courses";
            } else {
              setShowAssignmentModal(true);
            }
          }}
          icon="FileText"
        />
      ) : (
        <AssignmentTable
          assignments={assignments}
          courses={courses}
          onEdit={handleEditAssignment}
          onDelete={handleDeleteAssignment}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Floating Action Button */}
      {courses.length > 0 && (
        <FloatingActionButton 
          onClick={() => setShowAssignmentModal(true)}
          icon="Plus"
        />
      )}

      {/* Assignment Modal */}
      <Modal
        isOpen={showAssignmentModal}
        onClose={handleCloseModal}
        title={editingAssignment ? "Edit Assignment" : "Add New Assignment"}
        size="lg"
      >
        <AssignmentForm
          assignment={editingAssignment}
          courses={courses}
          onSubmit={editingAssignment ? handleUpdateAssignment : handleCreateAssignment}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default Assignments;