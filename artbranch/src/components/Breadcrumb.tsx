import React from "react";
import { Link } from "react-router-dom";

interface BreadcrumbLinkProps {
  to: string;
  children: React.ReactNode;
  isActive: boolean;
}

export const BreadcrumbLink: React.FC<BreadcrumbLinkProps> = ({
  to,
  children,
  isActive,
}) => (
  <Link
    to={to}
    className={`transition duration-200 ${
      isActive
        ? "text-black font-semibold"
        : "text-gray-500 hover:text-indigo-500 hover:underline"
    }`}
  >
    {children}
  </Link>
);

interface ActiveBreadcrumbProps {
  text: string;
}

export const ActiveBreadcrumb: React.FC<ActiveBreadcrumbProps> = ({ text }) => (
  <span className="text-black font-semibold">{text}</span>
);

export const BreadcrumbSeparator: React.FC = () => (
  <span className="text-gray-400 mx-2"> &gt; </span>
);
