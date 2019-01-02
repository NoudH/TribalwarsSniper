// ==UserScript==
// @name         Tribalwars sniper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tribalwars sniper
// @author       Doomness
// @match        *.tribalwars.{enter top-level domain here!}/game.php?village=*&screen=place&try=confirm
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @require      http://cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.js
// @run-at       document-end
// ==/UserScript==

$(document).ready(function(){

	$("head").append('<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.css">')
	$($("table.vis")[0]).append(
		'<p style="margin-top:5px; margin-bottom:0px;">Time of arrival:</p>' +
		'<input class="timepicker" style="margin-top:5px; font-size: 13px;">'+
		'<input type="text" class="milidelay" placeholder="miliseconds delay" style="margin-top:5px; font-size: 13px;">'+
		'<input id="snipebtn" type="button" class="btn" value="Snipe" style="width:100px; margin-top:3px;">'
	);

	$("input.timepicker").timepicker(
		{
			timeFormat: 'HH:mm:ss',
			minTime: '00:00:00',
			maxTime: '23:59:59',
			defaultTime: '00:00:00',
			dynamic: false,
			dropdown: false,
			scrollbar: false
		});
	$("input#snipebtn").click(function(){
		console.log('Snipe timed at: '+ $("input.timepicker").val() +':'+ parseInt($("input.milidelay").val()));
		$("input#snipebtn").parent().append('<p style="margin-bottom:0px; font-size:13px;"> Snipe gezet op: ' + $("input.timepicker").val() +':'+ parseInt($("input.milidelay").val()) +'</p>');
		snipeTimer()
	});
	$("input.troop_confirm_go").on('click', () => {storeTime();});
})

function snipeTimer(){
	if($("span.relative_time").text().indexOf($("input.timepicker").val()) >= 0){
		setTimeout(function() {
			$("input.troop_confirm_go").click();
		}, parseInt($("input.milidelay").val()));
	} else {
		setTimeout(snipeTimer, 10);
	}
}

function storeTime(){
	var orders = JSON.parse(sessionStorage.getItem("storedTime"));
	if(orders == null){
		orders = [];
	}
	var orderObject = {
		startCoords : $("#menu_row2").find("b.nowrap").text(),
		startTime : $("span#serverTime").text(),
		endTime : $("span.relative_time").text().substring($("span.relative_time").text().length - 9, 8),
		destination : $("span.village_anchor.contexted").find("a").first().text()
	}
	orders.push(orderObject);
	sessionStorage.setItem("storedTime", JSON.stringify(orders));
}

