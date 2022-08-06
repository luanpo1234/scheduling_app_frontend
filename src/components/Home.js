import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { CalendarContext } from "../contexts/CalendarContext";
import Sidebar from "./Sidebar";

const Home = () => {   //passando do Context pro App aos poucos
    const { getData, user, GET_USER_SCHEDULES_PATH, scheduled } = useContext(CalendarContext);

    // Acho que isso seria o caso pra um Hook customizado:
    useEffect(() => {
        getData(GET_USER_SCHEDULES_PATH);
    }, []);

    return (
        <>
            <div className="home-container">
            { user && <Sidebar scheduled={scheduled} /> }
                <h1>Aulas com Luiza</h1>
                <Link to="/online"><button>Agenda online</button></Link>
                <Link to="/presence"><button>Agenda presencial</button></Link>
            </div>
        </>
    )    
}

export default Home;