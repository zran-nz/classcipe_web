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
function n(e,t){return t.recorderType||t.type||(t.audio&&t.video?t.type="video":t.audio&&!t.video&&(t.type="audio")),t.recorderType&&!t.type&&(t.recorderType===M||t.recorderType===E||"undefined"!==typeof O&&t.recorderType===O?t.type="video":t.recorderType===G?t.type="gif":t.recorderType===q?t.type="audio":t.recorderType===x&&(v(e,"audio").length&&v(e,"video").length||!v(e,"audio").length&&v(e,"video").length?t.type="video":v(e,"audio").length&&!v(e,"video").length&&(t.type="audio"))),"undefined"!==typeof x&&"undefined"!==typeof MediaRecorder&&"requestData"in MediaRecorder.prototype&&(t.mimeType||(t.mimeType="video/webm"),t.type||(t.type=t.mimeType.split("/")[0]),t.bitsPerSecond),t.type||(t.mimeType&&(t.type=t.mimeType.split("/")[0]),t.type||(t.type="audio")),t}
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
 */function u(e,t){var r;return(f||h||g)&&(r=q),"undefined"!==typeof MediaRecorder&&"requestData"in MediaRecorder.prototype&&!f&&(r=x),"video"===t.type&&(f||g)&&(r=M,"undefined"!==typeof O&&"undefined"!==typeof ReadableStream&&(r=O)),"gif"===t.type&&(r=G),"canvas"===t.type&&(r=E),P()&&r!==E&&r!==G&&"undefined"!==typeof MediaRecorder&&"requestData"in MediaRecorder.prototype&&(v(e,"video").length||v(e,"audio").length)&&("audio"===t.type?"function"===typeof MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported("audio/webm")&&(r=x):"function"===typeof MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported("video/webm")&&(r=x)),e instanceof Array&&e.length&&(r=_),t.recorderType&&(r=t.recorderType),!t.disableLogs&&r&&r.name&&console.log("Using recorderType:",r.name||r.constructor.name),!r&&I&&(r=x),r}
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
 */function p(e){this.addStream=function(t){t&&(e=t)},this.mediaType={audio:!0,video:!0},this.startRecording=function(){var t,r=this.mediaType,a=this.mimeType||{audio:null,video:null,gif:null};if("function"!==typeof r.audio&&P()&&!v(e,"audio").length&&(r.audio=!1),"function"!==typeof r.video&&P()&&!v(e,"video").length&&(r.video=!1),"function"!==typeof r.gif&&P()&&!v(e,"video").length&&(r.gif=!1),!r.audio&&!r.video&&!r.gif)throw"MediaStream must have either audio or video tracks.";if(r.audio&&(t=null,"function"===typeof r.audio&&(t=r.audio),this.audioRecorder=new o(e,{type:"audio",bufferSize:this.bufferSize,sampleRate:this.sampleRate,numberOfAudioChannels:this.numberOfAudioChannels||2,disableLogs:this.disableLogs,recorderType:t,mimeType:a.audio,timeSlice:this.timeSlice,onTimeStamp:this.onTimeStamp}),r.video||this.audioRecorder.startRecording()),r.video){t=null,"function"===typeof r.video&&(t=r.video);var i=e;if(P()&&r.audio&&"function"===typeof r.audio){var s=v(e,"video")[0];S?(i=new N,i.addTrack(s),t&&t===M&&(t=x)):(i=new N,i.addTrack(s))}this.videoRecorder=new o(i,{type:"video",video:this.video,canvas:this.canvas,frameInterval:this.frameInterval||10,disableLogs:this.disableLogs,recorderType:t,mimeType:a.video,timeSlice:this.timeSlice,onTimeStamp:this.onTimeStamp,workerPath:this.workerPath,webAssemblyPath:this.webAssemblyPath,frameRate:this.frameRate,bitrate:this.bitrate}),r.audio||this.videoRecorder.startRecording()}if(r.audio&&r.video){var n=this,u=!0===P();(r.audio instanceof q&&r.video||!0!==r.audio&&!0!==r.video&&r.audio!==r.video)&&(u=!1),!0===u?(n.audioRecorder=null,n.videoRecorder.startRecording()):n.videoRecorder.initRecorder((function(){n.audioRecorder.initRecorder((function(){n.videoRecorder.startRecording(),n.audioRecorder.startRecording()}))}))}r.gif&&(t=null,"function"===typeof r.gif&&(t=r.gif),this.gifRecorder=new o(e,{type:"gif",frameRate:this.frameRate||200,quality:this.quality||10,disableLogs:this.disableLogs,recorderType:t,mimeType:a.gif}),this.gifRecorder.startRecording())},this.stopRecording=function(e){e=e||function(){},this.audioRecorder&&this.audioRecorder.stopRecording((function(t){e(t,"audio")})),this.videoRecorder&&this.videoRecorder.stopRecording((function(t){e(t,"video")})),this.gifRecorder&&this.gifRecorder.stopRecording((function(t){e(t,"gif")}))},this.pauseRecording=function(){this.audioRecorder&&this.audioRecorder.pauseRecording(),this.videoRecorder&&this.videoRecorder.pauseRecording(),this.gifRecorder&&this.gifRecorder.pauseRecording()},this.resumeRecording=function(){this.audioRecorder&&this.audioRecorder.resumeRecording(),this.videoRecorder&&this.videoRecorder.resumeRecording(),this.gifRecorder&&this.gifRecorder.resumeRecording()},this.getBlob=function(e){var t={};return this.audioRecorder&&(t.audio=this.audioRecorder.getBlob()),this.videoRecorder&&(t.video=this.videoRecorder.getBlob()),this.gifRecorder&&(t.gif=this.gifRecorder.getBlob()),e&&e(t),t},this.destroy=function(){this.audioRecorder&&(this.audioRecorder.destroy(),this.audioRecorder=null),this.videoRecorder&&(this.videoRecorder.destroy(),this.videoRecorder=null),this.gifRecorder&&(this.gifRecorder.destroy(),this.gifRecorder=null)},this.getDataURL=function(e){function t(e,t){if("undefined"!==typeof Worker){var a=r((function(e){postMessage((new FileReaderSync).readAsDataURL(e))}));a.onmessage=function(e){t(e.data)},a.postMessage(e)}else{var i=new FileReader;i.readAsDataURL(e),i.onload=function(e){t(e.target.result)}}}function r(e){var t,r=b.createObjectURL(new Blob([e.toString(),"this.onmessage =  function (eee) {"+e.name+"(eee.data);}"],{type:"application/javascript"})),a=new Worker(r);if("undefined"!==typeof b)t=b;else{if("undefined"===typeof webkitURL)throw"Neither URL nor webkitURL detected.";t=webkitURL}return t.revokeObjectURL(r),a}this.getBlob((function(r){r.audio&&r.video?t(r.audio,(function(a){t(r.video,(function(t){e({audio:a,video:t})}))})):r.audio?t(r.audio,(function(t){e({audio:t})})):r.video&&t(r.video,(function(t){e({video:t})}))}))},this.writeToDisk=function(){o.writeToDisk({audio:this.audioRecorder,video:this.videoRecorder,gif:this.gifRecorder})},this.save=function(e){e=e||{audio:!0,video:!0,gif:!0},e.audio&&this.audioRecorder&&this.audioRecorder.save("string"===typeof e.audio?e.audio:""),e.video&&this.videoRecorder&&this.videoRecorder.save("string"===typeof e.video?e.video:""),e.gif&&this.gifRecorder&&this.gifRecorder.save("string"===typeof e.gif?e.gif:"")}}o.version="5.6.2",e.exports=o,i=[],s=function(){return o}.apply(t,i),void 0===s||(e.exports=s),o.getFromDisk=function(e,t){if(!t)throw"callback is mandatory.";console.log("Getting recorded "+("all"===e?"blobs":e+" blob ")+" from disk!"),w.Fetch((function(r,a){"all"!==e&&a===e+"Blob"&&t&&t(r),"all"===e&&t&&t(r,a.replace("Blob",""))}))},o.writeToDisk=function(e){console.log("Writing recorded blob(s) to disk!"),e=e||{},e.audio&&e.video&&e.gif?e.audio.getDataURL((function(t){e.video.getDataURL((function(r){e.gif.getDataURL((function(e){w.Store({audioBlob:t,videoBlob:r,gifBlob:e})}))}))})):e.audio&&e.video?e.audio.getDataURL((function(t){e.video.getDataURL((function(e){w.Store({audioBlob:t,videoBlob:e})}))})):e.audio&&e.gif?e.audio.getDataURL((function(t){e.gif.getDataURL((function(e){w.Store({audioBlob:t,gifBlob:e})}))})):e.video&&e.gif?e.video.getDataURL((function(t){e.gif.getDataURL((function(e){w.Store({videoBlob:t,gifBlob:e})}))})):e.audio?e.audio.getDataURL((function(e){w.Store({audioBlob:e})})):e.video?e.video.getDataURL((function(e){w.Store({videoBlob:e})})):e.gif&&e.gif.getDataURL((function(e){w.Store({gifBlob:e})}))},p.getFromDisk=o.getFromDisk,p.writeToDisk=o.writeToDisk,"undefined"!==typeof o&&(o.MRecordRTC=p);var c="Fake/5.0 (FakeOS) AppleWebKit/123 (KHTML, like Gecko) Fake/12.3.4567.89 Fake/123.45";(function(e){e&&"undefined"===typeof window&&"undefined"!==typeof r&&(r.navigator={userAgent:c,getUserMedia:function(){}},r.console||(r.console={}),"undefined"!==typeof r.console.log&&"undefined"!==typeof r.console.error||(r.console.error=r.console.log=r.console.log||function(){console.log(arguments)}),"undefined"===typeof document&&(e.document={documentElement:{appendChild:function(){return""}}},document.createElement=document.captureStream=document.mozCaptureStream=function(){var e={getContext:function(){return e},play:function(){},pause:function(){},drawImage:function(){},toDataURL:function(){return""},style:{}};return e},e.HTMLVideoElement=function(){}),"undefined"===typeof location&&(e.location={protocol:"file:",href:"",hash:""}),"undefined"===typeof screen&&(e.screen={width:0,height:0}),"undefined"===typeof b&&(e.URL={createObjectURL:function(){return""},revokeObjectURL:function(){return""}}),e.window=r)})("undefined"!==typeof r?r:null);var m=window.requestAnimationFrame;if("undefined"===typeof m)if("undefined"!==typeof webkitRequestAnimationFrame)m=webkitRequestAnimationFrame;else if("undefined"!==typeof mozRequestAnimationFrame)m=mozRequestAnimationFrame;else if("undefined"!==typeof msRequestAnimationFrame)m=msRequestAnimationFrame;else if("undefined"===typeof m){var l=0;m=function(e,t){var r=(new Date).getTime(),a=Math.max(0,16-(r-l)),i=setTimeout((function(){e(r+a)}),a);return l=r+a,i}}var d=window.cancelAnimationFrame;"undefined"===typeof d&&("undefined"!==typeof webkitCancelAnimationFrame?d=webkitCancelAnimationFrame:"undefined"!==typeof mozCancelAnimationFrame?d=mozCancelAnimationFrame:"undefined"!==typeof msCancelAnimationFrame?d=msCancelAnimationFrame:"undefined"===typeof d&&(d=function(e){clearTimeout(e)}));var y=window.AudioContext;"undefined"===typeof y&&("undefined"!==typeof webkitAudioContext&&(y=webkitAudioContext),"undefined"!==typeof mozAudioContext&&(y=mozAudioContext));var b=window.URL;"undefined"===typeof b&&"undefined"!==typeof webkitURL&&(b=webkitURL),"undefined"!==typeof navigator&&"undefined"===typeof navigator.getUserMedia&&("undefined"!==typeof navigator.webkitGetUserMedia&&(navigator.getUserMedia=navigator.webkitGetUserMedia),"undefined"!==typeof navigator.mozGetUserMedia&&(navigator.getUserMedia=navigator.mozGetUserMedia));var h=-1!==navigator.userAgent.indexOf("Edge")&&(!!navigator.msSaveBlob||!!navigator.msSaveOrOpenBlob),g=!!window.opera||-1!==navigator.userAgent.indexOf("OPR/"),S=navigator.userAgent.toLowerCase().indexOf("firefox")>-1&&"netscape"in window&&/ rv:/.test(navigator.userAgent),f=!g&&!h&&!!navigator.webkitGetUserMedia||k()||-1!==navigator.userAgent.toLowerCase().indexOf("chrome/"),I=/^((?!chrome|android).)*safari/i.test(navigator.userAgent);I&&!f&&-1!==navigator.userAgent.indexOf("CriOS")&&(I=!1,f=!0);var N=window.MediaStream;function T(e){var t=1e3,r=["Bytes","KB","MB","GB","TB"];if(0===e)return"0 Bytes";var a=parseInt(Math.floor(Math.log(e)/Math.log(t)),10);return(e/Math.pow(t,a)).toPrecision(3)+" "+r[a]}function C(e,t){if(!e)throw"Blob object is required.";if(!e.type)try{e.type="video/webm"}catch(o){}var r=(e.type||"video/webm").split("/")[1];if(-1!==r.indexOf(";")&&(r=r.split(";")[0]),t&&-1!==t.indexOf(".")){var a=t.split(".");t=a[0],r=a[1]}var i=(t||Math.round(9999999999*Math.random())+888888888)+"."+r;if("undefined"!==typeof navigator.msSaveOrOpenBlob)return navigator.msSaveOrOpenBlob(e,i);if("undefined"!==typeof navigator.msSaveBlob)return navigator.msSaveBlob(e,i);var s=document.createElement("a");s.href=b.createObjectURL(e),s.download=i,s.style="display:none;opacity:0;color:transparent;",(document.body||document.documentElement).appendChild(s),"function"===typeof s.click?s.click():(s.target="_blank",s.dispatchEvent(new MouseEvent("click",{view:window,bubbles:!0,cancelable:!0}))),b.revokeObjectURL(s.href)}function k(){return"undefined"!==typeof window&&"object"===typeof window.process&&"renderer"===window.process.type||(!("undefined"===typeof a||"object"!==typeof a.versions||!a.versions.electron)||"object"===typeof navigator&&"string"===typeof navigator.userAgent&&navigator.userAgent.indexOf("Electron")>=0)}function v(e,t){return e&&e.getTracks?e.getTracks().filter((function(e){return e.kind===(t||"audio")})):[]}function A(e,t){"srcObject"in t?t.srcObject=e:"mozSrcObject"in t?t.mozSrcObject=e:t.srcObject=e}function R(e,t){if("undefined"===typeof EBML)throw new Error("Please link: https://www.webrtc-experiment.com/EBML.js");var r=new EBML.Reader,a=new EBML.Decoder,i=EBML.tools,s=new FileReader;s.onload=function(e){var s=a.decode(this.result);s.forEach((function(e){r.read(e)})),r.stop();var o=i.makeMetadataSeekable(r.metadatas,r.duration,r.cues),n=this.result.slice(r.metadataSize),u=new Blob([o,n],{type:"video/webm"});t(u)},s.readAsArrayBuffer(e)}"undefined"===typeof N&&"undefined"!==typeof webkitMediaStream&&(N=webkitMediaStream),"undefined"!==typeof N&&"undefined"===typeof N.prototype.stop&&(N.prototype.stop=function(){this.getTracks().forEach((function(e){e.stop()}))}),"undefined"!==typeof o&&(o.invokeSaveAsDialog=C,o.getTracks=v,o.getSeekableBlob=R,o.bytesToSize=T,o.isElectron=k);
