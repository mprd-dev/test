/* ///////////////////////////////////
// COMMON
/////////////////////////////////// */
// CHECK FPS
//(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})();

// 이미지 경로 정의
const IMG_PATH = './resources/images/';
const VIDEO_PATH = './resources/video/';
const AUDIO_PATH = './resources/audio/';
// 스테이지 셋팅
var nowStage = 10; //TEST 시 값 변경 10:중앙통제실
var prevStage = 0;
var stages = [
	  'start' 
	, 'intro_bridge'
	, 'setup'
	, 'enter'
	, 'airlock'
	, 'airlock_door' //에어락입구 문제, 힌트 2개??
	, 'airlock_door_wrong'
	, 'gate_bridge'
	, 'gate'
	, 'maincontrol_bridge'
	, 'maincontrol'
	, 'maincontrol_computer'
	, 'maincontrol_computer_main' //중앙통제실 컴퓨터 문제, 힌트 2개
	, 'maincontrol_computer_wrong'
	, 'maincontrol_meetingroom'
	, 'maincontrol_meetingroom_main' //중앙통제실 회의실 문제, 힌트 2개
	, 'mainlab' //메인랩 문제, 힌트 2개
	, 'infirmary' //의무실 문제, 힌트 2개
	, 'storage1' //저장고1 문제, 힌트 2개
	, 'storage1_inside' //저장고내부 문제, 힌트 2개
	, 'storage2'
	, 'storage3'
	, 'ending_bridge'
	, 'ending'
];

//-- UI Setting
function settingUI($page) {
	//지도셋팅
	$('#pop_mainmap .mainmap_holder > div').removeClass('on');
	$('#pop_mainmap .mainmap_holder').find('.mainmap_'+$page).addClass('on');
	//UI 셋팅
	switch($page) {
		case 'start' :
		case 'intro_bridge' :
		case 'gate_bridge' :
		case 'maincontrol_bridge' :
		case 'ending_bridge' :
			$('#timer').hide();
			$('#tools .share').hide();
			$('#tools .hint').hide().removeClass('active');
			$('#tools .clue').hide();
			$('#tools .minimap').hide();
			break;
		case 'setup' :
		case 'enter' :
			$('#timer').hide();
			$('#tools .share').hide();
			$('#tools .hint').hide().removeClass('active');
			$('#tools .clue').hide();
			$('#tools .minimap').hide();
			break;
		case 'airlock' :
		case 'airlock_door_wrong' :
		case 'maincontrol_computer_wrong' :
		case 'gate' :
			$('#timer').show();
			$('#tools .share').hide();
			$('#tools .hint').hide().removeClass('active');
			$('#tools .clue').hide();
			$('#tools .minimap').hide();
			break;
		case 'maincontrol' :
		case 'maincontrol_computer' :
		case 'maincontrol_meetingroom' :
		case 'storage2' :
		case 'storage3' :
			$('#timer').show();
			$('#tools .share').show();
			$('#tools .minimap').show();
			$('#tools .hint').hide().removeClass('active');
			$('#tools .clue').show();
			break;
		case 'airlock_door' :
			$('#timer').show();
			//$('#tools .hint').show().removeClass('active');
			break;
		case 'maincontrol_computer_main' :
		case 'maincontrol_meetingroom_main' :
		case 'mainlab' :
		case 'infirmary' :
		case 'storage1' :
		case 'storage1_inside' :
			$('#timer').show();
			$('#tools .share').show();
			$('#tools .minimap').hide();
			$('#tools .hint').show().removeClass('active');
			$('#tools .clue').show();
			break;
		case 'ending' :
			break;
	}
}

// 타이머 셋팅
var timer = 0; //interval 객체
var count = 0; //카운트 
var limit = 2*60*60; //제한시간 60분
// 단서
var clues = [];
// 힌트
var hintUseCnt = 0;
var hints = [];
hints.airlock_door = {useCnt:0, txt1:'숫자에 색깔이 있는 것과 관련이 있을거 같다.', txt2:'정답은 START 이다.'}
hints.maincontrol_computer_main = {useCnt:0, txt1:'쪽지의 글자를 키보드의 위치에 대입해보자', txt2:'정답은 BAL-HAESTN 이다.'}
hints.maincontrol_meetingroom_main = {useCnt:0, txt1:'문제가 뭔지도 모르겠다', txt2:'정답은 46050550 이다.'}

// 닉네임
var nickname = '';
// BGM
var bgm;
var bgImg;
var bgMov;

