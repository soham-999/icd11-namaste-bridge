/*import React from "react";
import Dashboard from "./Dashboard.jsx";

function App() {

const token =
localStorage.getItem(
"token"
);

if(!token){
return (
<div
style={{
height:"100vh",
display:"flex",
alignItems:"center",
justifyContent:"center",
background:"#0f172a",
color:"white"
}}
>
Login page not connected yet
</div>
);
}

return <Dashboard />;

}

export default App;*/
import React, { useState } from 'react';
import Dashboard from './Dashboard';
import Login from './Login';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('token')
  );

  return isLoggedIn 
    ? <Dashboard /> 
    : <Login onLogin={() => setIsLoggedIn(true)} />;
}