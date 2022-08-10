import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useState, useEffect, useContext } from "react";
import { CalendarContext } from "../contexts/CalendarContext";
import Axios from "axios";
import UserScheduleRequest from "./UserScheduleRequest";

//import { useAuth0 } from "@auth0/auth0-react";

const AdminForm = (props) => {
    const { 
        scheduled,
        GET_USER_PROFILE_PATH
    } = useContext(CalendarContext);

    const [userProfiles, setUserProfiles] = useState([]);
    const [adminSchedulingForms, setAdminSchedulingForms] = useState("");

  //  const { user } = useAuth0();

    const getThisTimeslotUserData = () => {
        const resData = scheduled.filter(data =>
            data.timeslot === props.id);
        return resData;
        };
    
    const getUserProfiles = () => {
        const userProfiles = [];
        Axios.get(GET_USER_PROFILE_PATH)
            .then(response => response.data)
            .then(data => data.map(user =>
                userProfiles.push({ ...user, timeslot: props.id })
            ))
            .then(res => setUserProfiles(userProfiles))
            .catch(error => console.error(error))
    }

    useEffect(() => {
        props.willDefineUser && getUserProfiles()
    }, [props.willDefineUser])

    const handleCloseButton = () => {
        props.willDefineUser && props.setWillDefineUserFalse();
        props.toggleVisibility();
    }

    const userSchedulingFromAdmin = (userData) => {
            setAdminSchedulingForms(
                <UserScheduleRequest 
                    adminScheduling={true}
                    toggleVisibility={() => props.toggleVisibility()}
                    calendarType={props.calendarType}
                    makeThisTimeslotUnavailable={props.makeThisTimeslotUnavailable}
                    userData={userData} 
                    key={userData.sub}
                />
            )
    }

    const getContent = () => {
        const [ year, month, day, startTime, endTime ] = props.id.split("-");
        if (props.isVisible) {
            if (!props.willDefineUser)
            {
                return (
                    <div>
                        <h3>Pedido de marcação de horário para o dia {day}/{String(Number(month)+1)}/{year} das {startTime} às {endTime} horas</h3>
                        <hr />
                        {   
                            getThisTimeslotUserData().map(userData =>
                                //Admin doesn't see rejected users
                                userData.status !== "rejected" && 
                                <UserScheduleRequest 
                                    adminScheduling={false}
                                    makeThisTimeslotUnavailable={props.makeThisTimeslotUnavailable}
                                    userData={userData} 
                                    key={userData.sub} />)
                        }
        
                    </div>
                )
            } else if (props.willDefineUser) {
                //getUserProfiles() was being called several times without useEffect
                return (
                    <div>
                        <h3>Marcar aula no dia {day}/{String(Number(month)+1)}/{year} das {startTime} às {endTime} horas para:</h3>
                            <DropdownButton id="dropdown-item-button" variant="secondary" title="Escolher aluno">
                                {userProfiles.map(user =>
                                    <Dropdown.Item as="button" key={user.name} onClick={() => userSchedulingFromAdmin(user)}>{user.name}</Dropdown.Item>)}
                            </DropdownButton>
                        <hr />
                        { adminSchedulingForms }
                    </div>
                )
            }
        }
        
    };

    return (
        <div className="scheduling-form--container admin-form--container" style={{display: !props.isVisible && "none"}} >
            <i className="ri-close-line ri-fw ri-2x" onClick={handleCloseButton}></i>
            <div className="scheduling-form--main-content">
                {getContent()}
            </div>
        </div>
    )    
}

export default AdminForm;