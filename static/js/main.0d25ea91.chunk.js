(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{126:function(e,t,n){},128:function(e,t,n){"use strict";n.r(t);n(75);var a=n(0),i=n.n(a),r=n(29),o=n.n(r),s=n(11),c=n.n(s),u=n(13),l=n(17),d=n(6),h=n(3),p=n(2),m=n(8),v=n(4),b=n(7),f=n(1),j=n(71),y=n(67),x=n(30),w=n.n(x),O=function(e){var t=e.toData(),n=new w.a;n.file("metadata.json",JSON.stringify(t));var a=n.folder("audio"),i=!0,r=!1,o=void 0;try{for(var s,c=e.audioLibrary.entries()[Symbol.iterator]();!(i=(s=c.next()).done);i=!0){var u=s.value,l=Object(j.a)(u,2),d=l[0],h=l[1];a.file(d.toString(),h)}}catch(p){r=!0,o=p}finally{try{i||null==c.return||c.return()}finally{if(r)throw o}}return n.generateAsync({type:"blob"})},g=function(){var e=Object(u.a)(c.a.mark(function e(t){var n;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,O(t);case 2:n=e.sent,Object(y.saveAs)(n,"audio3d-project.zip");case 4:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}(),k=n(72),A=function(e){function t(){var e,n;Object(h.a)(this,t);for(var a=arguments.length,i=new Array(a),r=0;r<a;r++)i[r]=arguments[r];return(n=Object(m.a)(this,(e=Object(v.a)(t)).call.apply(e,[this].concat(i)))).nextId=0,n}return Object(b.a)(t,e),Object(p.a)(t,[{key:"add",value:function(e){return this.set(this.nextId,e),this.nextId++}}]),t}(Object(k.a)(Map)),E=new f.d(1,1,1),C=new f.k,S=function(e){function t(e){var n;return Object(h.a)(this,t),(n=Object(m.a)(this,Object(v.a)(t).call(this,E,C))).audioLibrary=e,n.audioId=null,n.audioData=null,n}return Object(b.a)(t,e),Object(p.a)(t,[{key:"toData",value:function(){return{name:this.name,position:this.position.toArray(),scale:this.scale.toArray(),rotation:this.rotation.toArray(),audioId:this.audioId}}},{key:"fromData",value:function(e){return this.name=e.name,this.position.set(e.position[0],e.position[1],e.position[2]),this.scale.set(e.scale[0],e.scale[1],e.scale[2]),this.rotation.set(e.rotation[0],e.rotation[1],e.rotation[2]),this.audioId=e.audioId,null!=this.audioId&&(this.audioData=this.audioLibrary.get(this.audioId)||null),this}}]),t}(f.i),D=function(e){function t(e){var n,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{width:1,height:1,depth:1};Object(h.a)(this,t),(n=Object(m.a)(this,Object(v.a)(t).call(this))).audioLibrary=e,n.roomDimensions=i,n.grid=void 0,n.name=a;var r=new f.a(16777215,.5);n.add(r);var o=new f.p(16777215,.5);o.position.set(5,5,0),o.lookAt(0,0,0),n.add(o);var s=Math.max(i.width,i.depth);return n.grid=new f.h(s,s,16777215,16777215),n.add(n.grid),n}return Object(b.a)(t,e),Object(p.a)(t,[{key:"dimensions",get:function(){return this.roomDimensions},set:function(e){this.roomDimensions=e,this.remove(this.grid);var t=Math.max(e.width,e.depth);this.grid=new f.h(t,t,16777215,16777215),this.add(this.grid)}}]),Object(p.a)(t,[{key:"addCube",value:function(){var e=new S(this.audioLibrary);return e.position.y+=.5,e.name="New cube",this.add(e),e}},{key:"toData",value:function(){return{name:this.name,dimensions:this.dimensions,objects:this.children.filter(function(e){return e instanceof S}).map(function(e){return e.toData()})}}},{key:"fromData",value:function(e){var t=this;this.name=e.name,this.dimensions=e.dimensions;var n=e.objects.map(function(e){return new S(t.audioLibrary).fromData(e)});return this.add.apply(this,Object(l.a)(n)),this}}]),t}(f.t),M=function(){},P={onSelect:M,onScale:M,onTranslate:M},R=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:P;Object(h.a)(this,e),this.events=t,this.audioLibrary=new A,this.id=null,this.name="New project",this.rooms=[],this.audioType=1,this.activeRoom=void 0,this.activeObject=null;var n=new D(this.audioLibrary,"First room",{width:15,depth:10,height:3});n.addCube(),this.rooms.push(n),this.activeRoom=n}return Object(p.a)(e,[{key:"toData",value:function(){return{name:this.name,rooms:this.rooms.map(function(e){return e.toData()})}}},{key:"fromData",value:function(e){var t=this;return this.name=e.name,this.rooms=e.rooms.map(function(e){return new D(t.audioLibrary).fromData(e)}),this.activeRoom=this.rooms[0],this}}]),e}(),z=function(e){var t=[];return e.forEach(function(e,n){return t.push({name:e,file:n})}),t},L=function(){var e=Object(u.a)(c.a.mark(function e(t){var n,a,i,r,o,s,u,l,d,h,p,m,v;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,w.a.loadAsync(t);case 2:return n=e.sent,e.t0=JSON,e.next=6,n.file("metadata.json").async("text");case 6:e.t1=e.sent,a=e.t0.parse.call(e.t0,e.t1),i=n.folder("audio"),r=new R,o=!0,s=!1,u=void 0,e.prev=13,l=z(i)[Symbol.iterator]();case 15:if(o=(d=l.next()).done){e.next=31;break}if(h=d.value,p=h.name,m=h.file,v=parseInt(p,10),isNaN(v)){e.next=28;break}return e.t2=r.audioLibrary,e.t3=v,e.next=25,m.async("arraybuffer");case 25:e.t4=e.sent,e.t2.set.call(e.t2,e.t3,e.t4),v>=r.audioLibrary.nextId&&(r.audioLibrary.nextId=v+1);case 28:o=!0,e.next=15;break;case 31:e.next=37;break;case 33:e.prev=33,e.t5=e.catch(13),s=!0,u=e.t5;case 37:e.prev=37,e.prev=38,o||null==l.return||l.return();case 40:if(e.prev=40,!s){e.next=43;break}throw u;case 43:return e.finish(40);case 44:return e.finish(37);case 45:return r.fromData(a),e.abrupt("return",r);case 47:case"end":return e.stop()}},e,this,[[13,33,37,45],[38,,40,44]])}));return function(t){return e.apply(this,arguments)}}(),Y=n(9),X=n(10);function I(){var e=Object(Y.a)(["\n  height: 0;\n  margin: 5px;\n  border-bottom: 1px solid hsl(210, 15%, 35%);\n"]);return I=function(){return e},e}function Z(){var e=Object(Y.a)(["\n  white-space: nowrap;\n  padding: 8px 20px;\n  margin: 2px 0;\n  cursor: pointer;\n\n  :hover {\n    background: hsl(210, 25%, 30%);\n  }\n"]);return Z=function(){return e},e}function T(){var e=Object(Y.a)(["\n  position: absolute;\n  left: 0;\n  top: 100%;\n  background: hsl(210, 25%, 20%);\n  padding: 5px 0;\n  min-width: 200px;\n  font-size: 0.95em;\n  box-shadow: 5px 5px 8px rgba(0, 0, 0, 0.5);\n\n  border-bottom-left-radius: 3px;\n  border-bottom-right-radius: 3px;\n\n  cursor: default;\n"]);return T=function(){return e},e}function N(){var e=Object(Y.a)(["\n      background: hsl(210, 29%, 20%);\n    "]);return N=function(){return e},e}function F(){var e=Object(Y.a)(["\n  position: relative;\n  display: inline-block;\n  padding: 10px 15px;\n  cursor: pointer;\n\n  :hover {\n    background: hsl(210, 29%, 20%);\n  }\n\n  ","\n"]);return F=function(){return e},e}function U(){var e=Object(Y.a)(["\n  flex: 0 0 auto;\n  background: hsl(210, 29%, 15%);\n  color: #fff;\n  font-size: 0.9em;\n  padding: 0 10px;\n  user-select: none;\n\n  :focus {\n    outline: none;\n  }\n"]);return U=function(){return e},e}var W,H=X.b.div(U()),K=X.b.div(F(),function(e){return e.isActive&&Object(X.a)(N())}),G=X.b.div(T()),B=X.b.div(Z()),q=X.b.div(I());!function(e){e[e.FileMenu=0]="FileMenu",e[e.EditMenu=1]="EditMenu",e[e.HelpMenu=2]="HelpMenu"}(W||(W={}));var J=function(e){function t(){var e,n;Object(h.a)(this,t);for(var a=arguments.length,i=new Array(a),r=0;r<a;r++)i[r]=arguments[r];return(n=Object(m.a)(this,(e=Object(v.a)(t)).call.apply(e,[this].concat(i)))).state={activeMenu:null},n}return Object(b.a)(t,e),Object(p.a)(t,[{key:"toggleMenu",value:function(e){this.setState(function(t){return{activeMenu:t.activeMenu===e?null:e}})}},{key:"closeMenu",value:function(){this.setState({activeMenu:null})}},{key:"render",value:function(){var e=this,t=this.state.activeMenu;return i.a.createElement(H,{tabIndex:-1,onBlur:function(){return e.closeMenu()}},i.a.createElement(K,{isActive:t===W.FileMenu,onClick:function(){return e.toggleMenu(W.FileMenu)}},"File",i.a.createElement(G,{hidden:t!==W.FileMenu},i.a.createElement(B,null,"New project"),i.a.createElement(B,null,"Load project"),i.a.createElement(B,null,"Save project"),i.a.createElement(q,null),i.a.createElement(B,{onClick:this.props.onImportProject},"Import project"),i.a.createElement(B,{onClick:this.props.onExportProject},"Export project"),i.a.createElement(q,null),i.a.createElement(B,null,"Settings"))),i.a.createElement(K,{isActive:t===W.EditMenu,onClick:function(){return e.toggleMenu(W.EditMenu)}},"Edit",i.a.createElement(G,{hidden:t!==W.EditMenu},i.a.createElement(B,{onClick:this.props.onAddObject},"New object"),i.a.createElement(B,null,"Delete object"),i.a.createElement(q,null),i.a.createElement(B,{onClick:this.props.onAddRoom},"New room"),i.a.createElement(B,null,"Delete room"),i.a.createElement(q,null),i.a.createElement(B,null,"Release the kraken"))),i.a.createElement(K,{isActive:t===W.HelpMenu,onClick:function(){return e.toggleMenu(W.HelpMenu)}},"Help",i.a.createElement(G,{hidden:t!==W.HelpMenu},i.a.createElement(B,null,"Issues"),i.a.createElement(B,null,"Repository"),i.a.createElement(B,null,"About"))))}}]),t}(i.a.Component);function Q(){var e=Object(Y.a)(["\n      background: hsl(210, 29%, 20%);\n      border-left: 2px solid #3498db;\n    "]);return Q=function(){return e},e}function $(){var e=Object(Y.a)(["\n  cursor: pointer;\n  padding: 7px 10px;\n  border-radius: 2px;\n  ",";\n"]);return $=function(){return e},e}function V(){var e=Object(Y.a)(["\n  list-style: none;\n  padding: 5px;\n  margin: 5px 0;\n  border-radius: 3px;\n  background: hsl(210, 29%, 24%);\n"]);return V=function(){return e},e}function _(){var e=Object(Y.a)(["\n  display: block;\n  appearance: none;\n  background: hsl(210, 29%, 24%);\n  border-radius: 3px;\n  border: 2px solid hsl(210, 29%, 24%);\n  color: #fff;\n  width: 100%;\n  padding: 10px 12px;\n  margin: 5px 0;\n\n  transition: 0.2s ease border-color;\n  :focus {\n    outline: none;\n    border-color: #3498db;\n  }\n"]);return _=function(){return e},e}function ee(){var e=Object(Y.a)(["\n  margin: 20px 0;\n"]);return ee=function(){return e},e}function te(){var e=Object(Y.a)(["\n  flex: 1;\n  height: 100%;\n"]);return te=function(){return e},e}function ne(){var e=Object(Y.a)(["\n  flex: 0 0 300px;\n  height: 100%;\n  background: hsl(210, 29%, 29%);\n  color: #fff;\n  padding: 0 15px;\n  overflow-x: hidden;\n  overflow-y: auto;\n"]);return ne=function(){return e},e}function ae(){var e=Object(Y.a)(["\n  flex: 1;\n  display: flex;\n  flex-direction: row;\n"]);return ae=function(){return e},e}function ie(){var e=Object(Y.a)(["\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  background: #000;\n  display: flex;\n  flex-direction: column;\n"]);return ie=function(){return e},e}var re,oe=X.b.div(ie()),se=X.b.div(ae()),ce=X.b.aside(ne()),ue=X.b.main(te()),le=X.b.div(ee()),de=X.b.input(_()),he=X.b.ol(V()),pe=X.b.li($(),function(e){return e.active&&Object(X.a)(Q())}),me=function(e){return 180*e/Math.PI},ve=function(e){return e/180*Math.PI},be=function(e){function t(){var e,n;Object(h.a)(this,t);for(var a=arguments.length,i=new Array(a),r=0;r<a;r++)i[r]=arguments[r];return(n=Object(m.a)(this,(e=Object(v.a)(t)).call.apply(e,[this].concat(i)))).onAudioFileSelected=function(e){var t=e.currentTarget.files;if(t){var a=t.item(0);if(a)if(console.log("Selected file:",a),a.size>5242880)console.log("File too big, aborting");else{var i=new FileReader;i.onload=function(){i.result?n.props.onUpdateAudio(i.result):console.error("Failed reading file:",e)},i.readAsArrayBuffer(a)}}},n}return Object(b.a)(t,e),Object(p.a)(t,[{key:"render",value:function(){var e=this.props,t=e.object,n=e.onUpdateName,a=e.onUpdatePosition,r=e.onUpdateRotation,o=e.onUpdateScale;return i.a.createElement("div",null,i.a.createElement(le,null,i.a.createElement("label",null,"Name"),i.a.createElement(de,{type:"text",value:t.name,onChange:function(e){return n(e.currentTarget.value)}})),i.a.createElement(le,null,i.a.createElement("label",null,"Position (x, y, z)"),i.a.createElement(de,{type:"number",step:"any",value:t.position.x,onChange:function(e){return a(e.currentTarget.valueAsNumber,t.position.y,t.position.z)}}),i.a.createElement(de,{type:"number",step:"any",value:t.position.y,onChange:function(e){return a(t.position.x,e.currentTarget.valueAsNumber,t.position.z)}}),i.a.createElement(de,{type:"number",step:"any",value:t.position.z,onChange:function(e){return a(t.position.x,t.position.y,e.currentTarget.valueAsNumber)}})),i.a.createElement(le,null,i.a.createElement("label",null,"Euler-Rotation in Degrees (x, y, z)"),i.a.createElement(de,{type:"number",step:1,value:me(t.rotation.x).toFixed(0),onChange:function(e){return r(ve(e.currentTarget.valueAsNumber),t.rotation.y,t.rotation.z)}}),i.a.createElement(de,{type:"number",step:1,value:me(t.rotation.y).toFixed(0),onChange:function(e){return r(t.rotation.x,ve(e.currentTarget.valueAsNumber),t.rotation.z)}}),i.a.createElement(de,{type:"number",step:1,value:me(t.rotation.z).toFixed(0),onChange:function(e){return r(t.rotation.x,t.rotation.y,ve(e.currentTarget.valueAsNumber))}})),i.a.createElement(le,null,i.a.createElement("label",null,"Size (width, height, depth)"),i.a.createElement(de,{type:"number",step:"any",min:.1,max:10,value:t.scale.x,onChange:function(e){return o(e.currentTarget.valueAsNumber,t.scale.y,t.scale.z)}}),i.a.createElement(de,{type:"number",step:"any",min:.1,max:10,value:t.scale.y,onChange:function(e){return o(t.scale.x,e.currentTarget.valueAsNumber,t.scale.z)}}),i.a.createElement(de,{type:"number",step:"any",min:.1,max:10,value:t.scale.z,onChange:function(e){return o(t.scale.x,t.scale.y,e.currentTarget.valueAsNumber)}})),i.a.createElement(le,null,i.a.createElement("label",null,"Audio source (file)"),i.a.createElement(de,{type:"file",accept:"audio/*",onChange:this.onAudioFileSelected})))}}]),t}(i.a.Component),fe=n(70),je=n(31),ye=function(e){function t(e,n){var a;return Object(h.a)(this,t),(a=Object(m.a)(this,Object(v.a)(t).call(this))).audioContext=n,a.audioSource=void 0,a.source=void 0,a.isPlaying=void 0,a.audioSource=n.createBufferSource(),a.audioSource.loop=!0,a.source=e.createSource({position:new Float32Array([0,1,3]),forward:new Float32Array([1,0,0])}),a.audioSource.connect(a.source.input),a.isPlaying=!1,a}return Object(b.a)(t,e),Object(p.a)(t,[{key:"updateMatrixWorld",value:function(e){Object(je.a)(Object(v.a)(t.prototype),"updateMatrixWorld",this).call(this,e);var n=new f.w,a=new f.r,i=new f.w,r=new f.w;this.matrixWorld.decompose(n,a,i),console.log(n.x,n.y,n.z),r.set(0,0,1).applyQuaternion(a),this.source.setPosition(n.x,n.y,n.z),this.source.setOrientation(r.x,r.y,r.z,this.up.x,this.up.y,this.up.z)}},{key:"play",value:function(){var e=Object(u.a)(c.a.mark(function e(t){var n,a,i;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!0!==this.isPlaying){e.next=3;break}return console.warn("ResAudio: Audio is already playing."),e.abrupt("return");case 3:return e.next=5,fetch(t);case 5:return n=e.sent,e.next=8,n.arrayBuffer();case 8:return a=e.sent,e.next=11,this.audioContext.decodeAudioData(a);case 11:i=e.sent,this.audioSource.buffer=i,this.audioSource.start(),this.isPlaying=!0;case 15:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()},{key:"pause",value:function(){this.audioSource.stop(),this.isPlaying=!1}},{key:"stop",value:function(){this.audioSource.stop(),this.isPlaying=!1,this.audioSource.buffer=null}}]),t}(f.l),xe=function(e){function t(e){var n;return Object(h.a)(this,t),(n=Object(m.a)(this,Object(v.a)(t).call(this))).audioScene=e,n}return Object(b.a)(t,e),Object(p.a)(t,[{key:"updateMatrixWorld",value:function(e){Object(je.a)(Object(v.a)(t.prototype),"updateMatrixWorld",this).call(this,e);var n=new f.w,a=new f.r,i=new f.w,r=new f.w;this.matrixWorld.decompose(n,a,i),r.set(0,0,-1).applyQuaternion(a),this.audioScene.setListenerPosition(n.x,n.y,n.z),this.audioScene.setListenerOrientation(r.x,r.y,r.z,this.up.x,this.up.y,this.up.z)}}]),t}(f.l),we=function(){function e(){Object(h.a)(this,e),this.onGamepadConnected=function(e){console.log("Gamepad connected:",e.gamepad)},this.onGamepadDisconnected=function(e){console.log("Gamepad disconnected:",e.gamepad)}}return Object(p.a)(e,[{key:"listen",value:function(){window.addEventListener("gamepadconnected",this.onGamepadConnected),window.addEventListener("gamepaddisconnected",this.onGamepadDisconnected)}},{key:"stop",value:function(){window.removeEventListener("gamepadconnected",this.onGamepadConnected),window.removeEventListener("gamepaddisconnected",this.onGamepadDisconnected)}},{key:"getAxis",value:function(e){var t=navigator.getGamepads(),n=0,a=!0,i=!1,r=void 0;try{for(var o,s=t[Symbol.iterator]();!(a=(o=s.next()).done);a=!0){var c=o.value;if(c&&"standard"===c.mapping)if(e<4){var u=c.axes[e];Math.abs(u)>=.1&&Math.abs(u)>Math.abs(n)&&(n=u)}else if(4===e){var l=c.buttons[6].value,d=c.buttons[7].value-l;Math.abs(d)>Math.abs(n)&&(n=d)}}}catch(h){i=!0,r=h}finally{try{a||null==s.return||s.return()}finally{if(i)throw r}}return n}}]),e}(),Oe=function(){function e(t){var n=this;Object(h.a)(this,e),this.target=void 0,this.keysPressed=new Set,this.lastKeyUp=new Map,this.reset=function(){n.keysPressed.clear()},this.onKeyDown=function(e){e.preventDefault(),Math.abs(e.timeStamp-(n.lastKeyUp.get(e.key)||0))>=100&&n.keysPressed.add(e.key)},this.onKeyUp=function(e){e.preventDefault(),n.keysPressed.delete(e.key),n.lastKeyUp.set(e.key,e.timeStamp)},this.onClick=function(e){2===e.button&&e.shiftKey&&n.reset()},this.target=t}return Object(p.a)(e,[{key:"listen",value:function(){this.target.addEventListener("blur",this.reset),this.target.addEventListener("contextmenu",this.reset),this.target.addEventListener("keydown",this.onKeyDown),this.target.addEventListener("keyup",this.onKeyUp),document.addEventListener("click",this.onClick)}},{key:"stop",value:function(){this.target.removeEventListener("blur",this.reset),this.target.removeEventListener("contextmenu",this.reset),this.target.removeEventListener("keydown",this.onKeyDown),this.target.removeEventListener("keyup",this.onKeyUp),document.removeEventListener("click",this.onClick),this.reset()}},{key:"isPressed",value:function(e){return this.keysPressed.has(e)}}]),e}();!function(e){e[e.AxisX=0]="AxisX",e[e.AxisY=1]="AxisY",e[e.AxisZ=2]="AxisZ",e[e.PlaneYZ=3]="PlaneYZ",e[e.PlaneXZ=4]="PlaneXZ",e[e.PlaneXY=5]="PlaneXY"}(re||(re={}));var ge,ke=function(e){function t(e){var n;Object(h.a)(this,t),(n=Object(m.a)(this,Object(v.a)(t).call(this))).project=e,n.objectDragDirection=null,n.isScaling=!1,n.dragOffset=new f.w,n.lastPoint=new f.w,n.plane=new f.n,n.axisX=void 0,n.axisY=void 0,n.axisZ=void 0,n.scaleX=void 0,n.scaleY=void 0,n.scaleZ=void 0,n.planeYZ=void 0,n.planeXZ=void 0,n.planeXY=void 0;var a={transparent:!0,opacity:.75,side:f.f},i=new f.d(.05,.05,.5);n.axisX=new f.i(i,new f.j(Object(d.a)({},a,{color:16711680}))),n.axisX.position.set(.275,0,0),n.axisX.rotation.y=Math.PI/2,n.axisX.userData.direction=re.AxisX,n.axisY=new f.i(i,new f.j(Object(d.a)({},a,{color:65280}))),n.axisY.position.set(0,.275,0),n.axisY.rotation.x=Math.PI/2,n.axisY.userData.direction=re.AxisY,n.axisZ=new f.i(i,new f.j(Object(d.a)({},a,{color:255}))),n.axisZ.position.set(0,0,.275),n.axisZ.userData.direction=re.AxisZ,n.add(n.axisX),n.add(n.axisY),n.add(n.axisZ);var r=new f.u(.05,16,16);n.scaleX=new f.i(r,new f.j(Object(d.a)({},a,{color:16711680}))),n.scaleX.position.set(.65,0,0),n.scaleX.userData.direction=re.AxisX,n.scaleX.userData.isScale=!0,n.scaleY=new f.i(r,new f.j(Object(d.a)({},a,{color:65280}))),n.scaleY.position.set(0,.65,0),n.scaleY.userData.direction=re.AxisY,n.scaleY.userData.isScale=!0,n.scaleZ=new f.i(r,new f.j(Object(d.a)({},a,{color:255}))),n.scaleZ.position.set(0,0,.65),n.scaleZ.userData.direction=re.AxisZ,n.scaleZ.userData.isScale=!0,n.add(n.scaleX),n.add(n.scaleY),n.add(n.scaleZ);var o=new f.o(.25,.25);return n.planeYZ=new f.i(o,new f.j(Object(d.a)({},a,{color:65535}))),n.planeYZ.position.set(0,.25,.25),n.planeYZ.rotation.y=Math.PI/2,n.planeYZ.userData.direction=re.PlaneYZ,n.planeXZ=new f.i(o,new f.j(Object(d.a)({},a,{color:16711935}))),n.planeXZ.position.set(.25,0,.25),n.planeXZ.rotation.x=Math.PI/2,n.planeXZ.userData.direction=re.PlaneXZ,n.planeXY=new f.i(o,new f.j(Object(d.a)({},a,{color:16776960}))),n.planeXY.position.set(.25,.25,0),n.planeXY.userData.direction=re.PlaneXY,n.add(n.planeYZ),n.add(n.planeXZ),n.add(n.planeXY),n}return Object(b.a)(t,e),Object(p.a)(t,[{key:"getControlFromRaycaster",value:function(e){if(!this.project.activeObject)return null;this.position.copy(this.project.activeObject.position);var t=e.intersectObjects(this.children),n=!0,a=!1,i=void 0;try{for(var r,o=t[Symbol.iterator]();!(n=(r=o.next()).done);n=!0){var s=r.value,c=s.object;if(c.userData.hasOwnProperty("direction"))return this.dragOffset.copy(s.point).sub(this.project.activeObject.position),this.lastPoint.copy(s.point),c}}catch(u){a=!0,i=u}finally{try{n||null==o.return||o.return()}finally{if(a)throw i}}return null}},{key:"onClick",value:function(e){var t=this.getControlFromRaycaster(e);return!(!t||!t.userData.hasOwnProperty("direction"))&&(this.objectDragDirection=t.userData.direction,this.isScaling=!!t.userData.isScale,this.onMove(e),!0)}},{key:"onMove",value:function(e){var t=e.ray;if(null!==this.objectDragDirection&&this.project.activeObject){var n=this.project.activeObject.position,a=this.plane,i=null;switch(this.objectDragDirection){case re.AxisX:a.set(new f.w(0,1,0),-n.y),i=new f.n(new f.w(0,0,1),-n.z);break;case re.AxisY:a.set(new f.w(1,0,0),-n.x),i=new f.n(new f.w(0,0,1),-n.z);break;case re.AxisZ:a.set(new f.w(1,0,0),-n.x),i=new f.n(new f.w(0,1,0),-n.y);break;case re.PlaneXY:a.set(new f.w(0,0,1),-n.z);break;case re.PlaneYZ:a.set(new f.w(1,0,0),-n.x);break;case re.PlaneXZ:a.set(new f.w(0,1,0),-n.y)}i&&Math.abs(i.distanceToPoint(t.origin))>Math.abs(a.distanceToPoint(t.origin))&&a.copy(i);var r=t.intersectPlane(a,new f.w);if(r){if(this.isScaling){switch(this.objectDragDirection){case re.AxisX:this.project.activeObject.scale.x=Math.min(Math.max(this.project.activeObject.scale.x+(r.x-this.lastPoint.x),.1),10);break;case re.AxisY:this.project.activeObject.scale.y=Math.min(Math.max(this.project.activeObject.scale.y+(r.y-this.lastPoint.y),.1),10);break;case re.AxisZ:this.project.activeObject.scale.z=Math.min(Math.max(this.project.activeObject.scale.z+(r.z-this.lastPoint.z),.1),10)}this.project.events.onScale(this.project.activeObject.scale)}else{switch(r.sub(this.dragOffset),this.objectDragDirection){case re.AxisX:this.project.activeObject.position.x=r.x;break;case re.AxisY:this.project.activeObject.position.y=r.y;break;case re.AxisZ:this.project.activeObject.position.z=r.z;break;default:this.project.activeObject.position.copy(r)}this.project.events.onTranslate(this.project.activeObject.position)}this.lastPoint.copy(r)}}}}]),t}(f.t);!function(e){e[e.Primary=0]="Primary",e[e.Middle=1]="Middle",e[e.Secondary=2]="Secondary"}(ge||(ge={}));var Ae={x:new f.w(1,0,0),y:new f.w(0,1,0),z:new f.w(0,0,1)},Ee=function(){function e(t){var n=this;Object(h.a)(this,e),this.project=t,this.target=null,this.rafHandle=0,this.previousTimestamp=0,this.audioType=1,this.audioContext=new AudioContext,this.listener=new f.b,this.audioScene=new fe.ResonanceAudio(this.audioContext),this.resListener=new xe(this.audioScene),this.controls=void 0,this.camera=new f.m(75,1,.1,1e3),this.renderer=new f.x,this.canvas=void 0,this.outlineMesh=new f.i,this.raycaster=new f.s,this.keys=new Oe(this.renderer.domElement),this.gamepads=new we,this.isDraggingCamera=!1,this.resize=function(){if(n.target){var e=n.target,t=e.offsetWidth,a=e.offsetHeight;n.camera.aspect=t/a,n.camera.updateProjectionMatrix(),n.renderer.setPixelRatio(window.devicePixelRatio),n.renderer.setSize(t,a)}},this.animate=function(e){n.rafHandle=window.requestAnimationFrame(n.animate);var t=(e-n.previousTimestamp)/1e3;n.previousTimestamp=e,n.update(t),n.renderer.clear(),n.renderer.render(n.project.activeRoom,n.camera),n.project.activeObject&&(n.controls.position.copy(n.project.activeObject.position),n.renderer.clearDepth(),n.renderer.render(n.controls,n.camera))},this.onClick=function(e){},this.onMouseDown=function(e){e.button===ge.Secondary&&(n.isDraggingCamera=!0,n.canvas.requestPointerLock()),e.button===ge.Primary&&(n.updateRaycaster(e),n.controls.onClick(n.raycaster)?n.canvas.style.cursor="grabbing":n.checkSceneClick(n.raycaster))},this.onMouseUp=function(e){e.button===ge.Secondary&&n.isDraggingCamera&&(n.isDraggingCamera=!1,document.exitPointerLock()),e.button===ge.Primary&&null!==n.controls.objectDragDirection&&(n.controls.objectDragDirection=null,n.controls.getControlFromRaycaster(n.raycaster)?n.canvas.style.cursor="grab":n.canvas.style.cursor=null)},this.onMouseMove=function(e){n.isDraggingCamera?(e.movementX&&n.camera.rotateOnWorldAxis(Ae.y,-e.movementX/100),e.movementY&&n.camera.rotateOnAxis(Ae.x,-e.movementY/100)):(n.updateRaycaster(e),null!==n.controls.objectDragDirection?n.controls.onMove(n.raycaster):n.controls.getControlFromRaycaster(n.raycaster)?n.canvas.style.cursor="grab":n.canvas.style.cursor=null)},this.onWheel=function(e){e.preventDefault();var t=e.deltaY;0===e.deltaMode&&(t/=15),n.camera.translateZ(t/10)},this.audioScene.output.connect(this.audioContext.destination),this.audioType=t.audioType,this.renderer.autoClear=!1,this.renderer.setClearColor(new f.e(1649238)),this.canvas=this.renderer.domElement,this.canvas.tabIndex=-1,this.canvas.addEventListener("click",this.onClick),this.canvas.addEventListener("mousedown",this.onMouseDown),this.canvas.addEventListener("mouseup",this.onMouseUp),this.canvas.addEventListener("mousemove",this.onMouseMove),this.canvas.addEventListener("wheel",this.onWheel),this.canvas.addEventListener("contextmenu",function(e){return e.preventDefault(),e.stopPropagation(),!1},!0),this.controls=new ke(t),this.camera.position.z=3,this.camera.position.y=3,this.camera.lookAt(new f.w(0,.5,0));var a=new f.j({color:16777215,side:f.c});this.outlineMesh.material=a,this.outlineMesh.scale.multiplyScalar(1.05),this.camera.add(this.listener),this.camera.add(this.resListener)}return Object(p.a)(e,[{key:"attach",value:function(e){this.keys.listen(),this.gamepads.listen(),this.target=e,e.appendChild(this.canvas),this.resize(),window.requestAnimationFrame(this.animate),window.addEventListener("resize",this.resize)}},{key:"detach",value:function(){window.cancelAnimationFrame(this.rafHandle),window.removeEventListener("resize",this.resize),this.target&&(this.target.removeChild(this.canvas),this.target=null),this.keys.stop(),this.gamepads.stop()}},{key:"focus",value:function(){this.canvas.focus()}},{key:"changeProject",value:function(e){this.project=e,this.controls.project=e,this.selectObject(null)}},{key:"selectObject",value:function(e){this.project.activeObject&&this.project.activeObject.remove(this.outlineMesh),e&&(this.outlineMesh.geometry=e.geometry,e.add(this.outlineMesh)),this.project.activeObject=e,this.project.events.onSelect(e)}},{key:"addAudioToActiveMesh",value:function(){var e=Object(u.a)(c.a.mark(function e(t){var n,a,i;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(this.project.activeObject){e.next=2;break}return e.abrupt("return");case 2:if(0!==this.audioType){e.next=18;break}return(a=this.project.activeObject.getObjectByName("audio"))&&(this.project.activeObject.remove(a),a.stop()),this.project.activeObject.audioId&&this.project.audioLibrary.delete(this.project.activeObject.audioId),this.project.activeObject.audioData=t.slice(0),this.project.activeObject.audioId=this.project.audioLibrary.add(this.project.activeObject.audioData),e.next=10,this.audioContext.decodeAudioData(t);case 10:i=e.sent,(n=new f.q(this.listener)).name="audio",n.setBuffer(i),n.setLoop(!0),n.play(),e.next=20;break;case 18:(n=new ye(this.audioScene,this.audioContext)).play("/audio/breakbeat.wav");case 20:this.project.activeObject.add(n),console.log("Successfully added new audio to selected mesh");case 22:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()},{key:"update",value:function(e){this.keys.isPressed("w")&&this.camera.translateOnAxis(Ae.z,-2*e),this.keys.isPressed("s")&&this.camera.translateOnAxis(Ae.z,2*e),this.keys.isPressed("a")&&this.camera.translateOnAxis(Ae.x,-2*e),this.keys.isPressed("d")&&this.camera.translateOnAxis(Ae.x,2*e),this.keys.isPressed(" ")&&(this.camera.position.y+=2*e),this.keys.isPressed("Shift")&&(this.camera.position.y-=2*e),this.keys.isPressed("ArrowLeft")&&this.camera.rotateOnWorldAxis(Ae.y,e),this.keys.isPressed("ArrowRight")&&this.camera.rotateOnWorldAxis(Ae.y,-e),this.keys.isPressed("ArrowUp")&&this.camera.rotateOnAxis(Ae.x,e),this.keys.isPressed("ArrowDown")&&this.camera.rotateOnAxis(Ae.x,-e);var t=this.gamepads.getAxis(0),n=this.gamepads.getAxis(1),a=this.gamepads.getAxis(2),i=this.gamepads.getAxis(3),r=this.gamepads.getAxis(4);t&&this.camera.translateOnAxis(Ae.x,2*e*t),n&&this.camera.translateOnAxis(Ae.z,2*e*n),r&&this.camera.translateOnAxis(Ae.y,2*e*r),a&&this.camera.rotateOnWorldAxis(Ae.y,-e*a),i&&this.camera.rotateOnAxis(Ae.x,-e*i)}},{key:"checkSceneClick",value:function(e){var t=e.intersectObjects(this.project.activeRoom.children),n=!0,a=!1,i=void 0;try{for(var r,o=t[Symbol.iterator]();!(n=(r=o.next()).done);n=!0){var s=r.value.object;if(s instanceof S)return this.selectObject(s),!0}}catch(c){a=!0,i=c}finally{try{n||null==o.return||o.return()}finally{if(a)throw i}}return this.selectObject(null),!1}},{key:"updateRaycaster",value:function(e){var t=this.renderer.getSize(new f.v),n=(e.pageX-this.canvas.offsetLeft)/t.x*2-1,a=-(e.pageY-this.canvas.offsetTop)/t.y*2+1;this.raycaster.setFromCamera({x:n,y:a},this.camera)}}]),e}(),Ce=function(e){function t(){return Object(h.a)(this,t),Object(m.a)(this,Object(v.a)(t).apply(this,arguments))}return Object(b.a)(t,e),Object(p.a)(t,[{key:"render",value:function(){var e=this.props,t=e.room,n=e.onUpdateName,a=e.onUpdateDimensions;return i.a.createElement("div",null,i.a.createElement(le,null,i.a.createElement("label",null,"Name"),i.a.createElement(de,{type:"text",value:t.name,onChange:function(e){return n(e.currentTarget.value)}})),i.a.createElement(le,null,i.a.createElement("label",null,"Dimensions (width, depth, height)"),i.a.createElement(de,{type:"number",step:1,min:5,max:50,value:t.dimensions.width,onChange:function(e){return a(Object(d.a)({},t.dimensions,{width:e.currentTarget.valueAsNumber}))}}),i.a.createElement(de,{type:"number",step:1,min:5,max:50,value:t.dimensions.depth,onChange:function(e){return a(Object(d.a)({},t.dimensions,{depth:e.currentTarget.valueAsNumber}))}}),i.a.createElement(de,{type:"number",step:1,min:3,max:50,value:t.dimensions.height,onChange:function(e){return a(Object(d.a)({},t.dimensions,{height:e.currentTarget.valueAsNumber}))}})))}}]),t}(i.a.Component),Se=function(e){function t(e){var n;return Object(h.a)(this,t),(n=Object(m.a)(this,Object(v.a)(t).call(this,e))).project=new R,n.projectCanvas=new Ee(n.project),n.state={rooms:n.project.rooms.map(function(e){return{id:e.id,name:e.name,dimensions:e.dimensions}}),selectedRoomId:0,selectedObject:null},n.mainRef=i.a.createRef(),n.onSelectObject=function(e){e?n.setState({selectedObject:{id:e.id,name:e.name,position:e.position,scale:e.scale,rotation:e.rotation}}):n.setState({selectedObject:null})},n.onTranslateObject=function(e){n.setState(function(t){var n=t.selectedObject;return{selectedObject:n&&Object(d.a)({},n,{position:e})}})},n.onScaleObject=function(e){n.setState(function(t){var n=t.selectedObject;return{selectedObject:n&&Object(d.a)({},n,{size:{width:e.x,height:e.y,depth:e.z}})}})},n.updateRoomName=function(e){n.project.activeRoom.name=e,n.setState(function(t){var n=t.rooms,a=t.selectedRoomId;return{rooms:[].concat(Object(l.a)(n.slice(0,a)),[Object(d.a)({},n[a],{name:e})],Object(l.a)(n.slice(a+1)))}})},n.updateRoomDimensions=function(e){n.project.activeRoom.dimensions=e,n.setState(function(t){var n=t.rooms,a=t.selectedRoomId;return{rooms:[].concat(Object(l.a)(n.slice(0,a)),[Object(d.a)({},n[a],{dimensions:e})],Object(l.a)(n.slice(a+1)))}})},n.updateName=function(e){n.project.activeObject&&(n.project.activeObject.name=e),n.setState(function(t){var n=t.selectedObject;return{selectedObject:n&&Object(d.a)({},n,{name:e})}})},n.updateScale=function(e,t,a){n.project.activeObject&&n.project.activeObject.scale.set(e,t,a),n.setState(function(n){var i=n.selectedObject;return{selectedObject:i&&Object(d.a)({},i,{scale:new f.w(e,t,a)})}})},n.updatePosition=function(e,t,a){n.project.activeObject&&n.project.activeObject.position.set(e,t,a),n.setState(function(n){var i=n.selectedObject;return{selectedObject:i&&Object(d.a)({},i,{position:new f.w(e,t,a)})}})},n.updateRotation=function(e,t,a){n.project.activeObject&&n.project.activeObject.rotation.set(e,t,a),n.setState(function(n){var i=n.selectedObject;return{selectedObject:i&&Object(d.a)({},i,{rotation:new f.g(e,t,a)})}})},n.updateAudio=function(e){n.projectCanvas.addAudioToActiveMesh(e)},n.onAddRoomClick=function(){var e=new D(n.project.audioLibrary,"New room",{width:10,depth:10,height:3});n.project.rooms.push(e),n.project.activeRoom=e,n.projectCanvas.selectObject(e.addCube()),n.setState(function(t){return{rooms:[].concat(Object(l.a)(t.rooms),[{id:e.id,name:e.name,dimensions:e.dimensions}]),selectedRoomId:t.rooms.length}})},n.onAddCubeClick=function(){n.project.activeRoom.addCube()},n.onImportClick=function(){var e=document.createElement("input");e.type="file",e.accept="application/zip",e.onchange=function(){var t=Object(u.a)(c.a.mark(function t(a){var i;return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return console.log("selected file"),i=e.files[0],t.next=4,L(i);case 4:n.project=t.sent,n.project.events={onSelect:n.onSelectObject,onTranslate:n.onTranslateObject,onScale:n.onScaleObject},n.projectCanvas.changeProject(n.project),n.setState({rooms:n.project.rooms.map(function(e){return{id:e.id,name:e.name,dimensions:e.dimensions}}),selectedRoomId:0,selectedObject:null});case 8:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.click()},n.onExportClick=function(){g(n.project)},n.project.events={onSelect:n.onSelectObject,onTranslate:n.onTranslateObject,onScale:n.onScaleObject},n}return Object(b.a)(t,e),Object(p.a)(t,[{key:"componentDidMount",value:function(){this.mainRef.current&&(this.projectCanvas.attach(this.mainRef.current),this.projectCanvas.focus())}},{key:"componentWillUnmount",value:function(){this.projectCanvas.detach()}},{key:"selectRoom",value:function(e){this.projectCanvas.selectObject(null),this.project.activeRoom=this.project.rooms[e],this.setState({selectedRoomId:e,selectedObject:null})}},{key:"render",value:function(){var e=this,t=this.state.selectedObject;return i.a.createElement(oe,null,i.a.createElement(J,{onImportProject:this.onImportClick,onExportProject:this.onExportClick,onAddObject:this.onAddCubeClick,onAddRoom:this.onAddRoomClick}),i.a.createElement(se,null,i.a.createElement(ce,null,i.a.createElement(le,null,i.a.createElement("label",null,"Rooms"),i.a.createElement(he,null,this.state.rooms.map(function(t,n){return i.a.createElement(pe,{key:t.id,onClick:function(){return e.selectRoom(n)},active:n===e.state.selectedRoomId},t.name)}))),!t&&i.a.createElement(Ce,{room:this.state.rooms[this.state.selectedRoomId],onUpdateName:this.updateRoomName,onUpdateDimensions:this.updateRoomDimensions}),t&&i.a.createElement(be,{object:t,onUpdateName:this.updateName,onUpdatePosition:this.updatePosition,onUpdateRotation:this.updateRotation,onUpdateScale:this.updateScale,onUpdateAudio:this.updateAudio})),i.a.createElement(ue,{ref:this.mainRef})))}}]),t}(i.a.Component);n(126),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var De=window;!De.AudioContext&&De.webkitAudioContext&&(De.AudioContext=De.webkitAudioContext),o.a.render(i.a.createElement(Se,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},74:function(e,t,n){e.exports=n(128)},87:function(e,t){},89:function(e,t){}},[[74,2,1]]]);
//# sourceMappingURL=main.0d25ea91.chunk.js.map