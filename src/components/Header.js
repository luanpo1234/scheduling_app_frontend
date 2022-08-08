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
            <div>
                <p style={{color: "white"}}>-</p> {/* Gambiarra temporária depois cria um <nav>, etc. */}
                <Link to="/"><button>Home</button></Link>
            </div>
            {
                isAuthenticated ?
                <>
                    <h1>Aulas com Luiza</h1>
                    <div>
                        <Profile />
                        <LogoutButton />
                    </div>
                </> 
                :
                <>
                    <h1>Aulas com Luiza</h1>
                    <div>
                        <p>-</p>
                        <LoginButton />
                    </div>
                </>
            }
        </header>
    )    
}

export default Header;