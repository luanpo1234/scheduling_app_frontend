import { useState, useEffect, useContext } from "react";
import useTimeConversion from "../hooks/useTimeConversion";
import { CalendarContext } from "../contexts/CalendarContext";
import { useAuth0 } from "@auth0/auth0-react";
import { sendEmail } from "../utils/emailJS";

const SchedulingForm = (props) => {

    const [notes, setNotes] = useState("");
    const [formSent, setFormSent] = useState(false);
    const { convertToDateObj, incrementDays } = useTimeConversion();
    
    const { 
        scheduled,
        deleteDataAndGetNewData,
        addDataAndSetNewData,
        DOMAIN,
        GET_USER_SCHEDULES_PATH,
        POST_USER_SCHEDULE_PATH
    } = useContext(CalendarContext);

    const DELETE_USER_SCHEDULE_PATH = `${DOMAIN}/deleteUserSchedule`;

    const { user } = useAuth0();

    // If there is already an object with this id in scheduled, the form was already sent.
    useEffect(() => {
        //console.log("useEffect1");
        scheduled.some(data => 
            data.timeslot === props.id) && setFormSent(true);
    }, [props.id, scheduled]);

    const handleSubmit = (e, willSendEmail=true)  => {
        e.preventDefault();
        const removeTimeslotUserData = () => {
            deleteDataAndGetNewData(DELETE_USER_SCHEDULE_PATH, GET_USER_SCHEDULES_PATH, {_id: props.id + user.sub});
            setFormSent(false);
            props.toggleVisibility();
        }
        // If the button is clicked after form has been sent, delete entry.
        if (formSent && e.target.name === "withdrawRequest") {
            removeTimeslotUserData();
        } else if (formSent && e.target.name === "cancelBooking") {
            const thisTime = convertToDateObj(props.id)
            const oneDayBeforeThisTime = incrementDays(thisTime, -1)

            //Can only cancel 24h before booking
            if (new Date() < oneDayBeforeThisTime){
                removeTimeslotUserData();
                //send email
            } else if (new Date() >= oneDayBeforeThisTime) {
                // Em vez disso, sumir o botão 24 horas antes?
                alert("Não é possível desmarcar menos de 24 horas antes da aula.");
            }
        } else if (user.name && e.target.name ==="makeRequest") {
            const newSchedulingData = {
                _id: props.id + user.sub,
                timeslot: props.id,
                name: user.name,
                email: user.email,
                sub: user.sub,
                user_notes: notes,
                type: props.calendarType,
                status: "pending"
            }
            addDataAndSetNewData(POST_USER_SCHEDULE_PATH, GET_USER_SCHEDULES_PATH, newSchedulingData);
            setFormSent(true);
        }
        willSendEmail && sendEmail({
            // Não ideal, melhor tirar o e.target.name daqui e incluir as outras opções tb
            actionType: e.target.name === "cancelBooking" ? "Cancelamento" : "Pedido de marcação",
            timeslot: props.id,
            name: user.name,
            url: window.location.href,
            notes: notes,
            emailTemplate: "toAdmin"
        });
    }

    const getContent = () => {
        if (formSent) {
            if (props.userDataForThisTimeslot.status === "pending") {
                return(
                    <div>
                        <h3>Obrigada por enviar seu pedido! Responderei em breve</h3>
                        <button className="scheduling-form--button" name="withdrawRequest" type="submit" onClick={handleSubmit}>Desmarcar</button>
                    </div>
                )
            } else if (props.userDataForThisTimeslot.status === "accepted") {
                return(
                    <div>
                        <h3>Aula marcada!</h3>
                        <label htmlFor="text">Observações: </label>
                        <p><strong>Obs:</strong> {props.userDataForThisTimeslot.admin_notes}</p>
                        <textarea
                            type="text"
                            id="name"
                            name="name"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                        <button className="scheduling-form--button" name="cancelBooking" type="submit" onClick={handleSubmit}>Desmarcar</button>
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
            // Em vez de desconstruir aqui e ter que colocar o +1 no mês abaixo, faz um método geral pra isso, tb pra usar no Sidebar e no AdminForm
            const [ year, month, day, startTime, endTime ] = props.id.split("-");
            return (
                <form onSubmit={handleSubmit}>
                    <h3>Pedido de marcação de horário para o dia {day}/{String(Number(month)+1)}/{year} das {startTime} às {endTime} horas</h3>
                    <div>
                        <label htmlFor="text">Observações: </label>
                        <textarea
                            type="text"
                            id="name"
                            name="name"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                        <button className="scheduling-form--button" name="makeRequest" type="submit" onClick={handleSubmit}>Enviar</button>
                    </div>
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