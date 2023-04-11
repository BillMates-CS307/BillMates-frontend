import React, { useState, useEffect } from "react";
import { useRouter } from "next/router.js";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import { user_methods } from "@/lambda_service/userService";
import Header from "@/pages/global_components/groups_header";
import Footer from "@/pages/global_components/footer";
import CustomHead from "@/pages/global_components/head";
import { CommonPopup } from "@/lib/ui/CommonPopup";
import { selectGroupData } from "@/lib/store/groupData.slice";
import SubmitButton from "../_components_/SubmitButton";
import moment from "moment";
import {
  eventDataAction,
  selectEventData,
} from "@/lib/store/eventData/eventData.slice";
import { isNil } from "lodash";

export default function EventForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isAuthenticated, setAuthentication] = useState(false);
  const groupData = useSelector(selectGroupData);
  const { date, time } = useSelector(selectEventData);
  const userId = isAuthenticated ? localStorage.getItem("tempId") : null;

  async function check() {
    let result = await user_methods.validateLoginJWT(router);
    if (result.success) {
      localStorage.setItem("tempId", result.payload.email);
      setAuthentication(true);
    }
  }

  function holdGroupID() {
    if (userId == groupData.manager) {
      router.push("/groupsettings/" + groupData.groupId);
    } else {
      router.push("/groupsettings_members/" + groupData.groupId);
    }
  }

  const onNameBlurHandler = (e) => {
    dispatch(
      eventDataAction.setName({
        name: e.currentTarget.value,
      })
    );
  };

  const onDescriptionBlurHandler = (e) => {
    dispatch(
      eventDataAction.setDescription({
        description: e.currentTarget.value,
      })
    );
  };

  const onLocationBlurHandler = (e) => {
    dispatch(
      eventDataAction.setLocation({
        location: e.currentTarget.value,
      })
    );
  };

  const onDateChange = (v) => {
    console.log(v);
    dispatch(
      eventDataAction.setDate({
        date: moment(v).format("YYYY-MM-DD"),
      })
    );
  };

  const onTimeChange = (v) => {
    console.log(v);
    dispatch(
      eventDataAction.setTime({
        time: v,
      })
    );
  };

  const onClickSubmitHandler = async (e) => {
    e.preventDefault();
    dispatch(eventDataAction.requestFlowAddEvent());
  };

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("authenticating");
      check();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isNil(date)) {
      dispatch(
        eventDataAction.setDate({
          date: moment(new Date()).format("YYYY-MM-DD"),
        })
      );
    }
  }, [dispatch, date]);

  useEffect(() => {
    if (isNil(time)) {
      dispatch(
        eventDataAction.setTime({
          time: moment(new Date()).format("HH:mm:ss"),
        })
      );
    }
  }, [dispatch, time]);

  return (
    <>
      <CustomHead
        title={"Group Event Form"}
        description={"A BillMates group event form"}
      />
      <CommonPopup />
      <Header groupId={holdGroupID} />
      <CalendarWrapper>
        <EventTitleWrapper>
          <EventTitle>Event Form</EventTitle>
        </EventTitleWrapper>
        <PickerWrapper>
          <EventInputLabel>Date</EventInputLabel>
          <DatePicker locale="en" onChange={onDateChange} value={date} />
        </PickerWrapper>
        <PickerWrapper>
          <EventInputLabel>Time</EventInputLabel>
          <TimePicker
            locale="en"
            format="HH:mm:ss"
            maxDetail="second"
            onChange={onTimeChange}
            value={time}
          />
        </PickerWrapper>
        <EventInputSectionWrapper marginTop={10}>
          <EventInputLabel>Name</EventInputLabel>
          <EventInputWrapper>
            <EventInput
              type="text"
              name="name"
              required
              minlength="1"
              maxlength="20"
              onBlur={onNameBlurHandler}
            />
          </EventInputWrapper>
        </EventInputSectionWrapper>
        <EventInputSectionWrapper marginTop={5}>
          <EventInputLabel>Description</EventInputLabel>
          <EventInputWrapper>
            <EventInput
              type="text"
              name="description"
              required
              minlength="1"
              maxlength="100"
              onBlur={onDescriptionBlurHandler}
            />
          </EventInputWrapper>
        </EventInputSectionWrapper>
        <EventInputSectionWrapper marginTop={5}>
          <EventInputLabel>Location</EventInputLabel>
          <EventInputWrapper>
            <EventInput
              type="text"
              name="location"
              required
              minlength="1"
              maxlength="30"
              onBlur={onLocationBlurHandler}
            />
          </EventInputWrapper>
        </EventInputSectionWrapper>
        <SubmitButton
          text="Add Event"
          onClickSubmitHandler={onClickSubmitHandler}
        />
        <Space />
      </CalendarWrapper>
      <Footer />
    </>
  );
}

const CalendarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 700px;
  width: 90%;
  margin: 0 auto;
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: 1px 2px 15px 0 #949494;
  color: var(--main-background-font-color);
  background: var(--main-background);
`;

const EventTitleWrapper = styled.div`
  padding: 10px;
  width: 100%;
  background: var(--green-background);
  color: var(--main-background-font-color);
`;

const EventTitle = styled.h3``;

const PickerWrapper = styled.div`
  width: 100%;
  max-width: 1110px;
  margin-top: 5px;
  padding: 0 10px 0 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 19px;
`;

const EventInputSectionWrapper = styled.div`
  ${({ marginTop }) => css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: ${marginTop}px;
    padding: 0 10px 0 10px;
    width: 100%;
  `}
`;

const EventInputLabel = styled.div`
  display: flex;
  align-items: start;
  padding-top: 10px;
  max-width: 67px;
`;

const EventInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 314px;
  margin-left: 10px;
`;

const EventInput = styled.input`
  height: 40px;
  padding: 3px 5px;
  padding-right: 1.5rem;
  border-radius: 5px;
  border: 1px solid #9e9e9e;
  :focus {
    outline: 1px solid #00c923;
  }
`;

const Space = styled.div`
  width: 100%;
  height: 50px;
`;
