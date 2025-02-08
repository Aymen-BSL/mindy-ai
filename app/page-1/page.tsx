// app/page-1/page.tsx
"use client"; // This is necessary if you're using client-side interactivity (e.g., useState)

import { useState } from "react";
import StartChat from "./StartChat";

export default function Page1() {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [time, setTime] = useState<string>("");
  const [isStartChat, setIsStartChat] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (time === "") {
      alert("Please select a time for your session.");
      return;
    }
    alert(`Thank you, ${name}! You have selected ${time} for your session.`);
    setIsStartChat(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl"
      >
        <h1
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: "#745E96" }}
        >
          Coach Session Form
        </h1>

        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-700"
          >
            Age
          </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) =>
              setAge(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            How much time do you have to talk to the coach today?
          </label>
          <div className="mt-2 space-y-2">
            <label className="flex items-center p-4 border border-gray-300 rounded-md hover:bg-gray-200">
              <input
                type="radio"
                name="time"
                value="5"
                checked={time === "5"}
                onChange={() => setTime("5")}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-black">5 mins</span>
            </label>
            <label className="flex items-center p-4 border border-gray-300 rounded-md hover:bg-gray-200">
              <input
                type="radio"
                name="time"
                value="15"
                checked={time === "15"}
                onChange={() => setTime("15")}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-black">15 mins</span>
            </label>
            <label className="flex items-center p-4 border border-gray-300 rounded-md hover:bg-gray-200">
              <input
                type="radio"
                name="time"
                value="30"
                checked={time === "30"}
                onChange={() => setTime("30")}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-black">30 mins</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="text-white py-3 px-8 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300 ease-in-out"
          style={{ backgroundColor: "#745E96", float: "left" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#BCA4E3")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#745E96")
          }
        >
          Next
        </button>
      </form>
      {isStartChat && (
        <StartChat name={name} age={Number(age)} conversation_time={time} />
      )}
    </div>
  );
}
