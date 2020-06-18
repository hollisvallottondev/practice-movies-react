import React, {useState} from 'react';
import DropDownBox from '../DropDownBox/index.jsx'; 
import {
	baseMoviesUrl,
	searchKeyWordBaseUri,
  } from "../../../config.js";
  import {fetchFrom} from '../../fetchWrapper';

import styles from './styles.scss'; 

const NavBar = ({handleKeywordSelected, keywordsSelected}) => {
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
			  } else {
				setKeywords([]);
			  }
			};
			fetchKeyWords(searchUrl);
		  }, 1000)
		);
	  };

	const handleOptionSelected = (keyword) => {
		handleKeywordSelected(keyword);
		let newKewords = keywords;
		delete newKewords[keyword.id]; 
		setKeywords(newKewords);
	}
	return (
		<div className={styles.navBar}>
			<DropDownBox handleSearch={handleSearch} keywords={keywords} onOptionSelected={handleOptionSelected}/>
			<ul>
			{
				keywordsSelected.map( keyword => { 
					const {id, name} = keyword;
					return (<li key={id}>{name}</li>)
				})
			}
			</ul>
		</div>
	)
}

export default NavBar;