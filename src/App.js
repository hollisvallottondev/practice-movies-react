import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import SearchBox from "./components/SearchBox/index.jsx";
import MovieCard from "./components/MovieCard/index.jsx";
import Modal from "./components/Modal/index.jsx";
import {
  baseMoviesUrl,
  topRatedMoviesUri,
  genresUri,
  searchMovieUri,
  discoverMovieUri,
} from "../config.js";

import { fetchFrom } from "./fetchWrapper";
import styles from "./styles.scss";

const App = () => {
  const [fetchUrl, setFetchUrl] = useState(baseMoviesUrl + topRatedMoviesUri);
  const [movies, setMovies] = useState({ results: [] });
  const [keywordsSelected, setKeywordsSelected] = useState([]);
  const [openModal, setOpeonModal] = useState(false);
  const [focusMovie, setFocusMovie] = useState(null);
  const [title, setTitle] = useState('');
  const [genres, setGenres] = useState([]);
  const [genresApplied, setGenresApplied] = useState({}); 

  const handleModalClose = () => {
	  setOpeonModal(false);
  }
  const handleKeywordSelected = (keyword) => {
	const alreadyExists = keywordsSelected.filter(keywordSelected => keywordSelected.id === keyword.id ).length;
	if(!alreadyExists){
		const newKeywords = [keyword, ...keywordsSelected];
		setKeywordsSelected(newKeywords);
		setFetchUrl( newKeywords.length? baseMoviesUrl + discoverMovieUri : baseMoviesUrl + topRatedMoviesUri);
	}
  };

  const handleKeywordDelete = (index) => {
	let newKeywords = keywordsSelected;
	newKeywords.splice(index, 1);
	setKeywordsSelected([...newKeywords]);
	setFetchUrl( newKeywords.length? baseMoviesUrl + discoverMovieUri : baseMoviesUrl + topRatedMoviesUri);
  }

  const handleGenreSelected = (genre) => {
	if(genresApplied[genre.id]){
		let newGenresApplied = {...genresApplied};
		delete newGenresApplied[genre.id];
		setGenresApplied(newGenresApplied);
	}else{
		setGenresApplied({...genresApplied, [genre.id]: true});
	}
  }

  const handleMovieSelected = (index) => {
	setOpeonModal(true);
	setFocusMovie(index);
  }

  const handleTitleSearch = (title) => {
	setTitle(title);
	setFetchUrl( title? baseMoviesUrl + searchMovieUri : baseMoviesUrl + topRatedMoviesUri );
	if(title) setKeywordsSelected([]);
  }

  const getCommaSeparated = (elements, key) => {
	  return elements.reduce( (accum, element, index) => {
		return accum += (key? element[key]: element) + (index === keywordsSelected.length - 1? '': ',');
	}, ''); 
  }

  const applyGenre = (movie) => {
	return Object.keys(genresApplied).length? movie.genre_ids.reduce( ( includes, id ) => includes || genresApplied[id], false ) : true;
  }

  useEffect(() => {
	const fetchGenres = async () => {
		const result = await fetchFrom(baseMoviesUrl + genresUri, {}, {});
		setGenres(result.genres);
	}
	fetchGenres();
  }, []);

  useEffect(() => {
	const searchByTitle = async (url) => {
		const result = await fetchFrom(url, {}, {query: title});
		setMovies(result);
	};
	const discover =  async (url) => {
	  const with_keywords = getCommaSeparated(keywordsSelected, 'id');
	  const with_genres = getCommaSeparated(Object.keys(genresApplied));
	  const result = await fetchFrom(url, {}, {with_keywords, with_genres});
      setMovies(result);
	}
	const getLatest = async (url) => {
	  const result = await fetchFrom(url, {}, {});
      setMovies(result);
	};	  
	
	if(title) searchByTitle(fetchUrl);
	else if (keywordsSelected.length || Object.keys(genresApplied).length) discover(fetchUrl);
	else getLatest(fetchUrl);

  }, [fetchUrl, title, JSON.stringify(keywordsSelected), JSON.stringify(genresApplied)]);

  return (
    <div className={styles.appContainer}>
	  <div className={styles.header}>
	  	<h1 className={styles.title}>Movies of every type for everyone</h1>
	  </div>
      <div className={styles.mainContainer}>
		{
			movies.results
				.filter(movie => applyGenre(movie))
				.map((movie, index) => (<MovieCard key={movie.id} handleMovieSelected={handleMovieSelected} movie={movie} imgSize={"w200"} index={index} /> ))
		}
      </div>
	  <div className={styles.sideBarContainer}>
		  <SearchBox 
		  	  handleTitleSearch={handleTitleSearch}
	          handleKeywordSelected={handleKeywordSelected}
			  keywordsSelected={keywordsSelected}
			  handleKeywordDelete={handleKeywordDelete}
			  handleGenreSelected={handleGenreSelected}
			  genres={genres}
			  genresApplied={genresApplied}
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
