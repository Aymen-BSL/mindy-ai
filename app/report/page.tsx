"use client"; // Add this at the top to enable client-side interactivity

import { useEffect, useState } from "react";
import Button from "./components/Button";
import ActivityCard from "./components/ActivityCard";

interface Activity {
  emoji: string;
  title: string;
  frequency: string;
  description: string;
  youtubeLink: string;
}

export default function ReportPage() {
  const [isButtonUnlocked, setIsButtonUnlocked] = useState(false);
  const [remainingDays, setRemainingDays] = useState(7);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Mock API data for testing
  const mockActivities = [
    {
      emoji: "🧘‍♂️",
      title: "Meditation",
      frequency: "7",
      description:
        "Meditation helps reduce stress and improve focus. Try guided meditations on YouTube.",
      youtubeLink: "https://www.youtube.com/embed/example-video-id",
    },
    {
      emoji: "🏃‍♂️",
      title: "Running",
      frequency: "5",
      description: "Running improves cardiovascular health and boosts mood.",
      // No YouTube link for this activity
    },
    {
      emoji: "📖",
      title: "Reading",
      frequency: "3",
      description:
        "Reading enhances knowledge and reduces stress. Try reading a book for 30 minutes.",
      youtubeLink: "https://www.youtube.com/embed/yet-another-video-id",
    },
  ];

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchActivities = async () => {
      try {
        // Simulate a delay for API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActivities(mockActivities); // Use mock data
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      }
    };

    fetchActivities();

    // Check local storage for the first visit timestamp
    const firstVisit = localStorage.getItem("firstVisit");
    const now = new Date();

    if (!firstVisit) {
      // If no timestamp exists, set it to the current time
      localStorage.setItem("firstVisit", now.toISOString());
    } else {
      // Calculate the difference between now and the first visit
      const firstVisitDate = new Date(firstVisit);
      const diffInDays = Math.floor(
        (now.getTime() - firstVisitDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Calculate remaining days
      const daysLeft = 7 - diffInDays;
      setRemainingDays(daysLeft > 0 ? daysLeft : 0);

      // Unlock the button if 7 days have passed
      if (diffInDays >= 7) {
        setIsButtonUnlocked(true);
      }
    }
  }, []);

  const handleUpdateProgress = () => {
    alert("Progress updated!");
    // Add logic to handle progress update here
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {/* White Container */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-10">
        {/* Report Section */}
        <section className="mb-12">
          {/* gray-800 */}
          <h1 className="text-4xl font-bold text-[#aa87e5] mb-4">
            Your Mental Health Report
          </h1>
          <p className="text-gray-600 ml-2">
            Based on your recent interactions, here are some activities to help
            you improve your mental health.
          </p>
        </section>

        {/* Activities Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Make your week special with these activities
          </h2>
          <div className="space-y-6">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <ActivityCard
                  key={index}
                  emoji={activity.emoji}
                  title={activity.title}
                  frequency={activity.frequency}
                  description={activity.description}
                  youtubeLink={activity.youtubeLink}
                />
              ))
            ) : (
              <p className="text-gray-600">Loading activities...</p>
            )}
          </div>
        </section>

        {/* Unlockable Button */}
        <div className="mt-8">
          <Button onClick={handleUpdateProgress} disabled={!isButtonUnlocked}>
            {isButtonUnlocked
              ? "Update Progress"
              : `Update Progress (Available in ${remainingDays} days)`}
          </Button>
        </div>
      </div>
    </div>
  );
}
