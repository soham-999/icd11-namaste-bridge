import {
useEffect,
useState
}
from "react"

import Layout
from "../components/Layout"

export default function
AuditLogs(){

const[
logs,
setLogs
]=useState<any[]>(
[]
)

useEffect(()=>{

setLogs([])

},[])

return(

<Layout>

<h1>

Audit Logs

</h1>

{

logs.length===0

?

<div>

No Audit Events

</div>

:

logs.map(
(x:any)=>(

<div
key={x.id}
className="audit-card"
>

<div>

{
x.action
}

</div>

<div>

{
x.time
}

</div>

</div>

)

)

}

<button>

Export Logs

</button>

</Layout>

)

}