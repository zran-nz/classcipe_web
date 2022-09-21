/**
 * {@link https://github.com/muaz-khan/RecordRTC|RecordRTC} is a WebRTC JavaScript library for audio/video as well as screen activity recording. It supports Chrome, Firefox, Opera, Android, and Microsoft Edge. Platforms: Linux, Mac and Windows. 
 * @summary Record audio, video or screen inside the browser.
 * @license {@link https://github.com/muaz-khan/RecordRTC/blob/master/LICENSE|MIT}
 * @author {@link https://MuazKhan.com|Muaz Khan}
 * @typedef RecordRTC
 * @class
 * @example
 * var recorder = RecordRTC(mediaStream or [arrayOfMediaStream], {
 *     type: 'video', // audio or video or gif or canvas
 *     recorderType: MediaStreamRecorder || CanvasRecorder || StereoAudioRecorder || Etc
 * });
 * recorder.startRecording();
 * @see For further information:
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - Single media-stream object, array of media-streams, html-canvas-element, etc.
 * @param {object} config - {type:"video", recorderType: MediaStreamRecorder, disableLogs: true, numberOfAudioChannels: 1, bufferSize: 0, sampleRate: 0, desiredSampRate: 16000, video: HTMLVideoElement, etc.}
 */
function o(e,t){if(!e)throw"First parameter is required.";t=t||{type:"video"},t=new n(e,t);var r=this;function a(a){return t.disableLogs||console.log("RecordRTC version: ",r.version),a&&(t=new n(e,a)),t.disableLogs||console.log("started recording "+t.type+" stream."),h?(h.clearRecordedData(),h.record(),y("recording"),r.recordingDuration&&d(),r):(i((function(){r.recordingDuration&&d()})),r)}function i(r){r&&(t.initCallback=function(){r(),r=t.initCallback=null});var a=new u(e,t);h=new a(e,t),h.record(),y("recording"),t.disableLogs||console.log("Initialized recorderType:",h.constructor.name,"for output-type:",t.type)}function s(e){if(e=e||function(){},h){if("paused"===r.state)return r.resumeRecording(),void setTimeout((function(){s(e)}),1);"recording"===r.state||t.disableLogs||console.warn('Recording state should be: "recording", however current state is: ',r.state),t.disableLogs||console.log("Stopped recording "+t.type+" stream."),"gif"!==t.type?h.stop(a):(h.stop(),a()),y("stopped")}else S();function a(a){if(h){Object.keys(h).forEach((function(e){"function"!==typeof h[e]&&(r[e]=h[e])}));var i=h.blob;if(!i){if(!a)throw"Recording failed.";h.blob=i=a}if(i&&!t.disableLogs&&console.log(i.type,"->",T(i.size)),e){var s;try{s=b.createObjectURL(i)}catch(o){}"function"===typeof e.call?e.call(r,s):e(s)}t.autoWriteToDisk&&l((function(e){var r={};r[t.type+"Blob"]=e,w.Store(r)}))}else"function"===typeof e.call?e.call(r,""):e("")}}function p(){h?"recording"===r.state?(y("paused"),h.pause(),t.disableLogs||console.log("Paused recording.")):t.disableLogs||console.warn("Unable to pause the recording. Recording state: ",r.state):S()}function c(){h?"paused"===r.state?(y("recording"),h.resume(),t.disableLogs||console.log("Resumed recording.")):t.disableLogs||console.warn("Unable to resume the recording. Recording state: ",r.state):S()}function m(e){postMessage((new FileReaderSync).readAsDataURL(e))}function l(e,r){if(!e)throw"Pass a callback function over getDataURL.";var a=r?r.blob:(h||{}).blob;if(!a)return t.disableLogs||console.warn("Blob encoder did not finish its job yet."),void setTimeout((function(){l(e,r)}),1e3);if("undefined"===typeof Worker||navigator.mozGetUserMedia){var i=new FileReader;i.readAsDataURL(a),i.onload=function(t){e(t.target.result)}}else{var s=o(m);s.onmessage=function(t){e(t.data)},s.postMessage(a)}function o(e){try{var t=b.createObjectURL(new Blob([e.toString(),"this.onmessage =  function (eee) {"+e.name+"(eee.data);}"],{type:"application/javascript"})),r=new Worker(t);return b.revokeObjectURL(t),r}catch(a){}}}function d(e){e=e||0,"paused"!==r.state?"stopped"!==r.state&&(e>=r.recordingDuration?s(r.onRecordingStopped):(e+=1e3,setTimeout((function(){d(e)}),1e3))):setTimeout((function(){d(e)}),1e3)}function y(e){r&&(r.state=e,"function"===typeof r.onStateChanged.call?r.onStateChanged.call(r,e):r.onStateChanged(e))}var h,g='It seems that recorder is destroyed or "startRecording" is not invoked for '+t.type+" recorder.";function S(){!0!==t.disableLogs&&console.warn(g)}var f={startRecording:a,stopRecording:s,pauseRecording:p,resumeRecording:c,initRecorder:i,setRecordingDuration:function(e,t){if("undefined"===typeof e)throw"recordingDuration is required.";if("number"!==typeof e)throw"recordingDuration must be a number.";return r.recordingDuration=e,r.onRecordingStopped=t||function(){},{onRecordingStopped:function(e){r.onRecordingStopped=e}}},clearRecordedData:function(){h?(h.clearRecordedData(),t.disableLogs||console.log("Cleared old recorded data.")):S()},getBlob:function(){if(h)return h.blob;S()},getDataURL:l,toURL:function(){if(h)return b.createObjectURL(h.blob);S()},getInternalRecorder:function(){return h},save:function(e){h?C(h.blob,e):S()},getFromDisk:function(e){h?o.getFromDisk(t.type,e):S()},setAdvertisementArray:function(e){t.advertisement=[];for(var r=e.length,a=0;a<r;a++)t.advertisement.push({duration:a,image:e[a]})},blob:null,bufferSize:0,sampleRate:0,buffer:null,reset:function(){"recording"!==r.state||t.disableLogs||console.warn("Stop an active recorder."),h&&"function"===typeof h.clearRecordedData&&h.clearRecordedData(),h=null,y("inactive"),r.blob=null},onStateChanged:function(e){t.disableLogs||console.log("Recorder state changed:",e)},state:"inactive",getState:function(){return r.state},destroy:function(){var e=t.disableLogs;t={disableLogs:!0},r.reset(),y("destroyed"),f=r=null,D.AudioContextConstructor&&(D.AudioContextConstructor.close(),D.AudioContextConstructor=null),t.disableLogs=e,t.disableLogs||console.log("RecordRTC is destroyed.")},version:"5.6.2"};if(!this)return r=f,f;for(var I in f)this[I]=f[I];return r=this,f}
/**
 * {@link RecordRTCConfiguration} is an inner/private helper for {@link RecordRTC}.
 * @summary It configures the 2nd parameter passed over {@link RecordRTC} and returns a valid "config" object.
 * @license {@link https://github.com/muaz-khan/RecordRTC/blob/master/LICENSE|MIT}
 * @author {@link https://MuazKhan.com|Muaz Khan}
 * @typedef RecordRTCConfiguration
 * @class
 * @example
 * var options = RecordRTCConfiguration(mediaStream, options);
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 * @param {object} config - {type:"video", disableLogs: true, numberOfAudioChannels: 1, bufferSize: 0, sampleRate: 0, video: HTMLVideoElement, getNativeBlob:true, etc.}
 */
