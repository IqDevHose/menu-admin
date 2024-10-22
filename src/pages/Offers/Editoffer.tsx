import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, FormEvent } from "react";
import axiosInstance from "@/axiosInstance";
import { useMutation } from "@tanstack/react-query";

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

  // Helper function to convert image file to base64 string
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Update mutation for saving offer
  const mutation = useMutation({
    mutationFn: async (updatedOffer: any) => {
      return axiosInstance.put(`/offers/${offerId}`, updatedOffer, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      navigate("/offers");
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let base64Image = uploadImageUrl;
    
    // Convert uploaded image to base64 if a new image is selected
    if (uploadImage) {
      base64Image = await convertImageToBase64(uploadImage);
    }

    const updatedOffer = {
      title: title || "",
      description: description || "",
      image: base64Image || null, // Include base64 image string if available
    };

    mutation.mutate(updatedOffer);
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
