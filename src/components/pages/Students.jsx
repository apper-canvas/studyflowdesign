import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { studentService } from "@/services/api/studentService";
import StudentForm from "@/components/organisms/StudentForm";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import FloatingActionButton from "@/components/organisms/FloatingActionButton";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Modal from "@/components/molecules/Modal";

function Students() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [expandedStudent, setExpandedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    major: '',
    year: '',
    gpa: '',
    enrollmentDate: ''
  });

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    let filtered = students;
    
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s?.major?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedGrade !== 'all') {
      filtered = filtered.filter(s => s?.year === selectedGrade);
    }
    
    setFilteredStudents(filtered);
  }, [searchTerm, selectedGrade, students]);

  async function loadStudents() {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getAll();
      setStudents(data || []);
      setFilteredStudents(data || []);
    } catch (err) {
      setError(err?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }

const handleOpenModal = (student = null) => {
if (student) {
      setEditingStudent(student);
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        major: student.major || '',
        year: student.year || '',
        gpa: student.gpa || '',
        enrollmentDate: student.enrollmentDate || ''
      });
    } else {
      setEditingStudent(null);
setFormData({
        name: '',
        email: '',
        phone: '',
        major: '',
        year: '',
        gpa: '',
        enrollmentDate: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setFormData({
name: '',
      email: '',
      phone: '',
      major: '',
      year: '',
      gpa: '',
      enrollmentDate: ''
    });
  };

const handleSubmitStudent = async (studentData) => {
    setIsSubmitting(true);
    try {
      if (editingStudent) {
if (!editingStudent?.Id) {
          toast.error('Invalid student data - missing ID');
          return;
        }
        const updated = await studentService.update(editingStudent.Id, studentData);
        setStudents(prev => prev.map(s => 
          s.Id === editingStudent.Id ? { ...s, ...updated, Id: editingStudent.Id } : s
        ));
        toast.success('Student updated successfully');
      } else {
        const newStudent = await studentService.create(studentData);
        setStudents(prev => [...prev, newStudent]);
        toast.success('Student added successfully');
      }
      handleCloseModal();
    } catch (err) {
      const errorMessage = err?.message || 'Failed to save student';
      toast.error(errorMessage);
      console.error('Student save error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

async function handleDelete(id) {
    if (!id) {
      toast.error('Invalid student ID');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      await studentService.delete(id);
      setStudents(prev => prev.filter(s => s.Id !== id));
      toast.success('Student deleted successfully');
    } catch (err) {
      toast.error(err?.message || 'Failed to delete student');
    }
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage your student roster</p>
        </div>
        <Button onClick={handleOpenModal} className="hidden sm:flex">
          <ApperIcon name="Plus" size={16} />
          Add Student
        </Button>
      </div>

      {students.length === 0 ? (
        <Card className="p-12 text-center">
          <ApperIcon name="Users" size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No students yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first student</p>
          <Button onClick={() => handleOpenModal()}>
            <ApperIcon name="Plus" size={16} />
            Add Student
          </Button>
</Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <Card key={student.Id} className="p-6 hover:shadow-elevated transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <ApperIcon name="User" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.year}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <ApperIcon name="Mail" size={16} className="text-gray-400" />
                  <span className="text-gray-700">{student.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ApperIcon name="Phone" size={16} className="text-gray-400" />
                  <span className="text-gray-700">{student.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ApperIcon name="BookOpen" size={16} className="text-gray-400" />
                  <span className="text-gray-700">{student.major}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ApperIcon name="Award" size={16} className="text-gray-400" />
                  <span className="text-gray-700">GPA: {student.gpa}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenModal(student)}
                  className="flex-1"
                >
                  <ApperIcon name="Edit" size={16} />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(student.Id)}
                  className="flex-1 text-error hover:bg-error/10"
                >
                  <ApperIcon name="Trash2" size={16} />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
)}

      <FloatingActionButton onClick={() => handleOpenModal()} />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingStudent ? 'Edit Student' : 'Add New Student'}
      >
        <StudentForm
          onSubmit={handleSubmitStudent}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
          initialData={editingStudent ? formData : undefined}
        />
      </Modal>
    </div>
  );
}

export default Students;