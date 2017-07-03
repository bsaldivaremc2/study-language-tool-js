
function VocabClass(iText,iTrans)
{
	this._text = iText;
	this._trans = iTrans;
}
	var word_pos=0;
	var word_class=0;
	var current_class=null;
	var classesList=[];
	var txt_move_left = "Left";
	var txt_move_right = "Right";
	var txt_show_translation = "Show/hide translation/notes";
	var kr_classes = [];
	var bool_show_trans = false;

	function googleFetch(iKey)
	{
				var _prefix="https://spreadsheets.google.com/feeds/list/";
				var _sufix= "/od6/public/basic?hl=en_US&alt=json";
 				var _key=iKey;
 				var _url=_prefix.concat(_key,_sufix);
 				var _tableGSS="";
 				var languageA=[];
 				$.getJSON(_url, function(data) 
				{
   					var msize =data.feed.openSearch$totalResults.$t;
   					var tableTitle=data.feed.title.$t;
					var contentCol = data.feed.entry[0].content.$t;
					for (var i=0;i<msize;i++)
					{
						korean=data.feed.entry[i].title.$t;
						english=data.feed.entry[i].content.$t.split("english:")[1];
						//{data.feed.entry[i].content.$t}
						//var myobj = JSON.parse(JSON.stringify({"helllo: english"}));
						//console.log(myobj);

						languageA.push(new VocabClass( korean, english));
					}
					current_class=languageA;
					showWordArray (0,current_class);
				});
				return languageA
	};
	function googleFetchClasses(iKey)
	{
		var _prefix="https://spreadsheets.google.com/feeds/list/";
		var _sufix= "/od6/public/basic?hl=en_US&alt=json";
 		var _key=iKey;
 		var _url=_prefix.concat(_key,_sufix);
 		var _tableGSS="";
 		var languageA=[];
 		$.getJSON(_url, function(data) 
		{
   			var msize =data.feed.openSearch$totalResults.$t;
   			var tableTitle=data.feed.title.$t;
			var contentCol = data.feed.entry[0].content.$t;
			for (var i=0;i<msize;i++)
			{
				className=data.feed.entry[i].title.$t;
				classKey=data.feed.entry[i].content.$t.split("gk: ")[1];
				languageA.push({ 'name': className, 'gk': classKey});
			}
			classesList=languageA;
			
			$.each(classesList, function(index, value) {   
     			$('#select_classes')
        			.append($("<option></option>")
           			.attr("value",classesList[index]['gk'])
           			.html(classesList[index]['name'])); 
			});
		});
	};

	function showWordArray (iPos,iClass)
	{

		$("#div_main_text").html(iClass[iPos]._text);
		$("#div_translation").html(iClass[iPos]._trans);
		var class_n = parseInt(iClass) +1;
		var word_n = parseInt(iPos) + 1;
		$("#div_word_counter").html("Total Classes: "+classesList.length+" Word: "+word_n+"/"+iClass.length);
	}
	function ShowTrans()
	{
		$("#div_translation").toggleClass("class_hide");
	}
	function move(iDir)
	{
		if (current_class != null )
		{
			if (iDir == "r")
			{
				word_pos += 1;
				if (word_pos >=  current_class.length )
				{
					word_pos = 0;
				}
				showWordArray(word_pos,current_class);
			}
			else if (iDir == "l")
			{
				word_pos -= 1;
				if ( word_pos <  0 )
				{
					word_pos = current_class.length - 1;
				}
				showWordArray(word_pos,current_class);
			}
		}
		
	}



		$("#div_show_en").html(txt_show_translation);
		$("#div_left").html(txt_move_left);
		$("#div_right").html(txt_move_right);
		$('#get_classes').click(function() {
			console.log("Clicked get classes");
			classes=googleFetchClasses(classListK);
		});
		$('#get_class').click(function() {
			classK=$('#select_classes option:selected').val();
			if (classK != null )
			{
				googleFetch(classK);

			}
		});
		$('#play_sound').click(function() {
			tts=$('#div_main_text').text();
			if (current_class != null )
			{
				if (tts != null )
				{
					var msg = new SpeechSynthesisUtterance(tts);
					//https://cloud.google.com/speech/docs/languages
					msg.lang='ko-KR';
					window.speechSynthesis.speak(msg);
				}
			}
		});
		$('#show_hide_daum').click(function() {
			$('#iframe_daum').toggleClass("class_hide");
		});
		

