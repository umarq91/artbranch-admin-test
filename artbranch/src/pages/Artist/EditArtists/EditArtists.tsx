import { useParams } from "react-router-dom";
import { TbSocial } from "react-icons/tb";
import useEditArtist from "./useEditArtist";
import Spinner from "../../../components/Spinner";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import AdminNoteModal from "../../../components/AdminNoteModal";
import { useState } from "react";
import AdminNotesList from "../../../components/AdminNoteList";

const EditArtist = () => {
  const { id } = useParams<{ id: string }>();
  const [isNoteModalOpen,setIsNoteModalOpen] = useState(false);
  const {
    artistData,
    categories,
    loading,
    error,
    handleCategoryChange,
    handleChange,
    handleSubmit,
    navigate,
    handleFavoriteToggle,
  } = useEditArtist(id!);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  console.log("ARTIST DATA", artistData)
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="container mx-auto mt-20 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-light p-6 rounded-2xl shadow-md"
      >
         <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold mb-6">Edit Artist</h2>
                   <button
                   type="button"
          onClick={(e) =>{
            e.stopPropagation();
             setIsNoteModalOpen(true)
          }}
            className="bg-light text-black px-4 py-2 rounded-md transition-transform transform hover:scale-105"
            >
            Add Note
          </button>
            </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-dark p-4 rounded-lg">
              <div>
                <label className="block mb-2 font-semibold">Artist Name:</label>
                <input
                  type="text"
                  name="full_name"
                  value={artistData?.full_name || ""}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-[13px] bg-light"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={artistData?.email || ""}
                  disabled
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-light cursor-pointer text-[13px]"
                />
              </div>

              {artistData?.social_profiles &&
                Object.entries(artistData.social_profiles).map(
                  ([platform, link]) => (
                    <div key={platform} className=" items-center">
                      <label className="block mb-2 font-semibold capitalize">
                        {platform}:
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          name={`social_profiles.${platform}`}
                          value={String(link ?? "")}
                          disabled
                          className="block w-full p-2 border border-gray-300 rounded-md bg-light cursor-pointer text-[13px] mr-2"
                        />

                        <button
                          type="button"
                          onClick={() => window.open(link as string, "_blank")}
                          className="text-black hover:text-blue-700 bg-light p-2 rounded-md transition-transform transform hover:scale-105"
                        >
                          <TbSocial size={20} />
                        </button>
                      </div>
                    </div>
                  ),
                )}

              <div>
                <label className="block mb-2 font-semibold">Status:</label>
                <select
                  name="status"
                  value={artistData?.status || ""}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-light text-[13px]"
                >
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                  <option value="rejected">Rejected</option>
                  <option value="verification_pending">
                    Verification Pending
                  </option>
                </select>
              </div>
             <div>
             <div className="flex items-center mb-4 mt-7">
    <label className="block  font-semibold">Featured Artist:</label>
    <button
        type="button"
        onClick={() =>
            handleFavoriteToggle(!artistData?.is_featured)
        }
        className="ml-4 text-[#bc893c] text-lg"
    >
        {artistData?.is_featured ? (
            <AiFillStar size={18} className="text-[#bc893c]" />
        ) : (
            <AiOutlineStar size={18} />
        )}
    </button>
</div>
             </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-dark p-3 rounded-lg">
            <label className="block mb-2 font-semibold">Categories:</label>
            <div
              className="grid grid-cols-2 gap-4 text-sm overflow-y-auto overflow-hidden1"
              style={{ maxHeight: "200px" }}
            >
              {categories.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      artistData?.selectedCategories?.includes(category) ||
                      false
                    }
                    onChange={() => handleCategoryChange(category)}
                    className="mr-2 h-4 w-4"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-light text-black px-4 py-2 rounded-md transition-transform transform hover:scale-105"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate("/artist")}
            className="ml-4 bg-light text-black px-4 py-2 rounded-md transition-transform transform hover:scale-105"
          >
            Cancel
          </button>
        </div>
      </form>
      <AdminNotesList userId={artistData?.id}/>

      <AdminNoteModal
      isOpen={isNoteModalOpen}
      onClose={()=>setIsNoteModalOpen(false)}
      targetUserId={artistData.id}
      />
    </div>
  );
};

export default EditArtist;
