import styles from '@/styles/Group.module.css'
import React, { useState } from 'react';

function MaxCommentLengthInput({ setCommentChange, options = [] }) {

  return (
    <div>
      <label htmlFor="comment">Expense Comment Length:</label>
      <input
        type="text"
        id="comment"
        name="comment"
        value = {options}
        readOnly
      />
    </div>
  );
};

export default MaxCommentLengthInput;
