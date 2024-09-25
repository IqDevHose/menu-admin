import React, { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/axiosInstance";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown"; 
import marked from 'marked';

const Addoffer = () => {
  const [title, setTitle] = useState("");
  const [withEmoji, setWithEmoji] = useState("");
  const [description, setDescription] = useState(""); 
  const [uploadImageUrl, setUploadImageUrl] = useState<string | null>(null);
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false); 
  const [autoTitle, setAutoTitle] = useState(false); // State for auto title checkbox
  const navigate = useNavigate();

  function removeMarkdownPreserveEmojis(input:string) {
    let result = input.replace(/^(#{1,6})\s+/gm, '');
    result = result.replace(/\*\*([^*]+)\*\*/g, '$1'); 
    result = result.replace(/\*([^*]+)\*/g, '$1'); 
    result = result.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1'); 
    result = result.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1'); 
    result = result.replace(/```[\s\S]*?```/g, ''); 
    result = result.replace(/`([^`]+)`/g, '$1'); 
    result = result.replace(/^\s*[-*+]\s+/gm, ''); 
    result = result.replace(/^\s*\d+\.\s+/gm, ''); 
    result = result.replace(/^>\s+/gm, '');
    result = result.replace(/^\s*[-*]{3,}\s*$/gm, '');
    return result.trim();
  }

  // Function to generate description using Google Gemini API
  const generateDescription = async (title: string) => {
    try {
      setLoading(true); 
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyABPSSgejEC2icELd6_5fK5rLEKqbu5S88`,
        {
          contents: [
            {
              parts: [
                {
                  text: `create, complete and enhance this offer: ${title} ${withEmoji}`,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const generatedContent = response.data.candidates[0].content.parts[0].text;
      setLoading(false);
      return removeMarkdownPreserveEmojis(generatedContent);
    } catch (error) {
      console.error("Error generating description: ", error);
      setLoading(false);
      return "";
    }
  };

  const mutation = useMutation({
    mutationFn: (newoffer: FormData) => {
      return axiosInstance.post(`/offers`, newoffer);
    },
    onSuccess: () => {
      navigate("/offers");
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (uploadImage) {
      formData.append("image", uploadImage);
    }

    mutation.mutate(formData);
  };

  const handleGenerateDescription = async () => {
    if (title) {
      const generatedDescription = await generateDescription(title);
      setDescription(generatedDescription); 
    } else {
      alert("Please enter a title to generate a description.");
    }
  };

   
         const handleAutoTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setAutoTitle(isChecked);

    if (isChecked) {
      // Append emojis to the current title if the checkbox is checked
      setWithEmoji('with emojis');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Offer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
           
          />
          <div className="mt-2">
            <label>
              <input
                type="checkbox"
                checked={autoTitle}
                onChange={handleAutoTitleChange}
              />{" "}
              Add emojis 
            </label>
          </div>
        </div>

        {/* Generate Description Button */}
        <div>
          <button
            type="button"
            onClick={handleGenerateDescription}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Generating Description..." : "Generate Description"}
          </button>
        </div>

        {/* Manual Description Input */}
        <div>
          <label className="block font-bold mb-2">Add Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={7}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="You can add or edit the description here..."
          />
        </div>

        {/* Upload Image */}
        <div className="mb-4">
          {uploadImageUrl && (
            <div className="p-4">
              <img width={100} src={uploadImageUrl} alt="" />
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 disabled:animate-pulse disabled:bg-indigo-300 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Adding... " : "Add Offer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Addoffer;
