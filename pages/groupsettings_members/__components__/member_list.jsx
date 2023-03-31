import styles from '@/styles/Group.module.css'
import { useState, useEffect } from 'react';

export default function MemberList({ groupMembers, groupOwnerId, currentUserId, onKickUser }) {

  return (
    <div>
      <h3>Group Members</h3>
      <ul>
        {Object.keys(groupMembers).map((member) => (
          <li key={member}>
            {groupMembers[member]}
          </li>
        ))}
      </ul>
    </div>
  );
}