/**
 * Storage is a standalone object used by {@link RecordRTC} to store reusable objects e.g. "new AudioContext".
 * @license {@link https://github.com/muaz-khan/RecordRTC/blob/master/LICENSE|MIT}
 * @author {@link https://MuazKhan.com|Muaz Khan}
 * @example
 * Storage.AudioContext === webkitAudioContext
 * @property {webkitAudioContext} AudioContext - Keeps a reference to AudioContext object.
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 */
var D={};function P(){if(S||I||h)return!0;navigator.appVersion;var e,t,r=navigator.userAgent,a=""+parseFloat(navigator.appVersion),i=parseInt(navigator.appVersion,10);return(f||g)&&(e=r.indexOf("Chrome"),a=r.substring(e+7)),-1!==(t=a.indexOf(";"))&&(a=a.substring(0,t)),-1!==(t=a.indexOf(" "))&&(a=a.substring(0,t)),i=parseInt(""+a,10),isNaN(i)&&(a=""+parseFloat(navigator.appVersion),i=parseInt(navigator.appVersion,10)),i>=49}
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
 * @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 * @param {object} config - {disableLogs:true, initCallback: function, mimeType: "video/webm", timeSlice: 1000}
 * @throws Will throw an error if first argument "MediaStream" is missing. Also throws error if "MediaRecorder API" are not supported by the browser.
 */function x(e,t){var r=this;if("undefined"===typeof e)throw'First argument "MediaStream" is required.';if("undefined"===typeof MediaRecorder)throw"Your browser does not support the Media Recorder API. Please try other modules e.g. WhammyRecorder or StereoAudioRecorder.";if(t=t||{mimeType:"video/webm"},"audio"===t.type){var a;if(v(e,"video").length&&v(e,"audio").length)navigator.mozGetUserMedia?(a=new N,a.addTrack(v(e,"audio")[0])):a=new N(v(e,"audio")),e=a;t.mimeType&&-1!==t.mimeType.toString().toLowerCase().indexOf("audio")||(t.mimeType=f?"audio/webm":"audio/ogg"),t.mimeType&&"audio/ogg"!==t.mimeType.toString().toLowerCase()&&navigator.mozGetUserMedia&&(t.mimeType="audio/ogg")}var i,s=[];function o(){r.timestamps.push((new Date).getTime()),"function"===typeof t.onTimeStamp&&t.onTimeStamp(r.timestamps[r.timestamps.length-1],r.timestamps)}function n(e){return i&&i.mimeType?i.mimeType:e.mimeType||"video/webm"}function u(){s=[],i=null,r.timestamps=[]}function p(){if("active"in e){if(!e.active)return!1}else if("ended"in e&&e.ended)return!1;return!0}this.getArrayOfBlobs=function(){return s},this.record=function(){r.blob=null,r.clearRecordedData(),r.timestamps=[],c=[],s=[];var a=t;t.disableLogs||console.log("Passing following config over MediaRecorder API.",a),i&&(i=null),f&&!P()&&(a="video/vp8"),"function"===typeof MediaRecorder.isTypeSupported&&a.mimeType&&(MediaRecorder.isTypeSupported(a.mimeType)||(t.disableLogs||console.warn("MediaRecorder API seems unable to record mimeType:",a.mimeType),a.mimeType="audio"===t.type?"audio/webm":"video/webm"));try{i=new MediaRecorder(e,a),t.mimeType=a.mimeType}catch(u){i=new MediaRecorder(e)}a.mimeType&&!MediaRecorder.isTypeSupported&&"canRecordMimeType"in i&&!1===i.canRecordMimeType(a.mimeType)&&(t.disableLogs||console.warn("MediaRecorder API seems unable to record mimeType:",a.mimeType)),i.ondataavailable=function(e){if(e.data&&c.push("ondataavailable: "+T(e.data.size)),"number"!==typeof t.timeSlice)!e.data||!e.data.size||e.data.size<100||r.blob?r.recordingCallback&&(r.recordingCallback(new Blob([],{type:n(a)})),r.recordingCallback=null):(r.blob=t.getNativeBlob?e.data:new Blob([e.data],{type:n(a)}),r.recordingCallback&&(r.recordingCallback(r.blob),r.recordingCallback=null));else if(e.data&&e.data.size&&(s.push(e.data),o(),"function"===typeof t.ondataavailable)){var i=t.getNativeBlob?e.data:new Blob([e.data],{type:n(a)});t.ondataavailable(i)}},i.onstart=function(){c.push("started")},i.onpause=function(){c.push("paused")},i.onresume=function(){c.push("resumed")},i.onstop=function(){c.push("stopped")},i.onerror=function(e){e&&(e.name||(e.name="UnknownError"),c.push("error: "+e),t.disableLogs||(-1!==e.name.toString().toLowerCase().indexOf("invalidstate")?console.error("The MediaRecorder is not in a state in which the proposed operation is allowed to be executed.",e):-1!==e.name.toString().toLowerCase().indexOf("notsupported")?console.error("MIME type (",a.mimeType,") is not supported.",e):-1!==e.name.toString().toLowerCase().indexOf("security")?console.error("MediaRecorder security error",e):"OutOfMemory"===e.name?console.error("The UA has exhaused the available memory. User agents SHOULD provide as much additional information as possible in the message attribute.",e):"IllegalStreamModification"===e.name?console.error("A modification to the stream has occurred that makes it impossible to continue recording. An example would be the addition of a Track while recording is occurring. User agents SHOULD provide as much additional information as possible in the message attribute.",e):"OtherRecordingError"===e.name?console.error("Used for an fatal error other than those listed above. User agents SHOULD provide as much additional information as possible in the message attribute.",e):"GenericError"===e.name?console.error("The UA cannot provide the codec or recording option that has been requested.",e):console.error("MediaRecorder Error",e)),function(e){if(!r.manuallyStopped&&i&&"inactive"===i.state)return delete t.timeslice,void i.start(6e5);setTimeout(e,1e3)}(),"inactive"!==i.state&&"stopped"!==i.state&&i.stop())},"number"===typeof t.timeSlice?(o(),i.start(t.timeSlice)):i.start(36e5),t.initCallback&&t.initCallback()},this.timestamps=[],this.stop=function(e){e=e||function(){},r.manuallyStopped=!0,i&&(this.recordingCallback=e,"recording"===i.state&&i.stop(),"number"===typeof t.timeSlice&&setTimeout((function(){r.blob=new Blob(s,{type:n(t)}),r.recordingCallback(r.blob)}),100))},this.pause=function(){i&&"recording"===i.state&&i.pause()},this.resume=function(){i&&"paused"===i.state&&i.resume()},this.clearRecordedData=function(){i&&"recording"===i.state&&r.stop(u),u()},this.getInternalRecorder=function(){return i},this.blob=null,this.getState=function(){return i&&i.state||"inactive"};var c=[];this.getAllStates=function(){return c},"undefined"===typeof t.checkForInactiveTracks&&(t.checkForInactiveTracks=!1);r=this;(function e(){if(i&&!1!==t.checkForInactiveTracks)return!1===p()?(t.disableLogs||console.log("MediaStream seems stopped."),void r.stop()):void setTimeout(e,1e3)})(),this.name="MediaStreamRecorder",this.toString=function(){return this.name}}
