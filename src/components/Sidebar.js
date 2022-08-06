import Loading from "./Loading";

const Sidebar = ({ scheduled }) => {

    const statusTextDict = {
        "rejected" : "recusada",
        "accepted" : "marcada",
        "pending" : "pendente",

    }

    const transformDateStr = (dateStr) => {
        const [ year, month, day, startTime, endTime ] = dateStr.split("-");
        return `${day}/${String(Number(month)+1)} das ${startTime} às ${endTime}h`
    }

    const getColors = (status) => {
        if (status === "pending") {
            return { backgroundColor: "yellow" };
        } else if (status === "rejected") {
            return { backgroundColor: "lightgrey" };
        } else if (status === "accepted") {
            return { backgroundColor: "green" };
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
                    <div style={getColors(item.status)}>
                        <p>
                            {item.name}
                        </p>
                        <p>
                            {transformDateStr(item.timeslot)}
                        </p>
                        <p>
                            {item.type} - {statusTextDict[item.status]}
                        </p>

                        <hr />
                    </div>)
            }
            </div>
        </div>
    )
};

export default Sidebar;