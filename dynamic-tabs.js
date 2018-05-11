// Constants
/* Constants from where the click action happened */
var FT = "FROM_TAB"; // Clicked from Add tab
var FM = "FROM_MORE"; // Clicked from More dropdown
var NT = "NEW_TAB"; // Clicked from Add tab for replacing new tab into the last but one
var OT = "ON_TAB"; // Clicked on tab 

// Variables
var tabNo = 1; // Default tab no;
var cf = ""; // Clicked from variable changes based on action
var tw; // total width
var dtw; // default tab width
var tabW; // Tab Width
var ntv; // Number of tabs visible count
var tcf; // Number of tabs can be fit in the given width/window

// Arrays
var at = new Array(); // Contains all tabs names that are opened
var mt = new Array(); // Contains all tabs names that are stacked into more dropdown

$(document).ready(function() {  	
	displayTab(tabNo,'default',0); // Adding Default Tab 1	
});

$(window).resize(function(){  
	var screen_type = "";
	if ($('#tabs').width() < 1000){
		dtw = "140px";
		screen_type = "small";
	}
	else if ($('#tabs').width() > 1000){
		dtw = "150px";	
		screen_type = "large";			
	}
		
	getTabWidth(dtw);
	
	checkOverFlowTabs(screen_type);
	
});

function getTabWidth(){	
	if(dtw.indexOf("px") != -1){
		var splitPx = dtw.split("px");
		tabW = splitPx[0];
	}else{
		tabW = 150;
	}
}

function checkOverFlowTabs(screen_type){	
	if(at.length > 0){		
		if(screen_type == "small"){
			tw = $(window).width();
		}else{
			tw = $("#tabs").width();
		}
		tcf = Math.round(tw / tabW);	
		$("#tabs li").remove();
		$("#last_tab ul#more_tabs li").remove();
		mt = new Array();
		for(var j = 0; j < at.length; j++){			
			if(at[j] == tcf){				
				var moreWidth = tabW;
				var totalMinusmore = tw - moreWidth;	
				var visibleLisWidth = tabW * (tcf - 1);		
				var remain_width = tw - visibleLisWidth;
				
				pushTabsToMore(at[j]);
				displayTab(at[j],"last",remain_width);	
				addTabsToMore();
			}else if(at[j] < tcf){				
				displayTab(at[j],"",0); 
			}else{
				pushTabsToMore(at[j]);
				addTabsToMore();				
			}			
		}
	}
}

function getNumTabsCanFit(){
	dtw = $("#tabs li").css("width"); 
	getTabWidth(dtw);
	
	tw = $("#tabs").width(); // default width	
	tcf = Math.round(tw / tabW);	
	
	return tcf;
}

function addNewtab(){
	var numOfTabsCanFit = getNumTabsCanFit();	
	tabNo++;	
	if(tabNo == numOfTabsCanFit){	
		
		var moreWidth = tabW;		
		var ntv = $("#tabs li").length;
		var totalMinusmore = tw - moreWidth;	
		var visibleLisWidth = moreWidth * ntv;
		var remain_width = totalMinusmore - visibleLisWidth;
		var last_tab_width = +moreWidth + +remain_width;

		pushTabsToMore(tabNo);
		displayTab(tabNo,"last",last_tab_width);
		addTabsToMore();		
	}
	else if(tabNo < numOfTabsCanFit){
		displayTab(tabNo,"",0);
	}else{
		
		pushTabsToMore(tabNo);
		addTabsToMore();
		cf = NT;
		loadMoreClickedTabOnLast(cf,tabNo)
	}
}

