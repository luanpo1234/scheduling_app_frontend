import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const CalendarContext = React.createContext();

const CalendarContextProvider = ({ children }) => {
    const DOMAIN = process.env.REACT_APP_DOMAIN;

    const GET_USER_SCHEDULES_PATH = `${DOMAIN}/getUserSchedules`;
    const GET_TIMESLOTS_PATH = `${DOMAIN}/getAvailableTimeslots`;

    const [availableTimeslots, setAvailableTimeslots] = useState([]);
    const [scheduled, setScheduled] = useState([]);
    const { user } = useAuth0();
    const [isAdmin, setIsAdmin] = useState(false);    
    
    //Gambiarra para simular admin
    useEffect(() => {
        if(user) {
        setIsAdmin(user.nickname==="admin")
    }
    }, [user])

    const deleteDataAndGetNewData = (postPath, getPath, parameters) => {
        Axios.delete(postPath, { params: parameters })
        .then(response => console.log("Data entry deleted!"))
        .then(response => getData(getPath));
    };

    const addDataAndGetNewData = (postPath, getPath, data) => {
        console.log("adding");
        Axios.post(postPath, data)
        .then(response => console.log("New data entry!"))
        .then(response => getData(getPath));
    };

    const getData = useCallback((path, query) => { //renomeia pra getAndSetData
        // TODO: remove hard coding
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
    }}, [isAdmin, user]);

    useEffect(() => {      
        getData(GET_USER_SCHEDULES_PATH);
    }, [user, getData]);

    useEffect(() => {        
        user && Axios.get(GET_TIMESLOTS_PATH).then(response => {
            setAvailableTimeslots(response.data)});
    }, [user]);

    return (
        <CalendarContext.Provider value={ 
            { 
                scheduled,
                availableTimeslots,
                deleteDataAndGetNewData,
                addDataAndGetNewData,
                getData,
                isAdmin,
                user,
                GET_USER_SCHEDULES_PATH,
                GET_TIMESLOTS_PATH,
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