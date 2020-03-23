import React, { useState } from "react";
import "./style.scss";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar as Cal } from "react-modern-calendar-datepicker";
const Calendar = props => {
  const [selectedDay, setSelectedDay] = useState(null);
  return (
    <Cal
      value={selectedDay}
      onChange={date => {
        console.log(date);
        setSelectedDay(date);
      }}
      //   shouldHighlightWeekends
      colorPrimary="#00000047"
      customDaysClassName={[
        { year: 2020, month: 3, day: 8, className: "highlight" }
      ]}
    />
  );
};
export default Calendar;
