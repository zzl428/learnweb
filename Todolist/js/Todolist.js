//html的meta里设置了每隔30s刷新一次页面

//main()
load();


//初始化函数
function init(){
	localStorage.clear();
	//alert("Todolist已重置");
	if(!window.localStorage){
		alert("浏览器不支持localstorage");
	}
	location.reload();
}

//判断事件是否过期
function judgeExpire(){
	var now=new Date();
	for(let i=0;i<localStorage.length;i++){
		let key=localStorage.key(i);
		let value=JSON.parse(localStorage.getItem(key));
		let time=Date.parse(value.deadline);
		let nowtime=now.getTime();
		if(time<nowtime){
			value.expire=true;
		}
		else{
			let remaining_time=time-nowtime;
			let remaining_seconds=remaining_time/1000;
			if(remaining_seconds<=60){
				value.remaining_time=parseInt(remaining_seconds)+"秒";
			}
			else if(remaining_seconds<=60*60){
				let minutes=parseInt(remaining_seconds/60);
				let seconds=parseInt(remaining_seconds-minutes*60);
				value.remaining_time=minutes+"分"+seconds+"秒";
			}
			else if(remaining_seconds<=60*60*24){
				let hours=parseInt(remaining_seconds/(60*60));
				let minutes=parseInt((remaining_seconds-hours*60*60)/60);
				let seconds=parseInt(remaining_seconds-hours*60*60-minutes*60);
				value.remaining_time=hours+"时"+minutes+"分"+seconds+"秒";
			}
			else{
				let days=parseInt(remaining_seconds/(60*60*24));
				let hours=parseInt((remaining_seconds-days*60*60*24)/(60*60));
				let minutes=parseInt((remaining_seconds-days*60*60*24-hours*60*60)/60);
				let seconds=parseInt(remaining_seconds-days*60*60*24-hours*60*60-minutes*60);
				value.remaining_time=days+"天"+hours+"时"+minutes+"分"+seconds+"秒";
			}
		}
		localStorage.setItem(key,JSON.stringify(value));
	}
}

//添加函数，从表单获取事件，然后转化存入本地
function add(){
	var input=document.getElementById("input");
	var time=document.getElementById("time");
	if(input.value===""){
		alert("待办事项内容为空，请重新输入。");
		return false;
	}
	if(time.value===""){
		alert("待办事项时间为空，请重新输入。");
		return false;
	}
	var temp={
		deadline:time.value,
		done:false,
		expire:false,
		done_time:" ",
		remaining_time:" "
	}
	localStorage.setItem(input.value,JSON.stringify(temp));
	//load();
}

//列表顺序排列
function sort_insert(todo_ul_node,new_li,value){
	let lis_array=todo_ul_node.children;
	//todo_ul_node.appendChild(new_li);
	//若ul为空，则直接插入，否则进行排序
	if(lis_array.length===0){
		todo_ul_node.appendChild(new_li);
	}
	else{
		//若时间比第一个节点早，则插在第一个
		let li=todo_ul_node.firstElementChild;
		let li_array=li.children;
		let li_time=li_array[1].value;
		let time=Date.parse(li_time);
		let new_time=Date.parse(value.deadline);
		if(new_time<time){
			todo_ul_node.insertBefore(new_li,li);
			return true;
		}
		//若时间比最后一个节点晚，则插在最后一个
		li=todo_ul_node.lastElementChild;
		li_array=li.children;
		li_time=li_array[1].value;
		time=Date.parse(li_time);
		if(time<new_time){
			todo_ul_node.appendChild(new_li);
			return true;
		}
		else{//否则遍历li数组，比较后插入
			for(let k=0;k<lis_array.length-1;k++){
				let 
					li1=lis_array[k];
					li2=lis_array[k+1];
				let 
					li1_array=li1.children;
					li2_array=li2.children;
				let 
					li1_time=li1_array[1].value;
					li2_time=li2_array[1].value;
				let 
					time1=Date.parse(li1_time);
					time2=Date.parse(li2_time);
				if(time1<=new_time&&new_time<=time2){
					todo_ul_node.insertBefore(new_li,li2);
				}
			}
		}
	}
}

