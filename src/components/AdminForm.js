import { useContext } from "react";
import { CalendarContext } from "../contexts/CalendarContext";
import UserScheduleRequest from "./UserScheduleRequest";
//import { useAuth0 } from "@auth0/auth0-react";

const AdminForm = (props) => {

    const { 
        scheduled
    } = useContext(CalendarContext);

  //  const { user } = useAuth0();

    const getThisTimeslotUserData = () => {
        const resData = scheduled.filter(data =>
            data.timeslot === props.id);
        return resData;
        };

    const getContent = () => {
        return (
            <div>
                <h3>Pedidos de marcação de horário para o dia {props.dateTime[0]} das {props.dateTime[3][0]} às {props.dateTime[3][1]} horas:</h3>
                <hr />
                {
                    props.isVisible && getThisTimeslotUserData().map(userData =>
                        <UserScheduleRequest userData={userData} key={userData.sub} />)
                }

            </div>
        )
    };

    return (
        <div className="scheduling-form--container admin-form--container" style={{display: !props.isVisible && "none"}} >
            <i className="ri-close-line ri-fw ri-2x" onClick={props.toggleVisibility}></i>
            <div className="scheduling-form--main-content">
                {getContent()}
            </div>
        </div>
    )    
}

export default AdminForm;