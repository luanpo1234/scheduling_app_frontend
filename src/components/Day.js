
import TimeSlot from "./TimeSlot";
import { weekDays } from "../utils/globalVars";

const Day = (props) => {
    const timeSlots = [];
    for (let i=props.dailyTimeRange[0];i<props.dailyTimeRange[1];i++) {
        timeSlots.push(i)
    }

    return (
        <div className="day-grid">
            <div className="date-title">
                <h6>{weekDays[props.date.getDay()]}</h6>
                <h2>{props.date.getDate()}</h2>
            </div>
            {timeSlots.map(slot =>
                <TimeSlot
                    date={props.date}
                    key={
                        String(props.date.getFullYear()) + "-" +
                        String(props.date.getMonth()) + "-" +
                        String(props.date.getDate()) + "-" +
                        String(slot)
                    }
                    timeRange={[slot, slot+1]}
                    calendarType={props.calendarType}
                />)
                }
        </div>
    )    
}

export default Day;