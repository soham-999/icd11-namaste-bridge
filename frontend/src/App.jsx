import React from "react";
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

export default App;