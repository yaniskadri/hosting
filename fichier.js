var jsonData;


//1. Récupérer le contenu textuel à être affiché sur la page
fetch("https://raw.githubusercontent.com/yaniskadri/hosting/master/data.json")
	 .then(function (response) {
    return response.json();
  })
	 .then(function (data) {
	 	jsonData = data;
	 	appendData(data);
	 })
  .catch(function (err) {
	console.log(err);
  });


//2. Afficher le contenu récupéré dans les balises html
function appendData(data){
	//Remplissage des nouvelles
	var news = document.getElementsByClassName('nouvelle');
	for (var i = 0; i < news.length; i++){
		news[i].children[0].children[0].textContent = data.nouvelles[i].titre;
		news[i].children[1].textContent = cutText(data.nouvelles[i].article);
	}


	//Remplissage du formulaire
	var items = document.getElementById("items").getElementsByTagName("LABEL");
	for(var i =0; i<items.length ; i++){
		items[i].textContent = data.materiel[i];
		items[i].previousElementSibling.setAttribute("value", "0");
	}	


	//Remplissage des guides
	var guides = document.getElementById("guides").getElementsByTagName("H4");
	for (var i = 0; i < guides.length; i++) {
		guides[i].children[0].textContent = data.guides[i].titre
		console.log(guides[i].innerHTML)
	}

	//Remplissage du bottin
	var bottin = document.getElementsByClassName("contact");
	for (var i = 0; i < bottin.length ; i++){
		bottin[i].children[0].textContent = data.bottin[i].nom + " - " + data.bottin[i].fonction;
		bottin[i].children[1].textContent = data.bottin[i].email;
	}
	
	//Remplissage des partenaires
	var partenaires = document.getElementsByClassName("lienImage");
	for(var i = 0; i < partenaires.length; i++){
		partenaires[i].setAttribute("href", data.partenaires[i].url);
		var html = "<img src=" + '"' + data.partenaires[i].urlphoto + '"' +"> <p>";

		for(var j=0; j < data.partenaires[i].informations.length; j++){
			html += data.partenaires[i].informations[j] + "<br>";
		}
		html += "</p>";
		partenaires[i].innerHTML = html;
	}
}


	//Appellée au chargement de la page
	window.addEventListener('load', function() {
		loadLogin();
		loadModals();
		setClipboard();
	})



//Assigner les différents contenus de fenêtre modales aux boutons 
function loadModals(){
	const openModalButtons = document.getElementsByClassName("modalButton")
	const modal = document.getElementById("modal-container")

	Array.from(openModalButtons).forEach(button =>
		button.addEventListener('click', () => {
			fillModal(button.id)
			openModal(modal)
		}))

	const closeModalButtons = document.getElementsByClassName("button-close")
	Array.from(closeModalButtons).forEach(button =>
		button.addEventListener('click', () => {
			closeModal(modal)
		}))
}

//Charger la fenêtre modale d'identification
function loadLogin(){
		document.getElementById("bouton-connecter").addEventListener('click', ()=>{
		var loginFields = document.getElementsByClassName("loginInput")
		var validation = (loginFields[0].value == "jbradette") && (loginFields[1].value == "123456")

		if (validation == true) {closeModal(document.getElementById('modal-container2'))}
		else {document.getElementById("errorLogin").classList.add('active')}
	})

	openModal(document.getElementById('modal-container2'))
}


 //Établir le contenu à afficher dans la fenêtre modale en fonction du bouton appellant
 function fillModal(id){ 
 	var data = jsonData;
 	var title, content;
 	const shortid = id.substring(0, 4)

 	switch(shortid){
 		case 'news':
 			title = data.nouvelles[id[4]].titre
 			content = data.nouvelles[id[4]].article
 			break;
 		case 'guid':
 			title = data.guides[id[4]].titre
 			content = data.guides[id[4]].contenu
 			break;
 		case 'comm':
 			setOrder()
 			var order = JSON.parse(localStorage.getItem('commande'))
 			title = "Confirmation"
 			content = order.savon + " L de savon, " + order.guenilles + " guenilles, " + order.desodorisant + " bouteilles de desodorisant et " + order.ampoules + " ampoules" 
 			content += "Vous serez avisé lorsque les items commandés seront à votre disposition au siège de l’association Frigocommunautaire sur au 4525 Rue Clark, Montréal, QC. "
 			break;
 	}


 	const header = document.getElementById("modal-title")
 	const body = document.getElementsByClassName("modal-content")

 	header.textContent=title;
 	body[0].textContent= content;
 }

  function openModal(modal){
 	if(modal== null) return
 	 modal.classList.add('active')
     overlay.classList.add('active')
 }

 function closeModal(modal){
 	if(modal== null) return 
 	modal.classList.remove('active')
    overlay.classList.remove('active')
    console.log("closed")
 }



//Récupérer la commande effectuée pour son affichage ultérieur
function setOrder(){
	var order = { 'savon' : 0, 'guenilles' : 0, 'desodorisant' :0, 'ampoules' : 0 }

	order.savon = document.getElementById("item0").value
	order.guenilles = document.getElementById("item1").value
	order.desodorisant = document.getElementById("item2").value
	order.ampoules = document.getElementById("item3").value

	localStorage.setItem('commande', JSON.stringify(order))
}


//Copier les emails dans le presse-papier
function setClipboard(){
	var contacts = document.getElementsByClassName("clipboard")
	Array.from(contacts).forEach(button=>
		button.addEventListener('click', ()=>{
			var email = button.parentNode.children[1].textContent
			copy(email)
		}))
}


function copy(text) {
    var input = document.createElement('textarea');
    input.innerHTML = text;
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input);
    return result;
}


	//Fonctions intérmédiaires
	function cutText(text){
		if (text.length > 230){
			return (text.substring(0, 230) + "...");
		} else {return text;}
	}