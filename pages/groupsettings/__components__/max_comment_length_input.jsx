import styles from '@/styles/Group.module.css'
import React from 'react';

function MaxCommentLengthInput({ maxLength, onChange }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <label htmlFor="max-comment-length">Max Comment Length:</label>
      <input
        type="number"
        id="max-comment-length"
        min="0"
        max="200"
        value={maxLength}
        onChange={handleChange}
      />
    </div>
  );
}

export default MaxCommentLengthInput;