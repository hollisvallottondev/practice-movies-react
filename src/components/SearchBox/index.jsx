import React, {useState} from 'react';
import styles from './styles.scss'; 
import DropDownBox from '../DropDownBox/index.jsx';
import {
	baseMoviesUrl,
	searchKeyWordBaseUri,
  } from "../../../config.js";
  import {fetchFrom} from '../../fetchWrapper';

const SearchBox = ({handleKeywordDelete, handleKeywordSelected, keywordsSelected}) => {
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
		  }, 500)
		);
	  };

	const handleOptionSelected = (keyword) => {
		handleKeywordSelected(keyword);
		let newKewords = keywords;
		delete newKewords[keyword.id]; 
		setKeywords(newKewords);
	}

	return (
		<div className={styles.searchBoxWrapper}>
			<div className={styles.searchBoxContainer}>
				<DropDownBox handleSearch={handleSearch} elements={keywords} onOptionSelected={handleOptionSelected} icon={'fas fa-search'}/>
				<DropDownBox elements={{}} icon={'far fa-calendar'}/>
			</div>
			<div className={styles.labelsContainer}>
				<h4>Keywords applied</h4>
				<ul className ={styles.keywordList}>
				{
					keywordsSelected.map( (keyword, index) => { 
						const {id, name} = keyword;
						return (<li key={id}>
							<i className="fas fa-minus"></i>							
							<h5 className={styles.keyWord} onClick={() => handleKeywordDelete(index)}>{name}</h5>
						</li>)
					})
				}
			</ul>
			</div>
		</div>
	)
}

export default SearchBox;