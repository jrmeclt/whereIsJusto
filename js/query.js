$("document").ready(function(){
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
					afficherPersonne(result);
				}
				else if(result.role=='city'){
					//console.log("ville");
					html += afficherVille(result);

				}
				else if(result.role=='text'){
					console.log("text");
				}
				else if(result.role=='audio'){
					console.log("audio");
				}
				else if(result.role=='video'){
					console.log("video");
				}
				else if(result.role=='image'){
					console.log("image");
				}
				
				else{
					console.log(result.role);
				}

				//$( "div" ).append( document.createTextNode(i+1+" "+result.role));
			}
			
			$("#results").html(html);
			//$( "div.demo-container" ).html('1233');
			
		}
	
	});

};

function afficherPersonne(person){
						console.log("personne");
	
						

}

function afficherVille(city){
						console.log(city);
	
	var html = '<div class="city">'+city["city.name"]+'</div>';
	
	return html;				

}

/*$.ajax({
  'url': 'http://yoursolrserver.com/solr/select',
  'data': {'wt':'json', 'q':'your search goes here'},
  'success': function(data) { /* process e.g. data.response.docs...  }
  'dataType': 'jsonp',
  'jsonp': 'json.wrf'
});

*/