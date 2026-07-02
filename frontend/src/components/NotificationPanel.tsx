export default function
NotificationPanel(){

const notifications=[

"3 Syncs Completed",

"1 Mapping Pending",

"Analytics Updated"

]

return(

<div
className="notification-panel"
>

<h3>

Notifications

</h3>

{

notifications.map(
(n)=>(

<div
key={n}
className="notify"
>

{
n
}

</div>

)

)

}

</div>

)

}