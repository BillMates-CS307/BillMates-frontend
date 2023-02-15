import type { FC } from 'react'
import styled from '@emotion/styled'

export const UserInfo: FC = () => <UserInfoWrapper>UserInfo</UserInfoWrapper>

const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 24px;
`
