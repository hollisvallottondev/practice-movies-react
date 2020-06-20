import React, {useState, useRef, useEffect} from "react";
import PropTypes from 'prop-types';
import styles from "./styles.scss";

const CustomInput = ({handleSearch, placeHolder, icon = null}) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
	  event.persist();
	  const {value} = event.target;
	  if(handleSearch) handleSearch(event);
	  setValue(value);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
		  {
			  icon && <i className={icon}></i>
		  }
        <input type="text" onChange={onChange} value ={value} placeholder={placeHolder}/>
      </div>
    </div>
  );
};

CustomInput.propTypes = {
  handleSearch: PropTypes.func, 
  placeHolder: PropTypes.string, 
  icon: PropTypes.string
}

export default CustomInput;