import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

import { MTLLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";
// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setY(50);
renderer.render(scene, camera);

// Torus

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.z = t * -1;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
  console.log(camera.position.z);
}

document.body.onscroll = moveCamera;
moveCamera();

let airplane: THREE.Group<THREE.Object3DEventMap> | null = null;

let aux = -0.001;

function animate() {
  requestAnimationFrame(animate);

  if (airplane) {
    airplane.position.x += 0.1;
    if (airplane.position.x > 80) airplane.position.x = -80;
    const maxRotation = 3.8;
    const minRotation = 2.8;
    const airplaneRotation = airplane.rotation.x;
    if (airplaneRotation > maxRotation) aux = -0.001;
    if (airplaneRotation < minRotation) aux = 0.001;
    airplane.rotation.x += aux;
    console.log(airplane.rotation.x, aux);
  }

  controls.update();

  renderer.render(scene, camera);
}

animate();

// -------- OBJ Loader --------
const mtlLoader = new MTLLoader();
mtlLoader.load("./src/assets/11803_Airplane_v1_l1.mtl", function (materials) {
  materials.preload();
  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load(
    "./src/assets/11803_Airplane_v1_l1.obj",
    function (object) {
      object.scale.set(0.01, 0.01, 0.01);
      const loader = new OBJLoader();
      loader.setMaterials(materials);
      loader.load(
        "./src/assets/11803_Airplane_v1_l1.obj",
        function (object) {
          object.scale.set(0.01, 0.01, 0.01);
          scene.add(object);
          airplane = object;
        },
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        function (error) {
          console.log("An error happened", error);
        }
      );
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.log("An error happened", error);
    }
  );
});
