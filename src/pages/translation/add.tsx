import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/axiosInstance';
import { Link } from 'react-router-dom'; // Import Link from React Router

const AddTranslation = () => {
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');
    const [language, setLanguage] = useState('en'); // Default language

    const mutation = useMutation(
        {
mutationFn:(translationData: any) => {
    return axiosInstance.post('/translation/add', translationData);
}

        }
    );

    const handleAddTranslation = async (e: { preventDefault: () => void; }) => {
        e.preventDefault(); // Prevent the default form submission behavior

        const translationData = {
            key: key,
            value: value,
            language: language,
        };

        try {
        mutation.mutate(translationData);
            console.log('Translation added successfully');
            // Reset form fields after successful submission
            setKey('');
            setValue('');
            setLanguage('en');
        } catch (error) {
            console.error('Error adding translation:', error);
        }
    };

    return (
        <div>
            <h1>Add Translation</h1>
            <form onSubmit={handleAddTranslation}>
                <div>
                    <label htmlFor="key">Translation Key:</label>
                    <input
                        type="text"
                        id="key"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="value">Translation Value:</label>
                    <input
                        type="text"
                        id="value"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="language">Language:</label>
                    <select
                        id="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="ar">Arabic</option>
                        {/* Add more languages as needed */}
                    </select>
                </div>
                <button type="submit">Add Translation</button>
            </form>
            {mutation.isPending && <p>Adding...</p>}
            {mutation.isError && <p>Error: {mutation.error.message}</p>}
            {mutation.isSuccess && <p>Translation added!</p>}
            <Link to="/">Go Back to Home</Link> {/* Navigation link */}
        </div>
    );
};

export default AddTranslation;
