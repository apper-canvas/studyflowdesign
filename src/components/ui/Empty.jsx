import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "Nothing here yet", 
  description = "Get started by adding your first item", 
  actionLabel = "Add Item",
  onAction,
  icon = "Plus"
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 bg-white rounded-xl p-8 shadow-card">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-8 max-w-sm">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          <div className="flex items-center space-x-2">
            <ApperIcon name="Plus" className="w-5 h-5" />
            <span>{actionLabel}</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default Empty;