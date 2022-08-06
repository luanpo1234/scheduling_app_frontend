import { useState, useEffect, useContext } from "react";
import { CalendarContext } from "../contexts/CalendarContext";
import { useAuth0 } from "@auth0/auth0-react";
import {SERVER_PORT} from "../utils/globalVars"

const SchedulingForm = (props) => {

    const [notes, setNotes] = useState("");
    const [formSent, setFormSent] = useState(false);
    
    const { 
        scheduled,
        deleteDataAndGetNewData,
        addDataAndGetNewData,
        DOMAIN,
        GET_USER_SCHEDULES_PATH
    } = useContext(CalendarContext);

    const POST_USER_SCHEDULE_PATH = `${DOMAIN}:${SERVER_PORT}/createUserSchedule`;
    const DELETE_USER_SCHEDULE_PATH = `${DOMAIN}:${SERVER_PORT}/deleteUserSchedule`;

    const { user } = useAuth0();

    // If there is already an object with this id in scheduled, the form was already sent.
    useEffect(() => {
        //console.log("useEffect1");
        scheduled.some(data => 
            data.timeslot === props.id) && setFormSent(true);
    }, [props.id, scheduled]);

    const handleSubmit = (e)  => {
        e.preventDefault();
        // If the button is clicked after form has been sent, delete entry.
        if (formSent) {
            deleteDataAndGetNewData(DELETE_USER_SCHEDULE_PATH, GET_USER_SCHEDULES_PATH, {_id: props.id + user.sub});
            setFormSent(false);
        } else if (user.name) {
            const newSchedulingData = {
                _id: props.id + user.sub,
                timeslot: props.id,
                name: user.name,
                sub: user.sub,
                user_notes: notes,
                type: props.calendarType,
                status: "pending"
            }
            addDataAndGetNewData(POST_USER_SCHEDULE_PATH, GET_USER_SCHEDULES_PATH, newSchedulingData);
            setFormSent(true);
        }
    }

    const getContent = () => {
        if (formSent) {
            if (props.userDataForThisTimeslot.status === "pending") {
                return(
                    <div>
                        <h3>Obrigada por enviar seu pedido! Responderei em breve</h3>
                        <button className="scheduling-form--button" type="submit" onClick={handleSubmit}>Desmarcar</button>
                    </div>
                )
            } else if (props.userDataForThisTimeslot.status === "accepted") {
                return(
                    <div>
                        <h3>Aula marcada!</h3>
                    </div>
                )
            } else if (props.userDataForThisTimeslot.status === "rejected") {
                return(
                    <div>
                        <h3>Não foi possível marcar a aula.</h3>
                        <p><strong>Motivo:</strong> {props.userDataForThisTimeslot.admin_notes}</p>
                    </div>
                )
            }
        } else if (!formSent) {
            return (
                <form onSubmit={handleSubmit}>
                    <h3>Pedido de marcação de horário para o dia {props.dateTime[0]} das {props.dateTime[3][0]} às {props.dateTime[3][1]} horas</h3>
                    <label htmlFor="text">Observações: </label>
                    <textarea
                        type="text"
                        id="name"
                        name="name"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                    <button className="scheduling-form--button" type="submit" onClick={handleSubmit}>Enviar</button>
                </form>
            )
        }
    };

    //https://blog.logrocket.com/forms-in-react-in-2020/
    return (
        <div className="scheduling-form--container" style={{display: !props.isVisible && "none"}} >
            <i className="ri-close-line ri-fw ri-2x" onClick={props.toggleVisibility}></i>
            <div className="scheduling-form--main-content">
                {getContent()}
            </div>
        </div>
    )    
}

export default SchedulingForm;