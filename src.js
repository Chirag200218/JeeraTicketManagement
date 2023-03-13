let add = document.querySelector(".add-btn");
let modalCont = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let textareaCont = document.querySelector(".textarea-cont");
let color = ["lightpink","lightblue","lightgreen","black"];
let modalPriorityColor = color[color.length-1];
let allPriorityColor = document.querySelectorAll(".priority-color");
let toolBoxColor = document.querySelectorAll(".color");



let addFlag = false;

let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";


let ticketsArray=[];

if(localStorage.getItem("Jira_tickets")){
    
    //display tickets
    ticketsArray =JSON.parse(localStorage.getItem("Jira_tickets"));
    ticketsArray.forEach((tickObj)=>{
        createTicket(tickObj.ticketColor,tickObj.ticketValue,tickObj.ticketId);
    })
}
for(let i=0;i<toolBoxColor.length;i++){
    toolBoxColor[i].addEventListener("click",(e)=>{
        let currentToolBoxColor = toolBoxColor[i].classList[0];
        let filterTickets = ticketsArray.filter((ticketObj,idx)=>{
            return currentToolBoxColor==ticketObj.ticketColor;
        });
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        //Delete all tickets 
        for(let i=0;i<allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }

        //display new filtered tickets.
        filterTickets.forEach((tickObj,idx)=>{
            createTicket(tickObj.ticketColor,tickObj.ticketValue,tickObj.ticketId,false);
        }) 
    })


    toolBoxColor[i].addEventListener("dblclick",(e)=>{
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        //Delete all tickets 
        for(let i=0;i<allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }
        ticketsArray.forEach((tickObj,idx)=>{
            createTicket(tickObj.ticketColor,tickObj.ticketValue,tickObj.ticketId,false);
        })

    })
}


add.addEventListener("click",(e)=>{
    //addFLag=> true  -- display modal
     //addFlag=>false -- remove modal
    if(addFlag==false){
        modalCont.style.display="flex";
    }else{
        modalCont.style.display="none";
    }
   
    //generate ticket
    addFlag = !addFlag;
    console.log(addFlag);
});

 
modalCont.addEventListener("keydown",(e)=>{
    let key = e.key;
    if(key==="Shift"){
        let str = textareaCont.value;
        createTicket(modalPriorityColor,str,shortid(),true);
        addFlag= !addFlag;
        setModalToDefault();
    }
})

function createTicket(ticketColor,ticketValue,ticketId,bool){
  
    let id = ticketId;
    let ticketCont= document.createElement("div");
    ticketCont.setAttribute("class","ticket-cont");
    ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
                            <div class="ticket-id">${ticketId}</div>
                            <div class="task-area">${ticketValue}</div>
                            <div class="ticket-lock"><i class="fas fa-lock"></i></div>`;
    mainCont.appendChild(ticketCont);
    if(bool==true){
        ticketsArray.push({ticketColor,ticketValue,ticketId});
        localStorage.setItem("Jira_tickets",JSON.stringify(ticketsArray));
    }
    handleRemoval(ticketCont,id);
    handleLock(ticketCont,ticketId);
    handleColor(ticketCont,ticketId);
}

allPriorityColor.forEach((colorElem,idx )=> {
    colorElem.addEventListener("click",(e)=>{
        allPriorityColor.forEach((color,idx)=>{
            color.classList.remove("border");
        })
        colorElem.classList.add("border");
        modalPriorityColor = colorElem.classList[1];
    });
});


function handleRemoval(ticket,id){
    ticket.addEventListener("dblclick",(e)=>{
        let idx = getTicketIdx(id);
        ticketsArray.splice(idx,1);
        let strTicketArr = JSON.stringify(ticketsArray);
        localStorage.setItem("Jira_tickets",strTicketArr);
        
        ticket.remove();
    })
}

function handleLock(ticket,id){
    let ticketLockELem = ticket.querySelector(".ticket-lock");
    
    let ticketlock = ticketLockELem.children[0];
    let ticketTaskArea = ticket.querySelector(".task-area");
   console.log(ticketlock.classList)
    ticketlock.addEventListener("click",(e)=>{
        let idx = getTicketIdx(id);
        
        //console.log("jgj");
        if(ticketlock.classList.contains(lockClass)){
            console.log("inside")
            ticketlock.classList.remove(lockClass);
            ticketlock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable","true");
    
        }else{
            console.log("outside")
            ticketlock.classList.remove(unlockClass);
            ticketlock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable","false");
            
        }

        //Modify data in local storage
        ticketsArray[idx].ticketValue = ticketTaskArea.innerHTML;4
        localStorage.setItem("Jira_tickets",JSON.stringify( ticketsArray));
    });

}

function getTicketIdx(id){
    let ticketidx = ticketsArray.findIndex((tickObj)=>{
        return tickObj.ticketId===id;
    });
    return ticketidx;
}
function handleColor(ticket,id){
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click",(e)=>{
        //get ticket index form tticket 
        let idx = getTicketIdx(id);

        let currentTicketColor =ticketColor.classList[1];
        //Get ticket color index
         let currentTicketColorIndex =  color.findIndex((color)=>{
            return currentTicketColor===color;
        })
        let newTicketColorIndex = (currentTicketColorIndex+1)%4;
        let newTicketColor = color[newTicketColorIndex];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);

        //modify data in local storage..
        ticketsArray[idx].ticketColor = newTicketColor;
        localStorage.setItem("jira_tickets",JSON.stringify( ticketsArray));
    })
}


function getTicketIdx(id){
    let ticketidx = ticketsArray.findIndex((tickObj)=>{
        return tickObj.ticketId===id;
    });
    return ticketidx;
}

function setModalToDefault(){
    modalCont.style.display="none";
    textareaCont.value="";
    modalPriorityColor=color[color.length-1];
    allPriorityColor.forEach((color,idx)=>{
        color.classList.remove("border");
    })
    allPriorityColor[allPriorityColor.length-1].classList.add("border");
}

