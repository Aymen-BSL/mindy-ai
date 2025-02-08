"use client";
import InfoCard from "@/components/ui/InfoCard";
import { useState, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import { useRouter } from "next/navigation";

// Define card data structure
interface Activity {
    activity_name: string;
    activity_emoji: string;
    activity_description: string;
    activity_reps: string;
    activity_link?: string;
}

const Home: React.FC = () => {
    // State to track input values
    const [inputValues, setInputValues] = useState<number[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [apiResponse, setApiResponse] = useState<string>("");
    const [activities, setActivities] = useState<Activity[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const { messages, setMessages, userId, setUserId } = useChat();

    const router = useRouter();

    // Fetch activities dynamically
    useEffect(() => {
        const fetchActivities = async () => {
            setUserId(localStorage.getItem("userId"));
            try {
                if (!userId) return;
                const response = await fetch(
                    `https://3b90-41-226-8-251.ngrok-free.app/get-activities/${userId}`
                );
                if (!response.ok) throw new Error("Failed to fetch activities");
                const data = await response.json();
                setActivities(data);
                setInputValues(data.map(() => 0));
            } catch (error) {
                console.error("Error fetching activities:", error);
            }
        };
        fetchActivities();
    }, [userId]);

    // Handle input changes
    const handleInputChange = (index: number, value: number) => {
        const newValues = [...inputValues];
        newValues[index] = value;
        setInputValues(newValues);
    };

    // Handle submit
    const handleSubmit = async () => {
        const errors: string[] = [];

        activities.forEach((activity, index) => {
            const value = inputValues[index];
            const maxReps = parseInt(activity.activity_reps, 10) || Infinity;
            if (value > maxReps) {
                errors.push(
                    `"${activity.activity_name}" (Max: ${maxReps}, Current: ${value})`
                );
            }
        });

        if (errors.length > 0) {
            setErrorMessage(`Validation failed:\n${errors.join("\n")}`);
            return;
        }
        setErrorMessage("");

        try {
            // Construct activities_done array for the restart chat
            const activitiesDone = activities.map((activity, index) => ({
                activity_name: activity.activity_name,
                done: `${inputValues[index]}/${activity.activity_reps}`,
            }));

            const restartChatResponse = await fetch(
                `https://3b90-41-226-8-251.ngrok-free.app/restart-chat/${userId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        activities_done: activitiesDone,
                    }),
                }
            );
            if (!restartChatResponse.ok) throw new Error("Failed to restart chat");
            const restartChatData = await restartChatResponse.text();
            setApiResponse(restartChatData);
            setMessages([{ text: apiResponse, sender: "bot" }]);
            router.replace("/page2");

        } catch (error) {
            console.error("API Error:", error);
            setErrorMessage("An error occurred while processing your request.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 py-16">
            <div className="w-full max-w-3xl p-6 bg-white shadow-lg rounded-lg space-y-6">
                <p className="text-4xl font-bold text-[#aa87e5] mb-8">Weekly Results</p>

                {activities.map((activity, index) => (
                    <InfoCard
                        key={index}
                        emoji={activity.activity_emoji}
                        title={activity.activity_name}
                        maxNumber={parseInt(activity.activity_reps, 10) || Infinity}
                        value={inputValues[index]}
                        onChange={(value) => handleInputChange(index, value)}
                    />
                ))}

                <div className="flex flex-col items-end space-y-4">
                    {errorMessage && (
                        <p className="text-red-500 text-sm whitespace-pre-line">
                            {errorMessage}
                        </p>
                    )}

                    <button
                        onClick={handleSubmit}
                        className="p-4 min-w-[150px] bg-[#aa87e5] rounded-full text-xl text-gray-100 font-medium"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
