import styles from '@/styles/Group.module.css'
import { useState, useEffect } from 'react';

export default function MemberList({ groupMembers, groupOwnerId, currentUserId, onKickUser }) {

  return (
    <div>
      <h3>Group Members</h3>
      <ul>
        {Object.keys(groupMembers).map((member) => (
          (member == groupOwnerId)?
          <></>
          :
          <li key={member}>
            {groupMembers[member]}
            <button onClick={(e) => onKickUser(e, member)}>Kick</button>
          </li>
        ))}
      </ul>
    </div>
  );
}