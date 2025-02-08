// components/InfoCard.tsx
"use client";
import React, { ChangeEvent } from "react";

// Define the types for the props
interface InfoCardProps {
    emoji: string;
    title: string;
    maxNumber: number; // Changed from `number` to `maxNumber` for clarity
    value: number; // Added to track the input value from the parent
    onChange: (value: number) => void; // Added to handle input changes
}

const InfoCard: React.FC<InfoCardProps> = ({
    emoji,
    title,
    maxNumber,
    value,
    onChange,
}) => {
    // Handle input change and ensure it's a number
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
            // Only allow numeric input
            const numericValue = inputValue === "" ? 0 : Number(inputValue); // Convert to number
            onChange(numericValue); // Pass the value to the parent
        }
    };

    return (
        <div className="p-6 shadow-[#aa87e5] rounded-lg flex items-center space-x-4 w-full gap-1 border border-[#aa87e5]">
            <span className="text-4xl">{emoji}</span>

            <h3 className="text-xl font-semibold">{title}</h3>
            <div className="flex items-center flex-1 justify-end min-w-[150px]">
                <input
                    type="text"
                    value={value === 0 ? "" : value} // Show empty string if value is 0
                    onChange={handleChange}
                    className="w-12 p-2 border border-gray-300 rounded-md mr-2"
                />
                <p className="text-2xl text-[#aa87e5]">{` / ${maxNumber}`}</p>
            </div>
        </div>
    );
};

export default InfoCard;