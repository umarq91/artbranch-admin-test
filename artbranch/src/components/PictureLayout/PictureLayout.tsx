import React, { ReactNode } from "react";

interface PictureLayoutProps {
  title: string;
  backgroundImage: string;
  decorationImage: string;
  children?: ReactNode;
}

const PictureLayout: React.FC<PictureLayoutProps> = ({
  title,
  backgroundImage,
  decorationImage,
  children,
}) => {
  return (
    <div className="grid min-h-screen grid-cols-1 items-center bg-gray-50 md:grid-cols-2">
      <div className="relative h-full w-full">
        <img
          src={backgroundImage}
          alt="Background"
          className="h-full w-full rounded-b-2xl object-cover lg:rounded-br-3xl lg:rounded-tr-3xl"
        />
        <img
          src={decorationImage}
          alt="Leaf"
          className="absolute left-0 top-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-2xl font-bold text-white md:items-start md:justify-start md:px-16 md:py-28 md:text-start">
          {title}
        </div>
      </div>
      <div className="p-6 md:p-16">{children}</div>
    </div>
  );
};

export default PictureLayout;
