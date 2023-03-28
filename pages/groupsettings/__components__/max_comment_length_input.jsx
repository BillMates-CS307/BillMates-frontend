import styles from '@/styles/Group.module.css'
import React, { useState } from 'react';

function MaxCommentLengthInput({ onCommentChange }) {
  const [comment, setComment] = useState('200');

  const handleChange = (event) => {
    setComment(event.target.value);
    if (onCommentChange) {
      onCommentChange(event.target.value);
    }
  };

  return (
    <div>
      <label htmlFor="comment">Expense Comment Length:</label>
      <input
        type="text"
        id="comment"
        name="comment"
        maxLength="200"
        value={comment}
        onChange={handleChange}
      />
    </div>
  );
};

export default MaxCommentLengthInput;
