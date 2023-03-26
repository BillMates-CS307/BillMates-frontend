import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import styles from '@/styles/Group.module.css'
import MemberList from '../../groupsettings/__components__/member_List';
import LeaveGroupButton from '../../groupsettings/__components__/leave_group';
import AllowedFulfillmentOptions from './__components__/allowed_fulfillment_options';
import AutoApproveToggle from './__components__/autoapprove_toggle';
import MaxCommentLengthInput from './__components__/max_comment_length_input';
import KickMemberButton from './__components__/kick_member';

// To fetch group data......
// import { fetchGroupData } from '../api/group';

function GroupSettings() {
  const router = useRouter();
  const groupId = router.query.id;

  const [groupData, setGroupData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGroupData() {
      // Fetch group data and set the state
      const group = {
        id: groupId,
        name: 'Sample Group',
        ownerId: 'ownerId',
        members: [ //MOCK DATA.. DELETE
          { id: 'ownerId', name: 'Owner' },
          { id: 'member1', name: 'Member 1' },
          { id: 'member2', name: 'Member 2' },
        ],
      };
      setGroupData(group);
      setIsLoading(false);
    }

    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);

  const handleLeaveGroup = () => {
    // Implement logic to leave group
    
    // Redirect to the home page after leaving the group
    router.push('/home');
  };

  const handleKickUser = (userId) => {
    // Implement logic to kick user from group
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Group Settings: {groupData.name}</h2>
      <MemberList
        groupMembers={groupData.members}
        groupOwnerId={groupData.ownerId}
        currentUserId="member1" // Replace this with the actual current user ID
        onKickUser={handleKickUser}
      />
      <LeaveGroupButton onLeaveGroup={handleLeaveGroup} />
    </div>
  );
}

export default GroupSettings;