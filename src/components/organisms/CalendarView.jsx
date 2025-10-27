import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const CalendarView = ({ assignments, courses }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;

  // Generate calendar days
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
const dayAssignments = assignments.filter(assignment => 
        isSameDay(new Date(assignment.due_date_c), cloneDay)
      );

      days.push(
        <div
          key={day}
          className={`min-h-[120px] p-2 border-b border-r border-gray-100 ${
            !isSameMonth(day, monthStart) ? "bg-gray-50 text-gray-400" : "bg-white"
          } ${isSameDay(day, new Date()) ? "bg-blue-50" : ""}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${
              isSameDay(day, new Date()) ? "text-blue-600" : ""
            }`}>
              {format(cloneDay, dateFormat)}
            </span>
            {isSameDay(day, new Date()) && (
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
            )}
          </div>
          
          <div className="space-y-1">
            {dayAssignments.slice(0, 2).map(assignment => {
              const course = courses.find(c => c.Id.toString() === assignment.course_id_c.toString());
              return (
                <div
                  key={assignment.Id}
                  className="p-1 rounded text-xs truncate cursor-pointer hover:shadow-sm transition-shadow"
                  style={{ 
                    backgroundColor: `${course?.color_c || "#6366f1"}20`,
                    borderLeft: `3px solid ${course?.color_c || "#6366f1"}`
                  }}
                  title={`${assignment.title_c} - ${course?.name_c}`}
                >
                  <div className="font-medium truncate">{assignment.title_c}</div>
                  <div className="text-gray-600 truncate">{course?.code_c}</div>
                </div>
              );
            })}
            
            {dayAssignments.length > 2 && (
              <div className="text-xs text-gray-500 font-medium">
                +{dayAssignments.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day} className="grid grid-cols-7">
        {days}
      </div>
    );
    days = [];
  }

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevMonth}
              icon="ChevronLeft"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextMonth}
              icon="ChevronRight"
            />
          </div>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="p-4 text-center text-sm font-medium text-gray-600 border-r border-gray-100 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <motion.div
        key={format(currentDate, "yyyy-MM")}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="border-l border-gray-100"
      >
        {rows}
      </motion.div>

      {/* Legend */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-sm font-medium text-gray-600">Courses:</div>
          {courses.slice(0, 4).map(course => (
<div key={course.Id} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: course.color_c }}
              />
              <span className="text-sm text-gray-600">{course.code_c}</span>
            </div>
          ))}
          {courses.length > 4 && (
            <span className="text-sm text-gray-500">+{courses.length - 4} more</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CalendarView;