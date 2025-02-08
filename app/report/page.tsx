"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./components/Button";
import ActivityCard from "./components/ActivityCard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Activity {
  emoji: string;
  title: string;
  frequency: string;
  description: string;
  youtubeLink?: string;
}

export default function ReportPage() {
  const router = useRouter();
  const [isButtonUnlocked, setIsButtonUnlocked] = useState(false);
  const [remainingDays, setRemainingDays] = useState(7);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [reportText, setReportText] = useState<string>("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        // Retrieve the user_id stored after starting a chat session
        const userId = localStorage.getItem("user_id") || 928351;
        // const userId = 928351;
        if (!userId) {
          console.error("No user_id found in localStorage");
          return;
        }

        // Call the GET /get-report/<user_id> endpoint
        const response = await fetch(
          `https://3b90-41-226-8-251.ngrok-free.app/get-report/${userId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // The API now returns a Markdown-formatted report
        setReportText(data.report || "");

        // Map the API's activity objects to the format expected by ActivityCard
        const formattedActivities = data.activities.map((activity: any) => ({
          emoji: activity.activity_emoji,
          title: activity.activity_name,
          frequency: activity.activity_reps,
          description: activity.activity_description,
          youtubeLink: activity.activity_link, // This is optional per the API spec
        }));
        setActivities(formattedActivities);
      } catch (error) {
        console.error("Failed to fetch report:", error);
      }
    };

    fetchReport();

    // Button unlock logic: using the first visit timestamp from localStorage.
    const firstVisit = localStorage.getItem("firstVisit");
    const now = new Date();

    if (!firstVisit) {
      localStorage.setItem("firstVisit", now.toISOString());
    } else {
      const firstVisitDate = new Date(firstVisit);
      const diffInDays = Math.floor(
        (now.getTime() - firstVisitDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const daysLeft = 7 - diffInDays;
      setRemainingDays(daysLeft > 0 ? daysLeft : 0);

      if (diffInDays >= 7) {
        setIsButtonUnlocked(true);
      }
    }
  }, []);

  // When the progress update button is clicked, replace the current route with /page4
  const handleUpdateProgress = () => {
    router.replace("/page4");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {/* White Container */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-10">
        {/* Report Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-[#aa87e5] mb-4">
            Your Mental Health Report
          </h1>
          <div className="text-gray-600 ml-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {reportText || "Your Mental Health Report"}
            </ReactMarkdown>
          </div>
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
