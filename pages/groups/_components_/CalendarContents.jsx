import React, { useState, useEffect } from "react";
import { useRouter } from "next/router.js";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import Header from "@/pages/global_components/groups_header";
import Footer from "@/pages/global_components/footer";
import CustomHead from "@/pages/global_components/head";
import { CommonPopup } from "@/lib/ui/CommonPopup";
import { selectGroupData } from "@/lib/store/groupData.slice";

export default function CalendarContents() {
  const dispatch = useDispatch();
  const router = useRouter();
  const groupData = useSelector(selectGroupData);
  const [value, onChange] = useState(new Date());

  return (
    <CalendarWrapper>
      <Calendar
        calendarType="US"
        locale="en"
        onChange={onChange}
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

const Space = styled.div`
  width: 100%;
  height: 50px;
`;
