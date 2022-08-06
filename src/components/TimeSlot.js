import { useState, useContext, useEffect, useCallback } from "react";
import SchedulingForm from "./SchedulingForm";
import { CalendarContext } from "../contexts/CalendarContext";
import AdminForm from "./AdminForm";

const TimeSlot = (props) => {

    const [formVisible, setFormVisible] = useState(false);
    const [userDataForThisTimeslot, setUserDataForThisTimeslot] = useState("");
    const [isBooked, setIsBooked] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [isWrongCalendarType, setIsWrongCalendarType] = useState(false);
    
    const { 
        availableTimeslots, //pro admin (acho)
        addDataAndGetNewData,
        deleteDataAndGetNewData,
        scheduled,
        isAdmin,
        GET_TIMESLOTS_PATH,  //pro admin
        DOMAIN //pro admin
    } = useContext(CalendarContext);
    
    const ADDING_TIMESLOT_PATH = `${DOMAIN}/createTimeslot` //pro admin
    const DELETE_PATH = `${DOMAIN}/deleteTimeslot` //pro admin

    // For an individual user, each timeslot is unique.
    // The sub is added to the id for the db entry, since there will be several users.
    const slotId = 
        String(props.date.getFullYear()) + "-" +
        String(props.date.getMonth()) + "-" +
        String(props.date.getDate()) + "-" +
        String(props.timeRange[0]) + "-" +
        String(props.timeRange[1]
        );


    // Check if timeslot matches availableTimeslots or scheduled contexts
    const getMatch = useCallback((context) => ( context.find(data =>
        data.timeslot === slotId && data.type === props.calendarType
        ) 
    ), [props.calendarType, slotId]);

    // Era bom unir esse função com a de cima, mas hardcoded por enquanto:
    const checkIsWrongCalendarType = useCallback((context) => ( context.some(data =>
        data.timeslot === slotId && data.type !== props.calendarType
        ) 
    ), [props.calendarType, slotId]);

    useEffect(() => {
        checkIsWrongCalendarType(availableTimeslots) && setIsWrongCalendarType(true);
    }, [checkIsWrongCalendarType, props.calendarType, availableTimeslots])

    const getDataAndSetBooked = useCallback(() => {
        const match = getMatch(scheduled);
        if(match) {
            setIsBooked(true);
            setUserDataForThisTimeslot(match);
        } else if (!match) {
            setIsBooked(false);
            setUserDataForThisTimeslot({})
        }
    }, [getMatch, scheduled]);

    // Mais uma repetição, aqui e no useEffect embaixo
    const getDataAndSetAvailable = useCallback(() => {
        const match = getMatch(availableTimeslots);
        if(match) {
            setIsAvailable(true);
        } else if (!match) {
            setIsAvailable(false);
        }
    }, [getMatch, availableTimeslots]);

    useEffect(() => {
        getDataAndSetBooked()
    }, [scheduled, getDataAndSetBooked]);

    useEffect(() => {
        getDataAndSetAvailable()
    }, [availableTimeslots, getDataAndSetAvailable]);

    const getColors = () => {
        if (isWrongCalendarType) {
            return { backgroundColor: "grey" };
        } else if (isBooked && userDataForThisTimeslot.status === "pending") {
            return { backgroundColor: "yellow" };
        } else if (isBooked && userDataForThisTimeslot.status === "rejected") {
            return { backgroundColor: "red" };
        } else if (isBooked && userDataForThisTimeslot.status === "accepted") {
            return { backgroundColor: "green" };
        } else if (!isAvailable) {
            return { backgroundColor: "lightgrey" };
        // pro admin --------
        } else if (isAvailable) {
            return { backgroundColor: "white" };
        }
        // pro admin --------
    }

    const toggleForm = () => {
        const isAvailable = getMatch(availableTimeslots);
        if (isAdmin){
            if (isWrongCalendarType) {
                console.log("Wrong calendar type!")
            } else if (!isAvailable) {
                    const newTimeslot = {
                    _id: slotId,
                    timeslot: slotId,
                    type: props.calendarType
                }
                addDataAndGetNewData(ADDING_TIMESLOT_PATH, GET_TIMESLOTS_PATH, newTimeslot);
            } else if (isAvailable && !isBooked) {
                deleteDataAndGetNewData(DELETE_PATH, GET_TIMESLOTS_PATH, {_id: slotId});
                return ""   //gambiarra pra não rodar a próxima linha nesse caso
            }
        } if (isAvailable && !isWrongCalendarType) { //&& !isWrongCalendarType só pro admin
            setFormVisible(prevState => !prevState);
        };
    };

    // Tenta renderizar os formulários só quando clica, e não diretamente só mudando a visibilidade como ocorre agora
    // Tira o cursor: pointer se o esquema não estiver disponível.
    return (
        <>
            <div 
                className="time-slot"
                style={getColors()}
                onClick={toggleForm}>
                <p>{props.timeRange[0]}:00</p>
                {scheduled.filter(data =>   //filter relevante só pro admin, se tiver mais de um ele põe o ícone de mais
                    data.timeslot === slotId && data.type === props.calendarType).length > 1 && 
                    <i className="ri-add-line ri-fw ri-2x"></i>}
                    <p>{userDataForThisTimeslot && userDataForThisTimeslot.name}</p>
            </div>
            {
                isAdmin ?
                <AdminForm
                    id={slotId}
                    key={slotId + "admin"}
                    isVisible={formVisible} 
                    toggleVisibility={toggleForm}
                    calendarType={props.calendarType}
                />
                :
                <SchedulingForm
                    id={slotId}
                    key={slotId + "scheduling"}
                    userDataForThisTimeslot={userDataForThisTimeslot}
                    isVisible={formVisible} 
                    toggleVisibility={toggleForm}
                    calendarType={props.calendarType}
                />
            
            }
        </>
    )    
}

export default TimeSlot;