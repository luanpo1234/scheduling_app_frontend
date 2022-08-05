import { Link } from "react-router-dom";
import Profile from "./Profile";
// Depois une os dois botões e muda só pelo props
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";


const Header = () => {
    const { isAuthenticated } = useAuth0();

    return (
        <header>
                <Link to="/"><button>Home</button></Link>
                {
                    isAuthenticated ?
                    <>
                        <div>
                            <Profile />
                        </div>
                        <div>
                            <LogoutButton />
                        </div>
                    </> 
                    :
                    <div>
                        <LoginButton />
                    </div>
                }
        </header>
    )    
}

export default Header;