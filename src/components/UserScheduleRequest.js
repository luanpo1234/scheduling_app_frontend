import { useState, useContext } from "react";
import { CalendarContext } from "../contexts/CalendarContext";
import { sendEmail } from "../utils/emailJS";
import Axios from "axios";

const UserScheduleRequest = ({ userData }) => {
    const { getData, GET_USER_SCHEDULES_PATH, DOMAIN } = useContext(CalendarContext);
    const [notes, setNotes] = useState("");

    const updateUserRequestStatus = (newStatus) => {
        Axios.post(`${DOMAIN}/updateUserRequestStatus`, 
        {params: {_id: userData._id}, update: {status: newStatus, admin_notes: notes}})
        .then(response => console.log(`New user request status: ${newStatus}, _id: ${userData._id}`))
        .then(() => getData(GET_USER_SCHEDULES_PATH));
    }

    const handleSubmit = (e, willSendEmail=false)  => {
        e.preventDefault();
        //não está atualizando _scheduled_ hora que clica, tem que incluir função "...andUpdate..."
        e.target.name === "accept" && updateUserRequestStatus("accepted");
        e.target.name === "reject" && updateUserRequestStatus("rejected");
        const statusTextDict = {
            "reject" : "recusado",
            "accept" : "aceito"
        }
        willSendEmail && sendEmail({
            timeslot: userData.timeslot,
            status: statusTextDict[e.target.name],
            email: userData.email,
            name: userData.name,
            notes: notes,
            url: window.location.href,
            emailTemplate: "toUser"
        });
    }

    return (
        <form>
            <h3>{userData.name}</h3>
            { userData.status === "accepted" && <h4>Aula marcada!</h4> }
            { userData.status === "rejected" && <h4>Pedido recusado!</h4> }
            <p><strong>Obs. do aluno:</strong> {userData.user_notes}</p>
            <button className="scheduling-form--button" name="accept" type="submit" onClick={handleSubmit}>Aceitar</button>
            <button className="scheduling-form--button" name="reject" type="submit" onClick={handleSubmit}>Recusar</button>
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