/**
 * StereoAudioRecorder is a standalone class used by {@link RecordRTC} to bring "stereo" audio-recording in chrome.
 * @summary JavaScript standalone object for stereo audio recording.
 * @license {@link https://github.com/muaz-khan/RecordRTC/blob/master/LICENSE|MIT}
 * @author {@link https://MuazKhan.com|Muaz Khan}
 * @typedef StereoAudioRecorder
 * @class
 * @example
 * var recorder = new StereoAudioRecorder(MediaStream, {
 *     sampleRate: 44100,
 *     bufferSize: 4096
 * });
 * recorder.record();
 * recorder.stop(function(blob) {
 *     video.src = URL.createObjectURL(blob);
 * });
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 * @param {object} config - {sampleRate: 44100, bufferSize: 4096, numberOfAudioChannels: 1, etc.}
 */
function q(e,t){if(!v(e,"audio").length)throw"Your stream has no audio tracks.";t=t||{};var r,a=this,i=[],s=[],n=!1,u=0,p=2,c=t.desiredSampRate;function m(){if(!1===t.checkForInactiveTracks)return!0;if("active"in e){if(!e.active)return!1}else if("ended"in e&&e.ended)return!1;return!0}function l(e,t){function r(e,t){var r,a=e.numberOfAudioChannels,i=e.leftBuffers.slice(0),s=e.rightBuffers.slice(0),o=e.sampleRate,n=e.internalInterleavedLength,u=e.desiredSampRate;function p(e,t,r){var a=Math.round(e.length*(t/r)),i=[],s=Number((e.length-1)/(a-1));i[0]=e[0];for(var o=1;o<a-1;o++){var n=o*s,u=Number(Math.floor(n)).toFixed(),p=Number(Math.ceil(n)).toFixed(),m=n-u;i[o]=c(e[u],e[p],m)}return i[a-1]=e[e.length-1],i}function c(e,t,r){return e+(t-e)*r}function m(e,t){for(var r=new Float64Array(t),a=0,i=e.length,s=0;s<i;s++){var o=e[s];r.set(o,a),a+=o.length}return r}function l(e,t){for(var r=e.length+t.length,a=new Float64Array(r),i=0,s=0;s<r;)a[s++]=e[i],a[s++]=t[i],i++;return a}function d(e,t,r){for(var a=r.length,i=0;i<a;i++)e.setUint8(t+i,r.charCodeAt(i))}2===a&&(i=m(i,n),s=m(s,n),u&&(i=p(i,u,o),s=p(s,u,o))),1===a&&(i=m(i,n),u&&(i=p(i,u,o))),u&&(o=u),2===a&&(r=l(i,s)),1===a&&(r=i);var y=r.length,b=44+2*y,h=new ArrayBuffer(b),g=new DataView(h);d(g,0,"RIFF"),g.setUint32(4,36+2*y,!0),d(g,8,"WAVE"),d(g,12,"fmt "),g.setUint32(16,16,!0),g.setUint16(20,1,!0),g.setUint16(22,a,!0),g.setUint32(24,o,!0),g.setUint32(28,o*a*2,!0),g.setUint16(32,2*a,!0),g.setUint16(34,16,!0),d(g,36,"data"),g.setUint32(40,2*y,!0);for(var S=y,f=44,I=1,N=0;N<S;N++)g.setInt16(f,r[N]*(32767*I),!0),f+=2;if(t)return t({buffer:h,view:g});postMessage({buffer:h,view:g})}if(e.noWorker)r(e,(function(e){t(e.buffer,e.view)}));else{var a=d(r);a.onmessage=function(e){t(e.data.buffer,e.data.view),b.revokeObjectURL(a.workerURL),a.terminate()},a.postMessage(e)}}function d(e){var t=b.createObjectURL(new Blob([e.toString(),";this.onmessage =  function (eee) {"+e.name+"(eee.data);}"],{type:"application/javascript"})),r=new Worker(t);return r.workerURL=t,r}!0===t.leftChannel&&(p=1),1===t.numberOfAudioChannels&&(p=1),(!p||p<1)&&(p=2),t.disableLogs||console.log("StereoAudioRecorder is set to record number of channels: "+p),"undefined"===typeof t.checkForInactiveTracks&&(t.checkForInactiveTracks=!0),this.record=function(){if(!1===m())throw"Please make sure MediaStream is active.";N(),C=I=!1,n=!0,"undefined"!==typeof t.timeSlice&&R()},this.stop=function(e){e=e||function(){},n=!1,l({desiredSampRate:c,sampleRate:f,numberOfAudioChannels:p,internalInterleavedLength:u,leftBuffers:i,rightBuffers:1===p?[]:s,noWorker:t.noWorker},(function(t,r){a.blob=new Blob([r],{type:"audio/wav"}),a.buffer=new ArrayBuffer(r.buffer.byteLength),a.view=r,a.sampleRate=c||f,a.bufferSize=S,a.length=u,C=!1,e&&e(a.blob)}))},"undefined"===typeof o.Storage&&(o.Storage={AudioContextConstructor:null,AudioContext:window.AudioContext||window.webkitAudioContext}),o.Storage.AudioContextConstructor&&"closed"!==o.Storage.AudioContextConstructor.state||(o.Storage.AudioContextConstructor=new o.Storage.AudioContext);var y=o.Storage.AudioContextConstructor,h=y.createMediaStreamSource(e),g=[0,256,512,1024,2048,4096,8192,16384],S="undefined"===typeof t.bufferSize?4096:t.bufferSize;if(-1===g.indexOf(S)&&(t.disableLogs||console.log("Legal values for buffer-size are "+JSON.stringify(g,null,"\t"))),y.createJavaScriptNode)r=y.createJavaScriptNode(S,p,p);else{if(!y.createScriptProcessor)throw"WebAudio API has no support on this browser.";r=y.createScriptProcessor(S,p,p)}h.connect(r),t.bufferSize||(S=r.bufferSize);var f="undefined"!==typeof t.sampleRate?t.sampleRate:y.sampleRate||44100;(f<22050||f>96e3)&&(t.disableLogs||console.log("sample-rate must be under range 22050 and 96000.")),t.disableLogs||t.desiredSampRate&&console.log("Desired sample-rate: "+t.desiredSampRate);var I=!1;function N(){i=[],s=[],u=0,C=!1,n=!1,I=!1,y=null,a.leftchannel=i,a.rightchannel=s,a.numberOfAudioChannels=p,a.desiredSampRate=c,a.sampleRate=f,a.recordingLength=u,A={left:[],right:[],recordingLength:0}}function T(){r&&(r.onaudioprocess=null,r.disconnect(),r=null),h&&(h.disconnect(),h=null),N()}this.pause=function(){I=!0},this.resume=function(){if(!1===m())throw"Please make sure MediaStream is active.";if(!n)return t.disableLogs||console.log("Seems recording has been restarted."),void this.record();I=!1},this.clearRecordedData=function(){t.checkForInactiveTracks=!1,n&&this.stop(T),T()},this.name="StereoAudioRecorder",this.toString=function(){return this.name};var C=!1;function k(e){if(!I)if(!1===m()&&(t.disableLogs||console.log("MediaStream seems stopped."),r.disconnect(),n=!1),n){C||(C=!0,t.onAudioProcessStarted&&t.onAudioProcessStarted(),t.initCallback&&t.initCallback());var o=e.inputBuffer.getChannelData(0),c=new Float32Array(o);if(i.push(c),2===p){var l=e.inputBuffer.getChannelData(1),d=new Float32Array(l);s.push(d)}u+=S,a.recordingLength=u,"undefined"!==typeof t.timeSlice&&(A.recordingLength+=S,A.left.push(c),2===p&&A.right.push(d))}else h&&(h.disconnect(),h=null)}r.onaudioprocess=k,y.createMediaStreamDestination?r.connect(y.createMediaStreamDestination()):r.connect(y.destination),this.leftchannel=i,this.rightchannel=s,this.numberOfAudioChannels=p,this.desiredSampRate=c,this.sampleRate=f,a.recordingLength=u;var A={left:[],right:[],recordingLength:0};function R(){n&&"function"===typeof t.ondataavailable&&"undefined"!==typeof t.timeSlice&&(A.left.length?(l({desiredSampRate:c,sampleRate:f,numberOfAudioChannels:p,internalInterleavedLength:A.recordingLength,leftBuffers:A.left,rightBuffers:1===p?[]:A.right},(function(e,r){var a=new Blob([r],{type:"audio/wav"});t.ondataavailable(a),setTimeout(R,t.timeSlice)})),A={left:[],right:[],recordingLength:0}):setTimeout(R,t.timeSlice))}}
/**
 * CanvasRecorder is a standalone class used by {@link RecordRTC} to bring HTML5-Canvas recording into video WebM. It uses HTML2Canvas library and runs top over {@link Whammy}.
 * @summary HTML2Canvas recording into video WebM.
 * @license {@link https://github.com/muaz-khan/RecordRTC/blob/master/LICENSE|MIT}
 * @author {@link https://MuazKhan.com|Muaz Khan}
 * @typedef CanvasRecorder
 * @class
 * @example
 * var recorder = new CanvasRecorder(htmlElement, { disableLogs: true, useWhammyRecorder: true });
 * recorder.record();
 * recorder.stop(function(blob) {
 *     video.src = URL.createObjectURL(blob);
 * });
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {HTMLElement} htmlElement - querySelector/getElementById/getElementsByTagName[0]/etc.
 * @param {object} config - {disableLogs:true, initCallback: function}
 */
