/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/snake/food.ts":
/*!***************************!*\
  !*** ./src/snake/food.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass Food {\n    constructor(_ctx, posX, posY, _sprite, _unitLength) {\n        this._ctx = _ctx;\n        this.posX = posX;\n        this.posY = posY;\n        this._sprite = _sprite;\n        this._unitLength = _unitLength;\n    }\n    draw() {\n        this._ctx.drawImage(this._sprite, this.posX * this._unitLength, this.posY * this._unitLength, this._unitLength, this._unitLength);\n    }\n    updatePosition(x, y) {\n        this.posX = x;\n        this.posY = y;\n    }\n}\nexports[\"default\"] = Food;\n\n\n//# sourceURL=webpack://games-client/./src/snake/food.ts?");

/***/ }),

/***/ "./src/snake/game.ts":
/*!***************************!*\
  !*** ./src/snake/game.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass Game {\n    constructor(_ctx, _scoreElement, _snake, _food, _gridSize, _length) {\n        this._ctx = _ctx;\n        this._scoreElement = _scoreElement;\n        this._snake = _snake;\n        this._food = _food;\n        this._gridSize = _gridSize;\n        this._length = _length;\n        // shift food position by this amount if spawned inside snake; value should be coprime with number of tiles\n        this._foodSpawnStride = 13;\n    }\n    start() {\n        this._ctx.fillStyle = \"#fff\";\n        this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);\n        window.addEventListener(\"keydown\", this._handleKeyDown.bind(this));\n        requestAnimationFrame((timeStamp) => {\n            this._previousTimeStamp = timeStamp;\n            requestAnimationFrame(this._gameLoop.bind(this));\n        });\n    }\n    get score() {\n        return this._snake.size - 3;\n    }\n    _gameLoop(timeStamp) {\n        const elapsedTime = timeStamp - this._previousTimeStamp;\n        // Draw a frame every 80 ms\n        if (elapsedTime > 80) {\n            this._draw();\n            this._previousTimeStamp = timeStamp;\n        }\n        requestAnimationFrame(this._gameLoop.bind(this));\n    }\n    _draw() {\n        this._ctx.fillStyle = \"#fff\";\n        this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);\n        this._food.draw();\n        this._snake.draw();\n        if (this._snake.isHeadAtPos(this._food.posX, this._food.posY)) {\n            this._snake.grow();\n            this._setNextFoodPosition();\n            this._updateScoreText();\n        }\n        this._ctx.fillStyle = \"#000\";\n        for (let i = 1; i < this._gridSize; i++) {\n            const offset = i * this._length - 1;\n            this._ctx.fillRect(offset, 0, 1, this._ctx.canvas.height);\n            this._ctx.fillRect(0, offset, this._ctx.canvas.width, 1);\n        }\n    }\n    _handleKeyDown(event) {\n        switch (event.key.toLowerCase()) {\n            case \"w\":\n            case \"arrowup\":\n                this._snake.setDirection(0, -1);\n                break;\n            case \"a\":\n            case \"arrowleft\":\n                this._snake.setDirection(-1, 0);\n                break;\n            case \"s\":\n            case \"arrowdown\":\n                this._snake.setDirection(0, 1);\n                break;\n            case \"d\":\n            case \"arrowright\":\n                this._snake.setDirection(1, 0);\n                break;\n        }\n    }\n    _setNextFoodPosition() {\n        const numCells = this._gridSize * this._gridSize;\n        let newPosition = Math.floor(Math.random() * numCells);\n        for (let i = 0; i < numCells; i++) {\n            const x = newPosition % this._gridSize;\n            const y = Math.floor(newPosition / this._gridSize);\n            if (!this._snake.contains(x, y)) {\n                this._food.updatePosition(x, y);\n                break;\n            }\n            newPosition = (newPosition + this._foodSpawnStride) % numCells;\n        }\n    }\n    _updateScoreText() {\n        this._scoreElement.textContent = String(this.score);\n    }\n}\nexports[\"default\"] = Game;\n\n\n//# sourceURL=webpack://games-client/./src/snake/game.ts?");

/***/ }),