//-- 나가기 경고창
window.onbeforeunload = function (event) {
	event.preventDefault(); 
	//return '미션을 포기하시겠습니까?'; //귀찮으니 일단 주석
}
//-- 브라우저 채크
var word;
var version = "N/A";
var agent = navigator.userAgent.toLowerCase();
var name = navigator.appName;
//console.log('Check Browser...');
//console.log('agent : ' + agent);
//console.log('name : ' + name);
// IE old version ( IE 11 or Lower )
if (name == "Microsoft Internet Explorer") {
	word = "msie ";
} else {
	if (agent.search("trident") > -1) {
		// IE 11
		word = "trident/.*rv:";
	} else if (agent.search("edge/") > -1) {
		// Microsoft Edge
		word = "edge/";
	}
}
//IE인 경우 경고창
var reg = new RegExp(word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})");
if (reg.exec(agent) != null) {
	version = RegExp.$1 + RegExp.$2;
	var versionNumber = Math.floor(parseFloat(version));
	if (versionNumber <= 11) {
		alert('본 사이트는 Chrome, Safari, Firefox 및 Microsoft Edge에 최적화되어 있습니다.\n'+
		'원활한 서비스 이용을 위하여 최신 브라우저를 이용해 주세요.');
	}
}

//-- INIT
$(function(){
	// a link
	$("a").each(function(){
		if( $(this).attr("href") == "#" || $(this).attr("href") == "#none" || $(this).attr("href") == ""){
			$(this).attr("href", "javascript:void(0)");
		}
	});

	//BGM
	initBgm();
	
	//EVENTS
	$('.chapter .next').on('click', function(){
		if (nowStage >= stages.length -1) {
			return;
		}
		changeStage(nowStage+1);
	});
	//단서
	$(document).on('click', '#tools .clue ul li', function(){
		openClue($(this).data('id'));
	});
	//힌트
	$('#tools .hint .btn').on('click', function(){
		//cLog($(this).parent());
		$(this).parent().toggleClass('active');
	});
	$('#tools .hint ul li').on('click', function(){
		if ($(this).html() == 'open') {
			var data = $(this).parent().data('chapter');
			hints[data].useCnt ++;
			hintUseCnt ++;
			cLog('hintUseCnt : ' + hintUseCnt);
			setHints(data);
		}
	});
	//공통POP
	//LAYER POP :: open
	$('.btn.open-layer-pop').on('click', function(e) {
		var target = $(this).attr('href');
		e.preventDefault();
		$(target).addClass('active');
	});

	//LAYER POP :: close
	$('.layer-pop .btn-close').on('click', function(e) {
		var target = $(this).closest('.layer-pop');
		
		$('body').removeClass('modal-scroll');
		$('body').removeClass('modal-opened');
		
		$(target).removeClass('active');
		
		//210810 kbs : 해상도 변경 시 팝업이 다시 뜨는 현상 수정
		$(target).addClass('deactive');
	});
	//지도
	$('#pop_mainmap .mainmap_holder div').on('click', function(){
		var name = $(this).attr('class').split('mainmap_')[1];
		if (!$(this).hasClass('on')) {
			changeStageName(name);
		}
	});
	//START
	changeStage(nowStage);
});

//-- 페이지 전환
function changeStage($idx) {
	cLog('changeStage : ' + $idx);
	prevStage = nowStage;
	nowStage = $idx;
	var stage_nm = stages[$idx];
	//$('#loading').show().stop().animate({opacity:1},1000,'linear', function(){
	$('#loading').css('opacity','0').show();
	closePop();
	gsap.to($('#loading'), {duration: 1, opacity:1.0, ease:Linear.easeOut, onComplete:function(){
		$('.chapter').hide();
		if (nowStage != 0) {
			try {
				new Function('destroy_' + stages[prevStage] + '();')();
			} catch (e) {
				console.warn('stage('+stages[prevStage]+') function is not defined');
				//console.log(e);
			}
		}
		//TODO preload
		settingUI(stage_nm);
		$('#'+stage_nm).show();
		try {
			new Function('init_' + stage_nm + '();')();
		} catch (e) {
			console.warn('stage('+stage_nm+') function is not defined');
			console.log(e);
		}
		
		//$('#loading').fadeOut(500); //todo animation
		gsap.to($('#loading'), {duration: 1, opacity:0.0, ease:Linear.easeOut, onComplete:function(){
			$('#loading').hide();
		}});
	}});
}
function changeStageName($name) {
	var idx = stages.indexOf($name);
	if (idx < 0){
		cLog($name + ' stage not registed.');
		return;
	}
	changeStage(idx);
}

//-- 로딩바
function showLoading() {
	$('#loading').show(); //animation
}
function hideLoading() {
	$('#loading').hide();
}

