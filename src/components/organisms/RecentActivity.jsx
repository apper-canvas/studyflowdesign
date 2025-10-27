import React from "react";
import { format, isToday, isTomorrow } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const RecentActivity = ({ assignments, courses }) => {
  // Get upcoming assignments (next 7 days)
  const now = new Date();
  const upcoming = assignments
    .filter(a => a.status === "pending")
    .map(a => ({
      ...a,
      course: courses.find(c => c.Id.toString() === a.courseId)
    }))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM d");
  };

  const getDaysUntil = (dateString) => {
    const date = new Date(dateString);
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "overdue";
    if (diffDays === 0) return "today";
    if (diffDays === 1) return "tomorrow";
    return `${diffDays} days`;
  };

  const getUrgencyColor = (dateString) => {
    const daysUntil = getDaysUntil(dateString);
    if (daysUntil === "overdue") return "text-red-600";
    if (daysUntil === "today") return "text-orange-600";
    if (daysUntil === "tomorrow") return "text-yellow-600";
    return "text-gray-600";
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Upcoming Assignments</h2>
        <ApperIcon name="Clock" className="w-5 h-5 text-gray-400" />
      </div>

      {upcoming.length === 0 ? (
        <div className="text-center py-8">
          <ApperIcon name="CheckCircle" className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="text-gray-500">All caught up! No upcoming assignments.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {upcoming.map((assignment, index) => (
            <motion.div
              key={assignment.Id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: assignment.course?.color || "#6366f1" }}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-900 truncate">{assignment.title}</h3>
                  <p className="text-sm text-gray-500">{assignment.course?.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Badge variant={assignment.priority}>{assignment.priority}</Badge>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getUrgencyColor(assignment.dueDate)}`}>
                    {formatDueDate(assignment.dueDate)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(assignment.dueDate), "h:mm a")}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default RecentActivity;