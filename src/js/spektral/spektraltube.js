//////////////////////
////Spektral Tube
//////////////////////
function SpektralTube(id, container, paramObj) {

    //Private Var
    var player, stID = id,
        videoID,
        playerWidth, playerHeight,
        done = false,
        playerReadyEvent, playerState = 'UNSTARTED',
        autoplay = false;

    //Public Var
    this.id = id;

    //Private functions
    function initPlayer() {
        //Create playerready event
        playerReadyEvent = createEvent('playerready')

        //Inject iframe API
        injectIframeAPI();
        //trace('initPlayer');
    }

    function injectIframeAPI() {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        //trace('injectIframeAPI');
    }

    function onPlayerReady(event) {
        player = event.target;
        if(autoplay === true) {
        	player.playVideo();
        }
        triggerEvent(window, playerReadyEvent)
            //trace('onPlayerReady');
    }

    function onPlayerPlaybackQualityChange(event) {
        trace("Quality Change: " + event.data);
    }

    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
            setTimeout(this.stop, 6000);
            done = true;
        }
        if (event.data === -1) {
            playerState = 'UNSTARTED';
        } else if (event.data === 0) {
            playerState = 'ENDED';
        } else if (event.data === 1) {
            playerState = 'PLAYING';
        } else if (event.data === 2) {
            playerState = 'PAUSED';
        } else if (event.data === 3) {
            playerState = 'BUFFERING';
        } else if (event.data === 5) {
            playerState = 'VIDEO_CUED';
        }
        //trace('onPlayerStateChange: ' + playerState);
    }

    function onPlayerError(event) {
        trace('Player Error: ' + event.data);
    }

    //Public functions
    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player(container, {
            width: playerWidth,
            height: playerHeight,
            videoId: videoID,
            suggestedQuality: 'small',
            events: {
                'onReady': onPlayerReady,
                'onPlaybackQualityChange': onPlayerPlaybackQualityChange,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });
        //trace('onYouTubeIframeAPIReady');
    }

    this.loadVideo = function(url, start, quality) {
        start = start || 0;
        quality = quality || 'large';
        player.loadVideoById(url, start, quality);
    }

    this.onReady = function(callback) {
        attachEventListener(window, 'playerready', callback);
    }

    this.play = function() {
        player.playVideo();
        //trace('Play');
    }

    this.stop = function() {
        player.stopVideo();
        //trace('Play');
    }

    this.pause = function() {
        player.pauseVideo();
    }

    this.seek = function(seekNum, seekAhead) {
        seekAhead = seekAhead || true;
        player.seekTo(seekNum, seekAhead);
    }

    this.volume = function(level) {
        //trace('ID is: ' + id);
        //trace("volume: " + level);
        player.setVolume(level);
    }

    this.getVolume = function() {
        return player.getVolume();
    }

    this.toggleMute = function() {
        var muted = player.isMuted();
        if (muted === true) {
            player.unMute();
        } else {
            player.mute();
        }
    }

    this.getMuted = function() {
        return player.isMuted;
    }

    this.getPlayerState = function() {
        return playerState;
    }

    this.getVideoDuration = function() {
        return player.getDuration();
    }

    this.getTimeCurrent = function() {
        return player.getCurrentTime();
    }

    this.getPlayerIFrame = function() {
        return player.getIframe();
    }

    //Utils
    ////////////////////
    ////GET PARAMETER
    ////////////////////
    function getParameter(obj, val, defaultParam) {
        var retrievedParam;
        if (obj !== undefined) {
            if (obj[val] === undefined) {
                retrievedParam = defaultParam;
                //trace("getParameter: val was not found, setting to default.")
            } else {
                retrievedParam = obj[val];
                //trace("getParameter: val found.")
            }
        } else {
            retrievedParam = defaultParam;
            //trace("getParameter: object was not defined, setting val to default.")
        }
        return retrievedParam;
    }

    //////////////////
    ////CREATE EVENT
    /////////////////
    function createEvent(eventName, detail, bub, can) {
        detail = detail || null;
        bub = bub || true;
        can = can || true;

        var evt;
        evt = new CustomEvent(eventName, {
            detail: detail,
            bubbles: bub,
            cancelable: can
        });
        if (evt === undefined) {
            evt = new Event(eventName);
        }
        return evt;
    }

    //////////////////
    ////TRIGGER EVENT
    /////////////////
    function triggerEvent(obj, evt) {
        obj.dispatchEvent(evt);
    }

    //////////////////
    ////ATTACH EVENT LISTENER
    /////////////////
    function attachEventListener(eventTarget, eventType, eventHandler) {
        if (eventTarget.addEventListener) {
            eventTarget.addEventListener(eventType, eventHandler, false);
        } else if (eventTarget.attachEvent) {
            eventType = "on" + eventType;
            eventTarget.attachEvent(eventType, eventHandler);
        } else {
            eventTarget["on" + eventType] = eventHandler;
        }
    }

    //////////////////
    ////DETACH EVENT LISTENER
    /////////////////
    function detachEventListener(eventTarget, eventType, eventHandler) {
        if (eventTarget.removeEventListener) {
            eventTarget.removeEventListener(eventType, eventHandler, false);
        } else if (eventTarget.detachEvent) {
            eventType = "on" + eventType;
            eventTarget.detachEvent(eventType, eventHandler);
        } else {
            eventTarget["on" + eventType] = null;
        }
    }

    ////////////////////
    ////GET QUERY STRING
    ////////////////////
    function getQueryString(url) {

        var
            queryParams = {},
            queryString, valArray, i, value, hasAnd;

        queryString = url.split("?").pop();

        console.log("queryString: " + queryString);

        hasAnd = detectCharacter(queryString, "&");
        if (hasAnd === true) {
            valArray = splitString(queryString, "&");
            for (i = 0; i < valArray.length; i += 1) {
                value = splitString(valArray[i], "=");
                queryParams[value[0]] = value[1];
            }
        } else {
            value = splitString(queryString, "=");
            queryParams[value[0]] = value[1];
        }
        return queryParams;
    }

    //////////////////
    ////SPLIT STRING
    //////////////////
    function splitString(request, character) {

        character = character || ",";

        var
            splitArray = [],
            split,
            i, detectChar = detectCharacter(request, character),
            stripped;

        if (detectChar === false && character !== " ") {
            //Spektral.throwError("splitString: Could not split string because character [" + character + "] was not in string.");
            trace("splitString: Could not split string because character [" + character + "] was not in string.", "warn");
        } else {
            if (character !== " ") {
                split = request.split(character);
            } else {
                split = request.split(/[ ,]+/);
            }
        }

        for (i = 0; i < split.length; i += 1) {
            if (split[i] !== "") {
                stripped = stripWhiteSpace(split[i]);
                splitArray.push(stripped);
            }
        }
        return splitArray;
    }

    //////////////////
    ////DETECT CHARACTER
    //////////////////
    function detectCharacter(request, character) {
        var detected = false,
            test = request.match(character);
        if (test !== null) {
            detected = true;
        }
        return detected;
    }

    //////////////////
    ////STRIP WHITE SPACE
    //////////////////
    function stripWhiteSpace(request, removeAll) {
        removeAll = removeAll || false;
        var newString;
        if (removeAll !== false) {
            newString = request.replace(/\s+/g, '');
        } else {
            newString = request.replace(/(^\s+|\s+$)/g, '');
        }
        return newString;
    }

    ////////////////////
    ////TRACE
    ////////////////////
    function trace(message, method, obj) {
        message = 'SpektralTube: ' + stID + ": " + message;
        if (method === 'dir') {
            console.log(message);
            console.dir(obj);
        } else {
            console.log(message);
        }
    }

    //Parameters
    videoID = getParameter(paramObj, 'videoID', 'b7mixrO2lzA');
    playerWidth = getParameter(paramObj, 'width', 640);
    playerHeight = getParameter(paramObj, 'height', 390);

    trace("Parameters:" +
        " videoID: " + videoID +
        " playerWidth: " + playerWidth +
        " playerHeight: " + playerHeight);

    //Constructor
    initPlayer();

    trace("Spektral Tube: id: " + stID + " info: " + JSON.stringify(this));
}(window);
