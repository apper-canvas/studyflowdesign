import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Header = () => {
  const location = useLocation();

const navItems = [
    { path: "", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "courses", label: "Courses", icon: "BookOpen" },
    { path: "assignments", label: "Assignments", icon: "FileText" },
    { path: "calendar", label: "Calendar", icon: "Calendar" },
    { path: "study-timer", label: "Study Timer", icon: "Clock" }
  ];

  const isActive = (path) => {
    if (path === "" && location.pathname === "/") return true;
    if (path !== "" && location.pathname.includes(path)) return true;
    return false;
  };

  return (
    <header className="bg-white border-b border-gray-200/80 shadow-sm sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                StudyFlow
              </h1>
              <p className="text-xs text-gray-500">Student Management</p>
            </div>
          </div>

          {/* Navigation */}
<nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={`/${item.path}`}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive(item.path)
                    ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-b-2 border-primary"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              <ApperIcon name="Menu" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200/80">
<div className="grid grid-cols-5 gap-1 py-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={`/${item.path}`}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium transition-all duration-200",
                  isActive(item.path)
                    ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <ApperIcon name={item.icon} className="w-5 h-5 mb-1" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;