function displayTab(tab_id,type,width) {	
	pushToAllTabs(tab_id);
	var tab_name = "Tab "+tab_id;
	
    $("#tabs li").removeClass("current");
    $("#content div").hide();
    
	if(type == "last" && width != 0){
		width = width + "px";
		cf = FT;
		$("#tabs").append("<li class='current' id='last_tab' style='width:"+width+"' >" + 
							"<span>More</span><span>&#x25BC;</span><ul id='more_tabs'>"+
							"<li id='"+tab_id+"'><a id='"+tab_id+" rel='"+tab_id+"' onClick='loadMoreClickedTabOnLast(cf,this)'>"
							+tab_name+"</a><li></ul></li>");	
	}else{
		
		if(type == "default"){
			//$("#tabs li img#btn_close").addClass("nodisplay");
			$("#tabs li img#btn_close").removeClass("display");
		}else{
			$("#tabs li img#btn_close").addClass("display");
			$("#tabs li img#btn_close").removeClass("nodisplay");
		}
		$("#tabs").append("<li class='current' id='"+tab_id+"'><a class='tab' id='" +
							tab_id + "' href='javascript:void(0)'>" + 
							"<span>"+ tab_name +"</span></a><img src='../tabs_lib/images/disable-close.png' id='btn_close_' class='btn_close nodisplay' /></li>");	
	}
	  
	if(type == "last"){
		cf = FM;
		loadMoreClickedTabOnLast(cf,tab_id);
	}else{
		$("#content div").remove();
		$("#content").append("<div id='"+tab_id+"_content' style='float: left;overflow-y: hidden;width: 100%;'>"
								+"<h3>Content of "+tab_name+"</h3>"
								+"</div>");
	}
			
	$("#" +tab_id+ "_content").show();   
				            
}

// Main array to store all tabs that are opened and making sure not to open same tab again
function pushToAllTabs(tab_name){
	if(at.indexOf(tab_name) == -1){
		at.push(tab_name);
	}
}

function pushTabsToMore(tab_name){
	if(mt.indexOf(tab_name) == -1){
		mt.push(tab_name);
	}
}

function deleteTabsFromMore(tab_name){
	$.each(mt, function(key, val){
		if(val == tab_name){
			mt.splice(key,1);
		}
	});
}

function addTabsToMore(){
	cf = FT;	
	$("#last_tab ul#more_tabs li").remove();
	$.each(mt,function(k,item){	
		$("#last_tab ul#more_tabs").append("<li id='"+item+"'>"+
		"<a href='javascript:void(0)' id='"+item+"' rel='"+item+"' onClick='loadMoreClickedTabOnLast(cf,this)' >Tab "+item+"</a></li>");
	});	
}

function loadMoreClickedTabOnLast(type,link){
	console.log("current element",type); 
	var tab_id = "";
	if(type == FT){
		tab_id = $(link).attr("id");
	}
	if(type == FM || type == NT){
		tab_id = link;
	}
	
	console.log("tab_id",tab_id);
	
	var tab_before_more = $("#tabs li#last_tab").prev("li").attr('id');
	deleteTabsFromMore(tab_id);
	pushToAllTabs(tab_before_more);
	pushTabsToMore(tab_before_more);
	addTabsToMore();
	$("#tabs li#last_tab").prev("li").replaceWith("<li class='current' id='"+tab_id+"'><a class='tab' id='" +
													tab_id + "' href='javascript:void(0)'>" + 
													"<span>Tab "+ tab_id +"</span></a></li>");
							
	$("#content div#"+tab_before_more+"_content").remove();
	$("#content").append("<div id='"+tab_id+"_content' style='float: left;overflow-y: hidden;width: 100%;'>"
		+"<h3>Content of Tab "+tab_id+"</h3>"
		+"</div>");
}

// Loading the clicked tab if tab is already open    
function openExistingTab(link,type){
	var contentname =  content + "_content"; // tab iframe id
	// hide all other tabs
	$("#content div").hide();
	$("#tabs li").removeClass("current");
	
	// adding the current class to the li for clicked tab to show
	$("#"+content).parent("li").attr("class","current");
	$(link).parent().attr("class","current");
	$("div.top-links-ph ul").attr("class","top-links");
	$("#" + contentname).show();
	
				 
	if(refresh == 1){
		// hide all other tabs
		$("#content div").hide();
		$("#tabs li").removeClass("current");
	
		$("#"+content).parent("li").attr("class","current");
		$(link).parent().attr("class","current");
		$("div.top-links-ph ul").attr("class","top-links");
		$("#" + contentname).show();
	}
	if(refresh == 0){

		$("#content div").hide();
		$("#tabs li").removeClass("current");
		$("#"+content).parent("li").attr("class","current");
		$("div.top-links-ph ul").attr("class","top-links");
		$(link).parent().attr("class","current");
		$("#" + contentname).show();
		$(".tabloader").hide();	
	}
}
	
