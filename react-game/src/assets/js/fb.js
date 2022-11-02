var canvas, ctx;
var width, height, birdPos;
var sky, land, bird, pipe, pipeUp, pipeDown, scoreBoard, ready, splash;
var dist, birdY, birdF, birdN, birdV;
var animation, death, deathAnim;
var pipes = [], pipesDir = [], pipeSt, pipeNumber;
var score, maxScore;
var dropSpeed;
var flashlight_switch = false, hidden_switch = false;
var mode, delta;
var wechat = false;
var playend = false, playdata = [];
var wxData;

function getDeathStat() {

	return death;
}


var clearCanvas = function(){
	ctx.fillStyle = '#F9F5EB';
	ctx.fillRect(0, 0, width, height);
}

var loadImages = function(){
	var imgNumber = 9, imgComplete = 0;
	var onImgLoad = function(){
		imgComplete++;
		if(imgComplete == imgNumber){
			death = 1;
			dist = 0;
			birdY = (height - 112) / 2;
			birdF = 0;
			birdN = 0;
			birdV = 0;
			birdPos = width * 0.35;
			score = 0;
			pipeSt = 0;
			pipeNumber = 10;
			pipes = [];
			pipesDir = [];
			for(var i = 0; i < 10; ++i){
				pipes.push(Math.floor(Math.random() * (height - 300 - delta) + 10));
				pipesDir.push((Math.random() > 0.5));
			}
			drawCanvas();
		}
	}

	sky = new Image();
	sky.src = 'images/sky.png';
	sky.onload = onImgLoad;
	
	land = new Image();
	land.src = 'images/land.png';
	land.onload = onImgLoad;
	
	bird = new Image();
	bird.src = 'images/bird.png';
	bird.onload = onImgLoad;
	
	pipe = new Image();
	pipe.src = 'images/pipe.png';
	pipe.onload = onImgLoad;
	
	pipeUp = new Image();
	pipeUp.src = 'images/pipe-up.png';
	pipeUp.onload = onImgLoad;
	
	pipeDown = new Image();
	pipeDown.src = 'images/pipe-down.png';
	pipeDown.onload = onImgLoad;
	
	scoreBoard = new Image();
	scoreBoard.src = 'images/scoreboard.png';
	scoreBoard.onload = onImgLoad;
	
	ready = new Image();
	ready.src = 'images/replay.png';
	ready.onload = onImgLoad;
	
	splash = new Image();
	splash.src = 'images/splash.png';
	splash.onload = onImgLoad;
}

function is_touch_device() {  
  try {  
    document.createEvent("TouchEvent");  
    return true;  
  } catch (e) {  
    return false;  
  }  
}

var initCanvas = function(){
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext('2d');
	canvas.width = width = window.innerWidth;
	canvas.height = height = window.innerHeight;
	if(is_touch_device()){
		canvas.addEventListener("touchend", function(e) { e.preventDefault(); }, false);
        canvas.addEventListener("touchstart", function(e) {
	        	jump();
            e.preventDefault();
        }, false);
	}
	else
		canvas.onmousedown = jump;
	window.onkeydown = jump;
	FastClick.attach(canvas);
	loadImages();
}

var deathAnimation = function(){
	if(splash){
		ctx.drawImage(splash, width / 2 - 94, height / 2 - 54);
		splash = undefined;
	}
	else {
        ctx.drawImage(scoreBoard, width / 2 - 118, height / 2 - 54);
        playend = true;
        playdata = [mode, score];
        if(window.window.WeixinApi && window.WeixinJSBridge) {
            //alert("您在 " + ["easy", "normal", "hard"][mode] + " 模式中取得 " + score + " 分，右上角分享成绩到朋友圈吧~");
        }
    }
	ctx.drawImage(ready, width / 2 - 57, height / 2 + 10);
	maxScore = Math.max(maxScore, score);
}

var drawSky = function(){
	var totWidth = 0;
	while(totWidth < width){
		ctx.drawImage(sky, totWidth, height - 221);
		totWidth += sky.width;
	}
}

var drawLand = function(){
	var totWidth = -dist;
	while(totWidth < width){
		ctx.drawImage(land, totWidth, height - 112);
		totWidth += land.width;
	}
	dist = dist + 2;
	var tmp = Math.floor(dist - width * 0.65) % 220;
	if(dist >= width * 0.65 && Math.abs(tmp) <= 1){
		score++;
	}
}

