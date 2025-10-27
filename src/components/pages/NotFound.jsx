import React from "react";
import { Link } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="p-8 text-center max-w-md w-full">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="Search" className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          404
        </h1>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-3">
          <Link to="/">
            <Button className="w-full" icon="Home">
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="grid grid-cols-2 gap-3">
            <Link to="/courses">
              <Button variant="secondary" size="sm" className="w-full">
                Courses
              </Button>
            </Link>
            <Link to="/assignments">
              <Button variant="secondary" size="sm" className="w-full">
                Assignments
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Need help? Check out our navigation menu above.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;