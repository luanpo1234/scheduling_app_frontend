import Day from "./Day";

const Week = (props) => {
    return (
        <>
            {props.dates.map((currDate, index) =>
                <Day
                    date={currDate}
                    dailyTimeRange={props.dailyTimeRange}
                    calendarType={props.calendarType}
                    key={index}
                />
            )}
        </>
    )    
}

export default Week;