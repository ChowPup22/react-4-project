import React from 'react';
import styles from './InputBase.module.css';

const InputBase = ({ passData, errorM, header, type, ...props }) => (
	<label>
		{header && <div className={styles.header}>{header}</div>}
		{errorM ? (
			<input
				style={{ border: '2px solid red' }}
				type={type}
				className={styles.input_root}
				{...props}
			/>
		) : (
			<input
				className={styles.input_root}
				type={type}
				{...props}
			/>
		)}
		{errorM && <div className={styles.error}>{errorM}</div>}
	</label>
);

export default InputBase;
