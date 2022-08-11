import { useState, useContext } from "react";
import { CalendarContext } from "../contexts/CalendarContext";
import { sendEmail } from "../utils/emailJS";
import Axios from "axios";

const UserScheduleRequest = (props) => {
    const { 
        getAndSetDBData,
        scheduled,
        POST_USER_SCHEDULE_PATH,
        GET_USER_SCHEDULES_PATH,
        DOMAIN,
        addDataAndSetNewData
    } = useContext(CalendarContext);
    const [notes, setNotes] = useState("");

    const updateUserRequestStatus = (newStatus) => {
        Axios.post(`${DOMAIN}/updateUserRequestStatus`, 
        {params: {_id: props.userData._id}, update: {status: newStatus, admin_notes: notes}})
        .then(response => console.log(`New user request status: ${newStatus}, _id: ${props.userData._id}`))
        .then(() => getAndSetDBData(GET_USER_SCHEDULES_PATH));
    }

    const updateUserRequestStatusAndMakeTimeslotUnavailable = (newStatus) => {
        updateUserRequestStatus(newStatus);
        props.makeThisTimeslotUnavailable();
    }

    const updateUserRequestAndSendEmail = (statusChange, userData, willSendEmail=true) => {
        statusChange === "accept" && updateUserRequestStatus("accepted");
        statusChange === "acceptAndMakeUnavailable" && updateUserRequestStatusAndMakeTimeslotUnavailable("accepted");
        statusChange === "reject" && updateUserRequestStatus("rejected");
        const statusTextDict = {
            "reject" : "recusado",
            "accept" : "aceito"
        }
        willSendEmail && sendEmail({
            timeslot: props.userData.timeslot,
            status: statusTextDict[statusChange],
            email: props.userData.email,
            name: props.userData.name,
            notes: notes,
            url: window.location.href,
            emailTemplate: "toUser"
        });
    }
    // Até aqui

    const handleSubmit = (e)  => {
        e.preventDefault();
        if (props.adminScheduling) {
            props.userData.status = "accepted";
            const newSchedulingData = {
                _id: props.userData._id,
                timeslot: props.userData.timeslot,
                name: props.userData.name,
                admin_notes: notes,
                email: props.userData.email,
                sub: props.userData.sub,
                type: props.userData.type,
                status: props.userData.status
            }
            // Gambiarra, substitui isso e o update abaixo por um upsert depois
            !(scheduled.some(data =>
                data._id === props.userData._id)) &&
            addDataAndSetNewData(
                POST_USER_SCHEDULE_PATH,
                GET_USER_SCHEDULES_PATH,
                newSchedulingData,
                // Data already gets set in update request below
                false);
        }   //Run this anyway
            updateUserRequestAndSendEmail(e.target.name, props.userData)
    }

    return (
        props.adminScheduling ?
        <form>
            <h3>{props.userData.name}</h3>
            {props.userData.status === "accepted" && <h4>Aula marcada!</h4> }
            {props.userData.status === "rejected" && <h4>Pedido recusado!</h4> }
            <button className="scheduling-form--button" name="accept" type="submit" onClick={handleSubmit}>Agendar e deixar aberto</button>
            <button className="scheduling-form--button" name="acceptAndMakeUnavailable" type="submit" onClick={handleSubmit}>Agendar e fechar horário</button>
            <label htmlFor="text">Obs: </label>
                <textarea
                    type="text"
                    id="name"
                    name="name"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            <hr />
        </form>
        :
        <form>
            <h3>{props.userData.name}</h3>
            { props.userData.status === "accepted" && <h4>Aula marcada!</h4> }
            { props.userData.status === "rejected" && <h4>Pedido recusado!</h4> }
            <p><strong>Obs. do aluno:</strong> {props.userData.user_notes}</p>
            <button className="scheduling-form--button" name="accept" type="submit" onClick={handleSubmit}>
                Aceitar e deixar aberto
                </button>
            <button className="scheduling-form--button" name="acceptAndMakeUnavailable" type="submit" onClick={handleSubmit}>
                Aceitar e fechar horário
                </button>
            <button className="scheduling-form--button" name="reject" type="submit" onClick={handleSubmit}>
                {props.userData.status === "accepted" ? "Cancelar" : "Recusar"}
                </button>
            <label htmlFor="text">Motivo: </label>
                <textarea
                    type="text"
                    id="name"
                    name="name"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            <hr />
        </form>
    )
}

export default UserScheduleRequest;