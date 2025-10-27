import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const CourseGrid = ({ courses, onEdit, onDelete, onViewDetails }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course, index) => (
        <motion.div
          key={course.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card hover className="p-6 cursor-pointer" onClick={() => onViewDetails(course)}>
            <div className="flex items-start justify-between mb-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
style={{ backgroundColor: `${course.color_c}20` }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: course.color_c }}
                />
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(course);
                  }}
                  className="p-2"
                >
                  <ApperIcon name="Edit" className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(course);
                  }}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </Button>
              </div>
            </div>

<div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-1">{course.name_c}</h3>
              <p className="text-sm text-gray-500">{course.code_c}</p>
              <p className="text-sm text-gray-500">{course.instructor_c}</p>
            </div>

            {/* Course Details */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
              <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
              <span>{course.credits_c} credits</span>
            </div>
            {course.schedule_c && course.schedule_c.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ApperIcon name="Clock" className="w-4 h-4" />
                  {course.schedule_c.map((sched, idx) => (
                    <div key={idx}>
                      {sched.day} {sched.time}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div 
              className="mt-4 pt-4 border-t-2"
              style={{ borderColor: `${course.color}40` }}
            >
<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {course.semester_c}
              </span>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default CourseGrid;