function n(e,t){return t.recorderType||t.type||(t.audio&&t.video?t.type="video":t.audio&&!t.video&&(t.type="audio")),t.recorderType&&!t.type&&(t.recorderType===M||t.recorderType===E||"undefined"!==typeof O&&t.recorderType===O?t.type="video":t.recorderType===G?t.type="gif":t.recorderType===q?t.type="audio":t.recorderType===P&&(v(e,"audio").length&&v(e,"video").length||!v(e,"audio").length&&v(e,"video").length?t.type="video":v(e,"audio").length&&!v(e,"video").length&&(t.type="audio"))),"undefined"!==typeof P&&"undefined"!==typeof MediaRecorder&&"requestData"in MediaRecorder.prototype&&(t.mimeType||(t.mimeType="video/webm"),t.type||(t.type=t.mimeType.split("/")[0]),t.bitsPerSecond),t.type||(t.mimeType&&(t.type=t.mimeType.split("/")[0]),t.type||(t.type="audio")),t}
/**
 * {@link GetRecorderType} is an inner/private helper for {@link RecordRTC}.
 * @summary It returns best recorder-type available for your browser.
 * @license {@link https://github.com/muaz-khan/RecordRTC/blob/master/LICENSE|MIT}
 * @author {@link https://MuazKhan.com|Muaz Khan}
 * @typedef GetRecorderType
 * @class
 * @example
 * var RecorderType = GetRecorderType(options);
 * var recorder = new RecorderType(options);
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 * @param {object} config - {type:"video", disableLogs: true, numberOfAudioChannels: 1, bufferSize: 0, sampleRate: 0, video: HTMLVideoElement, etc.}
 */function u(e,t){var r;return(f||h||g)&&(r=q),"undefined"!==typeof MediaRecorder&&"requestData"in MediaRecorder.prototype&&!f&&(r=P),"video"===t.type&&(f||g)&&(r=M,"undefined"!==typeof O&&"undefined"!==typeof ReadableStream&&(r=O)),"gif"===t.type&&(r=G),"canvas"===t.type&&(r=E),x()&&r!==E&&r!==G&&"undefined"!==typeof MediaRecorder&&"requestData"in MediaRecorder.prototype&&(v(e,"video").length||v(e,"audio").length)&&("audio"===t.type?"function"===typeof MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported("audio/webm")&&(r=P):"function"===typeof MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported("video/webm")&&(r=P)),e instanceof Array&&e.length&&(r=B),t.recorderType&&(r=t.recorderType),!t.disableLogs&&r&&r.name&&console.log("Using recorderType:",r.name||r.constructor.name),!r&&I&&(r=P),r}
