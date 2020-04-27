import React, { useState, useEffect } from "react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Link } from "react-router-dom";
import "./style.scss";
import { Calendar as Cal } from "react-modern-calendar-datepicker";
const Calendar = (props) => {
  const defaultValue = {
    year: 2020,
    month: 4,
    day: 23,
  };
  const [selectedDay, setSelectedDay] = useState(defaultValue);
  useEffect(() => {
    var buttons = document.querySelectorAll(".Calendar__monthArrowWrapper");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        setSelectedDay({ day: 29, month: 5, year: 2020 });
        console.log(selectedDay.month);
      });
    });
  }, [selectedDay]);
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
          <Link to="/event/eventid">
            <div className="item-title">Launch day</div>
            <hr />
            <div className="item-description mb-2">
              Keep Calm it's Launch Day
            </div>
            <div className="item-date">
              <i className="material-icons">schedule</i>Thursday, 23 April⋅12:30
              – 1:30pm
            </div>
            <div className="item-location">
              <i className="material-icons">location_on</i>Ulaanbaatar ,Mongolia
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Calendar;
