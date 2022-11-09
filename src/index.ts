const PIXI = require('pixi.js');
const THREE = require('three');
import './style.css';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationClip, Group } from 'three';

let _APP = null;
let height = window.innerHeight;
let width = window.innerWidth;

let app: any;
let renderer: { setSize: (arg0: number, arg1: number) => void; setPixelRatio: (arg0: number) => void; shadowMap: { enabled: boolean; }; render: (arg0: { add: (arg0: Group) => void; }, arg1: { aspect: number; updateProjectionMatrix: () => void; position: { set: (arg0: number, arg1: number, arg2: number) => void; }; lookAt: (arg0: number, arg1: number, arg2: number) => void; }) => void; domElement: any; };
let camera: { aspect: number; updateProjectionMatrix: () => void; position: { set: (arg0: number, arg1: number, arg2: number) => void; }; lookAt: (arg0: number, arg1: number, arg2: number) => void; };
let model: Group;
let idle: { stop: () => void; play: () => void; };
let attack: { setLoop: (arg0: any) => void; play: () => void; };
let brag: { setLoop: (arg0: any) => void; play: () => void; };
let defend: { setLoop: (arg0: any) => void; play: () => void; };
let hit: { setLoop: (arg0: any) => void; play: () => void; };
let mixer: any;
let clock: { getDelta: () => any; };
let ninjaTexture: { update: () => void; };
let ninjaSprite;
let scene: { add: (arg0: Group) => void; };

/////

window.addEventListener('DOMContentLoaded', () => {
	_APP = new Main();
});

class Main {

	constructor() {
		this.Main();
	}


	Main() {

		const controlDown = (event: KeyboardEvent) => {
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

		window.addEventListener('keydown', controlDown);

		PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;

		window.onresize = () => {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);

		};

		let playAnimation = (animName: { setLoop: (arg0: any) => void; play: () => void; }) => {
			idle.stop();
			animName.setLoop(THREE.LoopOnce);
			animName.play();
			mixer.addEventListener('finished', function (e: { action: any; }) {
				let curAction = e.action;
				curAction.reset();
				curAction.stop();
				mixer.stopAllAction();
				idle.play();
			});

		};
		new InitThree();
		new InitPIXI();

	}
}

class InitThree {
	constructor() {
		this.InitThree();
	}

	InitThree() {
		// SCENE
		scene = new THREE.Scene();
		const textureLoader = new THREE.TextureLoader();

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
		const light = new THREE.DirectionalLight(0xffffff, 2.25);
		light.position.set(200, 450, 500);
		light.castShadow = true;
		scene.add(light);

		clock = new THREE.Clock();


		const textureNinja = textureLoader.load("./models/ninja.png");
		textureNinja.encoding = THREE.sRGBEncoding;

		const loader = new GLTFLoader()
		loader.load('models/ninja.glb', (gltf) => {
			gltf.scene.scale.set(10, 10, 10);
			gltf.scene.traverse(function (object: any) {

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

			let animate = () => {

				requestAnimationFrame(animate);

				const delta = clock.getDelta();

				mixer.update(delta);
				ninjaTexture.update();

				renderer.render(scene, camera);
			}

			idle.play();
			animate();

		});

	}

}

class InitPIXI {
	constructor() {
		this.InitPixi();
	}

	async InitPixi() {
		app = new PIXI.Application({
			width: width, height: height,
			backgroundColor: 0xFF66CC,
			backgroundAlpha: 0,
			antialias: false,
			resizeTo: window,
		});

		document.body.appendChild(app.view);

		const pixiContainer = new PIXI.Container();
		app.stage.addChild(pixiContainer);

		const bgTexture = await PIXI.Texture.from('./textures/golden.jpg');
		const background = await new PIXI.Sprite(bgTexture);
		await app.stage.addChild(background);

		ninjaTexture = await PIXI.Texture.from(renderer.domElement);
		ninjaSprite = await new PIXI.Sprite(ninjaTexture);
		await app.stage.addChild(ninjaSprite);

		let text = new PIXI.Text("Animations: keys 1-4", { fontSize: 35, fill: 0xffffff })
		text.x = 200;
		text.y = 800;
		app.stage.addChild(text);

		let text2 = new PIXI.Text("Movement: arrow keys", { fontSize: 35, fill: 0xffffff })
		text2.x = 1400;
		text2.y = 800;
		app.stage.addChild(text2);

	}

}




