import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { CalendarContext } from "../contexts/CalendarContext";
import Sidebar from "./Sidebar";

const Home = () => {
    const { getAndSetDBData, user, GET_USER_SCHEDULES_PATH, scheduled } = useContext(CalendarContext);

    // Acho que isso seria o caso pra um Hook customizado:
    useEffect(() => {
        getAndSetDBData(GET_USER_SCHEDULES_PATH);
    }, [GET_USER_SCHEDULES_PATH, getAndSetDBData]);

    return (
        <div className="home-container">
            { user && <Sidebar scheduled={scheduled} /> }
            <div className="main-btns-container">
                <div>
                    <Link to="/online"><button className="calendar-btn">Agenda online</button></Link>
                    <Link to="/presence"><button className="calendar-btn">Agenda presencial</button></Link>
                </div>
            </div>
        </div>
    )    
}

export default Home;