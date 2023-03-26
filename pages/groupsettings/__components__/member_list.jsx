import styles from '@/styles/Group.module.css'
import { useState, useEffect } from 'react';

function MemberList({ groupMembers, groupOwnerId, currentUserId, onKickUser }) {
  return (
    <div>
      <h3>Group Members</h3>
      <ul>
        {groupMembers.map((member) => (
          <li key={member.id}>
            {member.name}
            {currentUserId === groupOwnerId && currentUserId !== member.id && (
              <button onClick={() => onKickUser(member.id)}>Kick</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MemberList;