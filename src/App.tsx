import React from 'react';
import Login from './Login';
import Notes from './Notes';
import { UserData } from './types';

function App(){
    const [userData, setUserData] = React.useState<UserData>();

    return userData ? <Notes userData={userData} /> : <Login setUserData={setUserData}/>;
}

export default App;