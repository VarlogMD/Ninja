"use strict";
/// IMPORT FOR THREE.JS IS NOT WORKING ON TYPESCRIPT/////////////////////////
exports.__esModule = true;
var THREE = require("https://threejs.org/build/three.module.js");
var GLTFLoader_js_1 = require("https://threejs.org/examples/jsm/loaders/GLTFLoader.js");
var Main = /** @class */ (function () {
    function Main() {
        this.Main();
    }
    Main.prototype.Main = function () {
        var height = window.innerHeight;
        var width = window.innerWidth;
        var mixer, model, clock, renderer, scene, camera, light;
        var attack, idle, brag, defend, hit;
        var app;
        var ninjaTexture;
        var ninjaSprite;
        var container = document.getElementById('container');
        document.addEventListener('keydown', onKeyDown);
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
        var initTHREE = function () {
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
            light = new THREE.DirectionalLight(0xffffff, 2.25);
            light.position.set(200, 450, 500);
            light.castShadow = true;
            scene.add(light);
            clock = new THREE.Clock();
            var textureNinja = textureLoader.load("./ninja/ninja.png");
            textureNinja.encoding = THREE.sRGBEncoding;
            var loader = new GLTFLoader_js_1.GLTFLoader();
            loader.load('ninja/ninja.glb', function (gltf) {
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
                model.castShadows = true;
                mixer = new THREE.AnimationMixer(model);
                attack = mixer.clipAction(gltf.animations[0]);
                brag = mixer.clipAction(gltf.animations[1]);
                defend = mixer.clipAction(gltf.animations[2]);
                hit = mixer.clipAction(gltf.animations[3]);
                idle = mixer.clipAction(gltf.animations[4]);
                idle.play();
                animate();
            });
        };
        ////////////////////
        var initPIXI = function () {
            app = new PIXI.Application({
                width: width, height: height,
                backgroundColor: 0xFF66CC,
                backgroundAlpha: 0,
                antialias: false,
                resizeTo: window
            });
            document.body.appendChild(app.view);
            var pixiContainer = new PIXI.Container();
            app.stage.addChild(pixiContainer);
            var bgTexture = PIXI.BaseTexture.from('textures/golden.jpg');
            var background = new PIXI.Sprite.from(new PIXI.Texture(bgTexture));
            app.stage.addChild(background);
            ninjaTexture = PIXI.Texture.from(renderer.domElement);
            ninjaSprite = new PIXI.Sprite.from(new PIXI.Texture(ninjaTexture));
            app.stage.addChild(ninjaSprite);
            var text = new PIXI.Text("Animations: keys 1-4", { fontSize: 35, fill: 0xffffff });
            text.x = 200;
            text.y = 800;
            app.stage.addChild(text);
            var text2 = new PIXI.Text("Movement: arrow keys", { fontSize: 35, fill: 0xffffff });
            text2.x = 1400;
            text2.y = 800;
            app.stage.addChild(text2);
        };
        window.onresize = function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        function onKeyDown(event) {
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
        }
        ;
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
        var animate = function () {
            requestAnimationFrame(animate);
            var delta = clock.getDelta();
            mixer.update(delta);
            ninjaTexture.update();
            renderer.render(scene, camera);
        };
        initTHREE();
        initPIXI();
    };
    return Main;
}());
var _APP = null;
window.addEventListener('DOMContentLoaded', function () {
    _APP = new Main();
});
