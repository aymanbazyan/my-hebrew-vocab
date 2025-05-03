import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import EnhancedInteractiveText from "./EnhancedInteractiveText"; // Import the interactive text component

function TextDetail({ texts, vocabulary }) {
  // Accept texts and vocabulary as props
  const { textId } = useParams();
  const [text, setText] = useState(null);

  useEffect(() => {
    // Find the text from the texts prop
    const foundText = texts.find((item) => item.id === textId);
    setText(foundText);
  }, [textId, texts]); // Add texts to dependencies

  // Show loading or not found based on texts prop and found text
  if (texts.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center text-gray-600">
        Loading texts data...
      </div>
    );
  }

  if (!text) {
    return (
      <div className="container mx-auto p-4 text-center text-gray-600">
        Text not found.
      </div>
    );
  }

  // Check if vocabulary is loaded before rendering interactive text
  if (vocabulary.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center text-gray-600">
        Loading vocabulary data for interactive text...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
      <Link
        to={-1}
        className="text-blue-600 hover:underline mb-6 inline-block text-lg font-medium"
      >
        &larr; Back to Texts List
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">{text.title}</h1>

      {/* Render Hebrew text with interactivity */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 ">
          Hebrew Text:
        </h2>
        <EnhancedInteractiveText
          hebrewText={text.hebrew_text}
          allVocabulary={vocabulary} // Pass the full vocabulary
        />
      </div>

      {/* Display Full Text Translations */}
      {text.english_translation && (
        <div className="mb-6 border-t pt-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            English Translation:
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed whitespace-pre text-wrap">
            {text.english_translation}
          </p>
        </div>
      )}

      {text.arabic_translation && (
        <div className="mb-6 border-t pt-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Arabic Translation:
          </h2>
          <p
            dir="rtl"
            className="text-gray-700 text-lg text-right leading-relaxed whitespace-pre text-wrap"
          >
            {text.arabic_translation}
          </p>
        </div>
      )}
    </div>
  );
}

export default TextDetail;
