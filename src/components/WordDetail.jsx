import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import EnhancedInteractiveText from "./EnhancedInteractiveText";

function WordDetail({ vocabulary }) {
  const { wordId } = useParams();
  const [word, setWord] = useState(null);

  const playAudio = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
    }
  };

  useEffect(() => {
    const foundWord = vocabulary.find((item) => item.id === wordId);
    setWord(foundWord);
  }, [wordId, vocabulary]);

  if (vocabulary.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center text-gray-600">
        Loading vocabulary data...
      </div>
    );
  }

  if (!word) {
    return (
      <div className="container mx-auto p-4 text-center text-gray-600">
        Word not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
      <Link
        to={-1}
        className="text-blue-600 hover:underline mb-6 inline-block text-lg font-medium"
      >
        &larr; Back to Vocabulary List
      </Link>

      <div className="flex items-center justify-end border-b pb-3 mb-4">
        <button
          className={`ml-4 text-blue-600 hover:text-blue-800 focus:outline-none ${
            !word.audio_url ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => playAudio(word.audio_url)}
          disabled={!word.audio_url}
          title={word.audio_url ? "Play pronunciation" : "No audio available"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.899a9 9 0 010 12.728M5.586 15H4a1 0 01-1-1v-4a1 0 011-1h1.586l1.586-1.586a1 0 011.414 0L12 9.172V15.828l-2.828 2.828a1 0 01-1.414 0L5.586 15z"
            />
          </svg>
        </button>
        <h1 className="text-4xl font-extrabold text-gray-900">{word.hebrew}</h1>
      </div>

      {/* Display Note if it exists */}
      {word.note && (
        <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Note:</h2>
          <p className="text-gray-700 text-lg italic">{word.note}</p>
        </div>
      )}

      {/* Pronunciation */}
      {word.pronunciation_text && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Pronunciation:
          </h2>
          <p className="text-gray-700 text-lg">{word.pronunciation_text}</p>
        </div>
      )}

      {/* Forms */}
      {word.forms && word.forms.length > 0 && (
        <div className="mb-6 border-t pt-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Forms:</h2>
          <ul className="list-disc list-inside text-gray-700 text-lg">
            {word.forms.map((form, index) => (
              <li key={index}>
                <strong>{form.type}:</strong> {form.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Meanings */}
      {word.meanings && word.meanings.length > 0 && (
        <div className="mb-6 border-t pt-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Meanings:
          </h2>
          {word.meanings.map((meaning, meaningIndex) => (
            <div
              key={meaningIndex}
              className="mb-6 p-4 bg-gray-50 rounded-md shadow-sm"
            >
              {/* English Translations */}
              {meaning.english && meaning.english.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-lg font-medium text-gray-700 mb-1">
                    English:
                  </h3>
                  <p className="text-gray-600 italic">
                    {meaning.english.join(", ")}
                  </p>
                </div>
              )}

              {/* Arabic Translations */}
              {meaning.arabic && meaning.arabic.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-lg font-medium text-gray-700 mb-1">
                    Arabic:
                  </h3>
                  <p className="text-gray-600 italic">
                    {meaning.arabic.join(", ")}
                  </p>
                </div>
              )}

              {/* Example Sentences for this Meaning */}
              {meaning.example_sentences &&
                meaning.example_sentences.length > 0 && (
                  <div className="border-t pt-3 mt-3">
                    <h4 className="text-md font-semibold text-gray-700 mb-2">
                      Example Sentences:
                    </h4>
                    <ul className="space-y-3">
                      {meaning.example_sentences.map(
                        (sentence, sentenceIndex) => (
                          <li key={sentenceIndex} dir="rtl">
                            <EnhancedInteractiveText
                              hebrewText={sentence.hebrew}
                              allVocabulary={vocabulary}
                              wordToHighlight={sentence.word_to_highlight}
                            />
                            {sentence.translation_english && (
                              <p
                                dir="ltr"
                                className="text-left text-gray-700 text-sm mt-1 leading-relaxed"
                              >
                                {sentence.translation_english}
                              </p>
                            )}
                            {sentence.translation_arabic && (
                              <p className="text-right text-gray-700 text-sm mt-1 leading-relaxed">
                                {sentence.translation_arabic}
                              </p>
                            )}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}

      {/* Categories */}
      {word.categories && word.categories.length > 0 && (
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Categories:
          </h2>
          <p className="text-gray-700 text-lg">{word.categories.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

export default WordDetail;