/**
 * MRecordRTC runs on top of {@link RecordRTC} to bring multiple recordings in a single place, by providing simple API.
 * @summary MRecordRTC stands for "Multiple-RecordRTC".
 * @license {@link https://github.com/muaz-khan/RecordRTC/blob/master/LICENSE|MIT}
 * @author {@link https://MuazKhan.com|Muaz Khan}
 * @typedef MRecordRTC
 * @class
 * @example
 * var recorder = new MRecordRTC();
 * recorder.addStream(MediaStream);
 * recorder.mediaType = {
 *     audio: true, // or StereoAudioRecorder or MediaStreamRecorder
 *     video: true, // or WhammyRecorder or MediaStreamRecorder or WebAssemblyRecorder or CanvasRecorder
 *     gif: true    // or GifRecorder
 * };
 * // mimeType is optional and should be set only in advance cases.
 * recorder.mimeType = {
 *     audio: 'audio/wav',
 *     video: 'video/webm',
 *     gif:   'image/gif'
 * };
 * recorder.startRecording();
 * @see For further information:
 * @see {@link https://github.com/muaz-khan/RecordRTC/tree/master/MRecordRTC|MRecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 * @requires {@link RecordRTC}
/**
 * Storage is a standalone object used by {@link RecordRTC} to store reusable objects e.g. "new AudioContext".
 * @license {@link https://github.com/muaz-khan/RecordRTC/blob/master/LICENSE|MIT}
 * @author {@link https://MuazKhan.com|Muaz Khan}
 * @example
 * Storage.AudioContext === webkitAudioContext
 * @property {webkitAudioContext} AudioContext - Keeps a reference to AudioContext object.
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 */
var D={};function x(){if(S||I||h)return!0;navigator.appVersion;var e,t,r=navigator.userAgent,a=""+parseFloat(navigator.appVersion),i=parseInt(navigator.appVersion,10);return(f||g)&&(e=r.indexOf("Chrome"),a=r.substring(e+7)),-1!==(t=a.indexOf(";"))&&(a=a.substring(0,t)),-1!==(t=a.indexOf(" "))&&(a=a.substring(0,t)),i=parseInt(""+a,10),isNaN(i)&&(a=""+parseFloat(navigator.appVersion),i=parseInt(navigator.appVersion,10)),i>=49}
/**
 * MediaStreamRecorder is an abstraction layer for {@link https://w3c.github.io/mediacapture-record/MediaRecorder.html|MediaRecorder API}. It is used by {@link RecordRTC} to record MediaStream(s) in both Chrome and Firefox.
 * @summary Runs top over {@link https://w3c.github.io/mediacapture-record/MediaRecorder.html|MediaRecorder API}.
 * @license {@link https://github.com/muaz-khan/RecordRTC/blob/master/LICENSE|MIT}
 * @author {@link https://github.com/muaz-khan|Muaz Khan}
 * @typedef MediaStreamRecorder
 * @class
 * @example
 * var config = {
 *     mimeType: 'video/webm', // vp8, vp9, h264, mkv, opus/vorbis
 *     audioBitsPerSecond : 256 * 8 * 1024,
 *     videoBitsPerSecond : 256 * 8 * 1024,
 *     bitsPerSecond: 256 * 8 * 1024,  // if this is provided, skip above two
 *     checkForInactiveTracks: true,
 *     timeSlice: 1000, // concatenate intervals based blobs
 *     ondataavailable: function() {} // get intervals based blobs
 * }
 * var recorder = new MediaStreamRecorder(mediaStream, config);
 * recorder.record();
 * recorder.stop(function(blob) {
 *     video.src = URL.createObjectURL(blob);
 *
 *     // or
 *     var blob = recorder.blob;
 * });
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {object} config - {disableLogs:true, initCallback: function, mimeType: "video/webm", timeSlice: 1000}
/**
 * @class
 * @example