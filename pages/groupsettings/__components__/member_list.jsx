import styles from '@/styles/Group.module.css'
import { useState, useEffect } from 'react';

export default function MemberList({ groupMembers, groupOwnerId, currentUserId, onKickUser }) {
  console.log("groupMembers:", groupMembers);
  console.log("groupOwnerId:", groupOwnerId); //not working yet.. manager not getting called in properly
  console.log("currentUserId:", currentUserId);
  

  return (
    <div>
      <h3>Group Members</h3>
      <ul>
        {Object.keys(groupMembers).map((member) => (
          <li key={member}>
            {groupMembers[member]}
            {currentUserId == groupOwnerId && currentUserId != groupMembers && (
              <button onClick={() => onKickUser(member)}>Kick</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}