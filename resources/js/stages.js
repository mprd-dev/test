/* ///////////////////////////////////
// START
/////////////////////////////////// */
function init_start() {
	cLog('init_start');
	var vUrl = 'https://player.vimeo.com/external/243272043.sd.mp4?s=6ffaf105b3f4aed9b6b976e3f935c986384a3eb8&profile_id=165';
	initVideo(vUrl);
	/**/
	$('#start .btn.enter').on('click', function(){
		playBgm();
		changeStageName('intro_bridge');
	});
	
	$('#intro .title').hide().fadeIn(1000);
}
function destroy_start() {
	cLog('destroy_start');
	distroyVideo();
	$('#start .btn.enter').off('click');
}

/* ///////////////////////////////////
// INTRO_BRIDGE
/////////////////////////////////// */
function init_intro_bridge() {
	cLog('init_intro_bridge');
	var vUrl = 'https://player.vimeo.com/external/243270116.sd.mp4?s=7598038a7b1cf295327b44a75ec24cf6494a49f5&profile_id=165';
	initVideo(vUrl, 'changeStageName("setup")');
}
function destroy_intro_bridge() {
	cLog('destroy_intro_bridge');
	distroyVideo();
}

/* ///////////////////////////////////
// SETUP
/////////////////////////////////// */
function init_setup() {
	cLog('init_setup');

	//var vUrl = 'https://player.vimeo.com/external/243270116.sd.mp4?s=7598038a7b1cf295327b44a75ec24cf6494a49f5&profile_id=165';
	var vUrl = VIDEO_PATH + 'setup_mov.mp4';
	initVideo(vUrl);

	$('#term').on('click', function(){
		if ($(this).is(':checked')) {
			//개인정보 & 기밀사항 관련 안내 팝업
			openPop('pop_agreement');
		}
	});
	$('#setup .btn.start').on('click', function(){
		var checked = $('#term').is(':checked');
		if (!checked) {
			alert('동의해주세요.');
			return;
		}
		nickname = $.trim($('#setup #nickname').val());
		if (nickname == '') {
			alert('이름을 입력해 주세요.');
			return;
		}
		$('.nickname').html(nickname);
		changeStageName('enter');
	});
}
function destroy_setup() {
	cLog('destroy_setup');
	distroyVideo();
	$('#term').off('click');
	$('#setup .btn.start').off('click');
}

/* ///////////////////////////////////
// ENTER
/////////////////////////////////// */
function init_enter() {
	cLog('init_enter');
	//var vUrl = 'https://player.vimeo.com/external/243270116.sd.mp4?s=7598038a7b1cf295327b44a75ec24cf6494a49f5&profile_id=165';
	var vUrl = VIDEO_PATH + 'enter_mov.mp4'; //temp
	initVideo(vUrl, 'changeStageName("airlock")', true);

	$('#enter .w-inner .btn').on('click', function(){
		$('#enter').fadeOut();
		$('#video')[0].play();
		$('#timer').show();
		gsap.from($('#timer'), {duration: 1, opacity:0.0, ease:Linear.easeOut});
		initTimer();
	});
}
function destroy_enter() {
	cLog('destroy_enter');
	distroyVideo();
	$('#enter .w-inner .btn').off('click');
}

/* ///////////////////////////////////
// airlock 
/////////////////////////////////// */
function init_airlock() {
	cLog('init_airlock');
	
	//var vUrl = VIDEO_PATH + 'airlock_mov.mp4';
	//initVideo(vUrl, 'set_airlock()');
//}
//function set_airlock() {
	initBackground($('#airlock .img_container'), 'airlock_bg.jpg', 'static');
	var tweener = gsap.from($('#airlock .w-inner'), 1.0, {opacity:0, ease:Linear.easeOut});
	$('#airlock .w-inner').removeClass('hide');
	//effect motion
	$('#airlock .pop_warning').css('opacity','1');
	gsap.to($('#airlock .pop_warning'), {delay:2.0, duration: 1.0, opacity:0.5, repeat: 2, yoyo: true, ease:Linear.easeIn, onComplete:function(){
		gsap.to($('#airlock .pop_warning'), {duration: 1, opacity:0.0, ease:Linear.easeOut});
	}});
	playCaption($('#airlock .caption .before'), 1.0);
}
function destroy_airlock() {
	cLog('destroy_airlock');
	distroyVideo();
	//distroyBackground();
	$('#airlock .w-inner').addClass('hide');
	$('#airlock .pop_warning').css('opacity', '1.0');
}

