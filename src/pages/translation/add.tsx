import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/axiosInstance';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const AddTranslation = () => {
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');
    const [language, setLanguage] = useState('ar');

    const mutation = useMutation({
        mutationFn: (translationData: any) => {
            return axiosInstance.post('/translation/add', translationData);
        }
    });

    const handleAddTranslation = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const translationData = { key: key.trim(), value: value.trim(), language };

        try {
            mutation.mutate(translationData);
            setKey('');
            setValue('');
            setLanguage('en');
        } catch (error) {
            console.error('Error adding translation:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
                <Link 
                    to="/" 
                    className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Translation</h1>

                <form onSubmit={handleAddTranslation} className="space-y-6">
                <div className="space-y-2">
                        <label 
                            className="block text-sm font-medium text-gray-700"
                        >
                            Target Language
                        </label>
                        <Select
                            value={language}
                            onValueChange={setLanguage}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ar">Arabic</SelectItem>
                                <SelectItem value="es">Spanish</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                                <SelectItem value="de">German</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label 
                            htmlFor="key" 
                            className="block text-sm font-medium text-gray-700"
                        >
                            Source Text
                        </label>
                        <input
                            type="text"
                            id="key"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>

                    <div className="space-y-2">
                        <label 
                            htmlFor="value" 
                            className="block text-sm font-medium text-gray-700"
                        >
                            Translation
                        </label>
                        <input
                            type="text"
                            id="value"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>

                    

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? 'Adding...' : 'Add Translation'}
                    </button>
                </form>

                {mutation.isError && (
                    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                        Error: {mutation.error.message}
                    </div>
                )}

                {mutation.isSuccess && (
                    <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
                        Translation added successfully!
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddTranslation;