//响应确认按钮的监听器
function judgeDone(key,value){
	value.done=!(value.done);
	if(value.done===true){
		var now=new Date();
		value.done_time=now.getTime();
	}
	else{
		value.done_time="";
	}
	
	localStorage.setItem(key,JSON.stringify(value));
	location.reload();
}

//响应事件改动的监听器
function content_alter(key,value,new_text){
	localStorage.removeItem(key);
	key=new_text;
	localStorage.setItem(key,JSON.stringify(value));
	location.reload();
}

//响应时间改动的监听器
function time_alter(key,value,new_deadline){
	value.deadline=new_deadline;
	localStorage.setItem(key,JSON.stringify(value));
	location.reload();
}

//响应事件删除的监听器
function define_delete(key){
	localStorage.removeItem(key);
	location.reload();
}

//利用数据更新页面
function load(){
	//若本地为空，报错退出
	if(localStorage.length===0){
		return false;
	}
	//获取三个ul节点,清空页面上已有元素，方便重新加载
	var ul_array=document.getElementsByTagName("ul");
	ul_array[0].innerHTML="";
	ul_array[1].innerHTML="";
	ul_array[2].innerHTML="";
	//判断本地事项是否过期
	judgeExpire();
	for(let i=0;i<localStorage.length;i++){
		//获取本地数据
		let key=localStorage.key(i);
		let value=JSON.parse(localStorage.getItem(key));
		//新建li节点
		var new_li=document.createElement("li");
		//新建确认按钮，设置并插入li节点
		var new_checkbox=document.createElement("input");
		new_checkbox.setAttribute("type","checkbox");
		new_checkbox.setAttribute("class","checkbox_button");
		new_checkbox.addEventListener("click",function(){
			judgeDone(key,value);
		});
		new_li.appendChild(new_checkbox);
		//时间插入li
		let new_deadline=document.createElement("input");
		new_deadline.setAttribute("type","datetime-local");
		new_deadline.setAttribute("class","time_text");
		new_deadline.value=value.deadline;
		new_deadline.addEventListener("change",function(){
			time_alter(key,value,new_deadline.value);
		});
		new_li.appendChild(new_deadline);
		//事件插入li
		let new_text=document.createElement("input");
		new_text.setAttribute("type","text");
		new_text.setAttribute("class","content_text");
		new_text.value=key;
		new_text.addEventListener("change",function(){
			content_alter(key,value,new_text.value);
		});
		new_li.appendChild(new_text);
		//新建完成时间，设置并插入li节点
		let done_time=new Date(value.done_time);
		let done_time_text=document.createTextNode("剩余"+value.remaining_time);
		if(value.done===true){
			done_time_text=document.createTextNode(done_time.toLocaleString());
		}
		new_li.appendChild(done_time_text);
		//新建删除按钮，设置并插入li节点
		var new_delete=document.createElement("input");
		new_delete.setAttribute("type","button");
		new_delete.setAttribute("class","delete_button");
		new_delete.setAttribute("value"," ");
		new_delete.addEventListener("click",function(){
			define_delete(key);
		});
		new_li.appendChild(new_delete);
		//将li节点插入三个部分
		if(value.expire===true&&value.done===false){
			let expire_ul_node=document.getElementById("expirearea-list");
			sort_insert(expire_ul_node,new_li,value);
			//expire_ul_node.appendChild(new_li);
		}
		else if(value.done===true){
			let done_ul_node=document.getElementById("donearea-list");
			new_checkbox.checked=true;
			sort_insert(done_ul_node,new_li,value);
			//done_ul_node.appendChild(new_li);
		}
		else {
			let todo_ul_node=document.getElementById("todoarea-list");
			sort_insert(todo_ul_node,new_li,value);
		}
	}
}