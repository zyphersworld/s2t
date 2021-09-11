// #####################################################################	
// WENT A LITTLE OCD AND FOUND TABLE OF EVERY SUPPORTED LANGUAGE	
var langs =
[['Afrikaans',       ['af-ZA']],
 ['Bahasa Indonesia',['id-ID']],
 ['Bahasa Melayu',   ['ms-MY']],
 ['Català',          ['ca-ES']],
 ['Čeština',         ['cs-CZ']],
 ['Dansk',           ['da-DK']],
 ['Deutsch',         ['de-DE']],
 ['English',         ['en-AU', 'Australia'],
                     ['en-CA', 'Canada'],
                     ['en-IN', 'India'],
                     ['en-NZ', 'New Zealand'],
                     ['en-ZA', 'South Africa'],
                     ['en-GB', 'United Kingdom'],
                     ['en-US', 'United States']],
 ['Español',         ['es-AR', 'Argentina'],
                     ['es-BO', 'Bolivia'],
                     ['es-CL', 'Chile'],
                     ['es-CO', 'Colombia'],
                     ['es-CR', 'Costa Rica'],
                     ['es-EC', 'Ecuador'],
                     ['es-SV', 'El Salvador'],
                     ['es-ES', 'España'],
                     ['es-US', 'Estados Unidos'],
                     ['es-GT', 'Guatemala'],
                     ['es-HN', 'Honduras'],
                     ['es-MX', 'México'],
                     ['es-NI', 'Nicaragua'],
                     ['es-PA', 'Panamá'],
                     ['es-PY', 'Paraguay'],
                     ['es-PE', 'Perú'],
                     ['es-PR', 'Puerto Rico'],
                     ['es-DO', 'República Dominicana'],
                     ['es-UY', 'Uruguay'],
                     ['es-VE', 'Venezuela']],
 ['Euskara',         ['eu-ES']],
 ['Filipino',        ['fil-PH']],
 ['Français',        ['fr-FR']],
 ['Galego',          ['gl-ES']],
 ['Hrvatski',        ['hr_HR']],
 ['IsiZulu',         ['zu-ZA']],
 ['Íslenska',        ['is-IS']],
 ['Italiano',        ['it-IT', 'Italia'],
                     ['it-CH', 'Svizzera']],
 ['Lietuvių',        ['lt-LT']],
 ['Magyar',          ['hu-HU']],
 ['Nederlands',      ['nl-NL']],
 ['Norsk bokmål',    ['nb-NO']],
 ['Polski',          ['pl-PL']],
 ['Português',       ['pt-BR', 'Brasil'],
                     ['pt-PT', 'Portugal']],
 ['Română',          ['ro-RO']],
 ['Slovenščina',     ['sl-SI']],
 ['Slovenčina',      ['sk-SK']],
 ['Suomi',           ['fi-FI']],
 ['Svenska',         ['sv-SE']],
 ['Tiếng Việt',      ['vi-VN']],
 ['Türkçe',          ['tr-TR']],
 ['Ελληνικά',        ['el-GR']],
 ['български',       ['bg-BG']],
 ['Pусский',         ['ru-RU']],
 ['Српски',          ['sr-RS']],
 ['Українська',      ['uk-UA']],
 ['한국어',            ['ko-KR']],
 ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
                     ['cmn-Hans-HK', '普通话 (香港)'],
                     ['cmn-Hant-TW', '中文 (台灣)'],
                     ['yue-Hant-HK', '粵語 (香港)']],
 ['日本語',           ['ja-JP']],
 ['हिन्दी',            ['hi-IN']],
 ['ภาษาไทย',         ['th-TH']]];
// #####################################################################


for (var i = 0; i < langs.length; i++) {
  select_language.options[i] = new Option(langs[i][0], i);
}

// SET UP LANGUAGE SELECTION (IT'S HIDDEN At THE MO, BUT it's a select list populated with options)
select_language.selectedIndex = 7; updateCountry(); select_dialect.selectedIndex = 0;

function updateCountry() {
	for (var i = select_dialect.options.length - 1; i >= 0; i--) {select_dialect.remove(i);}
	var list = langs[select_language.selectedIndex];
	for (var i = 1; i < list.length; i++) {select_dialect.options.add(new Option(list[i][1], list[i][0]));}
}

var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;

if (!('webkitSpeechRecognition' in window)) { upgrade();} else {
//######################################################################

// THIS IS THE ENTRY POINT!
//######################################################################
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.onstart = function() {
    recognizing = true;
  };


  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {showInfo('info_no_speech');ignore_onend = true;}
    if (event.error == 'audio-capture') {showInfo('info_no_microphone');ignore_onend = true;}
    if (event.error == 'not-allowed') {if (event.timeStamp - start_timestamp < 100) {showInfo('info_blocked');} else {showInfo('info_denied');}ignore_onend = true;}
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {return;}
    if (!final_transcript) {return;}
   };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    
    if (typeof(event.results) == 'undefined') {
      recognition.onend = null;
      recognition.stop();
      return;
   }

    for (var i = event.resultIndex; i < event.results.length; ++i) {
		
		if (event.results[i].isFinal){
			final_transcript += event.results[i][0].transcript;} 
		else{
			interim_transcript += event.results[i][0].transcript;
			
		}
	}
	
	
	
    //WHOLE SENTENCE final_transcript
    final_span.innerHTML = linebreak(final_transcript);
    // INSTANT WORDS interim_transcript
    interim_span.innerHTML = linebreak(interim_transcript);
    if (final_transcript || interim_transcript) {}
  };
}
//######################################################################

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

function startButton(event) {
  if (recognizing) {
    recognition.stop();
    results.style.borderColor="grey";
    return;
  }
  final_transcript = '';
  recognition.lang = select_dialect.value;
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  start_timestamp = event.timeStamp;
  results.style.borderColor="black";
}

// GO GO GADGET FREAKAZOID!
document.addEventListener('keydown', function(event){
    console.log(event.keyCode);
    if(event.keyCode == 32){startButton(event);}
} );
