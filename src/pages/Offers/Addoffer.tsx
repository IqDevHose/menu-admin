// src/pages/AddOffer.js

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Progress } from "@/components/ui/progress";

const Addoffer = () => {
  const [title, setTitle] = useState("");
  const [uploadImageUrl, setUploadImageUrl] = useState<string | null>(null);
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [description, setDescription] = useState("");

 
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (uploadImage) {
      formData.append("image", uploadImage);
    }

    // mutation.mutate(formData);
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
        </div>
        {/* Upload Image */}
        <div className="mb-4">
          <div className="flex gap-4 flex-wrap items-center">
            <label
              htmlFor="upload-image"
              className="block text-sm font-medium text-gray-700"
            >
              Upload image
            </label>
            {progress > 0 && title && uploadImage && (
              <div className="flex items-center gap-1">
                <h1 className="text-gray-400 ">{progress}</h1>
                <Progress value={progress} max={100} className="h-2 w-24 " />
              </div>
            )}
          </div>
          {uploadImageUrl ? (
            <div className="p-4">
              <img width={100} src={uploadImageUrl} alt="" />
            </div>
          ) : null}
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

        <div>
          <label className="block font-bold mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 disabled:animate-pulse disabled:bg-indigo-300 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            // disabled={mutation.isPending}
          >
            {/* {mutation.isPending ? "Adding... " : "Add Item"} */}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Addoffer;
