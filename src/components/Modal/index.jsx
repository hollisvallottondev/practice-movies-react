import React, {useRef, useEffect} from 'react';
import styles from './styles.scss'; 
import {useClickOutside} from '../../hooks/clickOutside'; 

const Modal = ({open, handleClose, children}) => {
	const modalRef = useRef(null);
	const handleModalClose = () => {
		const { current: container } = modalRef;
		if(container && !container.contains(event.target)) {
			handleClose();
		}
	}

	useClickOutside(handleModalClose); 

	return open? (
		<div className={styles.modalMask}>
			<div className={styles.modalWrapper}>
		  		<div ref={modalRef} className={styles.modalContainer}>
				  	<i className={"fas fa-times-circle"} onClick={handleClose}></i>
					 {children}
				</div>
			</div>
		</div>
	): null;
}

export default Modal;