//-- 배경동영상
/*
* $url : 호출영상 경로
* $fn : 영상 재생 후 콜백 함수
* $stop : 자동플레이여부 (대부분 자동플레이니까 true인 경우에만 멈춤상태)
*/
function initVideo($url, $fn, $stop) {
	var video = $('#video')[0];
	video.src = $url;
	if ($fn) {
		$('#video').removeAttr('autoplay');
		$('#video').removeAttr('loop');
		$('#video').on('ended', function(){
			//cLog('video is ended, callback function is ' + $fn);
			$('#video').off('ended');
			new Function($fn)();
		});
	} else {
		$('#video').attr('autoplay', 'autoplay');
		$('#video').attr('loop', 'loop');
	}
	video.load();
	if (!$stop) {
		video.play();
	}

	/*
	//canvas 사용 시 -- video display:none 처리 후 사용
	const canvas = document.querySelector('.canvas');
	const ctx = canvas.getContext('2d');
	let canPlayState = false;
	ctx.textAlign = 'center';
	ctx.fillText('비디오 로딩 중..', 300, 200);
	const videoElem = document.querySelector('.video');
	videoElem.addEventListener('canplaythrough', render);
	function render() {
		ctx.drawImage(videoElem, 0, 0, 1920, 1080, 0, 0, canvas.width, canvas.height);
		requestAnimationFrame(render);
	}
	*/
}
function distroyVideo() {
	var video = $('#video')[0];
	$('#video').off('ended');
	video.src = '';
}

//-- 배경이미지
function initBackground($target, $url, $mode) {
	var $imgHolder = $target.find('.img_holder');
	$('.img_container').removeClass('pan-off');
	$imgHolder.css('background-image', 'url("' + IMG_PATH + $url + '")');

	$target.find('.img_holder').css('background-image', 'url("' + IMG_PATH + $url + '")');
	if ($mode == 'static') {
		$target.find('.img_holder').width('1900px');
		$target.find('.img_holder').height('1080px');
	}
	if ($mode == null || $mode == 'move' || $mode == 'drag') {

		bgImg = $target.pan({
			mouseControl: 'proportional'
			,'proportionalSmoothing': 0.9
			/*
			//TODO : 모바일일 경우 드래그
			mouseControl: 'kinetic'
			,'kineticDamping'  : 0.8*/
		});
	}
}
function distroyBackground() {
	$('.img_holder').css('background-image', 'none');
	$('.img_container').addClass('pan-off');
	if (bgImg != null) {
		bgImg.destroy();
		bgImg = null;
	}
}

//-- Timer
function initTimer() {
	clearInterval(timer);
	count = 0;
	//$('#timer em').html(convertSeconds(limit - count));
	timer = setInterval(function(){
		count ++;
		/*
		$('#timer em').html(convertSeconds(limit - count));
		if (count >= limit) {
			clearInterval(timer);
			cLog('TIME OVER');
		}
		*/
		$('#timer em').html(convertSeconds(count));
	}, 1000);
}

function convertSeconds(seconds){
	var hour = parseInt(seconds/3600) < 10 ? '0'+ parseInt(seconds/3600) : parseInt(seconds/3600); 
	var min = parseInt((seconds%3600)/60) < 10 ? '0'+ parseInt((seconds%3600)/60) : parseInt((seconds%3600)/60); 
	var sec = seconds % 60 < 10 ? '0'+seconds % 60 : seconds % 60;

	return hour +  ':' + min +  ':' + sec;
}

//-- 자막처리
function playCaption($target, $delay) {
	cLog('playCaption');
	$target.parent().find('.caption_container').hide();
	$target.show();
	$target.find('div').each(function(idx){
		$(this).css('position', 'absolute');

		//$(this).css('opacity', 0);
		//$(this).css('top', 50);
		/*
		gsap.to($(this), {delay:$delay + (idx*2), opacity:1, y:0, duration:0.5, ease:Linear.easeOut, onComplete:function(){
			gsap.to($(this), {delay:2, opacity:0, y:-100, duration:0.5, ease:Linear.easeOut});
		}});
		*/
		gsap.killTweensOf($(this));
		gsap.to($(this), {keyframes: [
			{opacity: 0, y:30, duration: 0},
			{opacity: 1, y:0, duration: 0.5, delay: $delay + (idx*3), ease: "power1.out"},
			{opacity: 0, y:-30, duration: 0.5, delay: 2, ease: "power1.in"}
		]});
	});
	
	//gsap.from($target, {delay:$delay, opacity:0, duration:0.5, ease:Linear.easeOut, onComplete:function(){
}

//-- 인벤토리 / 단서
function openIventory() {
	$('#tool .clue').addClass('active');
	//animation
}
function closeInventory() {
	$('#tool .clue').removeClass('active');
	//animation
}
// 단서를 찾았다
function findClue($name, $desc) {
	cLog('단서를 찾았다!! ' + $name + ' : ' + $desc);
	openClue($name, 'auto', 'addClue("'+$name+'","'+$desc+'")');
}
// 단서를 추가한다
function addClue($name, $desc) {
	//cLog('단서를 추가한다!! ' + $name + ' : ' + $desc);
	$('#tools .clue ul').append('<li class="item_'+$name+'" data-id="'+$name+'"><a href="javascript:void(0);">'+$desc+'</a></li>');
}
// 단서를 열어본다
function openClue($name, $mode, $callback) {
	var $target = $('#pop_clue').find('#'+$name);
	$('#pop_clue .pop_clue_item').removeClass('active');
	$target.addClass('active');
	openPop('pop_clue', $mode, $callback);
}

