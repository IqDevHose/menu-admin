import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";

const EditOffer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const record = location.state; // Access the passed record data from location state

  const [title, setTitle] = useState(record?.title || ""); // Set initial values
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [uploadImageUrl, setUploadImageUrl] = useState<string | null>(
    record?.image || ""
  ); // Initial URL from the record
  const [description, setDescription] = useState(record?.description || "");

  const { offerId } = useParams();

  // Update mutation for saving offer
  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      return axiosInstance.put(`/offers/${offerId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      navigate("/offers");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title || "");
    formData.append("description", description || "");

    if (uploadImage) {
      formData.append("image", uploadImage);
    } else if (uploadImageUrl) {
      formData.append("image", uploadImageUrl);
    }

    mutation.mutate(formData);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Offer</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Offer title"
            className="block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Upload Image */}
        <div className="mb-4">
          <label htmlFor="upload-image" className="block text-sm font-medium">
            Upload Image
          </label>
          {uploadImageUrl && (
            <div className="p-2">
              <img width={100} src={uploadImageUrl} alt="Offer preview" />
            </div>
          )}
          <input
            type="file"
            id="upload-image"
            onChange={(e) => {
              if (e.target.files) {
                setUploadImage(e.target.files[0]);
                setUploadImageUrl(URL.createObjectURL(e.target.files[0]));
              }
            }}
            className="mt-1 block w-full p-2 border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Offer description"
            className="block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 disabled:animate-pulse disabled:bg-indigo-300 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving... " : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditOffer;