/***/ "./src/snake/main.ts":
/*!***************************!*\
  !*** ./src/snake/main.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nvar _a, _b, _c, _d;\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst game_1 = __importDefault(__webpack_require__(/*! ./game */ \"./src/snake/game.ts\"));\nconst snake_1 = __importDefault(__webpack_require__(/*! ./snake */ \"./src/snake/snake.ts\"));\nconst food_1 = __importDefault(__webpack_require__(/*! ./food */ \"./src/snake/food.ts\"));\nconst sound_1 = __webpack_require__(/*! ./sound */ \"./src/snake/sound.ts\");\nfunction loadImage(source) {\n    const image = new Image();\n    return new Promise((resolve, reject) => {\n        image.onload = () => {\n            resolve(image);\n        };\n        image.onerror = () => {\n            reject(`Could not load image [${source}]`);\n        };\n        image.src = source;\n    });\n}\nconst gridSize = 16;\nconst unitLength = 30;\nconst canvas = document.createElement(\"canvas\");\n(_a = document.getElementById(\"canvas-container\")) === null || _a === void 0 ? void 0 : _a.appendChild(canvas);\ncanvas.width = gridSize * unitLength;\ncanvas.height = gridSize * unitLength;\nconst context = canvas.getContext(\"2d\", { alpha: false });\nif (!context) {\n    throw new Error(\"2d context is not supported by browser\");\n}\nconst scoreElement = (_b = document.getElementById(\"score-field\")) === null || _b === void 0 ? void 0 : _b.getElementsByTagName(\"span\")[0];\nif (!scoreElement) {\n    throw Error(\"score-field element not found\");\n}\nconst nameInputElement = (_c = document.getElementById(\"name-field\")) === null || _c === void 0 ? void 0 : _c.getElementsByTagName(\"input\")[0];\nif (!nameInputElement) {\n    throw Error(\"name-field element not found\");\n}\nconst submitButtonElement = (_d = document.getElementById(\"submit-button\")) === null || _d === void 0 ? void 0 : _d.getElementsByTagName(\"button\")[0];\nif (!submitButtonElement) {\n    throw Error(\"submit-button element not found\");\n}\nPromise.all([\n    loadImage(\"/images/apple.png\"),\n    (0, sound_1.loadAudioBuffer)(\"/sounds/pop.wav\")\n]).then(([image, popAudioBuffer]) => {\n    const growSound = new sound_1.Sound(popAudioBuffer);\n    const snake = new snake_1.default(context, nameInputElement, submitButtonElement, growSound, gridSize, unitLength);\n    const food = new food_1.default(context, 10, 10, image, unitLength);\n    const game = new game_1.default(context, scoreElement, snake, food, gridSize, unitLength);\n    submitButtonElement.addEventListener(\"click\", () => {\n        nameInputElement.disabled = true;\n        submitButtonElement.disabled = true;\n        const name = nameInputElement.value;\n        if (name.length < 3) {\n            alert(\"Name is too short\");\n            return;\n        }\n        if (name.length > 8) {\n            alert(\"Name is too long\");\n            return;\n        }\n        const snakeScore = {\n            score: game.score,\n            playerName: name,\n        };\n        fetch(\"/snake/scores\", {\n            method: \"put\",\n            headers: {\n                \"Accept\": \"application/json\",\n                \"Content-Type\": \"application/json\"\n            },\n            body: JSON.stringify(snakeScore)\n        }).then(() => {\n            window.location.reload();\n        }).catch((e) => {\n            console.error(e);\n        }).finally(() => {\n            nameInputElement.disabled = false;\n            submitButtonElement.disabled = false;\n        });\n    });\n    game.start();\n});\n// Render player scores in score-table element\nfetch(\"/snake/scores\").then((res) => {\n    var _a;\n    const scoreTableBody = (_a = document.getElementById(\"score-table\")) === null || _a === void 0 ? void 0 : _a.getElementsByTagName(\"tbody\")[0];\n    if (!scoreTableBody) {\n        console.warn(\"Score table body not found\");\n        return;\n    }\n    res.json().then((scores) => {\n        var _a;\n        for (const score of scores) {\n            const row = scoreTableBody.insertRow();\n            const scoreCell = row.insertCell();\n            const scoreNode = document.createTextNode(String(score.score));\n            scoreCell.appendChild(scoreNode);\n            const nameCell = row.insertCell();\n            const nameNode = document.createTextNode(score.playerName);\n            nameCell.appendChild(nameNode);\n            const dateCell = row.insertCell();\n            const dateNode = document.createTextNode((_a = score.creationDate) !== null && _a !== void 0 ? _a : \"\");\n            dateCell.appendChild(dateNode);\n        }\n    });\n}).catch((e) => {\n    console.error(e);\n});\n\n\n//# sourceURL=webpack://games-client/./src/snake/main.ts?");

/***/ }),

