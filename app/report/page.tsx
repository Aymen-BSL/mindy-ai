"use client"; // Add this at the top to enable client-side interactivity

import { useEffect, useState } from "react";
import Button from "./components/Button";

export default function ReportPage() {
  const [isButtonUnlocked, setIsButtonUnlocked] = useState(false);
  const [remainingDays, setRemainingDays] = useState(7);

  useEffect(() => {
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* White Container */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        {/* Report Section */}
        <section className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Your Mental Health Report
          </h1>
          <p className="text-gray-600">
            Based on your recent interactions, here are some activities to help
            you improve your mental health.
          </p>
        </section>

        {/* Activities Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Suggested Activities
          </h2>
          <div className="space-y-4">
            {/* Activity Card */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">🧘‍♂️</span> {/* Larger Emoji */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Meditation
                  </h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">7</span> times per week
                  </p>
                </div>
              </div>
              <p className="mt-2 text-gray-600">
                Meditation helps reduce stress and improve focus. Try guided
                meditations on YouTube.
              </p>
              {/* YouTube Embed */}
              <div className="mt-4">
                <iframe
                  className="w-full h-48 rounded-lg"
                  src="https://www.youtube.com/embed/example-video-id"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Add more activities here */}
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
