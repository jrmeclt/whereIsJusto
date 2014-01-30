$("document").ready(function(){
	getFacet();

	$(".btn_query").click(function(){
		 	//cherche la requete
		 	
		 	//console.log(reqVal);
		 	query();
	});
	
	
	$('#form1').submit(function() {
		event.preventDefault();
		query();
   	 	//return $jform.check();
	});

})

function query(){
	//reqVal= $(".query").val();
	//console.log(reqVal);
	
	//var query=$(".query").val();
	if($(".query").val() != ''){
		//q='*:*';
		var q=$(".query").val();

	}
	else {
		var q = '*:*';
	}
	
	var request = {};	
	request['q'] = q;	
	request['rows'] = $(".rows").val();	
	request['start'] = 0;	
	request['wt'] = "json";
	request['']= "";
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
			
			console.log(data);
			console.log(data.response.numFound);
			
			var html = "<h1>Nombre de r&eacute;sultats:" + data.response.numFound+"</h1>";
			
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
					console.log("qqch");
					html += afficherMedia(result);
				}
				
				
				else{
					console.log('erreur');
				}

				//$( "div" ).append( document.createTextNode(i+1+" "+result.role));
			}
			
			$("#results").html(html);
			//$( "div.demo-container" ).html('1233');
			
		}
	
	});

};

function afficherPersonne(person){
						console.log(person['firstname']);
						pictoUrl='images/picto/person'
	
				var html = "<div class='person'><img src='images/picto/person.gif'/> "+person['firstname']+" "+person['lastname']+"</div>";
	
	return html;		

}

function afficherVille(city){
						console.log(city);
	
	var html = '<div class="city"><img src="images/picto/city.gif"/> '+city["city.code"]+' '+city["city.name"]+' '+city["city.region.name"]+'</div>';
	
	return html;				

}

function afficherMedia(media){
						console.log(media);
	
	var html = '<div class="text"><img src="images/picto/'+media.role+'.gif"/> '+media["groupname"]+'</div>';
	
	return html;				

}

function getFacet(){
	var request = {};	
	request['q'] = '*:*';	
	request['rows'] = $(".rows").val();
	request['facet']='true';
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
			console.log("ou");
		
		}
	
		});
}
