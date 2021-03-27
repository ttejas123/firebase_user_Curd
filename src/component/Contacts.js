import ContactForm from "./ContactForm.js";
import React, {useState, useEffect} from "react";
import firebase from "../firebase";

const Contact=()=>{
	const [contactObject, setContactObject] = useState({});
	const [currentId, setCurrentId] = useState('');
	//get data from fireBase DataBase and store in setContactObject
	useEffect(()=>{
		firebase.child(`Contact`).on('value', snapshot=>{
			if(snapshot.val()){
				setContactObject({
					...snapshot.val()
				})
			}
		})
	},[])
	//Store data into firebase, or update data into database
	const addOrEdit = (obj) =>{
		if(currentId==""){
			console.log("This is for Saving Data");
			const mailId = obj.email.replace(/[^a-zA-Z0-9 ]/g, "");
				console.log(mailId);
				const ref =  firebase.child("Contact").orderByChild("email").equalTo(obj.email);
			    ref.once('value').then((snapshot)=>{
			    	let value = snapshot.val();
			    	console.log(value);
			    	if (value) {
			    		alert("This email is already Used, Try AnotherOne");
			    	}else{
			    		firebase.child(`Contact/${mailId}`).set(obj, err=>{
							if(err){
								alert(err);
							}else{
								setCurrentId('');
							}
						})
						alert("User successfully registered");
			    	}
			    })
		}else{
			console.log("This is for Update");
			const mailId = obj.email.replace(/[^a-zA-Z0-9 ]/g, "");
				console.log(mailId);
				const ref =  firebase.child("Contact").orderByChild("email").equalTo(obj.email);
			    ref.once('value').then((snapshot)=>{
			    	let value = snapshot.val();
			    	console.log(value);
			    	if (value) {

			    		firebase.child(`Contact/${mailId}`).set(obj, err=>{
							if(err){
								alert(err);
							}else{
								setCurrentId('');
							}
						})
						alert("Update Complete");
			    	}else{
			    		firebase.child(`Contact/${mailId}`).set(obj, err=>{
							if(err){
								alert(err);
							}else{
								setCurrentId('');
							}
						})

						alert("Update Completed");
			    	}
			    })
		}
	}
	const onDelete=(id)=>{
		if(window.confirm("Are you sure to delete this record")){
			firebase.child(`Contact/${id}`).remove(err=>{
							if(err){
								alert(err);
							}else{
								setCurrentId('');
							}
						})
		}
	}
	  return (
	  	<>
		  	<div className="jumbotron jumbotron-fluid">
			  <div className="container">
			    <h1 className="display-4 text-center">User Curd</h1>
			  </div>
			</div>
			<div className="row">
				<div className="col-md-5">
					<ContactForm {...({addOrEdit, currentId, contactObject})}/>
				</div>
				<div className="col-md-7">
					<table className="table table-borderless table-stripped">
						<thead className="thead-light">
							<th>full Name</th>
							<th>mobile</th>
							<th>Email</th>
                            <th>Action</th>
						</thead>
						<tbody>
							{
								Object.keys(contactObject).map(id =>{
									return <tr key={id}>
										<td>{contactObject[id].fullName}</td>
										<td>{contactObject[id].mobile}</td>
										<td>{contactObject[id].email}</td>
										<td> 
											<a className="btn text-primary" onClick={()=>{setCurrentId(id)}}>
												<i className="fas fa-pencil-alt"/>
											</a>
											<a className="btn text-danger" onClick={()=>{onDelete(id)}}>
												<i className="fas fa-trash-alt"/>
											</a>
										</td>
									</tr>
								})
							}
						</tbody>
					</table>
				</div>
			</div>
		</>
	  	);
}

export default Contact;