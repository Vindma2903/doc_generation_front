import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`rounded-xl border bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
                                                                                           children,
                                                                                           className = "",
                                                                                         }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);