/***/ "./src/snake/snake.ts":
/*!****************************!*\
  !*** ./src/snake/snake.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass Snake {\n    constructor(_ctx, _nameInputElement, _submitButtonElement, _growSound, _gridSize, _unitLength) {\n        this._ctx = _ctx;\n        this._nameInputElement = _nameInputElement;\n        this._submitButtonElement = _submitButtonElement;\n        this._growSound = _growSound;\n        this._gridSize = _gridSize;\n        this._unitLength = _unitLength;\n        this.isDead = false;\n        this._dx = 0;\n        this._dy = 0;\n        this._posX = [5, 4, 3];\n        this._posY = [10, 10, 10];\n    }\n    draw() {\n        if (!this.isDead) {\n            this.isDead = this._hasCollided();\n            if (this.isDead) {\n                this._nameInputElement.disabled = false;\n                this._submitButtonElement.disabled = false;\n            }\n        }\n        if (!this.isStationary() && !this.isDead) {\n            this._posX.unshift(this._posX[0] + this._dx);\n            this._posY.unshift(this._posY[0] + this._dy);\n            this._posX.pop();\n            this._posY.pop();\n        }\n        this._ctx.fillStyle = this.isDead ? \"#880000\" : \"#008800\";\n        for (let i = 0; i < this.size; i++) {\n            this._ctx.fillRect(this._posX[i] * this._unitLength, this._posY[i] * this._unitLength, this._unitLength, this._unitLength);\n        }\n    }\n    setDirection(dx, dy) {\n        const dirX = this._posX[0] - this._posX[1];\n        const dirY = this._posY[0] - this._posY[1];\n        if (dirX * dx < 0 || dirY * dy < 0) {\n            return;\n        }\n        this._dx = dx;\n        this._dy = dy;\n    }\n    grow() {\n        this._growSound.play();\n        const size = this.size;\n        this._posX.push(2 * this._posX[size - 1] - this._posX[size - 2]);\n        this._posY.push(2 * this._posY[size - 1] - this._posY[size - 2]);\n    }\n    isStationary() {\n        return this._dx === 0 && this._dy === 0;\n    }\n    _hasCollided() {\n        for (let i = 1; i < this.size; i++) {\n            if (this._posX[0] === this._posX[i] && this._posY[0] === this._posY[i]) {\n                return true;\n            }\n        }\n        return this._posX[0] < 0\n            || this._posX[0] >= this._gridSize\n            || this._posY[0] < 0\n            || this._posY[0] >= this._gridSize;\n    }\n    get size() {\n        return this._posX.length;\n    }\n    isHeadAtPos(x, y) {\n        return this._posX[0] === x && this._posY[0] === y;\n    }\n    contains(x, y) {\n        for (let i = 0; i < this.size; i++) {\n            if (this._posX[i] === x && this._posY[i] === y) {\n                return true;\n            }\n        }\n        return false;\n    }\n}\nexports[\"default\"] = Snake;\n\n\n//# sourceURL=webpack://games-client/./src/snake/snake.ts?");

/***/ }),

/***/ "./src/snake/sound.ts":
/*!****************************!*\
  !*** ./src/snake/sound.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports) {

eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar _a;\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.loadAudioBuffer = exports.Sound = void 0;\n// Get cross-browser AudioContext (Safari still uses webkitAudioContext…)\nconst AudioContext = (_a = window.AudioContext) !== null && _a !== void 0 ? _a : window.webkitAudioContext;\nconst audioContext = new AudioContext();\nconst gainNode = audioContext.createGain();\ngainNode.connect(audioContext.destination);\nclass Sound {\n    constructor(_audioBuffer) {\n        this._audioBuffer = _audioBuffer;\n        this._gainNode = audioContext.createGain();\n        this._gainNode.connect(gainNode);\n    }\n    play() {\n        const source = audioContext.createBufferSource();\n        source.buffer = this._audioBuffer;\n        source.loop = false;\n        source.connect(this._gainNode);\n        source.start();\n    }\n}\nexports.Sound = Sound;\nfunction loadAudioBuffer(source) {\n    return __awaiter(this, void 0, void 0, function* () {\n        const arrayBuffer = yield (yield fetch(source)).arrayBuffer();\n        return new Promise((resolve, reject) => {\n            audioContext.decodeAudioData(arrayBuffer, buffer => resolve(buffer), error => reject(error));\n        });\n    });\n}\nexports.loadAudioBuffer = loadAudioBuffer;\n\n\n//# sourceURL=webpack://games-client/./src/snake/sound.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/snake/main.ts");
/******/ 	
/******/ })()
;