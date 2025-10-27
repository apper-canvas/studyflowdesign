import React, { useState, useEffect } from 'react';
import { studentService } from '@/services/api/studentService';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Modal from '@/components/molecules/Modal';
import FloatingActionButton from '@/components/organisms/FloatingActionButton';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  async function loadStudents() {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenModal(student = null) {
    if (student) {
      setEditingStudent(student);
      setFormData({
        name: student.name,
        email: student.email,
        phone: student.phone,
        major: student.major,
        year: student.year,
        gpa: student.gpa,
        enrollmentDate: student.enrollmentDate
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
  }

  function handleCloseModal() {
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
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.major.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingStudent) {
        await studentService.update(editingStudent.Id, formData);
        setStudents(prev => prev.map(s => 
          s.Id === editingStudent.Id ? { ...s, ...formData } : s
        ));
        toast.success('Student updated successfully');
      } else {
        const newStudent = await studentService.create(formData);
        setStudents(prev => [...prev, newStudent]);
        toast.success('Student created successfully');
      }
      handleCloseModal();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      await studentService.delete(id);
      setStudents(prev => prev.filter(s => s.Id !== id));
      toast.success('Student deleted successfully');
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <p className="text-gray-600 mt-1">Manage your student roster</p>
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
          {students.map(student => (
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter student name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="student@university.edu"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Major *
            </label>
            <Input
              type="text"
              value={formData.major}
              onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
              placeholder="Computer Science"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <Input
              type="text"
              value={formData.year}
              onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
              placeholder="Freshman, Sophomore, Junior, Senior"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GPA
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="4.0"
              value={formData.gpa}
              onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
              placeholder="3.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enrollment Date
            </label>
            <Input
              type="date"
              value={formData.enrollmentDate}
              onChange={(e) => setFormData(prev => ({ ...prev, enrollmentDate: e.target.value }))}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingStudent ? 'Update Student' : 'Add Student'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Students;