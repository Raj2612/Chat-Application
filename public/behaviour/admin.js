window.onload=init;

function init(){
	var button=document.getElementById('submitMessage');
	button.addEventListener('click',submitMessage);
	console.log(button);
	setInterval(getData,1000);
	var buttons=document.getElementsByClassName('deleteMessage');
	for(var i=0;i<buttons.length;i++)
		buttons[i].addEventListener('click',deleteMessage);
	
}
function submitMessage(e){
	e.preventDefault();
	var messageField=document.getElementById('messageField');
	var message=messageField.value;
	message=encodeURIComponent(message);
	var str='message='+message;
	var req=new XMLHttpRequest();
	req.open('POST','/chat',true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.send(str);
	messageField.value="";
	req.addEventListener("load",function(){
		var obj=JSON.parse(req.responseText);
		console.log(obj);
		var div=document.createElement('div');
		div.innerHTML=obj.username+" ----- "+obj.message+" ----- on "+new Date();
		var parent=document.getElementById('messageContainer');
		div.classList.add('messages');
		parent.appendChild(div);
		var input=document.createElement('input');
		input.type='submit';
		input.classList.add('deleteMessage');
		input.name=obj.id;
		input.value='Delete';
		input.addEventListener('click',deleteMessage);
		div.appendChild(input);
	});
}
function deleteMessage(e){
	var button=e.target;
	e.stopPropagation();
	var id=button.name;
	console.log(id);
	id=encodeURIComponent(id);
	var str='id='+id;
	var req=new XMLHttpRequest();
	req.open('POST','/deletePost',true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.send(str);
	e.preventDefault();
	var parent=button.parentNode;
	var grandparent=parent.parentNode;
	grandparent.removeChild(parent);
	
}
function getData(){
	var req=new XMLHttpRequest();
	req.open('GET','/data',true);
	req.send();
	req.addEventListener("load",function(){
		var messages=JSON.parse(req.responseText)
		removeElementsByClass('messages');
		for(var i=0;i<messages.length;i++){
			var obj=messages[i];
			var div=document.createElement('div');
			div.innerHTML=obj.username+" ----- "+obj.message+" ----- on "+new Date(obj.timestamp);
			var parent=document.getElementById('messageContainer');
			div.classList.add('messages');
			parent.appendChild(div);
			var input=document.createElement('input');
			input.type='submit';
			input.classList.add('deleteMessage');
			input.name=obj["_id"];
			input.value='Delete';
			input.addEventListener('click',deleteMessage);
			div.appendChild(input);
			
		}
	})
}
function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}