var drawPipe = function(x, y){
	ctx.drawImage(pipe, x, 0, pipe.width, y);
	ctx.drawImage(pipeDown, x, y);
	ctx.drawImage(pipe, x, y + 168 + delta, pipe.width, height - 112);
	ctx.drawImage(pipeUp, x, y + 144 + delta);
	if(x < birdPos + 32 && x + 50 > birdPos && (birdY < y + 22 || birdY + 22 > y + 144 + delta)){
		clearInterval(animation);
		death = 1;
	}
	else if(x + 40 < 0){
		pipeSt++;
		pipeNumber++;
		pipes.push(Math.floor(Math.random() * (height - 300 - delta) + 10));
		pipesDir.push((Math.random() > 0.5));
	}
	
}

var drawBird = function(){
//	ctx.translate(width * 0.35 + 17, birdY + 12);
//	var deg = -Math.atan(birdV / 2) / 3.14159;
//	ctx.rotate(deg);
	ctx.drawImage(bird, 0, birdN * 24, bird.width, bird.height / 4, birdPos, birdY, bird.width, bird.height / 4);
//	ctx.rotate(-deg);
//	ctx.translate(-width * 0.35 - 17, -birdY - 12);
	birdF = (birdF + 1) % 6;
	if(birdF % 6 == 0)
		birdN = (birdN + 1) % 4;
	birdY -= birdV;
	birdV -= dropSpeed;
	if(birdY + 138 > height){
		clearInterval(animation);
		death = 1;
	}
	if(death)
		deathAnimation();
}

var drawScore = function(){
	ctx.font = '20px "Press Start 2P"';
	ctx.lineWidth = 5;
    ctx.strokeStyle = '#fff';
	ctx.fillStyle = '#000';
	var txt = "" + score;
	ctx.strokeText(txt, (width - ctx.measureText(txt).width) / 2, height * 0.15);
	ctx.fillText(txt, (width - ctx.measureText(txt).width) / 2, height * 0.15);
}

var drawShadow = function() {
	var left_shadow = "linear, " + ((width * 0.35 - 170) / width * 100.) + "% 0, " + ((width * 0.35 + 60) / width * 100.) + "% 0, from(black), to(rgba(0,0,0,0))";
	var right_shadow = "linear, " + ((width * 0.35 + 190) / width * 100.) + "% 0, " + ((width * 0.35 - 30) / width * 100.) + "% 0, from(black), to(rgba(0,0,0,0))";
	var grd = ctx.createLinearGradient(width * 0.35 - 170, 0, width * 0.35 + 60, 0);
	grd.addColorStop(0, "black");
	grd.addColorStop(1, "rgba(0, 0, 0, 0)");
	ctx.fillStyle = grd;
	ctx.fillRect((width * 0.35 - 170), 0, 230, height);
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, (width * 0.35 - 170), height);
	grd = ctx.createLinearGradient(width * 0.35 - 30, 0, width * 0.35 + 190, 0);
	grd.addColorStop(0, "rgba(0, 0, 0, 0)");
	grd.addColorStop(1, "black");
	ctx.fillStyle = grd;
	ctx.fillRect((width * 0.35 - 30), 0, 220, height);
	ctx.fillStyle = "black";
	ctx.fillRect(width * 0.35 + 190, 0, width * 0.65 - 190, height);
}

var drawHidden = function() {
	ctx.fillStyle = "black";
	ctx.fillRect(width * 0.35, 30, 300, height - 180);
}

var drawCanvas = function(){
	clearCanvas();
	drawSky();
	for(var i = pipeSt; i < pipeNumber; ++i){
		drawPipe(width - dist + i * 220, pipes[i]);
		if(mode == 2){
			if(pipesDir[i]){
				if(pipes[i] + 1 > height - 300){
					pipesDir[i] = !pipesDir[i];
					pipes[i] -= 1;
				}
				else
					pipes[i] += 1;
			}
			else{
				if(pipes[i] - 1 < 10){
					pipesDir[i] = !pipesDir[i];
					pipes[i] += 1;
				}
				else
					pipes[i] -= 1;
			}
		}
	}
	drawLand();
	if(flashlight_switch)
		drawShadow();
	else if(hidden_switch)
		drawHidden();
	drawBird();
	drawScore();
}

