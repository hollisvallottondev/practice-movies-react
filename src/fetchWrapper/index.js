import { apiKey, bearerToken } from '../../config.js';

export const fetchFrom = async (url, options, params) => {	
	let urlObj = new URL(url);
	let paramObj = {api_key:apiKey, ...params};

	let optionsObj = {
		withCredentials: false, 
		credentials: 'omit', 
		headers: {
			'Authorization': 'Bearer ' + bearerToken,
			'Content-Type': 'application/json'
		},
		...options};

	Object.keys(paramObj)
		.forEach(key => urlObj.searchParams.append(key, paramObj[key]));

  	return new Promise((resolve, reject) => {
    	fetch(urlObj.href, optionsObj)
      	.then((res) => res.json())
      	.then((res) => resolve(res))
      	.catch((err) => alert(err));
  	});
};
