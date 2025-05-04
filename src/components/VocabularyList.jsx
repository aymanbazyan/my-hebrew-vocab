import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";

function VocabularyList({
  vocabulary,
  visibleVocabulary,
  setVisibleVocabulary,
}) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("hebrew-asc");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const playAudio = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
    }
  };

  useEffect(() => {
    const uniqueCategories = [
      "All",
      ...new Set(vocabulary.flatMap((word) => word.categories)),
    ];
    setCategories(uniqueCategories);
  }, [vocabulary]);

  // Reset visible items when filters change
  // useEffect(() => {
  //   setVisibleVocabulary(10);
  // }, [selectedCategory, searchQuery, sortBy]);

  const sortedAndFilteredVocabulary = useMemo(() => {
    let currentVocabulary = vocabulary;

    if (selectedCategory !== "All") {
      currentVocabulary = currentVocabulary.filter((word) =>
        word.categories.includes(selectedCategory)
      );
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentVocabulary = currentVocabulary.filter((word) => {
        if (word.hebrew.toLowerCase().includes(lowerCaseQuery)) {
          return true;
        }
        if (word.meanings) {
          for (const meaning of word.meanings) {
            if (
              meaning.english &&
              meaning.english.some((eng) =>
                eng.toLowerCase().includes(lowerCaseQuery)
              )
            ) {
              return true;
            }
            if (
              meaning.arabic &&
              meaning.arabic.some((ar) =>
                ar.toLowerCase().includes(lowerCaseQuery)
              )
            ) {
              return true;
            }
          }
        }
        if (
          word.pronunciation_text &&
          word.pronunciation_text.toLowerCase().includes(lowerCaseQuery)
        ) {
          return true;
        }
        if (word.forms) {
          for (const form of word.forms) {
            if (form.text.toLowerCase().includes(lowerCaseQuery)) {
              return true;
            }
          }
        }
        return false;
      });
    }

    currentVocabulary.sort((a, b) => {
      const [field, order] = sortBy.split("-");
      let comparison = 0;
      if (field === "hebrew") {
        comparison = a.hebrew.localeCompare(b.hebrew, "he");
      } else if (field === "english") {
        const aEnglish = a.meanings?.[0]?.english?.[0] || "";
        const bEnglish = b.meanings?.[0]?.english?.[0] || "";
        comparison = aEnglish.localeCompare(bEnglish);
      }
      return order === "asc" ? comparison : -comparison;
    });

    return currentVocabulary;
  }, [vocabulary, selectedCategory, sortBy, searchQuery]);

  // Handle showing more items
  const handleShowMore = () => {
    setVisibleVocabulary((prev) => prev + 10); // Show 10 more items each time
  };

  // Get only the visible subset of items
  const visibleVocabularySliced = sortedAndFilteredVocabulary.slice(
    0,
    visibleVocabulary
  );

  if (vocabulary.length === 0) {
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
          <p className="text-lg font-medium text-gray-600">
            Loading vocabulary...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Header with action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          Practice your words
        </h1>
        <div className="flex space-x-3">
          <Link
            to="/add-word"
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
            Add Word
          </Link>
          <Link
            to="/texts"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200 flex items-center border border-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
            Texts & Stories
          </Link>
        </div>
      </div>

      {/* Filters section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search Input */}
          <div className="w-full md:w-1/2">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search Words
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
                id="search"
                className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search Hebrew, English, Arabic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-1/2">
            <label
              htmlFor="category-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter by Category
            </label>
            <select
              id="category-filter"
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Control */}
        <div>
          <label
            htmlFor="sort-by"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sort by
          </label>
          <select
            id="sort-by"
            className="block w-full md:w-48 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="hebrew-asc">Hebrew (A-Z)</option>
            <option value="hebrew-desc">Hebrew (Z-A)</option>
            <option value="english-asc">English (A-Z)</option>
            <option value="english-desc">English (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Results counter */}
      <div className="mb-4 text-sm text-gray-600">
        Showing{" "}
        {Math.min(visibleVocabulary, sortedAndFilteredVocabulary.length)} of{" "}
        {sortedAndFilteredVocabulary.length}{" "}
        {sortedAndFilteredVocabulary.length === 1 ? "word" : "words"}
        {selectedCategory !== "All" ? ` in category "${selectedCategory}"` : ""}
        {searchQuery ? ` matching "${searchQuery}"` : ""}
      </div>

      {sortedAndFilteredVocabulary.length === 0 ? (
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
            No words found matching your criteria.
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
        <>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleVocabularySliced.map((word) => (
              <li
                key={word.id}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow hover:shadow-md transition-shadow"
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => navigate(`/word/${word.id}`)}
                >
                  <div className="flex-1 min-w-0 mr-4">
                    {word.meanings && word.meanings.length > 0 && (
                      <div className="mb-1">
                        {word.meanings[0].english && (
                          <p className="text-gray-700 font-medium truncate">
                            {word.meanings[0].english.join(", ")}
                          </p>
                        )}
                        {word.meanings[0].arabic && (
                          <p className="text-gray-600 text-sm truncate">
                            {word.meanings[0].arabic.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                    {word.categories && word.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {word.categories.map((category, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right flex items-center">
                    <h2 className="text-xl font-bold text-gray-900">
                      {word.hebrew}
                    </h2>
                    <button
                      className={`ml-3 text-blue-500 hover:text-blue-700 focus:outline-none ${
                        !word.audio_url
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-blue-50 rounded-full p-1"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio(word.audio_url);
                      }}
                      disabled={!word.audio_url}
                      title={
                        word.audio_url
                          ? "Play pronunciation"
                          : "No audio available"
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.899a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l1.586-1.586a1 1 0 011.414 0L12 9.172V15.828l-2.828 2.828a1 1 0 01-1.414 0L5.586 15z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Show More Button */}
          {visibleVocabulary < sortedAndFilteredVocabulary.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleShowMore}
                className="bg-white border border-gray-300 shadow-sm hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-md transition duration-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Show More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default VocabularyList;
