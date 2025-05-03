import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useOutsideClick } from "../hooks/useOutsideClick";

// Helper function to clean up words (remove basic punctuation and convert to lowercase)
const cleanWord = (word) => {
  return word.replace(/[.,!?;:"'()]/g, "").toLowerCase();
};

function EnhancedInteractiveText({
  hebrewText,
  allVocabulary,
  wordToHighlight,
}) {
  // State for managing the tooltip
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [activeWordId, setActiveWordId] = useState(null);

  // Ref for the main text container
  const textContainerRef = useOutsideClick(() => setActiveWordId(null));

  // Memoize the vocabulary data into a Map for efficient lookup
  const vocabularyMap = useMemo(() => {
    const map = new Map();
    allVocabulary.forEach((word) => {
      map.set(cleanWord(word.hebrew), word);
      word.forms?.forEach((form) => {
        map.set(cleanWord(form.text), word);
      });
    });
    return map;
  }, [allVocabulary]);

  // Handle word click to show tooltip
  const handleWordClick = (e, vocabWord) => {
    e.stopPropagation(); // Prevent event bubbling

    // If clicking the same word again, close the tooltip
    if (activeWordId === vocabWord.id) {
      setActiveWordId(null);
      setTooltipContent(null);
      return;
    }

    // Set the active word ID
    setActiveWordId(vocabWord.id);

    // Prepare content for the tooltip
    const firstMeaning = vocabWord.meanings?.[0];
    if (firstMeaning) {
      setTooltipContent({
        hebrew: vocabWord.hebrew,
        english: firstMeaning.english?.join(", "),
        arabic: firstMeaning.arabic?.join(", "),
        wordId: vocabWord.id,
      });

      // Calculate tooltip position
      const spanRect = e.target.getBoundingClientRect();
      const containerRect = textContainerRef.current?.getBoundingClientRect();

      if (containerRect) {
        setTooltipPosition({
          top: spanRect.top - containerRect.top - 60,
          left: spanRect.left - containerRect.left + spanRect.width / 2,
        });
      }
    }
  };

  // Close tooltip when clicking outside
  const handleOutsideClick = () => {
    setActiveWordId(null);
    setTooltipContent(null);
  };

  // Memoize the rendering of the text into spans
  const renderedText = useMemo(() => {
    const wordsAndSeparators = [];
    const tokens = hebrewText.match(/(\S+|\s+)/g) || [];
    const cleanedWordToHighlight = cleanWord(wordToHighlight || "");

    tokens.forEach((token, index) => {
      const cleaned = cleanWord(token);
      const vocabWord = vocabularyMap.get(cleaned);
      const isWordToHighlight =
        cleanedWordToHighlight !== "" && cleaned === cleanedWordToHighlight;
      const isActive = vocabWord && vocabWord.id === activeWordId;

      if (vocabWord) {
        wordsAndSeparators.push(
          <span
            dir="rtl"
            key={index}
            className={`text-blue-600 font-semibold cursor-pointer hover:underline relative
              ${isWordToHighlight ? "bg-yellow-200" : ""}
              ${isActive ? "text-blue-800 underline" : ""}`}
            onClick={(e) => handleWordClick(e, vocabWord)}
          >
            {token}
          </span>
        );
      } else {
        wordsAndSeparators.push(
          <span
            key={index}
            className={`${
              isWordToHighlight ? "bg-yellow-200 font-semibold" : ""
            }`}
          >
            {token}
          </span>
        );
      }
    });

    return wordsAndSeparators;
  }, [hebrewText, vocabularyMap, wordToHighlight, activeWordId]);

  return (
    <div
      dir="rtl"
      className="bg-white whitespace-pre text-wrap p-3 rounded shadow-sm border border-gray-200 relative overflow-visible"
      ref={textContainerRef}
      onClick={handleOutsideClick}
    >
      <p className="text-right text-gray-900 text-lg mb-1 leading-relaxed">
        {renderedText}
      </p>

      {tooltipContent && activeWordId && (
        <div
          className="absolute z-20 min-w-56 px-4 py-3 bg-white text-gray-800 rounded border border-gray-300 shadow-md"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: "translateX(-50%) translateY(-10px)",
          }}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside tooltip
        >
          {tooltipContent.hebrew && (
            <div className="text-center mb-2 font-bold text-gray-800 text-lg">
              {tooltipContent.hebrew}
            </div>
          )}

          <div className="border-b border-gray-200 mb-2"></div>

          {tooltipContent.english && (
            <div className="mb-2 flex gap-1">
              <span className="font-bold text-gray-700 min-w-8">EN:</span>
              {}
              <span className="text-gray-700">{tooltipContent.english}</span>
            </div>
          )}

          {tooltipContent.arabic && (
            <div className="flex gap-1">
              <span className="font-bold text-gray-700 min-w-8">AR:</span>
              <span className="text-gray-700">{tooltipContent.arabic}</span>
            </div>
          )}

          {tooltipContent.wordId && (
            <Link
              to={`/word/${tooltipContent.wordId}`}
              className="block text-center text-white bg-blue-600 hover:bg-blue-700 rounded-md py-1 mt-3 transition-colors duration-200"
            >
              More details
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default EnhancedInteractiveText;
