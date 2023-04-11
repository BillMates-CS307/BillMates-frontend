import React, { useState, useEffect } from "react";
import { useRouter } from "next/router.js";
import styled from "@emotion/styled";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import { selectCalendarData } from "@/lib/store/calendarData/calendarData.slice";
import { selectGroupId } from "@/lib/store/groupData.slice";
import { checkEventDayBy } from "@/lib/util/date";

export default function CalendarContents() {
  const dispatch = useDispatch();
  const router = useRouter();
  const groupId = useSelector(selectGroupId);
  const events = useSelector(selectCalendarData).events;
  const [value, setValue] = useState(new Date());
  // const [mark, setMark] = useState(["2023-04-10", "2023-04-10"]);

  const onChange = (value, e) => {
    setValue(e.target.value);
    // TODO: Fix to detail page
    // router.push("/");
  };

  const onClickDay = (value, event) => {
    // href={`/groups/group_calendar/${router.query.id}`}
    router.push(
      `/groups/group_calendar_detail/${groupId}?date=${moment(value).format(
        "YYYY-MM-DD"
      )}`
    );
  };

  const checkEventsDay = (date, events) => {
    // console.log("checkEventsDay");
    for (const ev of events) {
      if (checkEventDayBy(date)(ev)) {
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
        onClickDay={onClickDay}
        formatDay={(locale, date) => moment(date).format("DD")}
        tileContent={({ date, view }) => {
          if (checkEventsDay(date, events)) {
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
