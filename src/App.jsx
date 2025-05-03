import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import VocabularyList from "./components/VocabularyList";
import WordDetail from "./components/WordDetail";
import AddWordForm from "./components/AddWordForm";
import TextList from "./components/TextList"; // Import TextList
import "./index.css";
import vocabularyData from "./data/vocabulary.json";
import textsData from "./data/text.json"; // Import text data
import TextDetail from "./components/TextDetails";

function App() {
  const [vocabulary, setVocabulary] = useState([]);
  const [texts, setTexts] = useState([]); // State for text data

  useEffect(() => {
    setVocabulary(vocabularyData);
    setTexts(textsData); // Load text data
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route
            path="/"
            element={<VocabularyList vocabulary={vocabulary} />}
          />
          <Route
            path="/word/:wordId"
            element={<WordDetail vocabulary={vocabulary} />}
          />
          <Route path="/add-word" element={<AddWordForm />} />
          <Route path="/texts" element={<TextList texts={texts} />} />
          <Route
            path="/texts/:textId"
            element={<TextDetail texts={texts} vocabulary={vocabulary} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
