import React, {useState, useRef, useEffect} from "react";
import styles from "./styles.scss";
import { useClickOutside } from '../../hooks/clickOutside'; 

const DropDownBox = ({ handleSearch, elements, onOptionSelected, icon = null }) => {
  const keys = 	Object.keys(elements);
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');
  const containerRef = useRef(null);

  const handleClick = event=> {
	  setIsFocused(true);
  }

  const handleChange = (event) => {
	  event.persist();
	  const {value} = event.target;
	  handleSearch(event);
	  setValue(value);
  }

  const handleOptionSelected = (element) => {
	  onOptionSelected(element);
  }

  const handleClickOutside = event => {
	const { current: container } = containerRef;
	if(container && !container.contains(event.target)) {
		setIsFocused(false);
		setValue('');
	}
  }

  useClickOutside(handleClickOutside);

  return (
    <div  ref={containerRef} className={styles.wrapper}>
      <div className={styles.header}>
		  {
			  icon && <i className={icon}></i>
		  }
        <input type="text" onChange={handleChange} onClick={handleClick} value ={value}/>
      </div>
	  {
	  	keys.length && isFocused? (
        <div className={styles.listWrapper}>
          <ul className={styles.list}>
            {keys.map((key) => {
			  const element = elements[key];
              const { id, name } = element;
              return (
                <li key={id} onClick={() => handleOptionSelected(element)}>
					<i className = {'fas fa-plus'} />
					<span>{name}</span>
                </li>
              );
            })}
          </ul>
        </div>) : null
      }
    </div>
  );
};

export default DropDownBox;
