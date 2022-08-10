import { useState, useContext, useEffect, useCallback } from "react";
import SchedulingForm from "./SchedulingForm";
import { CalendarContext } from "../contexts/CalendarContext";
import useTimeConversion from "../hooks/useTimeConversion";
import AdminForm from "./AdminForm";

const TimeSlot = (props) => {

    const [formVisible, setFormVisible] = useState(false);
    const [userDataForThisTimeslot, setUserDataForThisTimeslot] = useState("");
    const [isBooked, setIsBooked] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [isWrongCalendarType, setIsWrongCalendarType] = useState(false);
    const [willDefineUser, setWillDefineUser] = useState(false);
    const { convertFromBrazilTime, convertToDateObj } = useTimeConversion();

    const { 
        availableTimeslots, //pro admin (acho)
        addDataAndSetNewData,
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
    
    // Logo depois de desmontar a data, vc está recriando o objeto aqui, só que com a hora. Melhora isso.
    const dateObjInLocalTime = convertFromBrazilTime(convertToDateObj(slotId));
    
    // Check if timeslot matches availableTimeslots or scheduled contexts
    const getMatch = useCallback((context) => ( context.find(data =>
        data.timeslot === slotId && data.type === props.calendarType
        // Admin doesn't see rejected user
        && !(isAdmin && data.status === "rejected") //como o isAvailable tb roda aqui e não tem "status" pode dar pau!
        ) 
    ), [props.calendarType, slotId, isAdmin]);

    const makeThisTimeslotAvailable = () => {
        const newTimeslot = {
            _id: slotId,
            timeslot: slotId,
            type: props.calendarType
        }
        // Trying to avoid duplicate entries
        !getMatch(availableTimeslots) &&
        addDataAndSetNewData(ADDING_TIMESLOT_PATH, GET_TIMESLOTS_PATH, newTimeslot);
    };

    const makeThisTimeslotUnavailable = () => {
        deleteDataAndGetNewData(DELETE_PATH, GET_TIMESLOTS_PATH, {_id: slotId})
    };

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

    const toggleForm = (e) => {
        const isAvailable = getMatch(availableTimeslots);
        if (isAdmin){
            if (isWrongCalendarType) {
                console.log("Wrong calendar type!")
            } else if (e.type === "contextmenu") {
                e.preventDefault();
                setWillDefineUser(true);
                setFormVisible(prevState => !prevState);
                return ""   // Stop running code here
            } else if (!isAvailable && !isBooked) {
                makeThisTimeslotAvailable();
            // Admin clicks on empty available slot to make it unavailable
            } else if (isAvailable && !isBooked) {
                makeThisTimeslotUnavailable();
                return ""   //gambiarra pra não rodar a próxima linha nesse caso
            }
        } if ( (isAvailable || isBooked) && !isWrongCalendarType) { //&& !isWrongCalendarType só pro admin
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
                onClick={toggleForm}
                //add client adding logic for admin in onContextMenu
                onContextMenu={(e) => toggleForm(e)}
                >
                <p>{dateObjInLocalTime.getHours()}:00</p>
                {scheduled.filter(data =>   //filter only relevant for admin, if there is more than one user, set + symbol
                    //Virou meio bagunça essa coisa do !(isAdmin), cuidado
                    !(isAdmin && data.status === "rejected") && data.timeslot === slotId && data.type === props.calendarType).length > 1 && 
                    <i className="ri-add-line ri-fw ri-2x"></i>}
                    <p>{userDataForThisTimeslot && 
                        ! (isAdmin && userDataForThisTimeslot.status === "rejected") &&
                        userDataForThisTimeslot.name}</p>
            </div>
            {
                isAdmin ?
                <AdminForm
                    id={slotId}
                    key={slotId + "admin"}
                    isVisible={formVisible}
                    calendarType={props.calendarType}
                    toggleVisibility={() => setFormVisible(prevState => !prevState)}
                    makeThisTimeslotUnavailable={makeThisTimeslotUnavailable}
                    willDefineUser={willDefineUser}
                    setWillDefineUserFalse={() => setWillDefineUser(false)}
                />
                :
                <SchedulingForm
                    id={slotId}
                    key={slotId + "scheduling"}
                    userDataForThisTimeslot={userDataForThisTimeslot}
                    isVisible={formVisible} 
                    toggleVisibility={() => setFormVisible(prevState => !prevState)}
                    calendarType={props.calendarType}
                />
            
            }
        </>
    )    
}

export default TimeSlot;