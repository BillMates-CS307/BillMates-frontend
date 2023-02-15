import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from '@emotion/styled'
import { AppBar } from '@pagesImpl/home/__components__/AppBar'
import { UserInfo } from '@pagesImpl/home/__components__/UserInfo'
import { Groups } from '@pagesImpl/home/__components__/Groups'
import { selectUserData } from '@lib/store/api/__slice__/userData.api.slice'
import { homeActions } from '@lib/store/home/__slice__/home.slice'

export default function HomeImpl() {
  const dispatch = useDispatch()
  const userData = useSelector(selectUserData)
  const requestFetchRideReservations = useCallback(() => {
    dispatch(homeActions.requestGetUserData())
  }, [dispatch])

  useEffect(() => {
    requestFetchRideReservations()
  }, [requestFetchRideReservations])

  return (
    <BackgroundWrapper>
      <PageWrapper>
        <AppBar />
        <UserInfo />
        <Groups />
      </PageWrapper>
    </BackgroundWrapper>
  )
}

const BackgroundWrapper = styled.div`
  background: linear-gradient(180deg, #000 0%, #19254c 100%);
`

const PageWrapper = styled.div`
  max-width: 440px;
  margin: 0 auto;
  color: #f9f9f9;
`
