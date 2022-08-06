import { months } from "../utils/globalVars";
import { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CalendarContext } from "../contexts/CalendarContext";
import Loading from "./Loading";
import Week from "./Week";

const Calendar = (props) => {
    // Não acho ideal pegar isso do params, repense
    const { calendarType } = useParams();

    const { scheduled } = useContext(CalendarContext);
    
    // Increment date by `increment` days 
    const incrementDate = (dateInput, increment)  => {
        const dateFormatTotime = new Date(dateInput);
        const increasedDate = new Date(dateFormatTotime.getTime() + (increment * 86400000));
        return increasedDate;
    }

    const populateWeek = (date) => {
        const currDate = date ? new Date(date) : new Date();
        //Setting first day of calendar week to last - or this - Monday
        currDate.setDate(currDate.getDate()-currDate.getDay()+1);
        const week = [currDate];

        for (let i=1;i<7;i++) {
            const newDate = incrementDate(currDate, i);
            week.push(newDate);
        }
        return week;
        }

    const [currWeek, setCurrWeek] = useState(populateWeek())
    
    const changeWeek = (week, operator) => {
        let summand;
        if (operator === "+") {
            summand = 7
        } else if (operator ==="-") {
            summand = -7
        } else {
            throw Error("Invalid operator.")
        };
        const newDate = incrementDate(week[0], summand);
        setCurrWeek(populateWeek(newDate));
    }

    return (
        <div className="week-grid">
            {scheduled.length === 0 && <div className="loading-container"><Loading /></div>}
            <div className="date-title">
                <h3>{months[currWeek[0].getMonth()]}</h3>
                <h4>{currWeek[0].getFullYear()}</h4>
            </div>
            <i className="ri-arrow-left-s-line ri-fw ri-5x" onClick={() => changeWeek(currWeek, "-")}></i>
            <Week 
                dates={currWeek}
                dailyTimeRange={props.dailyTimeRange}
                key={currWeek[0]}
                calendarType={calendarType}
            />
            <i className="ri-arrow-right-s-line ri-fw ri-5x" onClick={() => changeWeek(currWeek, "+")}></i>
        </div>
    )    
}

export default Calendar;