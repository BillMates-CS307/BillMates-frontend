import styles from '@/styles/Group.module.css'
import React, { useState } from 'react';

function MaxCommentLengthInput({ setCommentChange, options = [] }) {

  const handleChange = (event) => {
    setCommentChange(event.target.value);
    // if (onCommentChange) {
    //   onCommentChange(event.target.value);
    // }
  };

  return (
    <div>
      <label htmlFor="comment">Expense Comment Length:</label>
      <input
        type="text"
        id="comment"
        name="comment"
        defaultValue = {options}
        onChange={handleChange}
      />
    </div>
  );
};

export default MaxCommentLengthInput;
