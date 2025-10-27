import React, { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Courses from "@/components/pages/Courses";
import Assignments from "@/components/pages/Assignments";

const AssignmentTable = ({ assignments, courses, onEdit, onDelete, onToggleStatus }) => {
  const [filter, setFilter] = useState({ course: "all", status: "all", priority: "all" });
  const [search, setSearch] = useState("");

  // Filter assignments
const filteredAssignments = assignments
.filter(assignment => {
      const course = courses.find(c => c.Id.toString() === assignment.course_id_c.toString());
      const matchesSearch = assignment.title_c.toLowerCase().includes(search.toLowerCase()) ||
                          course?.name_c.toLowerCase().includes(search.toLowerCase());
      const matchesCourse = filter.course === "all" || assignment.course_id_c.toString() === filter.course;
      const matchesStatus = filter.status === "all" || assignment.status_c === filter.status;
      const matchesPriority = filter.priority === "all" || assignment.priority_c === filter.priority;
      
      return matchesSearch && matchesCourse && matchesStatus && matchesPriority;
    })
    .sort((a, b) => new Date(a.due_date_c) - new Date(b.due_date_c));

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high": return "AlertTriangle";
      case "medium": return "AlertCircle";
      case "low": return "Circle";
      default: return "Circle";
    }
  };

  const getStatusIcon = (status) => {
    return status === "completed" ? "CheckCircle" : "Clock";
  };

  return (
    <Card className="overflow-hidden">
      {/* Filters */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h2 className="text-xl font-semibold text-gray-900">Assignments</h2>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
            <Input
              placeholder="Search assignments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:w-64"
            />
            
            <Select
              value={filter.course}
              onChange={(e) => setFilter(prev => ({ ...prev, course: e.target.value }))}
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
<option key={course.Id} value={course.Id.toString()}>
                  {course.name_c}
                </option>
              ))}
            </Select>

            <Select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </Select>

            <Select
              value={filter.priority}
              onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value }))}
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left p-4 font-medium text-gray-900">Assignment</th>
              <th className="text-left p-4 font-medium text-gray-900">Course</th>
              <th className="text-left p-4 font-medium text-gray-900">Due Date</th>
              <th className="text-left p-4 font-medium text-gray-900">Priority</th>
              <th className="text-left p-4 font-medium text-gray-900">Status</th>
              <th className="text-left p-4 font-medium text-gray-900">Grade</th>
              <th className="text-right p-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
{filteredAssignments.map((assignment, index) => {
              const course = courses.find(c => c.Id.toString() === assignment.course_id_c.toString());

              return (
                <motion.tr
                  key={assignment.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{assignment.title_c}</h3>
                      {assignment.description_c && (
                        <p className="text-sm text-gray-500 mt-1 truncate max-w-xs">
                          {assignment.description_c}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: course?.color_c || "#6366f1" }}
                      />
                      <span className="text-sm text-gray-900">{course?.name_c}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-900">
                      {format(new Date(assignment.due_date_c), "MMM d, yyyy")}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(assignment.due_date_c), "h:mm a")}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={assignment.priority_c}>
                      <ApperIcon name={getPriorityIcon(assignment.priority_c)} className="w-3 h-3 mr-1" />
                      {assignment.priority_c}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStatus(assignment.Id);
                      }}
                      className="cursor-pointer"
                    >
                      <Badge variant={assignment.status_c}>
                        <ApperIcon name={getStatusIcon(assignment.status_c)} className="w-3 h-3 mr-1" />
                        {assignment.status_c}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-gray-900">
                      {assignment.grade_c ? `${assignment.grade_c}%` : "-"}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(assignment)}
                        className="p-2"
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(assignment)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <ApperIcon name="FileText" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-500">Try adjusting your filters or add a new assignment.</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AssignmentTable;