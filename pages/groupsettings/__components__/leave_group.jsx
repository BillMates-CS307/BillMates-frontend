import styles from '@/styles/Group.module.css'
import React from 'react';

function LeaveGroupButton({ onLeaveGroup }) {
    return <button onClick={onLeaveGroup}>Leave Group</button>;
  }
  
  export default LeaveGroupButton;