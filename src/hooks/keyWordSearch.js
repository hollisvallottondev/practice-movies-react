import { useState, useEffect } from 'react';
import {baseMoviesUrl, searchKeyWordBaseUri} from '../../config'; 

export function useKeyWordSearch(event) {
	const [searchUrl, setSearchUrl] = useState(baseMoviesUrl + searchKeyWordBaseUri);
	const [searchTimer, setSearchTimer] = useState();
	const [keywords, setKeywords] = useState({});

	const handleSearch = (event) => {
		const { value } = event.target;
		clearTimeout(searchTimer);
		setSearchTimer(
		  setTimeout(function () {
			const fetchKeyWords = async (url) => {
			  if (value) {
				const result = await fetchFrom(url, {}, { query: value });
				const keyWordHash = result.results.reduce((accum, current) => {
					accum[current.id] = current;
					return accum;
				}, {})
				setKeywords(keyWordHash);
				return keyWordHash;
			  } else {
				setKeywords([]);
			  }
			};
			fetchKeyWords(searchUrl);
		  }, 1000)
		);
	  };
	  
	  return keywords;
}