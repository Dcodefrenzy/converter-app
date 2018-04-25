window.$on = function(target, event, cb){
	target.addEventListener(event, cb, false);
}

var CORE = (function(){
		var modules = {};

		function addModules(modules_id, mod){
			modules[modules_id]= mod;
		}

		function registerEvents(modules_id, evt){
			theMod = modules[modules_id];
			theMod.event = evt;
		}
		function triggerEvent(evt){
			var mod;
			for(index in modules){

				if(modules.hasOwnProperty(index)){
					mod = modules[index];

				if(mod.event && mod.event[evt.type] ){
					mod.event[evt.type](evt.data);
				}
			}

		}
	}
	return {
		addModules:addModules,
		registerEvents:registerEvents,
		triggerEvent:triggerEvent
	}
})();
		var sb = (function(){
		function listen(modules_id, evt){
			CORE.registerEvents(modules_id, evt);
		}
		function notify(evt){
			CORE.triggerEvent(evt);	
		}

		return{
			listen:listen,
			notify:notify
		}
	})();
		
		var farh = (function(){

			var id, form, rate, submit;

			id = 'fahrenheit';

			function init(){
				form = document.getElementById('add-conversion');
				rate = document.getElementsByClassName('fahrenheit')[0]; 
				submit = document.getElementsByClassName('submit')[0];

				$on(submit, 'click', send);
				sb.listen(id, {'returning': displayReturn });

			}
			function send(e){
				var theRate, newRate;

					theRate = parseFloat(rate.value);
					newRate = (theRate - 32) * (5 / 9);
				sb.notify({
					type: 'convert',
					data: newRate
				});
				form.classList.toggle('module-active');
				e.preventDefault();
		}
		function displayReturn(){
				rate.value = " ";
				form.classList.toggle('module-active');

		}
		return{
			id:id,
			init:init,
			send:send
		};
})();

	var convert = (function(){
		var id, converts, addConversion, conversionUl;

		id = 'celsius';
			function init(){
				converts = document.getElementById('conversion');
				addConversion = document.getElementsByClassName('add-conversion')[0];
				conversionUl = document.getElementById('conversion-list');
				sb.listen(id, {'convert': convert });
				$on(addConversion, 'click', returnBack);
			}
			function convert(rate){
				var li = document.createElement('li');
				var p = document.createElement('p');
				farh = document.createTextNode('Celsius: ');
				 newRate =  document.createTextNode(rate);
				
				p.appendChild(farh);
				p.appendChild(newRate);
				li.appendChild(p);
				conversionUl.appendChild(li);
				converts.classList.toggle('module-active');
			}
			function returnBack(){
				sb.notify({
					type: 'returning',
					data: null

				});
			converts.classList.toggle('module-active');
			}
			
			return{
				id:id,
				init:init,
				convert:convert
			};
		})();

		CORE.addModules(farh.id, farh);
		CORE.addModules(convert.id, convert);

		farh.init();
		convert.init();
