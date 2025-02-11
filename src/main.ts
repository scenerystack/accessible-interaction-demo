import { enableAssert } from "scenerystack/assert";
import { Property } from "scenerystack/axon";
import { Bounds2 } from "scenerystack/dot";
import { asyncLoader, platform } from "scenerystack/phet-core";
import { Display, Node, Rectangle, Text } from "scenerystack/scenery";
import { CyclistNode } from './CyclistNode.js';
import { Cyclist } from "./Cyclist.js";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (process.env.NODE_ENV === "development") {
  // Enable assertions if we are in development mode
  enableAssert();
}

// Tracks the bounds of the window (can listen with layoutBoundsProperty.link)
export const layoutBoundsProperty = new Property(
  new Bounds2(0, 0, window.innerWidth, window.innerHeight),
);

// The root node of the scene graph (all Scenery content will be placed in here)
const rootNode = new Node( {
  renderer: 'svg'
} );

// Display will render the scene graph to the DOM
const display = new Display(rootNode, {
  allowSceneOverflow: false,
  backgroundColor: "#eee",
  listenToOnlyElement: false,
  assumeFullWindow: true,
});

// We'll add the automatically-created DOM element to the body.
document.body.appendChild(display.domElement);

// Attach event listeners to the DOM.
display.initializeEvents();

// Lazy resizing logic
let resizePending = true;
const resize = () => {
  resizePending = false;

  const layoutBounds = new Bounds2(0, 0, window.innerWidth, window.innerHeight);
  display.setWidthHeight(layoutBounds.width, layoutBounds.height);
  layoutBoundsProperty.value = layoutBounds;

  if (platform.mobileSafari) {
    window.scrollTo(0, 0);
  }
};
const resizeListener = () => {
  resizePending = true;
};
window.addEventListener("resize", resizeListener);
window.addEventListener("orientationchange", resizeListener);
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
window.visualViewport &&
  window.visualViewport.addEventListener("resize", resizeListener);
resize();

// Wait for images to complete loading
asyncLoader.addListener( () => {
  const cyclist = new Cyclist();

  cyclist.effortProperty.value = 0;

  const cyclistNode = new CyclistNode( cyclist );
  const cyclistOffset = cyclistNode.bottom;
  cyclistNode.y = -cyclistOffset;

  const containerNode = new Node( {
    children: [
      cyclistNode
    ]
  } );

  rootNode.addChild( containerNode );

  // Center the text and the rectangle dynamically
  layoutBoundsProperty.link((bounds) => {
    const scale = bounds.height / 500;
    containerNode.setScaleMagnitude( bounds.height / 500 );
    containerNode.y = ( bounds.top + 3 * bounds.bottom ) / 4;
    cyclistNode.centerX = bounds.centerX / scale;
  });

  // Frame step logic
  display.updateOnRequestAnimationFrame((dt) => {
    if (resizePending) {
      resize();
    }

    cyclist.wheelAngleProperty.value += 1 * dt;
    cyclist.crankAngleProperty.value += 5 * dt;
  });
} );