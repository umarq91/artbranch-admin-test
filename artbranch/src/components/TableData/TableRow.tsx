import React, { useState } from "react";
import { FiTrash, FiEdit, FiEye, FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

interface TableRowProps {
  rowData: { [key: string]: any };
  columns: string[];
  deleteArtist?: (id: string) => void;
  deleteVerification?: (id: string) => void;
  deleteActivities?: (id: string) => void;
  loading?: boolean;
  editRoute?: string;
  showSelectCheckboxes?: boolean;
  toggleSelection: (id: string) => void;
  selectedIds: string[];
  onSingleEmailClick: (email: string) => void;
  showViewIcon?: boolean;
  showEditIcon?: boolean;
  showEmailIcon?: boolean;
  hideSelectButtons?: boolean;
}

const TableRow: React.FC<TableRowProps> = ({
  rowData,
  columns,
  deleteArtist,
  deleteVerification,
  deleteActivities,
  toggleSelection,
  selectedIds,
  showViewIcon = false,
  showEditIcon = false,
  showEmailIcon = false,
  loading = false,
  editRoute,
  showSelectCheckboxes = false,
  onSingleEmailClick,
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { role } = useAuth();
  const itemId = rowData.user_id || rowData.id;
  const itemName = rowData.Name || rowData.name;

  const categories =
    typeof rowData.Categories === "string"
      ? rowData.Categories.split(", ").map((category) => category.trim())
      : rowData.Categories || [];

  const displayedCategory = categories[0];
  const remainingCategories = categories.slice(1);

  const isSelected = selectedIds.includes(itemId);

  return (
    <>
      <tr
        className={`text-sm text-[#292D32] border-t-2 border-t-sideBorder ${
          isSelected ? "bg-[rgba(28,28,28,0.20)]" : ""
        }`}
      >
        {showSelectCheckboxes && (
          <td className="px-3 py-6">
            <input
              type="checkbox"
              checked={selectedIds.includes(itemId)}
              onChange={() => toggleSelection(itemId)}
              className="w-4 h-4 cursor-pointer"
            />
          </td>
        )}

        {columns.map((column, index) => (
          <td key={index} className="px-3 py-6 whitespace-nowrap">
            {loading ? (
              <div className=""></div>
            ) : column === "Categories" ? (
              <div className="flex items-center space-x-2">
                {displayedCategory && (
                  <span className="bg-dark text-black px-2 py-1 rounded-md text-sm">
                    {displayedCategory}
                  </span>
                )}
                {remainingCategories.length > 0 && (
                  <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="relative flex items-center"
                  >
                    <span className="bg-dark text-black text-[12px] rounded-full w-6 h-6 flex items-center justify-center cursor-pointer">
                      +{remainingCategories.length}
                    </span>
                    {isHovered && (
                      <div className="absolute left-0 mt-2 w-40 bg-dark border border-gray-300 shadow-lg rounded-lg p-2 text-sm z-10">
                        {remainingCategories.map(
                          (category: string, i: number) => (
                            <div key={i} className="text-gray-700 py-1">
                              {category}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : column === "Name" || column === "Artist Name" ? (
              <span
                onClick={() => navigate("/editArtist/" + rowData.user_id)}
                className="underline cursor-pointer"
              >
                {" "}
                {rowData[column]}{" "}
              </span>
            ) : (
              <span>{rowData[column]}</span>
            )}
          </td>
        ))}

        {(showViewIcon ||
          showEditIcon ||
          role === "SuperAdmin" ||
          role === "Admin") && (
          <td className="px-3 py-6 flex space-x-2 whitespace-nowrap">
            {showViewIcon && (
              <FiEye
                className=" text-gray-700 hover:bg-gray-400 h-8 w-8 p-2 rounded-md cursor-pointer transition-transform transform hover:scale-105"
                onClick={() => {
                  if (rowData.slug) {
                    window.open(
                      `https://artbranch.com.au/portfolio?post=${rowData.slug}`,
                      "_blank"
                    );
                  } else if (rowData.id) {
                    window.open(
                      `https://artbranch.com.au/portfolio/${rowData.id}`,
                      "_blank"
                    );
                  } else {
                    navigate(`/verificationDetails/${itemId}`, {
                      state: { name: itemName },
                    });
                  }
                }}
              />
            )}
            {showEditIcon && (
              <FiEdit
                className=" text-gray-700 hover:bg-gray-400 h-8 w-8 p-2 rounded-md cursor-pointer transition-transform transform hover:scale-105"
                onClick={() => navigate(`/${editRoute}/${rowData.id}`)}
              />
            )}
            {showEmailIcon && (
              <td>
                {showEmailIcon && (
                  <td>
                    <FiMail
                      className="text-gray-700 hover:bg-gray-400 h-8 w-8 p-2 rounded-md cursor-pointer transition-transform transform hover:scale-105"
                      onClick={() => onSingleEmailClick(rowData.Email)}
                    />
                  </td>
                )}
              </td>
            )}

            {role === "SuperAdmin" && deleteArtist && rowData.id && (
              <FiTrash
                className=" text-[#FF0000] hover:bg-[#FFA7A7] h-8 w-8 p-2 rounded-md cursor-pointer transition-transform transform hover:scale-105"
                onClick={() => deleteArtist(rowData.id)}
              />
            )}
            {(role === "Admin" || role === "SuperAdmin") &&
              deleteVerification &&
              rowData.id && (
                <FiTrash
                  className=" text-[#FF0000] hover:bg-[#FFA7A7] h-8 w-8 p-2 rounded-md cursor-pointer transition-transform transform hover:scale-105"
                  onClick={() => deleteVerification(rowData.id)}
                />
              )}

            {(role === "Admin" || role === "SuperAdmin") &&
              deleteActivities &&
              rowData.id && (
                <FiTrash
                  className=" text-[#FF0000] hover:bg-[#FFA7A7] h-8 w-8 p-2 rounded-md cursor-pointer transition-transform transform hover:scale-105"
                  onClick={() => deleteActivities(rowData.id)}
                />
              )}
          </td>
        )}
      </tr>
    </>
  );
};

export default TableRow;
