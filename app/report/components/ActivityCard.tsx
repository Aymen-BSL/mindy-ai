"use client"; // Add this at the top to enable client-side interactivity

import { useState } from "react";

interface ActivityCardProps {
  emoji: string;
  title: string;
  frequency: string;
  description: string;
  youtubeLink?: string; // Make youtubeLink optional
}

export default function ActivityCard({
  emoji,
  title,
  frequency,
  description,
  youtubeLink,
}: ActivityCardProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="border rounded-lg border-[#aa87e5] p-6">
      <div className="flex items-center space-x-4">
        <span className="text-4xl">{emoji}</span> {/* Emoji */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600">
            <span className="font-bold text-[#aa87e5]">{frequency}</span>
          </p>
        </div>
      </div>
      <p className="mt-2 text-gray-600">{description}</p>
      {/* Dropdown Button for YouTube Video (only if YouTube video exists) */}
      {youtubeLink && (
        <div className="mt-4">
          <button
            onClick={() => setIsVideoOpen(!isVideoOpen)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <img
              src="https://www.iconpacks.net/icons/2/free-youtube-logo-icon-2431-thumb.png"
              alt="YouTube Logo"
              className="w-6 h-6"
            />
            <span className="text-sm font-medium">Watch Video</span>
            <svg
              className={`w-4 h-4 transition-transform ${
                isVideoOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      )}
      {/* Dropdown for YouTube Video (only if YouTube video exists) */}
      {youtubeLink && (
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isVideoOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="mt-4">
            <iframe
              className="w-full h-80 rounded-lg"
              src={youtubeLink}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
