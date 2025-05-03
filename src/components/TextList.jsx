import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

function TextList({ texts }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Derive unique categories from the texts data
  const categories = useMemo(() => {
    const uniqueCategories = [
      "All",
      ...new Set(texts.map((text) => text.category).filter(Boolean)),
    ];
    return uniqueCategories;
  }, [texts]);

  // Filter texts based on search query and selected category
  const filteredTexts = useMemo(() => {
    let currentTexts = texts;

    if (selectedCategory !== "All") {
      currentTexts = currentTexts.filter(
        (text) => text.category === selectedCategory
      );
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentTexts = currentTexts.filter((text) => {
        const titleMatch = text.title?.toLowerCase().includes(lowerCaseQuery);
        const hebrewMatch = text.hebrew_text
          ?.toLowerCase()
          .includes(lowerCaseQuery);
        const englishMatch = text.english_translation
          ?.toLowerCase()
          .includes(lowerCaseQuery);
        const arabicMatch = text.arabic_translation
          ?.toLowerCase()
          .includes(lowerCaseQuery);
        const categoryMatch = text.category
          ?.toLowerCase()
          .includes(lowerCaseQuery);

        return (
          titleMatch ||
          hebrewMatch ||
          englishMatch ||
          arabicMatch ||
          categoryMatch
        );
      });
    }

    return currentTexts;
  }, [texts, selectedCategory, searchQuery]);

  if (texts.length === 0) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 mb-4 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-600">Loading texts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Header with navigation */}
      <div className="flex flex-col mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Vocabulary List
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">
            Texts & Stories
          </h1>
          <Link
            to="/add-text"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New Text
          </Link>
        </div>
      </div>

      {/* Filters section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="w-full md:w-1/2">
            <label
              htmlFor="text-search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search Texts
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="text-search"
                className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search title, content, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-1/2">
            <label
              htmlFor="text-category-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter by Category
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <select
                id="text-category-filter"
                className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none bg-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category || "Uncategorized"}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results counter */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredTexts.length}{" "}
        {filteredTexts.length === 1 ? "text" : "texts"}
        {selectedCategory !== "All" ? ` in category "${selectedCategory}"` : ""}
        {searchQuery ? ` matching "${searchQuery}"` : ""}
      </div>

      {filteredTexts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-600 text-lg font-medium">
            No texts found matching your criteria.
          </p>
          <button
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium flex items-center"
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTexts.map((text) => (
            <Link
              key={text.id}
              to={`/texts/${text.id}`}
              className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {text.title}
                  </h2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                {text.category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {text.category}
                  </span>
                )}

                {text.hebrew_text && (
                  <div
                    dir="rtl"
                    className="mt-3 text-right text-gray-600 text-sm overflow-hidden line-clamp-2 dir-rtl"
                  >
                    {text.hebrew_text.substring(0, 100)}
                    {text.hebrew_text.length > 100 ? "..." : ""}
                  </div>
                )}

                <div className="mt-3 text-gray-500 text-sm flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Click to view full text
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default TextList;
