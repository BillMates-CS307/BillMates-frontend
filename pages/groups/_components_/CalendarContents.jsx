import React, { useState, useEffect } from "react";
import { useRouter } from "next/router.js";
import styled from "@emotion/styled";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import {
  selectCalendarData,
  selectNonrecurringCalendarData,
  selectRecurringCalendarData,
} from "@/lib/store/calendarData/calendarData.slice";

export default function CalendarContents() {
  const dispatch = useDispatch();
  const router = useRouter();
  const nonrecurringCalendarData = useSelector(selectNonrecurringCalendarData);
  const recurringCalendarData = useSelector(selectRecurringCalendarData);
  const [value, setValue] = useState(new Date());
  // const [mark, setMark] = useState(["2023-04-10", "2023-04-10"]);

  const onChange = (value, e) => {
    setValue(e.target.value);
    // TODO: Fix to detail page
    // router.push("/");
  };

  const checkNonrecurringEventDay = (date) => {
    for (const ev of nonrecurringCalendarData) {
      if (
        moment(ev.date).format("YYYY-MM-DD") ===
        moment(date).format("YYYY-MM-DD")
      ) {
        return true;
      }
    }

    return false;
  };

  const checkRecurringEventDay = (date) => {
    for (const recurringEvent of recurringCalendarData) {
      // console.log(moment(date).weekday());
      if (moment(recurringEvent.date).weekday() === moment(date).weekday()) {
        return true;
      }
    }

    return false;
  };

  return (
    <CalendarWrapper>
      <Calendar
        calendarType="US"
        locale="en"
        onChange={onChange}
        formatDay={(locale, date) => moment(date).format("DD")}
        tileContent={({ date, view }) => {
          if (checkRecurringEventDay(date) || checkNonrecurringEventDay(date)) {
            return (
              <>
                <DotWrapper>
                  <Dot />
                </DotWrapper>
              </>
            );
          }
        }}
        value={value}
      />
    </CalendarWrapper>
  );
}

const CalendarWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DotWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: absolute;
  bottom: 4px;
`;

const Dot = styled.div`
  height: 8px;
  width: 8px;
  background-color: #f87171;
  border-radius: 50%;
  display: flex;
  margin-left: 1px;
`;