var anim = function(){
	animation = setInterval(drawCanvas, 1000 / 60);
}

var jump = function(){
	if(death){
		dist = 0;
		birdY = (height - 112) / 2;
		birdF = 0;
		birdN = 0;
		birdV = 0;
		death = 0;
		score = 0;
		birdPos = width * 0.35;
		pipeSt = 0;
		pipeNumber = 10;
		pipes = [];
		pipesDir = [];
		for(var i = 0; i < 10; ++i){
			pipes.push(Math.floor(Math.random() * (height - 300 - delta) + 10));
			pipesDir.push((Math.random() > 0.5));
		}
		anim();
	}
	if(mode == 0)
		birdV = 6;
	else if(mode == 1)
		birdV = 6;
	else
		birdV = 6;
}

var easy, normal, hard;

function easyMode(){
	easy.style["box-shadow"] = "0 0 0 2px #165CF3";
	normal.style["box-shadow"] = "";
	hard.style["box-shadow"] = "";
	clearInterval(animation);
	dropSpeed = 0.3;
	mode = 0;
	delta = 100;
	initCanvas();
}

function normalMode(){
	easy.style["box-shadow"] = "";
	normal.style["box-shadow"] = "0 0 0 2px #165CF3";
	hard.style["box-shadow"] = "";
	clearInterval(animation);
	dropSpeed = 0.3;
	mode = 1;
	delta = 0;
	initCanvas();
}

function hardMode(){
	easy.style["box-shadow"] = "";
	normal.style["box-shadow"] = "";
	hard.style["box-shadow"] = "0 0 0 2px #165CF3";
	clearInterval(animation);
	dropSpeed = 0.3;
	mode = 2;
	delta = 0;
	initCanvas();
}

function flashlight(){
	document.getElementById("flashlight").style.background = ["red", "rgba(255, 255, 255, 0.6)"][+flashlight_switch];
	flashlight_switch ^= 1;
}

function hidden(){
	document.getElementById("hidden").style.background = ["red", "rgba(255, 255, 255, 0.6)"][+hidden_switch];
	hidden_switch ^= 1;
}

window.onload = function(){
    //document.addEventListener("touchend", function(e) { e.preventDefault(); }, false);
    mode = 2;
    score = 0;
    playdata = [0, 0];
    // if(window.window.WeixinApi || window.WeixinJSBridge) {
    //     wechat = true;
    //     WeixinApi.ready(function(Api) {

    //         wxData = {
    //             "appId": "",
    //             "imgUrl" : 'http://shud.in/flappybird/images/logo.png',
    //             "imgWidth": '200',
    //             "imgHeight": '200',
    //             "link" : 'http://shud.in/flappybird',
    //             "desc" : 'Easy / Normal / Hard 三种难度, Flappy Bird 网页版',
    //             "title" : "Flappy Bird"
    //         };

    //         var wxCallbacks = {
    //             ready : function() {
    //                 wxData["title"] = 'Flappy Bird';
    //                 if(flashlight_switch)
    //                     wxData["desc"] = '我刚刚开启 flashlight, 在 ' + ["easy", "normal", "hard"][playdata[0]] + ' 下取得 ' + playdata[1] + ' 分, 你也来试试吧！';
    //                 else
    //                     wxData["desc"] = '我刚刚在 ' + ["easy", "normal", "hard"][playdata[0]] + ' 下取得 ' + playdata[1] + ' 分, 你也来试试吧！';
    //             },
    //             cancel : function(resp) {
    //             },
    //             fail : function(resp) {
    //                 alert("分享失败 > <");
    //             },
    //             confirm : function(resp) {
    //                 alert("分享成功 XD");
    //             },
    //             all : function(resp,shareTo) {
    //             }
    //         };

    //         // 用户点开右上角popup菜单后，点击分享给好友，会执行下面这个代码
    //         Api.shareToFriend(wxData, wxCallbacks);

    //         // 点击分享到朋友圈，会执行下面这个代码
    //         Api.shareToTimeline(wxData, wxCallbacks);

    //         // 点击分享到腾讯微博，会执行下面这个代码
    //         Api.shareToWeibo(wxData, wxCallbacks);

    //         // iOS上，可以直接调用这个API进行分享，一句话搞定
    //         Api.generalShare(wxData, wxCallbacks);
    //     });
    // }
	maxScore = 0;
	dropSpeed = 0.3;
	mode = 2;
	delta = 100;
	initCanvas();
	easy = document.getElementById("easy");
    easy.onclick = easyMode;
	normal = document.getElementById("normal");
    normal.onclick = normalMode;
	hard = document.getElementById("hard");
    hard.onclick = hardMode;
	document.getElementById("flashlight").onclick = flashlight;
	//document.getElementById("hidden").onclick = hidden;
	window.onresize = function() {
		canvas.width = width = window.innerWidth;
		canvas.height = height = window.innerHeight;
		drawCanvas();
	}
}


