import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const FloatingActionButton = ({ onClick, icon = "Plus" }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
    >
      <ApperIcon name={icon} className="w-6 h-6" />
    </motion.button>
  );
};

export default FloatingActionButton;