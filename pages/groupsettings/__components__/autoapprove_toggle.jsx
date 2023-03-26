import styles from '@/styles/Group.module.css'
import React from 'react';

function AutoApproveToggle({ isAutoApprove, onChange }) {
  const handleChange = (e) => {
    onChange(e.target.checked);
  };

  return (
    <div>
      <label htmlFor="auto-approve-toggle">Auto-approve Pending Requests:</label>
      <input
        type="checkbox"
        id="auto-approve-toggle"
        checked={isAutoApprove}
        onChange={handleChange}
      />
    </div>
  );
}

export default AutoApproveToggle;