//Showing Tab Navigation (Existing tabs)
$('#tabs li img#btn_close').live('click', function() {
	console.log("close");
		
		 var tabid = $(this).parent().find(".tab").attr("id");
		 console.log("tabid",tabid);
		 var numTabs = $("#tabs li").length;
		 
		 var key = at.indexOf(tabid); // key of removed tab from all links array
		console.log("at",at);
		// deleteLinksFromAll(key,allLinks); // delete the key value from all links
 
		 // if more than 7 tab exists
		/* if(numTabs <= 7 && moretab == "block"){
			// if more tab consists only one link
			if(extraLinks.length == 1){
				if(allLinks.indexOf(extraLinks[0]) == -1 && extraLinks[0] != "PatientDetails" && extraLinks[0] != ""){
					allLinks.push(extraLinks[0]);
				}

				var id = $("#tabs1 li ul").find("li").attr('rel',extraLinks[0]); // get the object of the link	
				addTab(id,'removemore'); // add tab for the more link in the place of removed tab

				// remove the more tab view and also empty the array of extralinks
				$("#tabs1").css('display','none'); 
				extraLinks = new Array();
									
				if(autoLoadTabs == true){											
					localStorage.setItem("list_data_key",  JSON.stringify(allLinks));
					localStorage.setItem("more_tabs",  JSON.stringify(extraLinks));
				}
			}
			
			// if more tab consists of more than one link
			else if(extraLinks.length > 1){
				
				var rel = $("#tabs1 li ul li:first a").attr("rel"); // get the object of first link from the more
				var id = $("#tabs1 li ul").find("li").attr('rel',rel);
				// swap the links from more to the normal tabs
				var key = extraLinks.indexOf(rel); 
				deleteLinksFromMore(key, extraLinks);
				
				addLinksToMore('default',extraLinks);
				var key = allLinks.indexOf(tabid);
				deleteLinksFromAll(key, allLinks);
				if(allLinks.indexOf(rel) == -1 && rel != "PatientDetails" && rel != ""){
					allLinks.push(rel);
				}
				if(autoLoadTabs == true){
					//localStorage.setItem("more_tabs",  JSON.stringify(extraLinks));
					localStorage.setItem("list_data_key",  JSON.stringify(allLinks));
				}

				addTab(id,'removemore'); // add the first link to the last tab
			}
		 }*/

		// remove tab and related content
		var contentname = tabid + "_content";
		$('#'+contentname).css('display','none');
		$('#'+contentname).remove();
		$(this).parent().remove();
		
		// if there is no current tab and if there are still tabs left, show the first one
		if ($("#tabs li.current").length == 0 && $("#tabs li").length > 0) {

			// find the first tab    
			var firsttab = $("#tabs li:first-child");
			firsttab.addClass("current");
			
			// get its link name and show related content
			var firsttabid = $(firsttab).find("a.tab").attr("id");
			$("#" + firsttabid + "_content").show();
								
		}
});

$(function() {
    $("#btn_close")
        .mouseover(function() { 
            var src = "../tabs_lib/images/close.png";
			console.log(src);
            $(this).attr("src", src);
        })
        .mouseout(function() {
            var src = "../tabs_lib/images/disable-close.png";
            $(this).attr("src", src);
        });
});

// changing the close button image of tab, disable to red or red to disable
function changeImage(action,_this){
	if(action == 1){
		$(_this).attr("src","/tabs_lib/images/close.png");
		$(_this).css({'width':'17x','height':'16px'});
	}
	if(action == 2){
		$(_this).attr("src","/tabs_lib/images/disable-close.png");
	}
}
			
function viewSettings(){
	$("#divID").css("display","none");
	$(".tabs_row").css("display","none");
	$("#btn_addtab").css("display","none");
	$("#btn_settings").css("display","none");
	$("#btn_back").css("display","block");	
	$("#settings").css("display","block");	
}

function backToTabs(){
	$("#divID").css("display","");
	$(".tabs_row").css("display","");
	$("#btn_addtab").css("display","");
	$("#btn_settings").css("display","");
	$("#btn_back").css("display","none");	
	$("#settings").css("display","none");	
}