/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @version 0.6.12
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */

/*jslint browser:true, node:true*/
/*global define, Event, Node*/


/**
 * Instantiate fast-clicking listeners on the specificed layer.
 *
 * @constructor
 * @param {Element} layer The layer to listen on
 */
 function FastClick(layer) {
	'use strict';
	var oldOnClick, self = this;


	/**
	 * Whether a click is currently being tracked.
	 *
	 * @type boolean
	 */
	this.trackingClick = false;


	/**
	 * Timestamp for when when click tracking started.
	 *
	 * @type number
	 */
	this.trackingClickStart = 0;


	/**
	 * The element being tracked for a click.
	 *
	 * @type EventTarget
	 */
	this.targetElement = null;


	/**
	 * X-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartX = 0;


	/**
	 * Y-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartY = 0;


	/**
	 * ID of the last touch, retrieved from Touch.identifier.
	 *
	 * @type number
	 */
	this.lastTouchIdentifier = 0;


	/**
	 * Touchmove boundary, beyond which a click will be cancelled.
	 *
	 * @type number
	 */
	this.touchBoundary = 10;


	/**
	 * The FastClick layer.
	 *
	 * @type Element
	 */
	this.layer = layer;

	if (!layer || !layer.nodeType) {
		throw new TypeError('Layer must be a document node');
	}

	/** @type function() */
	this.onClick = function() { return FastClick.prototype.onClick.apply(self, arguments); };

	/** @type function() */
	this.onMouse = function() { return FastClick.prototype.onMouse.apply(self, arguments); };

	/** @type function() */
	this.onTouchStart = function() { return FastClick.prototype.onTouchStart.apply(self, arguments); };

	/** @type function() */
	this.onTouchMove = function() { return FastClick.prototype.onTouchMove.apply(self, arguments); };

	/** @type function() */
	this.onTouchEnd = function() { return FastClick.prototype.onTouchEnd.apply(self, arguments); };

	/** @type function() */
	this.onTouchCancel = function() { return FastClick.prototype.onTouchCancel.apply(self, arguments); };

	if (FastClick.notNeeded(layer)) {
		return;
	}

	// Set up event handlers as required
	if (this.deviceIsAndroid) {
		layer.addEventListener('mouseover', this.onMouse, true);
		layer.addEventListener('mousedown', this.onMouse, true);
		layer.addEventListener('mouseup', this.onMouse, true);
	}

	layer.addEventListener('click', this.onClick, true);
	layer.addEventListener('touchstart', this.onTouchStart, false);
	layer.addEventListener('touchmove', this.onTouchMove, false);
	layer.addEventListener('touchend', this.onTouchEnd, false);
	layer.addEventListener('touchcancel', this.onTouchCancel, false);

	// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
	// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
	// layer when they are cancelled.
	if (!Event.prototype.stopImmediatePropagation) {
		layer.removeEventListener = function(type, callback, capture) {
			var rmv = Node.prototype.removeEventListener;
			if (type === 'click') {
				rmv.call(layer, type, callback.hijacked || callback, capture);
			} else {
				rmv.call(layer, type, callback, capture);
			}
		};

		layer.addEventListener = function(type, callback, capture) {
			var adv = Node.prototype.addEventListener;
			if (type === 'click') {
				adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
					if (!event.propagationStopped) {
						callback(event);
					}
				}), capture);
			} else {
				adv.call(layer, type, callback, capture);
			}
		};
	}

	// If a handler is already declared in the element's onclick attribute, it will be fired before
	// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
	// adding it as listener.
	if (typeof layer.onclick === 'function') {

		// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
		// - the old one won't work if passed to addEventListener directly.
		oldOnClick = layer.onclick;
		layer.addEventListener('click', function(event) {
			oldOnClick(event);
		}, false);
		layer.onclick = null;
	}
}


