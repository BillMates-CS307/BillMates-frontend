import styled from "@emotion/styled";



export default function NotificationDetail({_id, sender, message, time, closePanel, deleteNotification, index}) {
    console.log(sender);

    return (
        <>
        <BackgroundBlur>
              <NotificationDetailWrapper>
        <NotificationDetailContentsWrapper>
          <NotificationDetailTitle><CloseButton onClick={()=>{closePanel(-1)}}></CloseButton></NotificationDetailTitle>
          <NotificationDetailSender>
            {sender}
          </NotificationDetailSender>
          <NotificationDetailMessage>
            {message}
          </NotificationDetailMessage>
          <NotificationDetailTime>{time}</NotificationDetailTime>
        </NotificationDetailContentsWrapper>
        <DeleteButtonWrapper onClick={()=>{deleteNotification(index)}}>
          Delete
        </DeleteButtonWrapper>
      </NotificationDetailWrapper>
      </BackgroundBlur>
        </>
    )
}

const CloseButton = styled.div`
display: block;
width: 20px;
height: 20px;
position: relative;
cursor: pointer;
margin-left: auto;

:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
    background: var(--main-background-font-color);
    height: 100%;
    width: 3px;
  }

  :after {
    content: '';
    position: absolute;
    transform: translate(-50%, -50%) rotate(45deg);
    height: 3px;
    width: 100%;
    background: var(--main-background-font-color);
    top: 50%;
    left: 50%;
  }
`

const BackgroundBlur = styled.div`
background-color: var(--background-hide-color);
width: 100vw;
height: 100vh;
position: absolute;
top: 0;
left: 0;
z-index: 999;
`

const NotificationDetailWrapper = styled.div`
  max-width: 600px;
  width : 80%;
  margin: auto;
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: 1px 2px 15px 0 #949494;
  background: var(--main-background);
  color: var(--main-background-font-color);
  top: 30%;
position: absolute;
left: 50%;
transform: translate(-50%, -50%);
`;

const NotificationDetailContentsWrapper = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  max-height: 600px;
  border: 1px solid var(--neutral-background);
  border-radius: var(--border-radius);
  overflow: hidden;
`;

const NotificationDetailTitle = styled.div`
  padding: 10px;
  background-color: var(--green-background);
  font-size: 16px;
  font-weight: bold;
`;

const NotificationDetailSender = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 5px 10px;
`;

const NotificationDetailMessage = styled.div`
  margin: 0 10px;
  padding: 10px 5px;
  max-width: 100%;
  border-top: 1px solid var(--neutral-background);
  word-break: break-word;
`;

const NotificationDetailTime = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 5px 10px;
  color: var(--dark-neutral-background);
`;

const DeleteButtonWrapper = styled.div`
  text-align: center;
  margin-top: 10px;
  padding: 10px;
  width: 100%;
  border-radius: var(--border-radius);
  box-shadow: 1px 2px 3px 0 #949494;
  background: var(--green-background);
  color: white;
  font-weight: bold;
`;
