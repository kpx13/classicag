// JavaScript Document



	  function createXMLHttpRequest() {





    var ua;



    if(window.XMLHttpRequest) {

        

		try {

        

			ua = new XMLHttpRequest();

        

		} catch(e) {

        

			ua = false;

        

		};

    

	} else if(window.ActiveXObject) {

        

		try {

        

			ua = new ActiveXObject("Microsoft.XMLHTTP");

        

		} catch(e) {

        

			ua = false;

        

		};

    

	}

    

		return ua;

    

	};



    var req = createXMLHttpRequest(); 

    



	

	function price_total(id) {

      

		var fields = document.getElementsByTagName('input');



	  	var summ = parseInt(0);

		

		var text_summ = parseInt(0);

	  

	 	var _query = '?';

	  

	  	for(var i =0; i < fields.length; i++){

		

			switch (fields[i].type) {

			

	   			/*case 'radio':

	      		  

		 			if(fields[i].checked){

		

						summ = summ + parseInt(fields[i].value); 

		

		  			}else{

		  

		  			};

	     		

				break;

		  

	  			case 'checkbox':

	     

		   			if(fields[i].checked){

			

			  			summ = summ + parseInt(fields[i].value);   

		 

		   			}else{

			

		   			};

		  

	      		break;*/

	  

	  			case 'text':

	     

		 			if(document.getElementById(fields[i].id).value != 0){

		  

		  				if(!isNaN(document.getElementById(fields[i].id).value)){

		  

		     				text_summ = document.getElementById('h_'+fields[i].id).value * document.getElementById(fields[i].id).value;

		 

		     				summ = summ + parseInt(text_summ);

			 

			 

		  				}else{

			

							alert("Вы можете вводить только числовые значения!");

			

							document.getElementById(fields[i].id).value = 0;

			  document.getElementById(fields[i].id).select()

		  				};

		 

		 			}else{

			 

		 			};

					

		  			if(_query == '?'){

			 

			 			_query = _query + document.getElementById(fields[i].id).name + '=' + document.getElementById(fields[i].id).value;

			 

			 		}else{

				 

				 		_query = _query + '&' + document.getElementById(fields[i].id).name + '=' + document.getElementById(fields[i].id).value;

						

			 		};

					

				

			 

	     		break;

		  

	   			default:

	      

	      		break;

		  

	    	};

		 

	  	};

	  	

		if(summ == 0){

			document.getElementById('submit_order').disabled = true;

		}else{

			document.getElementById('submit_order').disabled = false;

		};

		

	  	document.getElementById('summ').innerHTML =  summ;

	 

		

		send_session(_query);

	  

	  	

	 

    };

	

	function send_session(_query){

		//alert(_query)

		req.open('get', 'http://www.seoclassic.nika-systems.ru/modules/price_list/ajax/ajax.php' + _query, true);

     

	 	req.onreadystatechange = function(){

		

    		if(req.readyState == 4){

        

				var response = req.responseText;



        		if(response.indexOf('||' != -1)) {

        

					update = response.split('||');

	 

	 				document.getElementById("quantity").innerHTML = update[0];

      

	  				document.getElementById("prods_to_order").innerHTML = '<ul style="padding:0;">' + update[1] + '</ul>';

	  

        		};

    		

			};

    		//else

    		//alert("loading" + req.readyState);

	 	};

     

	 	req.send();

		

	};

	

	function delete_item(id){

		

		var id;

		

		req.open('get', 'http://www.seoclassic.nika-systems.ru/modules/price_list/ajax/delete_item.php?id=' + id, true);

     

	 	req.onreadystatechange = function(){

		

    		if(req.readyState == 4){

        

				var response = req.responseText;



        		if(response.indexOf('||' != -1)) {

        

					update = response.split('||');

	 

	 				document.getElementById("quantity").innerHTML = update[0];

      

	  				document.getElementById("prods_to_order").innerHTML = '<ul style="padding:0;">' + update[1] + '</ul>';

					

					document.getElementById('summ').innerHTML = update[2];

					

					if(update[2] == 0){

			document.getElementById('submit_order').disabled = true;

		}else{

			document.getElementById('submit_order').disabled = false;

		};

					

					//alert(response);

	  

        		};

    		

			};

    		//else

    		//alert("loading" + req.readyState);

	 	};

     

	 	req.send();

		

		document.getElementById('price_field_' + id).value = '0';

		

	};

	