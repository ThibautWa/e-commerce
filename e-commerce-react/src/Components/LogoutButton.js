import Cookies from 'js-cookie';
import { useHistory } from "react-router-dom";



export default LogoutButton;


function LogoutButton(){
    let history = useHistory();

    Cookies.remove("token");
    Cookies.remove("email");
    history.push("/products");
    return(
        <div></div>
    )
}