/* ///////////////////////////////////
// airlock_door
/////////////////////////////////// */
function init_airlock_door() {
	cLog('init_airlock_door');
	
	var vUrl = VIDEO_PATH + 'airlock_door_mov.mp4';
	initVideo(vUrl, 'set_airlock_door()');
	$('#airlock_door .img_container').hide();

	//버튼클릭이랑 엔터
	/*
	$('#airlock_door_code').on('keyup', function(e) {
		if (e.keyCode == 13){
			$('#airlock_door_submit').trigger('click');
		}
	});
	$('#airlock_door_submit').on('click', function() {
		var answer = $.trim($('#airlock_door_code').val()).toUpperCase();
		if (answer == '') {
			alert('코드를 입력해 주세요');
			return;
		} else if (answer != 'START') {
			//오답
			changeStageName('airlock_door_wrong');
		} else {
			//정답
			changeStageName('gate_bridge');
		}
	});
	*/
	$('#airlock_door .btn').on('click', function() {
		changeStageName('airlock');
	});

	//힌트 셋팅
	setHints('airlock_door');

	//키보드 UI
	setKeyboardUI($('#airlock_door_bg .img_holder .keypad_holder'), $('#airlock_door_code'), ['S','L','A','R','T','H','U','N','P','back','Q','enter'], 'check_airlock_door()');
}
function check_airlock_door() {
	var answer = $.trim($('#airlock_door_code').val()).toUpperCase();
	if (answer == '') {
		alert('코드를 입력해 주세요');
		return;
	} else if (answer != 'START') {
		//오답
		changeStageName('airlock_door_wrong');
	} else {
		//정답
		changeStageName('gate_bridge');
	}
}
function set_airlock_door() {
	initBackground($('#airlock_door .img_container'), 'airlock_door_bg.jpg', 'static');
	$('#airlock_door_bg').css('z-index', '2');
	$('#airlock_door .img_container').show();
	var tweener = gsap.from($('#airlock_door .w-inner, #airlock_door .img_container'), {opacity:0, duration:0.5, ease:Linear.easeOut, onComplete:function(){
		$('#tools .hint').removeClass('active').show();
		$('#airlock_door_code').focus();
	}});
	$('#airlock_door .w-inner').removeClass('hide');
}
function destroy_airlock_door() {
	cLog('destroy_airlock_door');
	distroyVideo();
	distroyBackground();
	distroyKeyboardUI($('#airlock_door_bg .img_holder .keypad_holder'));
	//$('#airlock_door_code').off('keyup');
	//$('#airlock_door_submit').off('click');
	$('#airlock_door .btn').off('click');
	$('#airlock_door .w-inner').addClass('hide');
	$('#airlock_door_code').val('');
	$('#airlock_door .img_container').show();
}

/* ///////////////////////////////////
// airlock_door_wrong
/////////////////////////////////// */
function init_airlock_door_wrong() {
	cLog('init_airlock_door_wrong');
	
	var vUrl = VIDEO_PATH + 'airlock_door_wrong_mov.mp4';
	initVideo(vUrl);

	$('#airlock_door_wrong .btn').on('click', function() {
		changeStageName('airlock');
	});

	playCaption($('#airlock_door_wrong .caption .before'), 1.0);
}
function destroy_airlock_door_wrong() {
	cLog('destroy_airlock_door_wrong');
	distroyVideo();
	$('#airlock_door_wrong .btn').off('click');
}

/* ///////////////////////////////////
// gate_bridge
/////////////////////////////////// */
function init_gate_bridge() {
	cLog('init_gate_bridge');
	
	var vUrl = VIDEO_PATH + 'gate_bridge_mov.mp4';
	initVideo(vUrl, 'changeStageName("gate")');

}
function destroy_gate_bridge() {
	cLog('destroy_gate_bridge');
	distroyVideo();
}

