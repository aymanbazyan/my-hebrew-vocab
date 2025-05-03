import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // Assuming you have uuid installed (npm install uuid)

function AddWordForm() {
  const navigate = useNavigate();

  const [newWord, setNewWord] = useState({
    id: uuidv4(), // Generate a unique ID
    hebrew: "",
    pronunciation_text: "",
    audio_url: "",
    categories: [],
    forms: [],
    meanings: [
      {
        english: [],
        arabic: [],
        example_sentences: [],
      },
    ],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWord({ ...newWord, [name]: value });
  };

  // --- Category Handlers ---
  const handleAddCategory = () => {
    setNewWord({ ...newWord, categories: [...newWord.categories, ""] });
  };

  const handleCategoryChange = (index, value) => {
    const updatedCategories = newWord.categories.map((cat, i) =>
      i === index ? value : cat
    );
    setNewWord({ ...newWord, categories: updatedCategories });
  };

  const handleRemoveCategory = (index) => {
    const updatedCategories = newWord.categories.filter((_, i) => i !== index);
    setNewWord({ ...newWord, categories: updatedCategories });
  };

  // --- Form Handlers ---
  const handleAddForm = () => {
    setNewWord({
      ...newWord,
      forms: [...newWord.forms, { type: "", text: "" }],
    });
  };

  const handleFormChange = (index, field, value) => {
    const updatedForms = newWord.forms.map((form, i) =>
      i === index ? { ...form, [field]: value } : form
    );
    setNewWord({ ...newWord, forms: updatedForms });
  };

  const handleRemoveForm = (index) => {
    const updatedForms = newWord.forms.filter((_, i) => i !== index);
    setNewWord({ ...newWord, forms: updatedForms });
  };

  // --- Meaning Handlers ---
  const handleAddMeaning = () => {
    setNewWord({
      ...newWord,
      meanings: [
        ...newWord.meanings,
        { english: [], arabic: [], example_sentences: [] },
      ],
    });
  };

  const handleMeaningChange = (meaningIndex, field, value) => {
    const updatedMeanings = newWord.meanings.map((meaning, i) =>
      i === meaningIndex ? { ...meaning, [field]: value } : meaning
    );
    setNewWord({ ...newWord, meanings: updatedMeanings });
  };

  const handleRemoveMeaning = (meaningIndex) => {
    const updatedMeanings = newWord.meanings.filter(
      (_, i) => i !== meaningIndex
    );
    setNewWord({ ...newWord, meanings: updatedMeanings });
  };

  // --- Translation (English/Arabic) Handlers within Meaning ---
  const handleAddTranslation = (meaningIndex, language) => {
    const updatedMeanings = newWord.meanings.map((meaning, i) => {
      if (i === meaningIndex) {
        return {
          ...meaning,
          [language]: [...meaning[language], ""],
        };
      }
      return meaning;
    });
    setNewWord({ ...newWord, meanings: updatedMeanings });
  };

  const handleTranslationChange = (
    meaningIndex,
    language,
    translationIndex,
    value
  ) => {
    const updatedMeanings = newWord.meanings.map((meaning, i) => {
      if (i === meaningIndex) {
        const updatedTranslations = meaning[language].map((text, j) =>
          j === translationIndex ? value : text
        );
        return {
          ...meaning,
          [language]: updatedTranslations,
        };
      }
      return meaning;
    });
    setNewWord({ ...newWord, meanings: updatedMeanings });
  };

  const handleRemoveTranslation = (
    meaningIndex,
    language,
    translationIndex
  ) => {
    const updatedMeanings = newWord.meanings.map((meaning, i) => {
      if (i === meaningIndex) {
        const updatedTranslations = meaning[language].filter(
          (_, j) => j !== translationIndex
        );
        return {
          ...meaning,
          [language]: updatedTranslations,
        };
      }
      return meaning;
    });
    setNewWord({ ...newWord, meanings: updatedMeanings });
  };

  // --- Example Sentence Handlers within Meaning ---
  const handleAddSentence = (meaningIndex) => {
    const updatedMeanings = newWord.meanings.map((meaning, i) => {
      if (i === meaningIndex) {
        return {
          ...meaning,
          example_sentences: [
            ...meaning.example_sentences,
            {
              hebrew: "",
              translation_english: "",
              translation_arabic: "",
              word_to_highlight: "",
            },
          ],
        };
      }
      return meaning;
    });
    setNewWord({ ...newWord, meanings: updatedMeanings });
  };

  const handleSentenceChange = (meaningIndex, sentenceIndex, field, value) => {
    const updatedMeanings = newWord.meanings.map((meaning, i) => {
      if (i === meaningIndex) {
        const updatedSentences = meaning.example_sentences.map((sentence, j) =>
          j === sentenceIndex ? { ...sentence, [field]: value } : sentence
        );
        return {
          ...meaning,
          example_sentences: updatedSentences,
        };
      }
      return meaning;
    });
    setNewWord({ ...newWord, meanings: updatedMeanings });
  };

  const handleRemoveSentence = (meaningIndex, sentenceIndex) => {
    const updatedMeanings = newWord.meanings.map((meaning, i) => {
      if (i === meaningIndex) {
        const updatedSentences = meaning.example_sentences.filter(
          (_, j) => j !== sentenceIndex
        );
        return {
          ...meaning,
          example_sentences: updatedSentences,
        };
      }
      return meaning;
    });
    setNewWord({ ...newWord, meanings: updatedMeanings });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the newWord data to a backend API
    // or update your application's state management
    console.log("New Word Data:", newWord);

    // For now, we'll just log and navigate back to the list
    // In a real app, you'd update the shared vocabulary state here
    navigate("/");
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
      <Link
        to="/"
        className="text-blue-600 hover:underline mb-6 inline-block text-lg font-medium"
      >
        &larr; Back to Vocabulary List
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Word</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Word Info */}
        <div>
          <label
            htmlFor="hebrew"
            className="block text-sm font-medium text-gray-700"
          >
            Hebrew Word:
          </label>
          <input
            type="text"
            id="hebrew"
            name="hebrew"
            value={newWord.hebrew}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="pronunciation_text"
            className="block text-sm font-medium text-gray-700"
          >
            Pronunciation Text (Optional):
          </label>
          <input
            type="text"
            id="pronunciation_text"
            name="pronunciation_text"
            value={newWord.pronunciation_text}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="audio_url"
            className="block text-sm font-medium text-gray-700"
          >
            Audio URL (Optional):
          </label>
          <input
            type="text"
            id="audio_url"
            name="audio_url"
            value={newWord.audio_url}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Categories */}
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Categories:
          </h3>
          {newWord.categories.map((category, index) => (
            <div key={index} className="flex items-center mb-2 gap-2">
              <input
                type="text"
                value={category}
                onChange={(e) => handleCategoryChange(index, e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => handleRemoveCategory(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddCategory}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm mt-2"
          >
            Add Category
          </button>
        </div>

        {/* Forms */}
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Forms:</h3>
          {newWord.forms.map((form, index) => (
            <div
              key={index}
              className="flex items-center mb-2 gap-2 p-3 bg-gray-50 rounded-md"
            >
              <input
                type="text"
                placeholder="Type (e.g., singular-female)"
                value={form.type}
                onChange={(e) =>
                  handleFormChange(index, "type", e.target.value)
                }
                className="block w-1/3 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Form Text (Hebrew)"
                value={form.text}
                onChange={(e) =>
                  handleFormChange(index, "text", e.target.value)
                }
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => handleRemoveForm(index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddForm}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm mt-2"
          >
            Add Form
          </button>
        </div>

        {/* Meanings */}
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Meanings:
          </h3>
          {newWord.meanings.map((meaning, meaningIndex) => (
            <div
              key={meaningIndex}
              className="mb-6 p-4 bg-gray-100 rounded-md shadow-inner space-y-4"
            >
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleRemoveMeaning(meaningIndex)}
                  className="text-red-600 hover:text-red-800 text-sm font-semibold"
                >
                  Remove Meaning
                </button>
              </div>

              {/* English Translations */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  English Translations:
                </h4>
                {meaning.english.map((translation, transIndex) => (
                  <div
                    key={transIndex}
                    className="flex items-center mb-2 gap-2"
                  >
                    <input
                      type="text"
                      value={translation}
                      onChange={(e) =>
                        handleTranslationChange(
                          meaningIndex,
                          "english",
                          transIndex,
                          e.target.value
                        )
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveTranslation(
                          meaningIndex,
                          "english",
                          transIndex
                        )
                      }
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddTranslation(meaningIndex, "english")}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-xs mt-1"
                >
                  Add English Translation
                </button>
              </div>

              {/* Arabic Translations */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  Arabic Translations:
                </h4>
                {meaning.arabic.map((translation, transIndex) => (
                  <div
                    key={transIndex}
                    className="flex items-center mb-2 gap-2"
                  >
                    <input
                      type="text"
                      value={translation}
                      onChange={(e) =>
                        handleTranslationChange(
                          meaningIndex,
                          "arabic",
                          transIndex,
                          e.target.value
                        )
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveTranslation(
                          meaningIndex,
                          "arabic",
                          transIndex
                        )
                      }
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddTranslation(meaningIndex, "arabic")}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-xs mt-1"
                >
                  Add Arabic Translation
                </button>
              </div>

              {/* Example Sentences */}
              <div className="border-t pt-3 mt-3">
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  Example Sentences:
                </h4>
                {meaning.example_sentences.map((sentence, sentenceIndex) => (
                  <div
                    key={sentenceIndex}
                    className="mb-4 p-3 bg-gray-50 rounded-md space-y-2"
                  >
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveSentence(meaningIndex, sentenceIndex)
                        }
                        className="text-red-600 hover:text-red-800 text-xs font-semibold"
                      >
                        Remove Sentence
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Hebrew Sentence:
                      </label>
                      <input
                        type="text"
                        value={sentence.hebrew}
                        onChange={(e) =>
                          handleSentenceChange(
                            meaningIndex,
                            sentenceIndex,
                            "hebrew",
                            e.target.value
                          )
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        English Translation (Optional):
                      </label>
                      <input
                        type="text"
                        value={sentence.translation_english}
                        onChange={(e) =>
                          handleSentenceChange(
                            meaningIndex,
                            sentenceIndex,
                            "translation_english",
                            e.target.value
                          )
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Arabic Translation (Optional):
                      </label>
                      <input
                        type="text"
                        value={sentence.translation_arabic}
                        onChange={(e) =>
                          handleSentenceChange(
                            meaningIndex,
                            sentenceIndex,
                            "translation_arabic",
                            e.target.value
                          )
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Word to Highlight (Hebrew):
                      </label>
                      <input
                        type="text"
                        value={sentence.word_to_highlight}
                        onChange={(e) =>
                          handleSentenceChange(
                            meaningIndex,
                            sentenceIndex,
                            "word_to_highlight",
                            e.target.value
                          )
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddSentence(meaningIndex)}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-1 px-3 rounded text-xs mt-1"
                >
                  Add Example Sentence
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddMeaning}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm mt-2"
          >
            Add Meaning
          </button>
        </div>

        {/* Submit Button */}
        <div className="pt-4 mt-6 border-t">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Save Word
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddWordForm;
