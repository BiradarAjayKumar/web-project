const cl=console.log;
const form=document.getElementById('stdForm');
const fnamecontrol=document.getElementById('fname');
const lnamecontrol=document.getElementById('lname');
const contactcontrol=document.getElementById('contact');
const emailcontrol=document.getElementById('email');
const submit=document.getElementById('submit');
const stdContainer=document.getElementById('stdContainer');
const alertmsg=document.getElementById('alertmsg');
const table=document.getElementById('table');
const stdUpdatebtn=document.getElementById('stdUpdatebtn');

let stdarr=localStorage.getItem('stdarr') ? JSON.parse(localStorage.getItem('stdarr')):[]
const openSnackBar=(msg,icon)=>{
    Swal.fire({
        title:msg,
        icon:icon,
        timer:3000

    })
}

const showalertmsg=(arr)=>{
    if(arr.length===0){
        alertmsg.classList.remove('d-none')
        table.classList.add('d-none')
    }
    else{
        alertmsg.classList.add('d-none')
        table.classList.remove('d-none')
    }
}
showalertmsg(stdarr)
const generateUuid=()=>{
    return(
        String('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx')).replace(/[xy]/g,(character)=>{
            const random=(Math.random()*16)|0;
            const value=character==="x" ? random : (random & 0x3)|0x8;
            return value.toString(16);
        })
};
const onEdit=(e)=>{
    let editid=e.closest('tr').id
    localStorage.setItem('editid',editid)
    let editobj=stdarr.find(std=>std.id===editid)
    fnamecontrol.value=editobj.fname
    lnamecontrol.value=editobj.lname
    contactcontrol.value=editobj.contact
    emailcontrol.value=editobj.email
    submit.classList.add('d-none')
    stdUpdatebtn.classList.remove('d-none')
}
const onUpdate=(e)=>{
    let editid=localStorage.getItem('editid')
    let updatedobj={
        fname:fnamecontrol.value,
        lname:lnamecontrol.value,
        contact:contactcontrol.value,
        email:emailcontrol.value,
        id:editid
    }
    form.reset()
    stdUpdatebtn.classList.add('d-none')
    submit.classList.remove('d-none')
    let editindex=stdarr.findIndex(std=> std.id===editid)
    stdarr[editindex]=updatedobj;
    localStorage.setItem('stdarr',JSON.stringify(stdarr))
    const alltds=
    [...document.getElementById(editid).children]
    alltds[1].innerHTML=updatedobj.fname
    alltds[2].innerHTML=updatedobj.lname
    alltds[3].innerHTML=updatedobj.contact
    alltds[4].innerHTML=updatedobj.email
    openSnackBar(`New Student "${updatedobj.fname} ${updatedobj.lname}" Updated Successfully!`,'success')
}
const createtrs=(arr)=>{
    let result=stdarr.map((std,i)=>
        `<tr id="${std.id}">
    <td>${i+1}</td>
    <td>${std.fname}</td>
    <td>${std.lname}</td>
    <td>${std.contact}</td>
    <td>${std.email}</td>
    <td class="text-center"><i class="fas fa-edit fa-2x test-success" onclick="onEdit(this)"></i></td>
      <td class="text-center"><i class="fas fa-trash-alt fa-2x text-danger" onclick="onRemove(this)"></i></td>
    </tr>
    `).join('')
    stdContainer.innerHTML=result;
}
createtrs(stdarr)
const onRemove=(e)=>{
    let getconfirm=confirm(`Are you sure want to remove? `)
    if(getconfirm){
        removeid=e.closest('tr').id
        let removeindex=stdarr.findIndex(std=>std.id===removeid)
        stdarr.splice(removeindex,1)
        localStorage.setItem('stdarr',JSON.stringify(stdarr))
        e.closest('tr').remove()
        let alltrs=[...document.querySelectorAll('#stdcontainer tr')]
        alltrs.forEach((tr,i)=>tr.firstElementChild.innerHTML=i+1)
        openSnackBar(`student removed successfully!`,'success')
        showalertmsg(stdarr)
    }
}
const onSubmit=(e)=>{
    e.preventDefault()
    let obj={
        fname:fnamecontrol.value,
        lname:lnamecontrol.value,
        contact:contactcontrol.value,
        email:emailcontrol.value,
        id:generateUuid()
    }
    form.reset()
    stdarr.push(obj)
    localStorage.setItem('stdarr',JSON.stringify(stdarr))
    let newtr=document.createElement('tr')
    newtr.id=obj.id
    newtr.innerHTML=`
    <td>${stdarr.length}</td>
    <td>${obj.fname}</td>
    <td>${obj.lname}</td>
    <td>${obj.contact}</td>
    <td>${obj.email}</td>
    <td class="text-center"><i class="fas fa-edit fa-2x test-success" onclick="onEdit(this)"></i></td>
      <td class="text-center"><i class="fas fa-trash-alt fa-2x text-danger" onclick="onRemove(this)"></i></td>
    </tr>`
    stdContainer.append(newtr)
    showalertmsg(stdarr)
    openSnackBar(`New Student "${obj.fname} ${obj.lname}" Added Successfully!`,'success')
}
form.addEventListener('submit',onSubmit)
stdUpdatebtn.addEventListener('click',onUpdate)