/* ///////////////////////////////////
// gate
/////////////////////////////////// */
function init_gate() {
	cLog('init_gate');

	var vUrl = VIDEO_PATH + 'gate_mov.mp4';
	initVideo(vUrl, 'set_gate()');
	$('#gate .img_container').hide();
	$('#gate .btn_wrap').hide();
	$('#gate .caption').hide();
}
function set_gate() {
	initBackground($('#gate .img_container'), 'gate_bg_img.jpg');
	$('#gate_bg').css('z-index', '2');
	$('#gate .img_container').show();
	$('#gate .btn_wrap').show();
	//effect motion
	var tweener = gsap.from($('#gate .img_container'), {opacity:0, duration:0.5, ease:Linear.easeOut, onComplete:function(){
	}});
	$('#spot_clue1').on('click', function(){
		var name = $(this).data('clue');
		var desc = $(this).data('desc');
		findClue(name, desc);
		//5초 후 인벤토리 열기
		playCaption($('#gate .caption .after'), 0.2);
		setTimeout(function(){
			$('#tools .clue').show();
		}, 5000);
		$('#spot_clue1').hide();
	});
	playCaption($('#gate .caption .before'), 1.0);
	$('#gate .caption').show();
}
function destroy_gate() {
	cLog('destroy_gate');
	distroyBackground();
	distroyVideo();
	$('#spot_clue1').off('click');
}

/* ///////////////////////////////////
// maincontrol_bridge
/////////////////////////////////// */
function init_maincontrol_bridge() {
	cLog('init_maincontrol_bridge');
	
	var vUrl = VIDEO_PATH + 'maincontrol_bridge_mov.mp4';
	initVideo(vUrl, 'changeStageName("maincontrol")');
}
function destroy_maincontrol_bridge() {
	cLog('destroy_maincontrol_bridge');
	distroyVideo();
}

/* ///////////////////////////////////
// maincontrol
/////////////////////////////////// */
function init_maincontrol() {
	cLog('init_maincontrol');
	
	initBackground($('#maincontrol .img_container'), 'bg_sample_1.jpg');

	$('#spot_map').on('click', function(){
		//지도 레이어
		cLog('지도를 띄운다!!!');
		openPop('pop_mainmap');
	});
	$('#spot_computer').on('click', function(){
		//컴퓨터
		changeStageName('maincontrol_computer');
	});
	$('#spot_meetingroom').on('click', function(){
		//회의실
		changeStageName('maincontrol_meetingroom');
	});

	playCaption($('#maincontrol .caption .before'), 1.0);
}
function destroy_maincontrol() {
	cLog('destroy_maincontrol');
	distroyBackground();
	$('#spot_map').off('click');
	$('#spot_computer').off('click');
	$('#spot_meetingroom').off('click');
}

/* ///////////////////////////////////
// maincontrol_computer
/////////////////////////////////// */
function init_maincontrol_computer() {
	cLog('init_maincontrol_computer');
	
	initBackground($('#maincontrol_computer .img_container'), 'temp_maincontrol_computer_bg.jpg');

	$('#spot_computer_monitor_main').on('click', function(){
		changeStageName('maincontrol_computer_main');
	});
	$('#spot_computer_monitor_sub').on('click', function(){
		openPop('pop_computer_monitor_sub');
	});
	$('#spot_computer_keyboard').on('click', function(){
		openPop('pop_computer_keyboard');
	});
	$('#maincontrol_computer .btn_wrap .prev').on('click', function(){
		changeStageName('maincontrol');
	});
}
function destroy_maincontrol_computer() {
	cLog('destroy_maincontrol_computer');
	distroyBackground();
	$('#spot_computer_monitor_main').off('click');
	$('#spot_computer_monitor_sub').off('click');
	$('#spot_computer_keyboard').off('click');
	$('#maincontrol_computer .btn_wrap .prev').off('click');
}

/* ///////////////////////////////////
// maincontrol_computer_main
/////////////////////////////////// */
function init_maincontrol_computer_main() {
	cLog('init_maincontrol_computer_main');
	
	initBackground($('#maincontrol_computer_main .img_container'), 'temp_computer_main_bg.jpg', 'static');

	$('#maincontrol_computer_main .btn_wrap .prev').on('click', function(){
		//컴퓨터실
		changeStageName('maincontrol_computer');
	});

	$('#computer_monitor_main_submit').on('click', function(){
		var answer = $.trim($('#computer_monitor_main_code').val()).toUpperCase();
		if (answer == '') {
			alert('코드를 입력해 주세요');
			return;
		} else if (answer != 'BAL-HAESTN') {
			//오답
			changeStageName('maincontrol_computer_wrong');
		} else {
			//정답
			var name = 'clue2';
			var desc = '두번째 단서';
			findClue(name, desc);
			//5초 후 컴퓨터실로 이동
			setTimeout(function(){
				cLog('컴퓨터실로 이동해라!');
				changeStageName('maincontrol_computer');
			}, 5000);
			$('#spot_computer_monitor_main').hide();
		}
	});
	//힌트 셋팅
	setHints('maincontrol_computer_main');
}
function destroy_maincontrol_computer_main() {
	cLog('destroy_maincontrol_computer_main');
	distroyBackground();
	$('#computer_monitor_main_code').val('');
	$('#maincontrol_computer_main .btn_wrap .prev').off('click');
	$('#computer_monitor_main_submit').off('click');
}

