"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var PIXI = require('pixi.js');
var THREE = require('three');
require("./style.css");
var GLTFLoader_js_1 = require("three/examples/jsm/loaders/GLTFLoader.js");
var _APP = null;
var height = window.innerHeight;
var width = window.innerWidth;
var app;
var renderer;
var camera;
var model;
var idle;
var attack;
var brag;
var defend;
var hit;
var mixer;
var clock;
var ninjaTexture;
var ninjaSprite;
var scene;
/////
window.addEventListener('DOMContentLoaded', function () {
    _APP = new Main();
});
var Main = /** @class */ (function () {
    function Main() {
        this.Main();
    }
    Main.prototype.Main = function () {
        var controlDown = function (event) {
            var step = 10;
            if (event.keyCode == 40) {
                model.position.z += step;
            }
            else if (event.keyCode == 38) {
                model.position.z -= step;
            }
            else if (event.keyCode == 37) {
                model.position.x -= step;
            }
            else if (event.keyCode == 39) {
                model.position.x += step;
            }
            else if (event.keyCode == 49) {
                playAnimation(attack);
            }
            else if (event.keyCode == 50) {
                playAnimation(brag);
            }
            else if (event.keyCode == 51) {
                playAnimation(defend);
            }
            else if (event.keyCode == 52) {
                playAnimation(hit);
            }
        };
        window.addEventListener('keydown', controlDown);
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
        window.onresize = function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        var playAnimation = function (animName) {
            idle.stop();
            animName.setLoop(THREE.LoopOnce);
            animName.play();
            mixer.addEventListener('finished', function (e) {
                var curAction = e.action;
                curAction.reset();
                curAction.stop();
                mixer.stopAllAction();
                idle.play();
            });
        };
        new InitThree();
        new InitPIXI();
    };
    return Main;
}());
var InitThree = /** @class */ (function () {
    function InitThree() {
        this.InitThree();
    }
    InitThree.prototype.InitThree = function () {
        // SCENE
        scene = new THREE.Scene();
        var textureLoader = new THREE.TextureLoader();
        //RENDERER
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        //CAMERA
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.set(75, 100, 75);
        camera.lookAt(0, 0, 0);
        //scene.add(camera);
        //LIGHT
        var light = new THREE.DirectionalLight(0xffffff, 2.25);
        light.position.set(200, 450, 500);
        light.castShadow = true;
        scene.add(light);
        clock = new THREE.Clock();
        var textureNinja = textureLoader.load("./models/ninja.png");
        textureNinja.encoding = THREE.sRGBEncoding;
        var loader = new GLTFLoader_js_1.GLTFLoader();
        loader.load('models/ninja.glb', function (gltf) {
            gltf.scene.scale.set(10, 10, 10);
            gltf.scene.traverse(function (object) {
                if (object.isMesh) {
                    object.material.map = textureNinja;
                    object.material.side = THREE.BackSide;
                }
            });
            model = gltf.scene;
            scene.add(model);
            model.position.z = -20;
            model.castShadow = true;
            mixer = new THREE.AnimationMixer(model);
            attack = mixer.clipAction(gltf.animations[0]);
            brag = mixer.clipAction(gltf.animations[1]);
            defend = mixer.clipAction(gltf.animations[2]);
            hit = mixer.clipAction(gltf.animations[3]);
            idle = mixer.clipAction(gltf.animations[4]);
            var animate = function () {
                requestAnimationFrame(animate);
                var delta = clock.getDelta();
                mixer.update(delta);
                ninjaTexture.update();
                renderer.render(scene, camera);
            };
            idle.play();
            animate();
        });
    };
    return InitThree;
}());
var InitPIXI = /** @class */ (function () {
    function InitPIXI() {
        this.InitPixi();
    }
    InitPIXI.prototype.InitPixi = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pixiContainer, bgTexture, background, text, text2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        app = new PIXI.Application({
                            width: width, height: height,
                            backgroundColor: 0xFF66CC,
                            backgroundAlpha: 0,
                            antialias: false,
                            resizeTo: window
                        });
                        document.body.appendChild(app.view);
                        pixiContainer = new PIXI.Container();
                        app.stage.addChild(pixiContainer);
                        return [4 /*yield*/, PIXI.Texture.from('./textures/golden.jpg')];
                    case 1:
                        bgTexture = _a.sent();
                        return [4 /*yield*/, new PIXI.Sprite(bgTexture)];
                    case 2:
                        background = _a.sent();
                        return [4 /*yield*/, app.stage.addChild(background)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, PIXI.Texture.from(renderer.domElement)];
                    case 4:
                        ninjaTexture = _a.sent();
                        return [4 /*yield*/, new PIXI.Sprite(ninjaTexture)];
                    case 5:
                        ninjaSprite = _a.sent();
                        return [4 /*yield*/, app.stage.addChild(ninjaSprite)];
                    case 6:
                        _a.sent();
                        text = new PIXI.Text("Animations: keys 1-4", { fontSize: 35, fill: 0xffffff });
                        text.x = 200;
                        text.y = 800;
                        app.stage.addChild(text);
                        text2 = new PIXI.Text("Movement: arrow keys", { fontSize: 35, fill: 0xffffff });
                        text2.x = 1400;
                        text2.y = 800;
                        app.stage.addChild(text2);
                        return [2 /*return*/];
                }
            });
        });
    };
    return InitPIXI;
}());