function E(e,t){if("undefined"===typeof html2canvas)throw"Please link: https://www.webrtc-experiment.com/screenshot.js";t=t||{},t.frameInterval||(t.frameInterval=10);var r=!1;["captureStream","mozCaptureStream","webkitCaptureStream"].forEach((function(e){e in document.createElement("canvas")&&(r=!0)}));var a,i,s,o=(!!window.webkitRTCPeerConnection||!!window.webkitGetUserMedia)&&!!window.chrome,n=50,u=navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);if(o&&u&&u[2]&&(n=parseInt(u[2],10)),o&&n<52&&(r=!1),t.useWhammyRecorder&&(r=!1),r)if(t.disableLogs||console.log("Your browser supports both MediRecorder API and canvas.captureStream!"),e instanceof HTMLCanvasElement)a=e;else{if(!(e instanceof CanvasRenderingContext2D))throw"Please pass either HTMLCanvasElement or CanvasRenderingContext2D.";a=e.canvas}else navigator.mozGetUserMedia&&(t.disableLogs||console.error("Canvas recording is NOT supported in Firefox."));this.record=function(){if(s=!0,r&&!t.useWhammyRecorder){var e;"captureStream"in a?e=a.captureStream(25):"mozCaptureStream"in a?e=a.mozCaptureStream(25):"webkitCaptureStream"in a&&(e=a.webkitCaptureStream(25));try{var o=new N;o.addTrack(v(e,"video")[0]),e=o}catch(n){}if(!e)throw"captureStream API are NOT available.";i=new x(e,{mimeType:t.mimeType||"video/webm"}),i.record()}else y.frames=[],d=(new Date).getTime(),l();t.initCallback&&t.initCallback()},this.getWebPImages=function(r){if("canvas"===e.nodeName.toLowerCase()){var a=y.frames.length;y.frames.forEach((function(e,r){var i=a-r;t.disableLogs||console.log(i+"/"+a+" frames remaining"),t.onEncodingCallback&&t.onEncodingCallback(i,a);var s=e.image.toDataURL("image/webp",1);y.frames[r].image=s})),t.disableLogs||console.log("Generating WebM"),r()}else r()},this.stop=function(e){s=!1;var a=this;r&&i?i.stop(e):this.getWebPImages((function(){y.compile((function(r){t.disableLogs||console.log("Recording finished!"),a.blob=r,a.blob.forEach&&(a.blob=new Blob([],{type:"video/webm"})),e&&e(a.blob),y.frames=[]}))}))};var p=!1;function c(){y.frames=[],s=!1,p=!1}function m(){var t=document.createElement("canvas"),r=t.getContext("2d");return t.width=e.width,t.height=e.height,r.drawImage(e,0,0),t}function l(){if(p)return d=(new Date).getTime(),setTimeout(l,500);if("canvas"===e.nodeName.toLowerCase()){var r=(new Date).getTime()-d;return d=(new Date).getTime(),y.frames.push({image:m(),duration:r}),void(s&&setTimeout(l,t.frameInterval))}html2canvas(e,{grabMouse:"undefined"===typeof t.showMousePointer||t.showMousePointer,onrendered:function(e){var r=(new Date).getTime()-d;if(!r)return setTimeout(l,t.frameInterval);d=(new Date).getTime(),y.frames.push({image:e.toDataURL("image/webp",1),duration:r}),s&&setTimeout(l,t.frameInterval)}})}this.pause=function(){p=!0,i instanceof x&&i.pause()},this.resume=function(){p=!1,i instanceof x?i.resume():s||this.record()},this.clearRecordedData=function(){s&&this.stop(c),c()},this.name="CanvasRecorder",this.toString=function(){return this.name};var d=(new Date).getTime(),y=new L.Video(100)}
/**
 * WhammyRecorder is a standalone class used by {@link RecordRTC} to bring video recording in Chrome. It runs top over {@link Whammy}.
 * @summary Video recording feature in Chrome.
 * @license {@link https://github.com/muaz-khan/RecordRTC/blob/master/LICENSE|MIT}
 * @author {@link https://MuazKhan.com|Muaz Khan}
 * @typedef WhammyRecorder
 * @class
 * @example
 * var recorder = new WhammyRecorder(mediaStream);
 * recorder.record();
 * recorder.stop(function(blob) {
 *     video.src = URL.createObjectURL(blob);
 * });
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 * @param {object} config - {disableLogs: true, initCallback: function, video: HTMLVideoElement, etc.}
 */
