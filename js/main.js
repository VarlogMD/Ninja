
import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Main {

	constructor() {
		this.Main();
	}

	Main() {
		let height = window.innerHeight;
		let width = window.innerWidth;


		let mixer, model, clock, renderer, scene, camera, light;
		let attack, idle, brag, defend, hit;

		let app;

		let ninjaTexture;
		let ninjaSprite;

		const container = document.getElementById('container');
		document.addEventListener('keydown', onKeyDown);


		PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;


		let initTHREE = () => {
			// SCENE

			scene = new THREE.Scene();

			let textureLoader = new THREE.TextureLoader()


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


			let textureNinja = textureLoader.load("./models/ninja.png");
			textureNinja.encoding = THREE.sRGBEncoding;



			const loader = new GLTFLoader()
			loader.load('models/ninja.glb', (gltf) => {
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

		let initPIXI = () => {
			app = new PIXI.Application({
				width: width, height: height,
				backgroundColor: 0xFF66CC,
				backgroundAlpha: 0,
				antialias: false,
				resizeTo: window,
			});
			document.body.appendChild(app.view);

			let pixiContainer = new PIXI.Container();

			app.stage.addChild(pixiContainer);

			const bgTexture = PIXI.BaseTexture.from('textures/golden.jpg');
			const background = new PIXI.Sprite.from(new PIXI.Texture(bgTexture));
			app.stage.addChild(background);


			ninjaTexture = PIXI.Texture.from(renderer.domElement);
			ninjaSprite = new PIXI.Sprite.from(new PIXI.Texture(ninjaTexture));
			app.stage.addChild(ninjaSprite);


			let text = new PIXI.Text("Animations: keys 1-4", { fontSize: 35, fill: 0xffffff })
			text.x = 200;
			text.y = 800;
			app.stage.addChild(text);

			let text2 = new PIXI.Text("Movement: arrow keys", { fontSize: 35, fill: 0xffffff })
			text2.x = 1400;
			text2.y = 800;
			app.stage.addChild(text2);


		}



		window.onresize = () => {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);

		};

		function onKeyDown(event) {
			const step = 10;
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


		let playAnimation = (animName) => {
			idle.stop();
			animName.setLoop(THREE.LoopOnce);
			animName.play();
			mixer.addEventListener('finished', function (e) {
				let curAction = e.action;
				curAction.reset();
				curAction.stop();
				mixer.stopAllAction();
				idle.play();
			});

		};


		let animate = () => {

			requestAnimationFrame(animate);

			const delta = clock.getDelta();

			mixer.update(delta);
			ninjaTexture.update();

			renderer.render(scene, camera);
		}
		initTHREE();
		initPIXI();





	}


}


let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
	_APP = new Main();
});

