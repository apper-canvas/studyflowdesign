import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const DashboardStats = ({ courses, assignments }) => {
  const totalCourses = courses.length;
  const pendingAssignments = assignments.filter(a => a.status === "pending").length;
  const completedAssignments = assignments.filter(a => a.status === "completed").length;
  
  // Calculate GPA based on completed assignments
  const completedWithGrades = assignments.filter(a => a.status === "completed" && a.grade !== null);
  const averageGrade = completedWithGrades.length > 0 
    ? completedWithGrades.reduce((sum, a) => sum + a.grade, 0) / completedWithGrades.length 
    : 0;
  
  // Convert to GPA scale (assuming 4.0 scale)
  const gpa = (averageGrade / 100) * 4.0;

  const stats = [
    {
      title: "Total Courses",
      value: totalCourses,
      icon: "BookOpen",
      color: "from-primary to-secondary",
      bgColor: "from-primary/10 to-secondary/20"
    },
    {
      title: "Pending Tasks",
      value: pendingAssignments,
      icon: "Clock",
      color: "from-warning to-orange-500",
      bgColor: "from-warning/10 to-orange-500/20"
    },
    {
      title: "Current GPA",
      value: gpa.toFixed(2),
      icon: "TrendingUp",
      color: "from-success to-emerald-600",
      bgColor: "from-success/10 to-emerald-600/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card hover className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bgColor} flex items-center justify-center`}>
                <ApperIcon name={stat.icon} className="w-6 h-6 text-primary" />
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;