/**
 * Android requires exceptions.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;


/**
 * iOS requires exceptions.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);


/**
 * iOS 4 requires an exception for select elements.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS4 = FastClick.prototype.deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


/**
 * iOS 6.0(+?) requires the target element to be manually derived
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOSWithBadTarget = FastClick.prototype.deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);


/**
 * Determine whether a given element requires a native click.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element needs a native click
 */
FastClick.prototype.needsClick = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {

	// Don't send a synthetic click to disabled inputs (issue #62)
	case 'button':
	case 'select':
	case 'textarea':
		if (target.disabled) {
			return true;
		}

		break;
	case 'input':

		// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
		if ((this.deviceIsIOS && target.type === 'file') || target.disabled) {
			return true;
		}

		break;
	case 'label':
	case 'video':
		return true;
	}

	return (/\bneedsclick\b/).test(target.className);
};


/**
 * Determine whether a given element requires a call to focus to simulate click into element.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
 */
FastClick.prototype.needsFocus = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {
	case 'textarea':
		return true;
	case 'select':
		return !this.deviceIsAndroid;
	case 'input':
		switch (target.type) {
		case 'button':
		case 'checkbox':
		case 'file':
		case 'image':
		case 'radio':
		case 'submit':
			return false;
		}

		// No point in attempting to focus disabled inputs
		return !target.disabled && !target.readOnly;
	default:
		return (/\bneedsfocus\b/).test(target.className);
	}
};


/**
 * Send a click event to the specified element.
 *
 * @param {EventTarget|Element} targetElement
 * @param {Event} event
 */
FastClick.prototype.sendClick = function(targetElement, event) {
	'use strict';
	var clickEvent, touch;

	// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
	if (document.activeElement && document.activeElement !== targetElement) {
		document.activeElement.blur();
	}

	touch = event.changedTouches[0];

	// Synthesise a click event, with an extra attribute so it can be tracked
	clickEvent = document.createEvent('MouseEvents');
	clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
	clickEvent.forwardedTouchEvent = true;
	targetElement.dispatchEvent(clickEvent);
};

FastClick.prototype.determineEventType = function(targetElement) {
	'use strict';

	//Issue #159: Android Chrome Select Box does not open with a synthetic click event
	if (this.deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
		return 'mousedown';
	}

	return 'click';
};


/**
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.focus = function(targetElement) {
	'use strict';
	var length;

	// Issue #160: on iOS 7, some input elements (e.g. date datetime) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
	if (this.deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time') {
		length = targetElement.value.length;
		targetElement.setSelectionRange(length, length);
	} else {
		targetElement.focus();
	}
};


/**
 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
 *
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.updateScrollParent = function(targetElement) {
	'use strict';
	var scrollParent, parentElement;

	scrollParent = targetElement.fastClickScrollParent;

	// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
	// target element was moved to another parent.
	if (!scrollParent || !scrollParent.contains(targetElement)) {
		parentElement = targetElement;
		do {
			if (parentElement.scrollHeight > parentElement.offsetHeight) {
				scrollParent = parentElement;
				targetElement.fastClickScrollParent = parentElement;
				break;
			}

			parentElement = parentElement.parentElement;
		} while (parentElement);
	}

	// Always update the scroll top tracker if possible.
	if (scrollParent) {
		scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
	}
};


/**
 * @param {EventTarget} targetElement
 * @returns {Element|EventTarget}
 */
FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
	'use strict';

	// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
	if (eventTarget.nodeType === Node.TEXT_NODE) {
		return eventTarget.parentNode;
	}

	return eventTarget;
};


