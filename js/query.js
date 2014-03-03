$("document").ready(function(){

	//va cherceher la fonction getfacet selon le role, le tag et le groupname
	getFacet('role');
	getFacet('tag');
	getFacet('groupname');
	
	
	//lance la fonction query() si le le formulaire de recherche et cliqué
	$(".btn_query").click(function(){

		 	query();
		 	
	});
	
	
	//lance une requete avec le menu de facettes
	$("#side_search").on('click', '.facet', function(){

		 	var keyword = $(this).attr('id');
		 	var parent = $(this).parent().attr('id');
		 	$(".query").val(parent+':'+keyword);
		 	
		 	query(keyword,parent);
	});
	
	
	//lance la requete lorsque l'on appuie sur enter
	$('#form1').submit(function() {
		event.preventDefault();
		query();
	});
	
	//affiche les résultat suivant lorsque l'on clique sur page suivante
	$('#page').on('click', '.pageSuivante',function() {

		var page = $(".pageSuivante").attr('id');
		var parent = $(".nbpage").attr('id');

		console.log(parent);
		query('','',page,parent);
	});
	
	
	//affiche les résultat précédents lorsque l'on clique sur page suivante
	$('#page').on('click', '.pagePrecedente',function() {
		
		var page = $(".pagePrecedente").attr('id');
		var parent = $(".nbpage").attr('id');
		
		parent = Number(parent)-2;

		console.log(parent);
		query('','',page,parent);
	});
	
	//change le nombre de ligne affichée lorsque intervient un changement dans le select
	$('.rows').on('change','',function(){
		console.log('helo');
		query();
	});
	
	//change le type de tri lorsque intervient un changement dans le select
	$('.sort').on('change','',function(){
		console.log('hellllo');
		query();
	});
	
	//change le type de tri ascendant ou descenant lorsque intervient un changement dans le select
	$('.order').on('change','',function(){
		console.log('hellllo');
		query();
	});
	
	//affiche le résultat qui nous intéresse
	$('.result').live('click', '.hidden', function() {
		
		$(this).children('.hidden').toggle();

	});
	
})

//fonction ajax qui va chercher les résultats
//param id: valeur du keyword qui est dans le menu des facettes
//param parent: valeur du parent de keyword dans le menu des facettes (role, tag, groupnames)
//param page: page que l'on a consulté précédement
//param page: page que l'on va consulté

function query(id,parent,page,pageActuelRecu){
	id = id || "";
	parent = parent || "";
	page = page || "";
	pageActuelRecu = pageActuelRecu || "";

	//test si il y a qqch dans le champs de recherche
	if($(".query").val() != ''){
		var q=$(".query").val();
	}
	//prend la valeur de recherche générale
	else {
		var q = '*:*';
	}
	
	
	//construction du paramètre
	var request = {};
		
	if(id.length){		
		request['q']= parent+':'+id;
	}
	
	else{
		request['q'] = q;
	}
	
	if($(".sort option:selected").val() != ''){
		request['sort'] = $(".sort option:selected").val()+" "+$(".order option:selected").val();
	}
	else{
		request['sort'] = '';
	}
	
	request['rows'] = $(".rows option:selected").val();
	
	if(page.length){
		request['start'] = page;
	}
	else{
		request['start']=0;
	}
		
	request['wt'] = "json";
	var dataType = 'jsonp';
	var url="http://localhost:8983/solr/select";	
		
	$.ajax({
		dataType: "jsonp",
		url: url,
		
		'jsonp': 'json.wrf',
		'data': request,
		
		//en cas d'erreur
		error: function () {
			console.log('error');
		},
		//en cas de succés
		success: function (data) {
			
			$("#results").children().remove();
			
			var html = "<h1>"+ data.response.numFound+" résultats</h1><br/><div>";
			
			html += "<div id='resultContainer'>"
			
			for (var i = 0; i < data.response.docs.length; i++) {
				
				var result=data.response.docs[i];
				if(result.role=='person'){
					html += afficherPersonne(result);
				}
				else if(result.role=='city'){
					html += afficherVille(result);

				}
				else if(result.role=='text'||'audio'||'video'||'image'){
					html += afficherMedia(result);
				}
				
				
				else{
					console.log('erreur');
				}

			}
			
			
			if(data.response.numFound>request['rows']){
				var resultat = data.response.numFound;
				var resultatparpage = request['rows'];
				console.log(request['start']);
				var nextStart= Number(request['start'])+Number(resultatparpage);
				var previousStart= Number(request['start'])-Number(resultatparpage);
				console.log(nextStart);
				console.log(resultatparpage);
				var nbpagebrut = resultat / resultatparpage;
				var nbpage = Math.ceil(nbpagebrut);
				var pageActuel=Number(pageActuelRecu)+1;
				if(isNaN(pageActuel)) {
					var pageActuel = 1;
				}
				
				
				$("#page").children().remove();
				
				
				var pageresultats="<p class='nbpage' id='"+pageActuel+"'>page "+pageActuel+" de "+nbpage+"</p>";
				var pagesuivante="<p class='pageSuivante' id='"+nextStart+"'>Page suivante</p>";
				var pageprecedente="<p class='pagePrecedente' id='"+previousStart+"'>Page précédente</p>";
				
				if (pageActuel==1){
					$("#page").append(pageresultats);
					$("#page").append(pagesuivante);
				}
				else if (pageActuel==nbpage){
					$("#page").append(pageresultats);
					$("#page").append(pageprecedente);

				}
				else if (nbpage==1){
					$("#page").append(pageresultats);
				}
				else {
					$("#page").append(pageresultats);
					$("#page").append(pagesuivante);
					$("#page").append(pageprecedente);
				}

			}
			
			html += "</div>"
			
			$("#results").html(html);
			
		}
	
	});

};