/* ///////////////////////////////////
// maincontrol_computer_wrong
/////////////////////////////////// */
function init_maincontrol_computer_wrong() {
	cLog('init_maincontrol_computer_wrong');
	
	var vUrl = VIDEO_PATH + 'maincontrol_computer_wrong_mov.mp4';
	initVideo(vUrl);

	$('#maincontrol_computer_wrong .btn').on('click', function() {
		changeStageName('maincontrol_computer_main');
	});
}
function destroy_maincontrol_computer_wrong() {
	cLog('destroy_maincontrol_computer_wrong');
	distroyVideo();
	$('#maincontrol_computer_wrong .btn').off('click');
}

/* ///////////////////////////////////
// maincontrol_meetingroom
/////////////////////////////////// */
function init_maincontrol_meetingroom() {
	cLog('init_maincontrol_meetingroom');
	
	initBackground($('#maincontrol_meetingroom .img_container'), 'temp_maincontrol_meetingroom_bg.jpg');

	$('#spot_meetingroom_main').on('click', function(){
		changeStageName('maincontrol_meetingroom_main');
	});
	$('#maincontrol_meetingroom .btn_wrap .prev').on('click', function(){
		changeStageName('maincontrol');
	});
}
function destroy_maincontrol_meetingroom() {
	cLog('destroy_maincontrol_meetingroom');
	distroyBackground();
	$('#spot_meetingroom_main').off('click');
	$('#maincontrol_meetingroom .btn_wrap .prev').off('click');
}

/* ///////////////////////////////////
// maincontrol_meetingroom_main
/////////////////////////////////// */
function init_maincontrol_meetingroom_main() {
	cLog('init_maincontrol_meetingroom_main');
	
	initBackground($('#maincontrol_meetingroom_main .img_container'), 'temp_maincontrol_meetingroom_main_bg.jpg', 'static');

	$('#maincontrol_meetingroom_main .btn_wrap .prev').on('click', function(){
		changeStageName('maincontrol_meetingroom');
	});

	$('#meetingroom_main_submit').on('click', function(){
		var answer = $.trim($('#meetingroom_main_code').val()).toUpperCase();
		if (answer == '') {
			alert('코드를 입력해 주세요');
			return;
		} else if (answer != '46050550') {
			//오답
			openPop('pop_maincontrol_meetingroom_wrong');
			$('#meetingroom_main_code').val('');
		} else {
			//정답
			var name = 'clue3';
			var desc = '세번째 단서';
			findClue(name, desc);
			//5초 후 이동
			setTimeout(function(){
				changeStageName('maincontrol_meetingroom');
			}, 5000);
			$('#spot_meetingroom_main').hide();
		}
	});
	//힌트 셋팅
	setHints('maincontrol_meetingroom_main');
}
function destroy_maincontrol_meetingroom_main() {
	cLog('destroy_maincontrol_meetingroom_main');
	distroyBackground();
	$('#meetingroom_main_code').val('');
	$('#maincontrol_meetingroom_main .btn_wrap .prev').off('click');
	$('#meetingroom_main_submit').off('click');
}


/* ///////////////////////////////////
// STAGE 1
/////////////////////////////////// */
function init_stage1() {
	cLog('init_stage1');
	$('#logo').hide();
	$('#tools').show();
	
	distroyVideo();
	distroyBackground();

	initBackground($('#stage1_bg .img_container'), 'bg_sample_1.jpg');
	
	initTimer();
}

/* ///////////////////////////////////
// STAGE 2
/////////////////////////////////// */
function init_stage2() {
	cLog('init_stage2');
	$('#logo').hide();
	$('#tools').show();
	
	distroyVideo();
	distroyBackground();
	
	
}