/**
 * On touch start, record the position and scroll offset.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchStart = function(event) {
	'use strict';
	var targetElement, touch, selection;

	// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
	if (event.targetTouches.length > 1) {
		return true;
	}

	targetElement = this.getTargetElementFromEventTarget(event.target);
	touch = event.targetTouches[0];

	if (this.deviceIsIOS) {

		// Only trusted events will deselect text on iOS (issue #49)
		selection = window.getSelection();
		if (selection.rangeCount && !selection.isCollapsed) {
			return true;
		}

		if (!this.deviceIsIOS4) {

			// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
			// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
			// with the same identifier as the touch event that previously triggered the click that triggered the alert.
			// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
			// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
			if (touch.identifier === this.lastTouchIdentifier) {
				event.preventDefault();
				return false;
			}

			this.lastTouchIdentifier = touch.identifier;

			// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
			// 1) the user does a fling scroll on the scrollable layer
			// 2) the user stops the fling scroll with another tap
			// then the event.target of the last 'touchend' event will be the element that was under the user's finger
			// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
			// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
			this.updateScrollParent(targetElement);
		}
	}

	this.trackingClick = true;
	this.trackingClickStart = event.timeStamp;
	this.targetElement = targetElement;

	this.touchStartX = touch.pageX;
	this.touchStartY = touch.pageY;

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < 200) {
		event.preventDefault();
	}

	return true;
};


/**
 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.touchHasMoved = function(event) {
	'use strict';
	var touch = event.changedTouches[0], boundary = this.touchBoundary;

	if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
		return true;
	}

	return false;
};


/**
 * Update the last position.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchMove = function(event) {
	'use strict';
	if (!this.trackingClick) {
		return true;
	}

	// If the touch has moved, cancel the click tracking
	if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
		this.trackingClick = false;
		this.targetElement = null;
	}

	return true;
};


/**
 * Attempt to find the labelled control for the given label element.
 *
 * @param {EventTarget|HTMLLabelElement} labelElement
 * @returns {Element|null}
 */
FastClick.prototype.findControl = function(labelElement) {
	'use strict';

	// Fast path for newer browsers supporting the HTML5 control attribute
	if (labelElement.control !== undefined) {
		return labelElement.control;
	}

	// All browsers under test that support touch events also support the HTML5 htmlFor attribute
	if (labelElement.htmlFor) {
		return document.getElementById(labelElement.htmlFor);
	}

	// If no for attribute exists, attempt to retrieve the first labellable descendant element
	// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
	return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
};


/**
 * On touch end, determine whether to send a click event at once.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchEnd = function(event) {
	'use strict';
	var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

	if (!this.trackingClick) {
		return true;
	}

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < 200) {
		this.cancelNextClick = true;
		return true;
	}

	// Reset to prevent wrong click cancel on input (issue #156).
	this.cancelNextClick = false;

	this.lastClickTime = event.timeStamp;

	trackingClickStart = this.trackingClickStart;
	this.trackingClick = false;
	this.trackingClickStart = 0;

	// On some iOS devices, the targetElement supplied with the event is invalid if the layer
	// is performing a transition or scroll, and has to be re-detected manually. Note that
	// for this to function correctly, it must be called *after* the event target is checked!
	// See issue #57; also filed as rdar://13048589 .
	if (this.deviceIsIOSWithBadTarget) {
		touch = event.changedTouches[0];

		// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
		targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
		targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
	}

	targetTagName = targetElement.tagName.toLowerCase();
	if (targetTagName === 'label') {
		forElement = this.findControl(targetElement);
		if (forElement) {
			this.focus(targetElement);
			if (this.deviceIsAndroid) {
				return false;
			}

			targetElement = forElement;
		}
	} else if (this.needsFocus(targetElement)) {

		// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
		// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
		if ((event.timeStamp - trackingClickStart) > 100 || (this.deviceIsIOS && window.top !== window && targetTagName === 'input')) {
			this.targetElement = null;
			return false;
		}

		this.focus(targetElement);
		this.sendClick(targetElement, event);

		// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
		if (!this.deviceIsIOS4 || targetTagName !== 'select') {
			this.targetElement = null;
			event.preventDefault();
		}

		return false;
	}

	if (this.deviceIsIOS && !this.deviceIsIOS4) {

		// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
		// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
		scrollParent = targetElement.fastClickScrollParent;
		if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
			return true;
		}
	}

	// Prevent the actual click from going though - unless the target node is marked as requiring
	// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
	if (!this.needsClick(targetElement)) {
		event.preventDefault();
		this.sendClick(targetElement, event);
	}

	return false;
};


/**
 * On touch cancel, stop tracking the click.
 *
 * @returns {void}
 */
