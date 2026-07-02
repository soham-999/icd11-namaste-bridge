import {
useEffect,
useState
}
from "react"

import Layout
from "../components/Layout"

import {
getSyncStatus
}
from "../api"

export default function
SyncMonitor(){

const[
records,
setRecords
]=useState<any[]>(
[]
)

const[
loading,
setLoading
]=useState(
true
)

useEffect(()=>{

async function
load(){

try{

const data=
await getSyncStatus()

setRecords(
data
||
[]
)

}

catch{

setRecords(
[]
)

}

finally{

setLoading(
false
)

}

}

load()

},[])

return(

<Layout>

<h1>

Sync Monitor

</h1>

{

loading

?

<div>

Loading…

</div>

:

records.length===0

?

<div>

No Sync Records

</div>

:

records.map(
(r:any)=>(

<div
key={r.id}
className="sync-card"
>

<h3>

{
r.hospital
}

</h3>

<p>

Status:
{
r.status
}

</p>

<p>

Success:
{
r.rate
}

%

</p>

</div>

)

)

}

</Layout>

)

}