import React, { useState, useEffect } from "react";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import DashboardStats from "@/components/organisms/DashboardStats";
import RecentActivity from "@/components/organisms/RecentActivity";
import FloatingActionButton from "@/components/organisms/FloatingActionButton";
import Modal from "@/components/molecules/Modal";
import AssignmentForm from "@/components/organisms/AssignmentForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
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
      
      const [coursesData, assignmentsData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll()
      ]);
      
      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError("Failed to load dashboard data");
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
      console.error('Error loading dashboard data:', error);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Welcome to StudyFlow
        </h1>
        <p className="text-gray-600">Manage your courses and assignments efficiently</p>
      </div>

      {/* Stats Cards */}
      <DashboardStats courses={courses} assignments={assignments} />

      {/* Recent Activity */}
      <RecentActivity assignments={assignments} courses={courses} />

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

export default Dashboard;