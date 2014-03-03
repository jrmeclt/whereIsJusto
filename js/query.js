$("document").ready(function(){
	getFacet('role');
	getFacet('tag');
	getFacet('groupname');

	$(".btn_query").click(function(){
		 	//cherche la requete
		 	
		 	//console.log(reqVal);
		 	query();
	});
	
	$("#side_search").on('click', '.facet', function(){
		 	//cherche la requete
		 	//$( this ).slideUp();
		 	//console.log(reqVal);
		 	var keyword = $(this).attr('id');
		 	var parent = $(this).parent().attr('id');
		 	
		 	//console.log(keyword+parent);
		 	
		 	query(keyword,parent);
	});
	
	
	$('#form1').submit(function() {
		event.preventDefault();
		query();
   	 	//return $jform.check();
	});
	
	$('#page').on('click', '.pageSuivante',function() {
		//event.preventDefault();
		//var page = $(this).attr('value');
		var page = $(".pageSuivante").attr('id');
		var parent = $(".nbpage").attr('id');

		console.log(parent);
		query('','',page,parent);
   	 	//return $jform.check();
	});
	
	$('.rows').on('change','',function(){
		console.log('helo');
		query();
	});
	
	$('.hidden').on('click', '#headerResult', function() {
		
		//console.log("on");   	 	//return $jform.check();
		//$('.hidden',this).show();
		 //$(this).children().show();
		// $('.hidden',this).children('.hidden').toggle();
		//$(this).children('.hidden').show();
		//$('hidden'.this).childNodes.toggle();
		 //$(this).after("<p>Another paragraph!</p>");
	});
	
	//$( "div .headerResult" ).accordion({ header: "div" })

})

  $(function() {
    $( "#accordion" ).accordion();
  });

function query(id,parent,page,pageActuelRecu){
	id = id || "";
	parent = parent || "";
	page = page || "";
	pageActuelRecu = pageActuelRecu || "";
	//reqVal= $(".query").val();
	//console.log(reqVal);
	//console.log(page);
	//var page = 100;
	
	console.log(id.length);
	
	
	//var query=$(".query").val();
	if($(".query").val() != ''){
		//q='*:*';
		var q=$(".query").val();

	}
	else {
		var q = '*:*';
	}
	
	var request = {};	
	if(id.length){
		//var truc = $(".").val();
		request['q']= parent+':'+id;
	}
	else{
		request['q'] = q;
	}
	
	
	request['rows'] = $(".rows option:selected").val();
	
	if(page.length){
	console.log("bouhouuou");
	request['start'] = page;
	}
	else{
	request['start']=0;
	}
		
	request['wt'] = "json";
	//request['']= "";
	var dataType = 'jsonp';
	var url="http://localhost:8983/solr/select";	
	/*$.ajax(dataType, url, request, function(result, status, data) {	
	 	 var documents = result.response.docs;	
	 	 for ( var i = 0; i < documents.length; i++) {	
	 	 displayDocument(documents[i]);	
	 	 }
	 	 });	
	 

	
	var q=$(".query").val();
	var rows=$(".rows").val();
	var type=$(".type").val();
	var nbpage=4;
	var start=(nbpage*rows)-rows+1;
	
	console.log(rows);
	console.log(type);
	console.log(start);
	*/
	
	$.ajax({
		//type: "POST",
		dataType: "jsonp",
		url: url,
		
		'jsonp': 'json.wrf',
		'data': request,
		
		
		
		//data: { start_date : start_date, end_date: end_date, sexe: sexe, species: species },
		error: function () {
			console.log('error');
		},
		success: function (data) {
			//for (var i = 0; i < data.length; i++) {
			//}
			
			$("#results").children().remove();
			
			//console.log(data);
			//console.log(data.response.numFound);
			
			var html = "<h1>Nombre de r&eacute;sultats : " + data.response.numFound+"</h1><br/><div>";
			
			html += "<div id='resultContainer'>"
			
			for (var i = 0; i < data.response.docs.length; i++) {
				//console.log(data.response.docs[i]);
				
				var result=data.response.docs[i];
				if(result.role=='person'){
					html += afficherPersonne(result);
				}
				else if(result.role=='city'){
					//console.log("ville");
					html += afficherVille(result);

				}
				else if(result.role=='text'||'audio'||'video'||'image'){
					//console.log("qqch");
					html += afficherMedia(result);
				}
				
				
				else{
					console.log('erreur');
				}

				//$( "div" ).append( document.createTextNode(i+1+" "+result.role));
			}
			
			html += "</div>"

			
			if(data.response.numFound>request['rows']){
				var resultat = data.response.numFound;
				var resultatparpage = request['rows'];
				console.log(request['start']);
				var nextStart= Number(request['start'])+Number(resultatparpage);
				console.log(nextStart);
				console.log(resultatparpage);
				var nbpagebrut = resultat / resultatparpage;
				var nbpage = Math.ceil(nbpagebrut);
				var pageActuel=Number(pageActuelRecu)+1;
				if(isNaN(pageActuel)) {
					var pageActuel = 1;
				}
				console.log(nbpage);
				
				$("#page").children().remove();
				
				var pagesuivante="<p class='nbpage' id='"+pageActuel+"'>page "+pageActuel+" de "+nbpage+"</p><p class='pageSuivante' id='"+nextStart+"'>Page suivante</p>";
				//html += ...;
				$("#page").append(pagesuivante);

			}
			
			$("#results").html(html);
			//$( "div.demo-container" ).html('1233');
			
		}
	
	});

};

function afficherPersonne(person){
						//console.log(person['firstname']);
						pictoUrl='images/picto/person'
	
				var html = "<div class='result' id='person'><div id='headerResult'><img src='images/picto/person.gif'/> "+person['firstname']+" "+person['lastname']+"</div><div id='contentResult' class='hidden'><br>"+person['biography']+"</div>";
	
	return html;		

}

function afficherVille(city){
						//console.log(city);
	
	var html = '<div class="class="result" id="city"><img src="images/picto/city.gif"/>N° postal: '+city["city.code"]+'<br>Localité: '+city["city.name"]+'<br>Canton: '+city["city.region.name"]+'</div>';
	
	return html;				

}

function afficherMedia(media){
						console.log(media);
	
	var html = '<div class="result" id='+media.role+'><img src="images/picto/'+media.role+'.gif"/> '+media["title"]+'<a href="http://comem.trucmu.ch/mrm/medias/'+media["groupname"]+'/'+media["role"]+'/'+media["filename"]+'">Vers le fichier</a></div>';
	
	return html;				

}

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
		//type: "POST",
		dataType: "jsonp",
		url: url,
		
		'jsonp': 'json.wrf',
		'data': request,
		
		
		//data: { start_date : start_date, end_date: end_date, sexe: sexe, species: species },
		error: function () {
			console.log('error');
		},
		success: function (data) {
			
			var facet= data.facet_counts.facet_fields[field];
			//console.log(facet[0]);
			var uneBalise = "";
			//console.log(facet);

			for (var i = 0; i < facet.length; i=i+2){
				
			 	var value = facet[i];
			 	var result = facet[i+1];
				uneBalise += "<p id='"+value+"' class='facet'>"+value+" "+result+"</p>";
			}
			//console.log(uneBalise);
			$("#"+field+"").append(uneBalise);
		}
	
		});
}
