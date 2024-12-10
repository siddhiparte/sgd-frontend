// app/page.tsx
'use client'
import React, { useState } from 'react';
import axios from 'axios';

const Page = () => {
    const [skills, setSkills] = useState<string>('');
    const [predictions, setPredictions] = useState<any[]>([]);
    const [error, setError] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSkills(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setPredictions([]);

        const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);

        try {
            const response = await axios.post('http://127.0.0.1:5000/predict', {
                skills: skillsArray
            });
            setPredictions(response.data.predictions);
        } catch (err) {
            setError('Error fetching predictions. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Skill Predictor</h1>
            <form onSubmit={handleSubmit} className="mt-4">
                <textarea
                    value={skills}
                    onChange={handleInputChange}
                    placeholder="Enter skills separated by commas"
                    className="w-full p-2 border rounded"
                    rows={5}
                />
                <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">
                    Predict Skills
                </button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {predictions.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold">Predictions:</h2>
                    <ul className="list-disc ml-5">
                        {predictions.map((prediction, index) => (
                            <li key={index}>
                                Input Skill: <strong>{prediction.input_skill}</strong> &rarr; Predicted Base Skill: <strong>{prediction.base_skill}</strong> (Confidence: {prediction.confidence.toFixed(2)}%)
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Page;
