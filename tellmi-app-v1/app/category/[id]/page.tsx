"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Plus } from "lucide-react"
import { ActionSheet } from "@/components/ui/action-sheet"

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)

  // Sample category data based on ID
  const getCategoryData = (id: string) => {
    const categories = {
      "1": { name: "Dietary", color: "bg-[#a9e8e8]" },
      "2": { name: "Work", color: "bg-[#f5e2a0]" },
      "3": { name: "Learn English and Arabic", color: "bg-[#d2ccf2]" },
    }
    return categories[id as keyof typeof categories] || { name: "Category", color: "bg-[#a9e8e8]" }
  }

  const category = getCategoryData(params.id)

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <div className="flex-1 p-4 pb-20">
        <div className="flex items-center mb-6">
          <Link href="/" className="mr-4">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold">{category.name}</h1>
        </div>

        <div className={`${category.color} rounded-2xl p-6 mb-6 w-full`}>
          <h2 className="text-lg font-semibold">{category.name}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-white border border-[#d7dfee] rounded-xl p-4 h-24 flex flex-col items-center justify-center"
          >
            <div className="w-8 h-8 rounded-full border-2 border-[#414ba4] flex items-center justify-center mb-1">
              <Plus className="w-5 h-5 text-[#414ba4]" />
            </div>
            <span className="text-[#414ba4] font-medium">Add</span>
          </button>

          <button
            onClick={() => setIsAIModalOpen(true)}
            className="bg-[#414ba4] rounded-xl p-4 h-24 flex flex-col items-center justify-center"
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="#414ba4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="#414ba4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="#414ba4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-white font-medium">Get From AI</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between px-8 py-2">
        <Link href="/" className="flex flex-col items-center text-primary">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.02 2.84001L3.63 7.04001C2.73 7.74001 2 9.23001 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.29001 21.19 7.74001 20.2 7.05001L14.02 2.72001C12.62 1.74001 10.37 1.79001 9.02 2.84001Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 17.99V14.99"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/clock" className="flex flex-col items-center text-[#8291ae]">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51001"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xs mt-1">Clock</span>
        </Link>
        <Link href="/calendar" className="flex flex-col items-center text-[#8291ae]">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 2V5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 2V5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.5 9.09H20.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.6947 13.7H15.7037"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.6947 16.7H15.7037"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.9955 13.7H12.0045"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.9955 16.7H12.0045"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.29431 13.7H8.30329"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.29431 16.7H8.30329"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xs mt-1">Events</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-[#8291ae]">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.71997 11.28 8.71997 9.51C8.71997 7.7 10.18 6.23 12 6.23C13.81 6.23 15.28 7.7 15.28 9.51C15.27 11.28 13.88 12.72 12.12 12.78Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.74 19.38C16.96 21.01 14.6 22 12 22C9.40001 22 7.04001 21.01 5.26001 19.38C5.36001 18.44 5.96001 17.52 7.03001 16.8C9.77001 14.98 14.25 14.98 16.97 16.8C18.04 17.52 18.64 18.44 18.74 19.38Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </nav>

      {/* Add Item Modal */}
      <ActionSheet isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="relative">
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="absolute top-0 right-0 w-6 h-6 bg-[#414ba4] rounded-full flex items-center justify-center text-white"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 3L3 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 3L9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <h2 className="text-lg font-medium mb-6">Add New Event</h2>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Event name*"
                className="w-full p-3 border border-[#d7dfee] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414ba4]"
              />
            </div>

            <div>
              <textarea
                placeholder="Type the note here..."
                className="w-full p-3 border border-[#d7dfee] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414ba4] min-h-[100px]"
              ></textarea>
            </div>

            <button className="w-full bg-[#414ba4] text-white font-medium py-3 rounded-lg">CREATE EVENT</button>
          </div>
        </div>
      </ActionSheet>

      {/* AI Modal */}
      <ActionSheet isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)}>
        <div className="relative">
          <button
            onClick={() => setIsAIModalOpen(false)}
            className="absolute top-0 right-0 w-6 h-6 bg-[#414ba4] rounded-full flex items-center justify-center text-white"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 3L3 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 3L9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <h2 className="text-lg font-medium mb-6">Get Suggestions from AI</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#8291ae] mb-2">What is the goal of the diet?</label>
              <div className="relative">
                <select className="w-full p-3 border border-[#d7dfee] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414ba4] appearance-none pr-10">
                  <option>Weight loss</option>
                  <option>Weight gain</option>
                  <option>Weight maintenance</option>
                  <option>Muscle building</option>
                  <option>Vegan</option>
                  <option>Vegetarian</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M2 4L6 8L10 4"
                      stroke="#8291ae"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#8291ae] mb-2">Age</label>
                <div className="relative">
                  <select className="w-full p-3 border border-[#d7dfee] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414ba4] appearance-none pr-10">
                    <option>18-24</option>
                    <option>25-34</option>
                    <option>35-44</option>
                    <option>45-54</option>
                    <option>55+</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M2 4L6 8L10 4"
                        stroke="#8291ae"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8291ae] mb-2">Height</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="cm"
                    className="w-full p-3 border border-[#d7dfee] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414ba4]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#8291ae] mb-2">Gender</label>
                <div className="relative">
                  <select className="w-full p-3 border border-[#d7dfee] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414ba4] appearance-none pr-10">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M2 4L6 8L10 4"
                        stroke="#8291ae"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8291ae] mb-2">Weight</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="kg"
                    className="w-full p-3 border border-[#d7dfee] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414ba4]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8291ae] mb-2">ACTIVITY LEVEL</label>
              <p className="text-xs text-[#8291ae] mb-2">How much physical activity do you do daily?</p>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input type="radio" name="activity" className="mr-2" />
                  <span className="text-sm">Low</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="activity" className="mr-2" checked />
                  <span className="text-sm">Moderate</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="activity" className="mr-2" />
                  <span className="text-sm">High</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8291ae] mb-2">DISEASES OR ALLERGIES</label>
              <p className="text-xs text-[#8291ae] mb-2">
                Do you have any specific medical conditions or food allergies?
              </p>
              <textarea
                placeholder="Please Type..."
                className="w-full p-3 border border-[#d7dfee] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414ba4] min-h-[80px]"
              ></textarea>
            </div>

            <button className="w-full bg-[#414ba4] text-white font-medium py-3 rounded-lg">CREATE EVENT</button>
          </div>
        </div>
      </ActionSheet>
    </main>
  )
}