//fonction d'affichage des résulats des personnes
function afficherPersonne(person){
				pictoUrl='images/picto/person';
				var date = new Date(person['birthdate']);

				var day = date.getDate();
				var month = date.getMonth();
				var year = date.getFullYear();
				var dateFormated = day+"."+month+"."+year; 
	
				var html = "<div class='result' id='person'><img src='images/picto/person.gif'/><div id='headerResult'>";
				
				html +=person['firstname']+" "+person['lastname']+"</div>";
				html +="<div id='contentResult' class='hidden'>";
				html +="<p>Domicile: "+person['city.code']+" "+person['city.name']+"</p>";
				html +="<p>Date de naissance: "+dateFormated+"</p>";
				html +="<p>Biographie: "+person['biography']+"</p>";
				html +="<p>Hobby: "+person['hobby']+"</p>";
				html +="</div></div>";
				
				
	
	return html;		

}


//fonction d'affichage des résulats des villes
function afficherVille(city){
	
	var html = "<div class='result' id='city'><img src='images/picto/city.gif'/><div id='headerResult'>";
	html += "<p>"+city['city.code']+" "+city['city.name']+"</p></div>";
	html +="<div id='contentResult' class='hidden'>";
	html += "<p>"+city['city.region.name']+"</p>";
	html += "</div></div>";
	
	return html;				

}

//fonction d'affichage des résulats des médias
function afficherMedia(media){
	
	var html = "<div class='result' id='"+media.role+"'><img src='images/picto/"+media.role+".gif'/>";
	html += "<div id='headerResult'>"+media['title']+"</div>";
	html += "<div id='contentResult' class='hidden'>";
	html += "<p>"+media['role']+"</p>";
	html +=	 "<a href='http://comem.trucmu.ch/mrm/medias/"+media['groupname']+"/"+media['role']+"/"+media['filename']+"'> Lire le fichier</a>";
	html += "</div></div>";
	
	return html;				

}

//fonction qui va chercher les facettes à construires
function getFacet(field){
	var request = {};	
	request['q'] = '*:*';	
	request['rows'] = $(".rows").val();
	request['facet']='true';
	request['facet.field']=field;
	request['f.tag.facet.limit']=6;
	//request['start'] = 0;	
	request['wt'] = "json";
	request['']= "";
	var dataType = 'jsonp';
	var url="http://localhost:8983/solr/select";

	$.ajax({
		dataType: "jsonp",
		url: url,
		
		'jsonp': 'json.wrf',
		'data': request,
		
		
		error: function () {
			console.log('error');
		},
		success: function (data) {
			
			var facet= data.facet_counts.facet_fields[field];
			var uneBalise = "";

			for (var i = 0; i < facet.length; i=i+2){
				
			 	var value = facet[i];
			 	var result = facet[i+1];
				uneBalise += "<p id='"+value+"' class='facet'>"+value+" ("+result+")</p>";
			}
			$("#"+field+"").append(uneBalise);
		}
	
		});
}
