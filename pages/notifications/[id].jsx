import React from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";

const NotificationDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  // TODO: notification data fetch 해와야됨

  return (
    <NotificationDetailWrapper>notification {id}</NotificationDetailWrapper>
  );
};

export default NotificationDetail;

const NotificationDetailWrapper = styled.div`
  max-width: 440px;
  margin: 0 auto;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 1px 2px 15px 0 #949494;
  background: #fff;
  color: black;
`;
