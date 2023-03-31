import styles from '@/styles/Group.module.css'
import React, { useState } from 'react';

function MaxCommentLengthInput({ setCommentChange, options = [] }) {

  return (
    <div>
      <label htmlFor="comment">Expense Comment Length:</label>
      <input
        type="number"
        id="comment"
        name="comment"
        min="0" max="200"
        defaultValue = {options}
      />
    </div>
  );
};

export default MaxCommentLengthInput;
