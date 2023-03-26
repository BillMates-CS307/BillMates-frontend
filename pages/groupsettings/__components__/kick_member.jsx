import styles from '@/styles/Group.module.css'
import React from 'react';

function KickMemberButton({ onKick }) {
  return (
    <button className="kick-member-button" onClick={onKick}>Kick Member</button>
  );
}

export default KickMemberButton;