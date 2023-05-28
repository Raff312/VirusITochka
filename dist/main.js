(()=>{"use strict";class e{static minMax(e,t,i){return Math.min(Math.max(e,t),i)}static generateRandomNumber(e,t){const i=Math.ceil(e),s=Math.floor(t);return Math.floor(Math.random()*(s-i+1))+i}}class t{constructor(e){this.history=new Array,this.stateCounter=0,this.countOfHealthyCells=0,this.area=e,this.saveHistory()}get isAreaUnchangeable(){return this.area.size*this.area.size===this.countOfHealthyCells}next(){if(0===this.stateCounter||!this.isAreaUnchangeable){if(this.countOfHealthyCells=0,0===this.stateCounter){const e={i:Math.floor(this.area.size/2),j:Math.floor(this.area.size/2)};if(!this.area.infectCell(e))throw new Error("Unable to infect first cell")}for(let e=0;e<this.area.size;e++)for(let t=0;t<this.area.size;t++){const i={i:e,j:t},s=this.area.getCell(i);if(s){switch(s.state){case"infected":s.stateLifetime>0&&this.processInfectedCell(s,i);break;case"immune":this.processImmuneCell(s,i);break;case"healthy":this.countOfHealthyCells++}s.incrementLifeTime()}}this.stateCounter++,this.saveHistory()}}processInfectedCell(t,i){if(t.stateLifetime>5)this.area.immunizeCell(i);else{const t=this.area.getHealthyNeighborCoords(i),s=e.generateRandomNumber(0,1);if(t.length>0&&0===s){const i=e.generateRandomNumber(0,t.length-1);this.area.infectCell(t[i])}}}processImmuneCell(e,t){e.stateLifetime>3&&this.area.recoverCell(t)}reset(){this.area.resetCells(),this.resetHistory(),this.stateCounter=0}resetHistory(){this.history=[],this.saveHistory()}saveHistory(){this.history.push(this.area.copy())}}class i{constructor(e="healthy",t=0){this._state="healthy",this._stateLifetime=0,this._state=e,this._stateLifetime=t}get state(){return this._state}get stateLifetime(){return this._stateLifetime}infect(){return"healthy"===this._state&&(this._state="infected",this._stateLifetime=0,!0)}immunize(){return"infected"===this._state&&(this._state="immune",this._stateLifetime=0,!0)}recover(){return"immune"===this._state&&(this._state="healthy",this._stateLifetime=0,!0)}reset(){this._state="healthy",this._stateLifetime=0}incrementLifeTime(){this._stateLifetime++}copy(){return new i(this._state,this._stateLifetime)}}class s{constructor(e,t,i){this._size=3,this._cells=new Array,this.renderer=e,this.size=t,this.initCells(i)}initCells(e){this._cells=new Array;for(let t=0;t<this._size;t++){this._cells.push(new Array);for(let s=0;s<this._size;s++){const r=e&&e[t][s]?e[t][s].copy():new i;this._cells[t].push(r)}}}get size(){return this._size}set size(t){this._size!==t&&(t=e.minMax(t,s.MIN_SIZE,s.MAX_SIZE),this._size=1&t?t:t-1,this.initCells())}resetCells(){this._cells.forEach((e=>{e.forEach((e=>e.reset()))})),this.render()}infectCell(e){var t;const i=this.getCell(e),s=null!==(t=null==i?void 0:i.infect())&&void 0!==t&&t;return this.renderer.renderCell(i,e),s}immunizeCell(e){var t;const i=this.getCell(e),s=null!==(t=null==i?void 0:i.immunize())&&void 0!==t&&t;return this.renderer.renderCell(i,e),s}recoverCell(e){var t;const i=this.getCell(e),s=null!==(t=null==i?void 0:i.recover())&&void 0!==t&&t;return this.renderer.renderCell(i,e),s}render(){this.renderer.render(this)}getCell(t){const i=e.minMax(t.i,0,this._cells.length),s=e.minMax(t.j,0,this._cells[0].length);try{return this._cells[i][s]}catch(e){return null}}getHealthyNeighborCoords(e){const t=new Array;return[{i:e.i,j:e.j-1},{i:e.i-1,j:e.j-1},{i:e.i-1,j:e.j},{i:e.i-1,j:e.j+1},{i:e.i,j:e.j+1},{i:e.i+1,j:e.j+1},{i:e.i+1,j:e.j},{i:e.i+1,j:e.j-1}].forEach((e=>{try{this._cells[e.i][e.j]&&"healthy"===this._cells[e.i][e.j].state&&t.push(e)}catch(e){}})),t}copy(){return new s(this.renderer,this._size,this._cells)}}s.MIN_SIZE=3,s.MAX_SIZE=111;class r{constructor(){if(this.BORDER_SIZE=2,this.cellSize=100,this.canvasEl=document.getElementById("canvas"),this.ctx=this.canvasEl.getContext("2d"),!this.canvasEl||!this.ctx)throw new Error("Unable to create AreaRenderer")}render(e){this.cellSize=(this.canvasEl.width-this.BORDER_SIZE)/e.size,this.ctx.fillStyle="#000",this.ctx.fillRect(0,0,this.canvasEl.width,this.canvasEl.height);for(let t=0;t<e.size;t++)for(let i=0;i<e.size;i++){const s={i:t,j:i};this.renderCell(e.getCell(s),s)}}renderCell(e,t){e&&(this.ctx.fillStyle=this.getCellColor(e),this.ctx.fillRect(t.j*this.cellSize+this.BORDER_SIZE,t.i*this.cellSize+this.BORDER_SIZE,this.cellSize-this.BORDER_SIZE,this.cellSize-this.BORDER_SIZE))}getCellColor(e){if(!e)return"#ffffff";switch(e.state){case"infected":return"#c71010";case"immune":return"#c7c110";case"healthy":return"#00992b";default:return"#ffffff"}}}class a{constructor(){this.timeoutInSec=.3,this.areaRenderer=new r,this.area=new s(this.areaRenderer,5),this.areaStateManager=new t(this.area),this.gameTickCounter=0,this.running=!1,this.dateStart=0,this.animationRequestId=0,this.gameTick=e=>{(!this.dateStart||e-this.dateStart>=1e3*this.timeoutInSec)&&(this.dateStart=e,this.areaStateManager.next(),this.areaStateManager.isAreaUnchangeable&&(this.stop(),this.reset()),this.gameTickCounter++),this.running&&window.requestAnimationFrame(this.gameTick)}}init(){this.area.render()}start(){this.running||(this.area.render(),this.startGameAnimation(),this.running=!0)}startGameAnimation(){this.animationRequestId=window.requestAnimationFrame(this.gameTick)}stop(){this.stopGameAnimation(),this.running=!1}stopGameAnimation(){window.cancelAnimationFrame(this.animationRequestId),this.animationRequestId=0}reset(){this.areaStateManager.reset(),this.gameTickCounter=0,this.stop()}setSize(e){this.area.size=e,this.area.render()}getSize(){return this.area.size}}(e=>{const t=new a;e.game=t,t.init();const i=document.getElementById("timeout");i.addEventListener("input",(()=>{window.game.timeoutInSec=parseFloat(i.value)}));const s=document.getElementById("area-size");s.addEventListener("input",(()=>{window.game.setSize(parseInt(s.value))})),t.timeoutInSec=Number.parseFloat(i.value),t.setSize(Number.parseInt(s.value))})(window)})();
//# sourceMappingURL=main.js.map