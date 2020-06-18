import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import NavBar from "./components/NavBar/index.jsx";
import SearchBox from "./components/SearchBox/index.jsx";
import MovieCard from "./components/MovieCard/index.jsx";
import Modal from "./components/Modal/index.jsx";
import {
  baseMoviesUrl,
  topRatedMoviesUri,
  searchKeyWordBaseUri,
  latestMoviesUri,
  discoverMovieUri,
  movieUri
} from "../config.js";
import { fetchFrom } from "./fetchWrapper";
import styles from "./styles.scss";
const App = () => {
  const [fetchUrl, setFetchUrl] = useState(baseMoviesUrl + topRatedMoviesUri);
  const [movies, setMovies] = useState({ results: [] });
  const [keywordsSelected, setKeywordsSelected] = useState([]);
  const [openModal, setOpeonModal] = useState(false);
  const [focusMovie, setFocusMovie] = useState(null);

  const handleModalClose = () => {
	  setOpeonModal(false);
  }
  const handleKeywordSelected = (keyword) => {
	const newKeywords = [keyword, ...keywordsSelected];
	setKeywordsSelected(newKeywords);
	setFetchUrl(baseMoviesUrl + discoverMovieUri);
  };

  const handleKeywordDelete = (index) => {
	let newKeywords = keywordsSelected;
	newKeywords.splice(index, 1);
	setKeywordsSelected([...newKeywords]);
	if(!newKeywords.length){
		setFetchUrl(baseMoviesUrl + topRatedMoviesUri)
	}
  }

  const handleMovieSelected = (index) => {
	setOpeonModal(true);
	setFocusMovie(index);
  }
  useEffect(() => {
    const fetchData = async (url) => {
		const with_keywords = keywordsSelected.reduce( (accum, keyword, index) => {
			return accum += keyword.id + (index === keywordsSelected.length - 1? '': ',');
		}, ''); 

	  const result = await fetchFrom(url, {}, {with_keywords});
      setMovies(result);
	};
	fetchData(fetchUrl);
  }, [fetchUrl, keywordsSelected]);

  return (
    <div className={styles.appContainer}>
	  <div className={styles.header}>
	  	<h1 className={styles.title}>Movies of every type for everyone</h1>
	  </div>
      <div className={styles.mainContainer}>
        {movies.results.map((movie, index) => (
          <MovieCard handleMovieSelected={handleMovieSelected} movie={movie} imgSize={"w200"} index={index} /> //Memoize
        ))}
      </div>
	  <div className={styles.sideBarContainer}>
      	<SearchBox 
	          handleKeywordSelected={handleKeywordSelected}
			  keywordsSelected={keywordsSelected}
			  handleKeywordDelete={handleKeywordDelete}
		/>
	  </div>
	  <Modal open = {openModal} handleClose = {handleModalClose}>
			<div>
				<MovieCard movie = {movies.results[focusMovie]} imgSize={"w200"} index = {null}/>
				<div className={styles.modalActions}>
					<button className={styles.offline}>Watch Offline</button>
					<button className={styles.online}>Watch Online</button>
				</div>
			</div>
	  </Modal>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
