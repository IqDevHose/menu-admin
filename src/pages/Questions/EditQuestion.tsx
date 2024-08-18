import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom';

type questionType = {
    title: string | null;
    enTitle: string | null;
    description: string | null;
    restaurantId: string | null;
    answer: string | null;
};

function EditQuestion() {
    let [searchParams, setSearchParams] = useSearchParams();
    const [description, setDescription] = useState<string | null>(
        searchParams.get("description")
    );
    const [restaurantId, setrestaurantId] = useState<string | null>(
        searchParams.get("restaurantId")
    );
    const [answer, setanswer] = useState<string | null>(
        searchParams.get("answer")
    );
    const p = useParams()
    const [title, setTitle] = useState<string | null>(searchParams.get("title"));
    const [enTitle, setEnTitle] = useState<string | null>(
        searchParams.get("enTitle")
    );
    const { questionId } = useParams();
    const mutation = useMutation({
        mutationFn: (newEdit: questionType) => {
            return axios.put(`http://localhost:3000/${questionId}`, newEdit);
        },
    });
    const handleSubmit = () => {
        mutation.mutate({ title, enTitle, description, restaurantId, answer });
    };

    return (
        <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Edit Restaurant</h2>

            <form onSubmit={handleSubmit}>
                {/* title */}
                <div className="mb-4">
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title || ""}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter title"
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description || ""}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter Question description"
                    />
                </div>

                {/* enTitle */}
                <div className="mb-4">
                    <label
                        htmlFor="entitle"
                        className="block text-sm font-medium text-gray-700"
                    >
                        enTitle
                    </label>
                    <input
                        type="text"
                        id="EnTitle"
                        value={enTitle || ""}
                        onChange={(e) => setEnTitle(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter entitle"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditQuestion