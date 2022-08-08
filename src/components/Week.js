import Day from "./Day";

const Week = (props) => {
    return (
        <div className="week-grid">
            {props.dates.map((currDate, index) =>
                <Day
                    date={currDate}
                    dailyTimeRange={props.dailyTimeRange}
                    calendarType={props.calendarType}
                    key={index}
                />
            )}
        </div>
    )    
}

export default Week;