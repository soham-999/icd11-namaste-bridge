export default function
PatientTimeline({

timeline=[]

}:any){

return(

<div>

{

timeline.map(
(
item:any,
index:number
)=>(

<div
key={index}
className="timeline-item"
>

<div
className="timeline-dot"
/>

<div>

<h4>

{
item.title
}

</h4>

<p>

{
item.date
}

</p>

</div>

</div>

)

)

}

</div>

)

}