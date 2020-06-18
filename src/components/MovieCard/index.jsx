import React from 'react';
import {imgBaseUrl} from '../../../config.js'; 
import styles from './styles.scss';

const MovieCard = ({handleMovieSelected, index, movie, imgSize}) => {
	const {title, release_date, overview, poster_path, vote_average} = movie;
	const posterUrl = poster_path? imgBaseUrl + imgSize + poster_path : null;
	const handleSelect = (index) => {
		if(handleMovieSelected) handleMovieSelected(index)
	}
	return (
	<div className={`${styles.cardContainer} ${handleMovieSelected? styles.hover : ''}`} onClick={() => handleSelect(index)}>
		<div className={styles.posterContainer}>
			{
				posterUrl? <img src={posterUrl}></img> : <div className={styles.movieUnavailable}>{'No image available'}</div>
			}
		</div>
		<div className={styles.detailsContainer}>
			<div className={styles.cardHeader}>
				<h3>{title}</h3>
				<div className={styles.rating}>{vote_average}</div>
			</div>
			<div className={styles.cardDescription}>
				<label>Release date:</label>
				<p>{release_date || 'No release date available'}</p>
				<label>Overview</label>
				<p className={styles.overview}>{overview || 'No description available'}</p>
			</div>
		</div>
	</div>)
}

export default MovieCard;