function M(e,t){function r(e){e="undefined"!==typeof e?e:10;var t=(new Date).getTime()-p;return t?o?(p=(new Date).getTime(),setTimeout(r,100)):(p=(new Date).getTime(),u.paused&&u.play(),l.drawImage(u,0,0,m.width,m.height),c.frames.push({duration:t,image:m.toDataURL("image/webp")}),void(s||setTimeout(r,e,e))):setTimeout(r,e,e)}function a(e){var t=-1,r=e.length;(function a(){t++,t!==r?setTimeout((function(){e.functionToLoop(a,t)}),1):e.callback()})()}function i(e,t,r,i,s){var o=document.createElement("canvas");o.width=m.width,o.height=m.height;var n=o.getContext("2d"),u=[],p=-1===t,c=t&&t>0&&t<=e.length?t:e.length,l={r:0,g:0,b:0},d=Math.sqrt(Math.pow(255,2)+Math.pow(255,2)+Math.pow(255,2)),y=r&&r>=0&&r<=1?r:0,b=i&&i>=0&&i<=1?i:0,h=!1;a({length:c,functionToLoop:function(t,r){var a,i,s,o=function(){!h&&s-a<=s*b||(p&&(h=!0),u.push(e[r])),t()};if(h)o();else{var c=new Image;c.onload=function(){n.drawImage(c,0,0,m.width,m.height);var e=n.getImageData(0,0,m.width,m.height);a=0,i=e.data.length,s=e.data.length/4;for(var t=0;t<i;t+=4){var r={r:e.data[t],g:e.data[t+1],b:e.data[t+2]},u=Math.sqrt(Math.pow(r.r-l.r,2)+Math.pow(r.g-l.g,2)+Math.pow(r.b-l.b,2));u<=d*y&&a++}o()},c.src=e[r].image}},callback:function(){u=u.concat(e.slice(c)),u.length<=0&&u.push(e[e.length-1]),s(u)}})}t=t||{},t.frameInterval||(t.frameInterval=10),t.disableLogs||console.log("Using frames-interval:",t.frameInterval),this.record=function(){t.width||(t.width=320),t.height||(t.height=240),t.video||(t.video={width:t.width,height:t.height}),t.canvas||(t.canvas={width:t.width,height:t.height}),m.width=t.canvas.width||320,m.height=t.canvas.height||240,l=m.getContext("2d"),t.video&&t.video instanceof HTMLVideoElement?(u=t.video.cloneNode(),t.initCallback&&t.initCallback()):(u=document.createElement("video"),A(e,u),u.onloadedmetadata=function(){t.initCallback&&t.initCallback()},u.width=t.video.width,u.height=t.video.height),u.muted=!0,u.play(),p=(new Date).getTime(),c=new L.Video,t.disableLogs||(console.log("canvas resolutions",m.width,"*",m.height),console.log("video width/height",u.width||m.width,"*",u.height||m.height)),r(t.frameInterval)};var s=!1;this.stop=function(e){e=e||function(){},s=!0;var r=this;setTimeout((function(){i(c.frames,-1,null,null,(function(a){c.frames=a,t.advertisement&&t.advertisement.length&&(c.frames=t.advertisement.concat(c.frames)),c.compile((function(t){r.blob=t,r.blob.forEach&&(r.blob=new Blob([],{type:"video/webm"})),e&&e(r.blob)}))}))}),10)};var o=!1;function n(){c.frames=[],s=!0,o=!1}this.pause=function(){o=!0},this.resume=function(){o=!1,s&&this.record()},this.clearRecordedData=function(){s||this.stop(n),n()},this.name="WhammyRecorder",this.toString=function(){return this.name};var u,p,c,m=document.createElement("canvas"),l=m.getContext("2d")}"undefined"!==typeof y?D.AudioContext=y:"undefined"!==typeof webkitAudioContext&&(D.AudioContext=webkitAudioContext),"undefined"!==typeof o&&(o.Storage=D),"undefined"!==typeof o&&(o.MediaStreamRecorder=x),"undefined"!==typeof o&&(o.StereoAudioRecorder=q),"undefined"!==typeof o&&(o.CanvasRecorder=E),"undefined"!==typeof o&&(o.WhammyRecorder=M);
/**
 * Whammy is a standalone class used by {@link RecordRTC} to bring video recording in Chrome. It is written by {@link https://github.com/antimatter15|antimatter15}
 * @summary A real time javascript webm encoder based on a canvas hack.
 * @license {@link https://github.com/muaz-khan/RecordRTC/blob/master/LICENSE|MIT}
 * @author {@link https://MuazKhan.com|Muaz Khan}
 * @typedef Whammy
 * @class
 * @example
 * var recorder = new Whammy().Video(15);
 * recorder.add(context || canvas || dataURL);
 * var output = recorder.compile();
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 */
var L=function(){function e(e){this.frames=[],this.duration=e||1,this.quality=.8}function t(e){var t=b.createObjectURL(new Blob([e.toString(),"this.onmessage =  function (eee) {"+e.name+"(eee.data);}"],{type:"application/javascript"})),r=new Worker(t);return b.revokeObjectURL(t),r}function r(e){function t(e){var t=a(e);if(!t)return[];var i=3e4,s=[{id:440786851,data:[{data:1,id:17030},{data:1,id:17143},{data:4,id:17138},{data:8,id:17139},{data:"webm",id:17026},{data:2,id:17031},{data:2,id:17029}]},{id:408125543,data:[{id:357149030,data:[{data:1e6,id:2807729},{data:"whammy",id:19840},{data:"whammy",id:22337},{data:l(t.duration),id:17545}]},{id:374648427,data:[{id:174,data:[{data:1,id:215},{data:1,id:29637},{data:0,id:156},{data:"und",id:2274716},{data:"V_VP8",id:134},{data:"VP8",id:2459272},{data:1,id:131},{id:224,data:[{data:t.width,id:176},{data:t.height,id:186}]}]}]}]}],o=0,u=0;while(o<e.length){var p=[],c=0;do{p.push(e[o]),c+=e[o].duration,o++}while(o<e.length&&c<i);var m=0,d={id:524531317,data:r(u,m,p)};s[1].data.push(d),u+=c}return n(s)}function r(e,t,r){return[{data:e,id:231}].concat(r.map((function(e){var r=u({discardable:0,frame:e.data.slice(4),invisible:0,keyframe:1,lacing:0,trackNum:1,timecode:Math.round(t)});return t+=e.duration,{data:r,id:163}})))}function a(e){if(e[0]){for(var t=e[0].width,r=e[0].height,a=e[0].duration,i=1;i<e.length;i++)a+=e[i].duration;return{duration:a,width:t,height:r}}postMessage({error:"Something went wrong. Maybe WebP format is not supported in the current browser."})}function i(e){var t=[];while(e>0)t.push(255&e),e>>=8;return new Uint8Array(t.reverse())}function s(e){return new Uint8Array(e.split("").map((function(e){return e.charCodeAt(0)})))}function o(e){var t=[],r=e.length%8?new Array(9-e.length%8).join("0"):"";e=r+e;for(var a=0;a<e.length;a+=8)t.push(parseInt(e.substr(a,8),2));return new Uint8Array(t)}function n(e){for(var t=[],r=0;r<e.length;r++){var a=e[r].data;"object"===typeof a&&(a=n(a)),"number"===typeof a&&(a=o(a.toString(2))),"string"===typeof a&&(a=s(a));var u=a.size||a.byteLength||a.length,p=Math.ceil(Math.ceil(Math.log(u)/Math.log(2))/8),c=u.toString(2),m=new Array(7*p+7+1-c.length).join("0")+c,l=new Array(p).join("0")+"1"+m;t.push(i(e[r].id)),t.push(o(l)),t.push(a)}return new Blob(t,{type:"video/webm"})}function u(e){var t=0;if(e.keyframe&&(t|=128),e.invisible&&(t|=8),e.lacing&&(t|=e.lacing<<1),e.discardable&&(t|=1),e.trackNum>127)throw"TrackNumber > 127 not supported";var r=[128|e.trackNum,e.timecode>>8,255&e.timecode,t].map((function(e){return String.fromCharCode(e)})).join("")+e.frame;return r}function p(e){for(var t,r,a,i=e.RIFF[0].WEBP[0],s=i.indexOf("*"),o=0,n=[];o<4;o++)n[o]=i.charCodeAt(s+3+o);return a=n[1]<<8|n[0],t=16383&a,a=n[3]<<8|n[2],r=16383&a,{width:t,height:r,data:i,riff:e}}function c(e,t){return parseInt(e.substr(t+4,4).split("").map((function(e){var t=e.charCodeAt(0).toString(2);return new Array(8-t.length+1).join("0")+t})).join(""),2)}function m(e){var t=0,r={};while(t<e.length){var a=e.substr(t,4),i=c(e,t),s=e.substr(t+4+4,i);t+=8+i,r[a]=r[a]||[],"RIFF"===a||"LIST"===a?r[a].push(m(s)):r[a].push(s)}return r}function l(e){return[].slice.call(new Uint8Array(new Float64Array([e]).buffer),0).map((function(e){return String.fromCharCode(e)})).reverse().join("")}var d=new t(e.map((function(e){var t=p(m(atob(e.image.slice(23))));return t.duration=e.duration,t})));postMessage(d)}return e.prototype.add=function(e,t){if("canvas"in e&&(e=e.canvas),"toDataURL"in e&&(e=e.toDataURL("image/webp",this.quality)),!/^data:image\/webp;base64,/gi.test(e))throw"Input must be formatted properly as a base64 encoded DataURI of type image/webp";this.frames.push({image:e,duration:t||this.duration})},e.prototype.compile=function(e){var a=t(r);a.onmessage=function(t){t.data.error?console.error(t.data.error):e(t.data)},a.postMessage(this.frames)},{Video:e}}();"undefined"!==typeof o&&(o.Whammy=L);
/**
 * DiskStorage is a standalone object used by {@link RecordRTC} to store recorded blobs in IndexedDB storage.
 * @summary Writing blobs into IndexedDB.
 * @license {@link https://github.com/muaz-khan/RecordRTC/blob/master/LICENSE|MIT}
 * @author {@link https://MuazKhan.com|Muaz Khan}
 * @example
 * DiskStorage.Store({
 *     audioBlob: yourAudioBlob,
 *     videoBlob: yourVideoBlob,
 *     gifBlob  : yourGifBlob
 * });
 * DiskStorage.Fetch(function(dataURL, type) {
 *     if(type === 'audioBlob') { }
 *     if(type === 'videoBlob') { }
 *     if(type === 'gifBlob')   { }
 * });
 * // DiskStorage.dataStoreName = 'recordRTC';
 * // DiskStorage.onError = function(error) { };
 * @property {function} init - This method must be called once to initialize IndexedDB ObjectStore. Though, it is auto-used internally.
 * @property {function} Fetch - This method fetches stored blobs from IndexedDB.
 * @property {function} Store - This method stores blobs in IndexedDB.
 * @property {function} onError - This function is invoked for any known/unknown error.
 * @property {string} dataStoreName - Name of the ObjectStore created in IndexedDB storage.
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 */var w={init:function(){var e=this;if("undefined"!==typeof indexedDB&&"undefined"!==typeof indexedDB.open){var t,r=1,a=this.dbName||location.href.replace(/\/|:|#|%|\.|\[|\]/g,""),i=indexedDB.open(a,r);i.onerror=e.onError,i.onsuccess=function(){if(t=i.result,t.onerror=e.onError,t.setVersion)if(t.version!==r){var a=t.setVersion(r);a.onsuccess=function(){s(t),o()}}else o();else o()},i.onupgradeneeded=function(e){s(e.target.result)}}else console.error("IndexedDB API are not available in this browser.");function s(t){t.createObjectStore(e.dataStoreName)}function o(){var r=t.transaction([e.dataStoreName],"readwrite");function a(t){r.objectStore(e.dataStoreName).get(t).onsuccess=function(r){e.callback&&e.callback(r.target.result,t)}}e.videoBlob&&r.objectStore(e.dataStoreName).put(e.videoBlob,"videoBlob"),e.gifBlob&&r.objectStore(e.dataStoreName).put(e.gifBlob,"gifBlob"),e.audioBlob&&r.objectStore(e.dataStoreName).put(e.audioBlob,"audioBlob"),a("audioBlob"),a("videoBlob"),a("gifBlob")}},Fetch:function(e){return this.callback=e,this.init(),this},Store:function(e){return this.audioBlob=e.audioBlob,this.videoBlob=e.videoBlob,this.gifBlob=e.gifBlob,this.init(),this},onError:function(e){console.error(JSON.stringify(e,null,"\t"))},dataStoreName:"recordRTC",dbName:null};
/**
 * GifRecorder is standalone calss used by {@link RecordRTC} to record video or canvas into animated gif.
 * @license {@link https://github.com/muaz-khan/RecordRTC/blob/master/LICENSE|MIT}
 * @author {@link https://MuazKhan.com|Muaz Khan}
 * @typedef GifRecorder
 * @class
 * @example
 * var recorder = new GifRecorder(mediaStream || canvas || context, { onGifPreview: function, onGifRecordingStarted: function, width: 1280, height: 720, frameRate: 200, quality: 10 });
 * recorder.record();
 * recorder.stop(function(blob) {
 *     img.src = URL.createObjectURL(blob);
 * });
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object or HTMLCanvasElement or CanvasRenderingContext2D.
 * @param {object} config - {disableLogs:true, initCallback: function, width: 320, height: 240, frameRate: 200, quality: 10}
 */
/**
 * MultiStreamRecorder can record multiple videos in single container.
 * @summary Multi-videos recorder.
 * @license {@link https://github.com/muaz-khan/RecordRTC/blob/master/LICENSE|MIT}
 * @author {@link https://MuazKhan.com|Muaz Khan}
 * @typedef MultiStreamRecorder
 * @class
 * @example
 * var options = {
 *     mimeType: 'video/webm'
 * }
 * var recorder = new MultiStreamRecorder(ArrayOfMediaStreams, options);
 * recorder.record();
 * recorder.stop(function(blob) {
 *     video.src = URL.createObjectURL(blob);
 *
 *     // or
 *     var blob = recorder.blob;
 * });
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStreams} mediaStreams - Array of MediaStreams.
 * @param {object} config - {disableLogs:true, frameInterval: 1, mimeType: "video/webm"}
 */
function _(e,t){e=e||[];var r,a,i=this;function s(){var t=[];return e.forEach((function(e){v(e,"video").forEach((function(e){t.push(e)}))})),t}t=t||{elementClass:"multi-streams-mixer",mimeType:"video/webm",video:{width:360,height:240}},t.frameInterval||(t.frameInterval=10),t.video||(t.video={}),t.video.width||(t.video.width=360),t.video.height||(t.video.height=240),this.record=function(){r=new B(e,t.elementClass||"multi-streams-mixer"),s().length&&(r.frameInterval=t.frameInterval||10,r.width=t.video.width||360,r.height=t.video.height||240,r.startDrawingFrames()),t.previewStream&&"function"===typeof t.previewStream&&t.previewStream(r.getMixedStream()),a=new x(r.getMixedStream(),t),a.record()},this.stop=function(e){a&&a.stop((function(t){i.blob=t,e(t),i.clearRecordedData()}))},this.pause=function(){a&&a.pause()},this.resume=function(){a&&a.resume()},this.clearRecordedData=function(){a&&(a.clearRecordedData(),a=null),r&&(r.releaseStreams(),r=null)},this.addStreams=function(i){if(!i)throw"First parameter is required.";i instanceof Array||(i=[i]),e.concat(i),a&&r&&(r.appendStreams(i),t.previewStream&&"function"===typeof t.previewStream&&t.previewStream(r.getMixedStream()))},this.resetVideoStreams=function(e){r&&(!e||e instanceof Array||(e=[e]),r.resetVideoStreams(e))},this.getMixer=function(){return r},this.name="MultiStreamRecorder",this.toString=function(){return this.name}}
/**
 * RecordRTCPromisesHandler adds promises support in {@link RecordRTC}. Try a {@link https://github.com/muaz-khan/RecordRTC/blob/master/simple-demos/RecordRTCPromisesHandler.html|demo here}
 * @summary Promises for {@link RecordRTC}
 * @license {@link https://github.com/muaz-khan/RecordRTC/blob/master/LICENSE|MIT}
 * @author {@link https://MuazKhan.com|Muaz Khan}
 * @typedef RecordRTCPromisesHandler
 * @class
 * @example
 * var recorder = new RecordRTCPromisesHandler(mediaStream, options);
 * recorder.startRecording()
 *         .then(successCB)
 *         .catch(errorCB);
 * // Note: You can access all RecordRTC API using "recorder.recordRTC" e.g. 
 * recorder.recordRTC.onStateChanged = function(state) {};
 * recorder.recordRTC.setRecordingDuration(5000);
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - Single media-stream object, array of media-streams, html-canvas-element, etc.
 * @param {object} config - {type:"video", recorderType: MediaStreamRecorder, disableLogs: true, numberOfAudioChannels: 1, bufferSize: 0, sampleRate: 0, video: HTMLVideoElement, etc.}
 * @throws Will throw an error if "new" keyword is not used to initiate "RecordRTCPromisesHandler". Also throws error if first argument "MediaStream" is missing.
 * @requires {@link RecordRTC}
 */
function U(e,t){if(!this)throw'Use "new RecordRTCPromisesHandler()"';if("undefined"===typeof e)throw'First argument "MediaStream" is required.';var r=this;r.recordRTC=new o(e,t),this.startRecording=function(){return new Promise((function(e,t){try{r.recordRTC.startRecording(),e()}catch(a){t(a)}}))},this.stopRecording=function(){return new Promise((function(e,t){try{r.recordRTC.stopRecording((function(a){r.blob=r.recordRTC.getBlob(),r.blob&&r.blob.size?e(a):t("Empty blob.",r.blob)}))}catch(a){t(a)}}))},this.pauseRecording=function(){return new Promise((function(e,t){try{r.recordRTC.pauseRecording(),e()}catch(a){t(a)}}))},this.resumeRecording=function(){return new Promise((function(e,t){try{r.recordRTC.resumeRecording(),e()}catch(a){t(a)}}))},this.getDataURL=function(e){return new Promise((function(e,t){try{r.recordRTC.getDataURL((function(t){e(t)}))}catch(a){t(a)}}))},this.getBlob=function(){return new Promise((function(e,t){try{e(r.recordRTC.getBlob())}catch(a){t(a)}}))},this.getInternalRecorder=function(){return new Promise((function(e,t){try{e(r.recordRTC.getInternalRecorder())}catch(a){t(a)}}))},this.reset=function(){return new Promise((function(e,t){try{e(r.recordRTC.reset())}catch(a){t(a)}}))},this.destroy=function(){return new Promise((function(e,t){try{e(r.recordRTC.destroy())}catch(a){t(a)}}))},this.getState=function(){return new Promise((function(e,t){try{e(r.recordRTC.getState())}catch(a){t(a)}}))},this.blob=null,this.version="5.6.2"}
/**
 * WebAssemblyRecorder lets you create webm videos in JavaScript via WebAssembly. The library consumes raw RGBA32 buffers (4 bytes per pixel) and turns them into a webm video with the given framerate and quality. This makes it compatible out-of-the-box with ImageData from a CANVAS. With realtime mode you can also use webm-wasm for streaming webm videos.
 * @summary Video recording feature in Chrome, Firefox and maybe Edge.
 * @license {@link https://github.com/muaz-khan/RecordRTC/blob/master/LICENSE|MIT}
 * @author {@link https://MuazKhan.com|Muaz Khan}
 * @typedef WebAssemblyRecorder
 * @class
 * @example
 * var recorder = new WebAssemblyRecorder(mediaStream);
 * recorder.record();
 * recorder.stop(function(blob) {
 *     video.src = URL.createObjectURL(blob);
 * });
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 * @param {object} config - {webAssemblyPath:'webm-wasm.wasm',workerPath: 'webm-worker.js', frameRate: 30, width: 1920, height: 1080, bitrate: 1024, realtime: true}
 */