import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // 👈 ADD

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation(); // 👈 ADD

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <div className="search-section">
      <div className="search-box">
        <i
          className="bx bx-search"
          onClick={handleSearch}
          style={{ cursor: "pointer" }}
        ></i>

        <input
          placeholder={t("search_placeholder")} // 👈 TRANSLATED
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
}

export default SearchBar;