import React, { useState } from "react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import "./style.scss";
import { Calendar as Cal } from "react-modern-calendar-datepicker";
const Calendar = (props) => {
  const defaultValue = {
    year: 2020,
    month: 4,
    day: 23,
  };

  const [selectedDay, setSelectedDay] = useState(defaultValue);
  return (
    <div className="d-flex flex-column">
      <Cal
        value={selectedDay}
        onChange={(date) => {
          console.log(date);
          setSelectedDay(date);
        }}
        shouldHighlightWeekends
        colorPrimary="#00000047"
        customDaysClassName={[
          { year: 2020, month: 4, day: 28, className: "highlight" },
        ]}
      />
      <div className="calendar-preview">
        <hr />
        <div className="calendar-item">
          <div className="item-title">Launch day</div>
          <div className="item-date">Thursday, 23 April⋅12:30 – 1:30pm</div>
          <div className="item-description">Keep Calm it's Launch Day</div>
          <div className="item-location">Ulaanbaatar ,Mongolia</div>
          <div className="item-action">x x</div>
        </div>
      </div>
    </div>
  );
};
export default Calendar;
