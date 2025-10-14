import {useEffect, useState} from "react"
import Persons from "./components/Persons.jsx"
import Cars from "./components/Cars.jsx";
import Guitars from "./components/Guitars.jsx";
import DataContext from "./context";

function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(true);

    return (
        
        <DataContext.Provider value ={{isLoggedIn, setIsLoggedIn}}>
        <div>
            <h2>React App</h2>
            <div>
                is logged in: {JSON.stringify(isLoggedIn)}
                <br />
                <button onClick={()=>{setIsLoggedIn(prev=>!prev)}}>log out/in</button>
                <hr />
            </div>
            <Cars></Cars>
            {/* <Guitars></Guitars> */}
        </div>
        </DataContext.Provider>
    );
}   

export default App;




