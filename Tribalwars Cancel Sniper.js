// ==UserScript==
// @name         Tribalwars Cancel Sniper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tribalwars Cancel Sniper. Use together with my sniper scripts.
// @author       Doomness
// @match        *.tribalwars.nl/game.php?village=*&screen=place
// @require      http://code.jquery.com/jquery-latest.js
// @require      http://cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.js
// @run-at       document-end
// ==/UserScript==

$(document).ready(() => {
	setupControls();
})

function setupControls(){
	$("head").append('<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.css">');

	$("div#commands_outgoings").append(
		'<input class="timepicker" style="margin-top:5px; font-size: 13px; width: 100px;">'+
		'<input id="snipebtn" type="button" class="btn" value="Snipe" style="width:100px; margin-top:3px;">'
	)

	$("div#commands_outgoings").find("tr").first().prepend('<th></th>');
	$("div#commands_outgoings").find("tr").first().append('<th>snipe in:</th>');

	$("tr.command-row").each((k,v) =>{
		$(v).prepend('<td><input type="checkbox" class="commands" val="' + k + '"></td>');
		$(v).append('<td class="timeReturn" name="' + k + '"></td>');
	});

	$("a.command-cancel").each((k, v)=>{
		$(v).attr('id', k);
	});

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

	$("input#snipebtn").click(() => {
		snipeTimer();
		$("input#snipebtn").prop("disabled", true);
		$("input#snipebtn").val("Locked in");
	});
}

function snipeTimer(){
	$(bindOrdersCheckbox()).each((k,v) => {
		if($(v.checkbox).prop("checked") && v.order != null){
			var currentTime = convertToSeconds($("span#serverTime").text());
			var startTime = convertToSeconds(v.order.startTime);
			var endTime = convertToSeconds($("input.timepicker").val());
			if(currentTime >= startTime + ((endTime - startTime) / 2)){
				Command.cancelCustom($(v.checkbox).parent().parent().find("a.command-cancel").attr('id'), $(v.checkbox).parent().parent().find("a.command-cancel").attr("data-id"), $(v.checkbox).parent().parent().find("a.command-cancel").attr("data-home"));
			}
			if((startTime + ((endTime - startTime) / 2) - currentTime) % 1 != 0 && $("span#warning").length < 1){
				$(v.checkbox).parent().prepend('<span id="warning" title="Attack will be 1 second late!" style="font-size:14px; color:red; font-weight:bold;">!</span>');
			}
			console.log($(v.checkbox).attr('val'));
			$("td.timeReturn[name='" + $(v.checkbox).attr('val') + "']").text((startTime + ((endTime - startTime) / 2) - currentTime).toString() + "s");
			//console.log((startTime + ((endTime - startTime) / 2) - currentTime) + "s");
		}
	});

	setTimeout(snipeTimer, 250);
}
function bindOrdersCheckbox(){
	var orders = JSON.parse(sessionStorage.getItem("storedTime"));
	var commands = [];
	$("input.commands").each((k, v)=>{
		var foundOrder = returnOrder(orders, $(v).parent().parent());
		var checkboxOrderBinder = {
			order : foundOrder,
			checkbox : v
		}
		commands.push(checkboxOrderBinder);
	});
	return commands;
}

function returnOrder(orders, commandrow){
	var result;
	$(orders).each((k, v)=>{
		if( $(commandrow).find("span.quickedit-label").text().indexOf(v.destination) != -1 &&
			$("#menu_row2").find("b.nowrap").text().indexOf(v.startCoords) != -1 &&
		    $($(commandrow).find("td")[2]).text().indexOf(v.endTime) != -1){
			result = v;
		}
	});
	return result;
}

function convertToSeconds(timeString){
	var a = timeString.split(':');
	return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
}

Command.cancelCustom = function(btnId, id, home) {
            var a = $("a.command-cancel#"+btnId)
              , t = id
              , n = home
              , e = a.html();
            return a.html(UI.Image("loading2.gif")),
            TribalWars.post("place", {
                ajaxaction: "cancel"
            }, {
                id: t,
                village: n
            }, function() {
                var t = a.parents(".commands-container")
                  , n = parseInt(t.data("commands")) - 1;
                t.data("commands", n),
                t.find(".commands-command-count").text("(" + n + ")"),
                a.parents("tr").eq(0).remove()
            }, function() {
                a.html(e)
            }),
            !1
}