//-- 힌트
function setHints($chapter) {
	cLog('setHints : ' + $chapter);
	var useCnt = hints[$chapter].useCnt;
	$('#tools .hint_wrap').data('chapter', $chapter);
	$('#tools .hint_wrap li').text('lock');
	for (var i=0; i < 2; i++) {
		if (i < useCnt) {
			$('#tools .hint').find('#hint_txt'+(i+1)).html(hints[$chapter]['txt'+(i+1)]);
		} else if (i == useCnt) {
			$('#tools .hint').find('#hint_txt'+(i+1)).html('open');
		}
	}
}
function openHints() {
	$('#tools .hint').addClass('active');
}
function closeHints() {
	$('#tools .hint').removeClass('active');
}

//-- 키보드UI
function setKeyboardUI($keyboard, $target, $keys, $fn) {
	cLog('setKeyboardUI');
	$keyboard.find('li').each(function(idx) {
		$(this).data('key', $keys[idx]).html('<a href="#">'+$keys[idx]+'</a>');
	});
	$keyboard.find('li').on('click', function() {
		//var txt = $target.text();
		var txt = $target.val();
		cLog('txt : ' + txt);
		var ret = '';
		if ($(this).data('key') == 'enter') {
			new Function($fn)();
			return;
		} else if ($(this).data('key') == 'back') {
			ret = txt.substr(0, txt.length-1);
		} else {
			if (txt.length < $target.attr('maxlength')) {
				ret = txt + $(this).data('key');
			} else {
				ret = txt;
			}
		}
		//$target.text(ret);
		$target.val(ret);
	});
}
function distroyKeyboardUI($keyboard) {
	$keyboard.find('li').off('click');
}
//-- popup
$(function(){
	$('#popup_content').wrap('<div class="div_table"><div class="div_table_cell"></div></div>');
	$('.popup_close').on('click', function(){
		var $name = $(this).data('name');
		closePop($name);
	});
});
//$target : 대상 id
//$mode : def : 기본창 // auto : 5초 후 닫힘
//$callback : 닫힌 후 콜백
function openPop($name, $mode, $callback) {
	if ($name == '') return;
	$('#popup_content > div').removeClass('active');
	$target = $('#popup_content').find('#'+$name);
	cLog($name);
	//cLog($target);
	$target.addClass('active');
	$('html').css('overflow-y', 'hidden');
	$('html').on('scroll touchmove', function(e){
		e.preventDefault();
		e.stopPropagation();
		return false;
	});
	//자동닫힘 설정
	if ($mode == 'auto') {
		$('.popup_close').hide();
		setTimeout(function(){
			new Function($callback)();
			closePop();
		},5000);
	} else {
		$('.popup_close').show();
	}
	$('#popup_wrap').addClass('active');
	$('.img_container').addClass('pan-off');
}
function closePop($name) {
	$target = $('#popup_content').find('#'+$name);
	$target.removeClass('active');
	$('html').css('overflow-y', 'auto');
	$('html').off('scroll touchmove');
	$('#popup_wrap').removeClass('active');
	$('.img_container').removeClass('pan-off');
}

//-- bgm
function initBgm() {
	bgm = new Audio(AUDIO_PATH + 'bgm_2.mp3');
	//bgm.play();
	bgm.addEventListener('ended', function(){
		this.currentTime = 0;
		this.play();
	}, false);
	$('footer .audio .btn').on('click', function(){
		cLog('bgm play');
		if ($(this).hasClass('on')) {
			stopBgm();
		} else {
			playBgm();
		}
	});
}

function playBgm() {
	$('footer .audio .btn').addClass('on');
	$('footer .audio .btn').text('BGM ON');
	//bgm.play();
	/**/
	if (bgm.paused) {
		gsap.set(bgm, { volume: 0, playbackRate: 0.5 });  
	}
	gsap.to(bgm, 3, { volume: 1, playbackRate: 1 });
	bgm.play();
}
function stopBgm() {
	$('footer .audio .btn').removeClass('on');
	$('footer .audio .btn').text('BGM OFF');
	//bgm.pause();
	gsap.to(bgm, 3, { 
		volume: 0, 
		playbackRate: 0.5, 
		onComplete: bgm.pause, 
		callbackScope: bgm 
	});
}

//-- 공유하기

//-- logger
function cLog($text) {
	console.log($text);
}