FastClick.prototype.onTouchCancel = function() {
	'use strict';
	this.trackingClick = false;
	this.targetElement = null;
};


/**
 * Determine mouse events which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onMouse = function(event) {
	'use strict';

	// If a target element was never set (because a touch event was never fired) allow the event
	if (!this.targetElement) {
		return true;
	}

	if (event.forwardedTouchEvent) {
		return true;
	}

	// Programmatically generated events targeting a specific element should be permitted
	if (!event.cancelable) {
		return true;
	}

	// Derive and check the target element to see whether the mouse event needs to be permitted;
	// unless explicitly enabled, prevent non-touch click events from triggering actions,
	// to prevent ghost/doubleclicks.
	if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

		// Prevent any user-added listeners declared on FastClick element from being fired.
		if (event.stopImmediatePropagation) {
			event.stopImmediatePropagation();
		} else {

			// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
			event.propagationStopped = true;
		}

		// Cancel the event
		event.stopPropagation();
		event.preventDefault();

		return false;
	}

	// If the mouse event is permitted, return true for the action to go through.
	return true;
};


/**
 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
 * an actual click which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onClick = function(event) {
	'use strict';
	var permitted;

	// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
	if (this.trackingClick) {
		this.targetElement = null;
		this.trackingClick = false;
		return true;
	}

	// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
	if (event.target.type === 'submit' && event.detail === 0) {
		return true;
	}

	permitted = this.onMouse(event);

	// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
	if (!permitted) {
		this.targetElement = null;
	}

	// If clicks are permitted, return true for the action to go through.
	return permitted;
};


/**
 * Remove all FastClick's event listeners.
 *
 * @returns {void}
 */
FastClick.prototype.destroy = function() {
	'use strict';
	var layer = this.layer;

	if (this.deviceIsAndroid) {
		layer.removeEventListener('mouseover', this.onMouse, true);
		layer.removeEventListener('mousedown', this.onMouse, true);
		layer.removeEventListener('mouseup', this.onMouse, true);
	}

	layer.removeEventListener('click', this.onClick, true);
	layer.removeEventListener('touchstart', this.onTouchStart, false);
	layer.removeEventListener('touchmove', this.onTouchMove, false);
	layer.removeEventListener('touchend', this.onTouchEnd, false);
	layer.removeEventListener('touchcancel', this.onTouchCancel, false);
};


/**
 * Check whether FastClick is needed.
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.notNeeded = function(layer) {
	'use strict';
	var metaViewport;
	var chromeVersion;

	// Devices that don't support touch don't need FastClick
	if (typeof window.ontouchstart === 'undefined') {
		return true;
	}

	// Chrome version - zero for other browsers
	chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

	if (chromeVersion) {

		if (FastClick.prototype.deviceIsAndroid) {
			metaViewport = document.querySelector('meta[name=viewport]');
			
			if (metaViewport) {
				// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
				if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
					return true;
				}
				// Chrome 32 and above with width=device-width or less don't need FastClick
				if (chromeVersion > 31 && window.innerWidth <= window.screen.width) {
					return true;
				}
			}

		// Chrome desktop doesn't need FastClick (issue #15)
		} else {
			return true;
		}
	}

	// IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
	if (layer.style.msTouchAction === 'none') {
		return true;
	}

	return false;
};


/**
 * Factory method for creating a FastClick object
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.attach = function(layer) {
	'use strict';
	return new FastClick(layer);
};


if (typeof define !== 'undefined' && define.amd) {

	// AMD. Register as an anonymous module.
	define(function() {
		'use strict';
		return FastClick;
	});

	// AMD. Register as an anonymous module.
	define(function() {
		'use strict';
		return death;
	});
} else if (typeof module !== 'undefined' && module.exports) {
	module.exports = FastClick.attach;
	module.exports.FastClick = FastClick;
	module.exports.death = death;
} else {
	window.FastClick = FastClick;
}