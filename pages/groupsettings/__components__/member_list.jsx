import styles from '@/styles/Group.module.css'
import { useState, useEffect } from 'react';
import { useStore } from 'react-redux';

export default function MemberList({ groupMembers, groupOwnerId, currentUserId, onKickUser }) {
  const store = useStore();
  //const state = store.getState().groupData;

  return (
    <div>
      <h3>Group Members</h3>
      <ul>
        {Object.keys(groupMembers).map((member) => (
          <li key={member}>
            {groupMembers[member]}
            {currentUserId === groupOwnerId && currentUserId !== member && (
              <button onClick={() => onKickUser(member)}>Kick</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}