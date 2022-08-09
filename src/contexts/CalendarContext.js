import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const CalendarContext = React.createContext();

const CalendarContextProvider = ({ children }) => {
    const DOMAIN = process.env.REACT_APP_DOMAIN;
    const ADMIN_SUB = process.env.REACT_APP_ADMIN_SUB;

    // Essas variáveis que estão sendo passadas deviam vir de um utils ou algo assim
    const GET_USER_SCHEDULES_PATH = `${DOMAIN}/getUserSchedules`;
    const GET_TIMESLOTS_PATH = `${DOMAIN}/getAvailableTimeslots`;
    const GET_USER_PROFILE_PATH = `${DOMAIN}/getUserProfile`;
    const POST_USER_PROFILE_PATH = `${DOMAIN}/createUserProfile`;
    const POST_USER_SCHEDULE_PATH = `${DOMAIN}/createUserSchedule`;

    const [availableTimeslots, setAvailableTimeslots] = useState([]);
    const [scheduled, setScheduled] = useState([]);
    const { user } = useAuth0();
    const [isAdmin, setIsAdmin] = useState(false);    
    
    //Gambiarra para simular admin
    useEffect(() => {
        if(user) {
        setIsAdmin(user.sub===ADMIN_SUB)
    }
    }, [user, ADMIN_SUB])

    const deleteDataAndGetNewData = (postPath, getPath, parameters) => {
        Axios.delete(postPath, { params: parameters })
        .then(response => console.log("Data entry deleted!"))
        .then(response => getAndSetDBData(getPath))
        .catch(error => alert("Erro de conexão: não foi possível deletar o item"));
    };

    const addDataAndGetNewData = (postPath, getPath, data) => {
        console.log("adding");
        Axios.post(postPath, data)
        .then(response => console.log("New data entry!"))
        .then(response => getAndSetDBData(getPath))
        .catch(error => console.error(error.message))
        //.catch(error => alert("Erro de conexão: não foi possível inserir o item"));
    };

    const getAndSetDBData = useCallback((path, query) => { //renomeia pra getAndSetData
        let setterFunc;
        if (path === GET_USER_SCHEDULES_PATH) {
            setterFunc = setScheduled;
        } else if (path === GET_TIMESLOTS_PATH) {
            setterFunc = setAvailableTimeslots;
        }
        if (user) {
            const parameters = isAdmin ? 
                {...query} : 
                {...query, sub: user.sub};
            Axios.get(path, { params: parameters })
            .then(response => {setterFunc(response.data)})
            .catch(error => alert("Erro de conexão: não foi possível obter os dados do calendário."))
    }}, [isAdmin, user, GET_USER_SCHEDULES_PATH, GET_TIMESLOTS_PATH]);

    useEffect(() => {
        // Create new user if not in profile DB
        if(user && !isAdmin) {
            const createNewUser = () => {
                const newUserData = {
                    _id: user.sub,
                    name: user.name,
                    sub: user.sub,
                    email: user.email
                }
                Axios.post(POST_USER_PROFILE_PATH, newUserData)
                .then(response => console.log("New user added!"))
                .catch(error => alert("Erro de conexão"));
            }
            Axios.get(GET_USER_PROFILE_PATH, {params: {_id: user.sub}})
            .then(response => response.data.length === 0 && createNewUser())
            .catch(error => console.error(error))
            }
    }, [user, isAdmin, POST_USER_PROFILE_PATH, GET_USER_PROFILE_PATH])

    useEffect(() => {
        getAndSetDBData(GET_USER_SCHEDULES_PATH);
    }, [user, getAndSetDBData, GET_USER_SCHEDULES_PATH]);

    useEffect(() => {        
        user && Axios.get(GET_TIMESLOTS_PATH).then(response => {
            setAvailableTimeslots(response.data)});
    }, [user, GET_TIMESLOTS_PATH]);

    return (
        <CalendarContext.Provider value={ 
            { 
                scheduled,
                availableTimeslots,
                deleteDataAndGetNewData,
                addDataAndGetNewData,
                getAndSetDBData,
                isAdmin,
                user,
                GET_USER_SCHEDULES_PATH,
                GET_TIMESLOTS_PATH,
                GET_USER_PROFILE_PATH,
                POST_USER_SCHEDULE_PATH,
                DOMAIN
            } 
        }>
            {children}
        </CalendarContext.Provider>
    )
};

export {CalendarContextProvider, CalendarContext};

/*     const [scheduled, setScheduled] = useState(JSON.parse(localStorage.getItem('scheduled')) || []);

useEffect(() => {
    localStorage.setItem("scheduled", JSON.stringify(scheduled));
}, [scheduled]);
 */