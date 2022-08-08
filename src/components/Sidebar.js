import { Link } from "react-router-dom";
import Loading from "./Loading";

const Sidebar = ({ scheduled }) => {

    const statusTextDict = {
        "rejected" : "recusada",
        "accepted" : "marcada",
        "pending" : "pendente",

    }

    const getColors = (status) => {
        if (status === "pending") {
            return { backgroundColor: "#ded476" };
        } else if (status === "rejected") {
            return { backgroundColor: "lightgrey" };
        } else if (status === "accepted") {
            return { backgroundColor: "#569c83" };
        }
    }

    return (
        <div className="sidenav">
            <h3>Minhas aulas</h3>
            <hr />
            <div>
                {scheduled.length === 0 ?
                <div className="loading-container"><Loading /></div> :
                scheduled.map(item =>
                    {
                    const [ year, month, day, startTime, endTime ] = item.timeslot.split("-");
                    return (
                        <Link to={`/${item.type}/${new Date(year, month, day)}`} >
                            <div style={getColors(item.status)}>
                                <p>
                                    {item.name}
                                </p>
                                <p>
                                    {`${day}/${String(Number(month)+1)} das ${startTime} às ${endTime}h`}
                                </p>
                                <p>
                                    {item.type} - {statusTextDict[item.status]}
                                </p>

                                <hr />
                            </div>
                        </Link>
                        )
                    })
            }
            </div>
        </div>
    )
};

export default Sidebar;