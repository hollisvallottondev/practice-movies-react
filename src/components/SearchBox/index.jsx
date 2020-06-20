import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.scss";
import DropDownBox from "../DropDownBox/index.jsx";
import CustomInput from "../CustomInput/index.jsx";
import {useClickOutside} from "../../hooks/clickOutside";

import { baseMoviesUrl, searchKeyWordBaseUri } from "../../../config.js";

import { fetchFrom } from "../../fetchWrapper";

const mobileBreakPoint = 768;

const SearchBox = ({
  handleGenreSelected,
  handleKeywordDelete,
  handleTitleSearch,
  handleKeywordSelected,
  keywordsSelected,
  genres,
  genresApplied,
}) => {
  const [searchUrl, setSearchUrl] = useState(
    baseMoviesUrl + searchKeyWordBaseUri
  );
  const [searchTimer, setSearchTimer] = useState();
  const [keywords, setKeywords] = useState({});
  const [windowDimensions, setWindowDimensions] = useState({
    width: null,
    height: null,
  });
  const [showBox, setShowBox] = useState(false);

  const sideBarRef = useRef(null);

  const handleSideBarClose = () => {
	  const { current: container } = sideBarRef;
	  if(container && !container.contains(event.target)) {
		  setShowBox(false);
	  }
  }

  useClickOutside(handleSideBarClose); 

  useEffect(() => {
    window.addEventListener("resize", updateWindowDimensions);
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    return () => {
      window.removeEventListener("resize", updateWindowDimensions);
    };
  }, []);

  const updateWindowDimensions = () => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  const handleSearchTitle = ({ target }) => {
    const { value } = target;
    handleTitleSearch(value);
  };

  const handleSearchKeywords = ({ target }) => {
    const { value } = target;
    clearTimeout(searchTimer);
    setSearchTimer(
      setTimeout(function () {
        const fetchKeyWords = async (url) => {
          if (value) {
            const result = await fetchFrom(url, {}, { query: value });
            const keyWordHash = result.results.reduce((accum, current) => {
              accum[current.id] = current;
              return accum;
            }, {});
            setKeywords(keyWordHash);
          } else {
            setKeywords([]);
          }
        };
        fetchKeyWords(searchUrl);
      }, 500)
    );
  };

  const handleOptionSelected = (keyword) => {
    let newKewords = keywords;
    delete newKewords[keyword.id];
    setKeywords(newKewords);
    handleKeywordSelected(keyword);
  };

    return (
      <div className={styles.navBarContainer}>
		{
			windowDimensions.width <= mobileBreakPoint && <header className={styles.header}><i onClick={() => setShowBox(!showBox)} className="fas fa-bars"></i></header>
		}
		{
			(showBox || windowDimensions.width >= mobileBreakPoint) && (
				<div className={styles.searchBoxWrapper} ref={sideBarRef}>

				<div className={styles.searchBoxContainer}>
				<CustomInput
				  handleSearch={handleSearchTitle}
				  placeHolder={"by movie title"}
				  icon={"fas fa-search"}
				/>
				<DropDownBox
				  handleSearch={handleSearchKeywords}
				  placeHolder={"by keywords"}
				  elements={keywords}
				  onOptionSelected={handleOptionSelected}
				  icon={"fas fa-search"}
				/>
			  </div>
			  <div className={styles.labelsContainer}>
				<h4>Keywords applied</h4>
				<ul className={styles.keywordList}>
				  {keywordsSelected.map((keyword, index) => {
					const { id, name } = keyword;
					return (
					  <li key={id}>
						<i className="fas fa-minus"></i>
						<h5
						  className={styles.keyWord}
						  onClick={() => handleKeywordDelete(index)}
						>
						  {name}
						</h5>
					  </li>
					);
				  })}
				</ul>
			  </div>
			  <div className={styles.genresContainer}>
				<h4>Genres</h4>
				<ul>
				  {genres.map((genre) => {
					return (
					  <li
						onClick={() => handleGenreSelected(genre)}
						key={genre.id}
						className={styles.genre}
					  >
						<input
						  onChange={() => handleGenreSelected(genre)}
						  checked={genresApplied[genre.id] ? true : false}
						  type="checkbox"
						/>
						<span>{genre.name}</span>
					  </li>
					);
				  })}
				</ul>
			  </div>
			</div>
			)
		}
	</div>);
};

export default SearchBox;
