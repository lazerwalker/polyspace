import { recognize } from "./speechServices";
import { searchPoly } from "./googlePoly";
import * as BABYLON from "babylonjs";
import * as GUI from "@babylonjs/gui";
import "babylonjs-loaders";

import WebXRPolyfill from "webxr-polyfill";
const polyfill = new WebXRPolyfill();

let scene: BABYLON.Scene;
let engine: BABYLON.Engine;

const getMicInput = async () => {
  const rawText = (await recognize()).text;
  console.log(rawText);
  const searchResults = await searchPoly(rawText);

  const asset = searchResults.assets[0];
  await spawnAssetIntoScene(asset);
  console.log("Loaded?");
};

var createScene = async function (canvas: HTMLCanvasElement) {
  engine = new BABYLON.Engine(canvas, true);

  // This creates a basic Babylon Scene object (non-mesh)
  scene = new BABYLON.Scene(engine);

  scene.createDefaultCameraOrLight(true, true, true);

  // Our built-in 'sphere' shape.
  var sphere = BABYLON.MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 1.4, segments: 32 },
    scene
  );

  // Move the sphere upward 1/2 its height
  sphere.position.y = 1;

  sphere.material = new BABYLON.StandardMaterial("sphereMat", scene);

  const environment = scene.createDefaultEnvironment({
    groundColor: BABYLON.Color3.White(),
  });

  // XR
  const xr = await scene.createDefaultXRExperienceAsync({
    floorMeshes: [environment.ground],
  });

  xr.input.onControllerAddedObservable.add((xrController) => {
    alert(xrController.motionController.getComponentIds());
    // xrController.motionController.getComponent(WebXRControllerComponent)
    // more fun with the new controller, since we are in XR!

    // get the motionController, which is similar to but NOT a gamepad:
    const motionController = xrController.motionController;
    // xr supports all types of inputs, so some won't have a motion controller
    if (!motionController) {
      // using touch, hands, gaze, something else?
    }

    // mainComponent.onButtonStateChanged.add((component /* WebXRControllerComponent  ) => {
    // // check for changes:
    // // pressed changed?
    // if (component.changes.pressed) {
    //     // is it pressed?
    //     if (component.changes.pressed.current === true) {
    //         // pressed
    //     }
    //     // or a differend way:
    //     if (component.pressed) {
    //         // component is pressed.
    //     }
    // }

    //       getMicInput();
  });

  return scene;
};

/**
const createScene = async (canvas: HTMLCanvasElement) => {
  engine = new BABYLON.Engine(canvas, true);
  scene = new BABYLON.Scene(engine);

  const env = scene.createDefaultEnvironment({
    groundColor: BABYLON.Color3.White(),
  });

  const xr = await scene.createDefaultXRExperienceAsync({
    floorMeshes: [env.ground],
  });

  scene.createDefaultCameraOrLight(true, true, true);

  var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
  sphere.position.y = 1;

  scene.onKeyboardObservable.add((kbInfo) => {
    if (
      kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN &&
      kbInfo.event.key === "Escape"
    ) {
      getMicInput();
    }
  });

  let selectedMesh: BABYLON.AbstractMesh;
  // xr.input.onNewMeshSelected.add(function (mesh) {
  //   selectedMesh = mesh;
  // });

  // vrHelper.onSelectedMeshUnselected.add(function () {
  //   selectedMesh = null;
  // });

  // vrHelper.onControllerMeshLoaded.add((webVRController) => {
  //   webVRController.onTriggerStateChangedObservable.add((stateObject) => {
  //     if (webVRController.hand == "left") {
  //       if (selectedMesh != null && selectedMesh.name !== "ground") {
  //         //grab
  //         if (stateObject.value > 0.01) {
  //           webVRController.mesh.addChild(selectedMesh);
  //           //ungrab
  //         } else {
  //           webVRController.mesh.removeChild(selectedMesh);
  //         }
  //       }
  //     }
  //   });

  xr.input.onControllerAddedObservable.add((xrController) => {
    alert(xrController.motionController.getComponentIds());
    // xrController.motionController.getComponent(WebXRControllerComponent)
    // more fun with the new controller, since we are in XR!

    // get the motionController, which is similar to but NOT a gamepad:
    const motionController = xrController.motionController;
    // xr supports all types of inputs, so some won't have a motion controller
    if (!motionController) {
      // using touch, hands, gaze, something else?
    }

    // mainComponent.onButtonStateChanged.add((component /* WebXRControllerComponent  ) => {
    // // check for changes:
    // // pressed changed?
    // if (component.changes.pressed) {
    //     // is it pressed?
    //     if (component.changes.pressed.current === true) {
    //         // pressed
    //     }
    //     // or a differend way:
    //     if (component.pressed) {
    //         // component is pressed.
    //     }
    // }

    //       getMicInput();
  });
  return scene;
};
*/

const spawnAssetIntoScene = async (asset: any) => {
  const gltf = asset.formats.find((f) => f.formatType === "GLTF2");
  if (!gltf) {
    console.log("Could not find GLTF2");
    console.log(`Formats: ${asset.formats.map((f) => f.formatType)}`);
    return;
  }

  // Strips out the filename from the path — "https://googlepoly.com/models/model.gltf" => "https://googlepoly.com/models/"
  const path = gltf.root.url.substr(0, gltf.root.url.lastIndexOf("/") + 1);
  const filename = gltf.root.relativePath;

  console.log(`Attempting to load path "${path}" and filename "${filename}"`);
  return await BABYLON.SceneLoader.ImportMesh("", path, filename, scene);
};

window.addEventListener("DOMContentLoaded", () => {
  // get the canvas DOM element
  const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

  // load the 3D engine
  createScene(canvas);

  // run the render loop
  engine.runRenderLoop(function () {
    scene.render();
  });

  // the canvas/window resize event handler
  window.addEventListener("resize", function () {
    engine.resize();
  });
});
