import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import ProgressRing from "@/components/molecules/ProgressRing";
import { assignmentService } from "@/services/api/assignmentService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const CourseDetail = ({ course, onEdit, onClose, onAddAssignment }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAssignments();
  }, [course.Id]);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await assignmentService.getByCourseId(course.Id);
      setAssignments(data);
    } catch (err) {
      setError("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const calculateGrade = () => {
    const completedAssignments = assignments.filter(a => a.status === "completed" && a.grade !== null);
    if (completedAssignments.length === 0) return { average: 0, totalWeight: 0 };
    
    const totalGrade = completedAssignments.reduce((sum, a) => sum + (a.grade * a.weight), 0);
    const totalWeight = completedAssignments.reduce((sum, a) => sum + a.weight, 0);
    
    return {
      average: totalWeight > 0 ? totalGrade / totalWeight : 0,
      totalWeight,
      completedWeight: totalWeight,
      remainingWeight: Math.max(0, 100 - totalWeight)
    };
  };

  const gradeInfo = calculateGrade();
  const completedAssignments = assignments.filter(a => a.status === "completed").length;
  const totalAssignments = assignments.length;
  const completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAssignments} />;

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${course.color}20` }}
            >
              <ApperIcon 
                name="BookOpen" 
                className="w-8 h-8"
                style={{ color: course.color }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
              <p className="text-lg text-gray-600">{course.code}</p>
              <p className="text-sm text-gray-500">{course.instructor}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="secondary" onClick={() => onEdit(course)} icon="Edit">
              Edit Course
            </Button>
            <Button variant="ghost" onClick={onClose} icon="X" />
          </div>
        </div>

        {/* Course Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{course.credits}</div>
            <div className="text-sm text-gray-500">Credits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalAssignments}</div>
            <div className="text-sm text-gray-500">Total Assignments</div>
          </div>
          <div className="text-center">
            <ProgressRing 
              progress={completionRate} 
              color={course.color}
              size={50}
            />
            <div className="text-sm text-gray-500 mt-2">Completion</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {gradeInfo.average.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">Current Grade</div>
          </div>
        </div>

        {/* Schedule */}
        {course.schedule && course.schedule.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Schedule</h3>
            <div className="space-y-2">
              {course.schedule.map((sched, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
                  <span>{sched.day}: {sched.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Assignments Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Assignments</h2>
          <Button onClick={() => onAddAssignment(course)} icon="Plus">
            Add Assignment
          </Button>
        </div>

        {assignments.length === 0 ? (
          <Empty
            title="No assignments yet"
            description="Start by adding your first assignment for this course."
            actionLabel="Add Assignment"
            onAction={() => onAddAssignment(course)}
            icon="FileText"
          />
        ) : (
          <div className="space-y-4">
            {assignments
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .map(assignment => (
                <div
                  key={assignment.Id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <ApperIcon 
                        name={assignment.status === "completed" ? "CheckCircle" : "Clock"}
                        className={`w-5 h-5 ${
                          assignment.status === "completed" ? "text-green-600" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Due: {format(new Date(assignment.dueDate), "MMM d, yyyy")}</span>
                        <span>Weight: {assignment.weight}%</span>
                        {assignment.grade && (
                          <span className="font-medium text-gray-700">Grade: {assignment.grade}%</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge variant={assignment.priority}>{assignment.priority}</Badge>
                    <Badge variant={assignment.status}>{assignment.status}</Badge>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* Grade Breakdown */}
        {gradeInfo.completedWeight > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Grade Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{gradeInfo.average.toFixed(1)}%</div>
                <div className="text-sm text-gray-500">Current Average</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{gradeInfo.completedWeight}%</div>
                <div className="text-sm text-gray-500">Completed Weight</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{gradeInfo.remainingWeight}%</div>
                <div className="text-sm text-gray-500">Remaining Weight</div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CourseDetail;