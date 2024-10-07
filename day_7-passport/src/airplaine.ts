import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";
// Setup

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.setZ(100);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true;

const keyLight = new THREE.DirectionalLight(
  new THREE.Color("hsl(30, 100%, 75%)"),
  1.0
);
keyLight.position.set(-100, 0, 100);
const fillLight = new THREE.DirectionalLight(
  new THREE.Color("hsl(240, 100%, 75%)"),
  0.75
);
fillLight.position.set(100, 0, 100);
const backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();

scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);

const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

animate();

const loader = new OBJLoader();
loader.load(
  "./src/assets/11803_Airplane_v1_l1.obj",
  function (object) {
    scene.add(object);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened", error);
  }
);
