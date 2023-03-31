import styles from '@/styles/Group.module.css'
import React from 'react';

function AutoApproveToggle({ setAutoApproved, options}) {
  
  const handleAutoApprove = (e) => {
    setAutoApproved(e.target.checked);
    //onChange(getSelectedOptions());
  };

  return (
    <div>
      <label htmlFor="auto-approve-toggle">Auto-approve Pending Requests:</label>
      <input
        type="checkbox"
        id="auto-approve-toggle"
        checked={options}
      />
    </div>
  );
}

export default AutoApproveToggle;