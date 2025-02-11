import { HueRotate, Image, Node, NodeOptions } from 'scenerystack/scenery';
import bicycleFrameURL from '../images/bicycleFrame.png';
import bicycleGearURL from '../images/bicycleGear.png';
import bicycleSpokesURL from '../images/bicycleSpokes.png';
import cyclistTorsoURL from '../images/cyclistTorso.png';
import cyclistTorsoTired1URL from '../images/cyclistTorsoTired1.png';
import cyclistTorsoTired2URL from '../images/cyclistTorsoTired2.png';
import cyclistTorsoTired3URL from '../images/cyclistTorsoTired3.png';
import cyclistLegBack01URL from '../images/cyclistLegBack01.png';
import cyclistLegBack02URL from '../images/cyclistLegBack02.png';
import cyclistLegBack03URL from '../images/cyclistLegBack03.png';
import cyclistLegBack04URL from '../images/cyclistLegBack04.png';
import cyclistLegBack05URL from '../images/cyclistLegBack05.png';
import cyclistLegBack06URL from '../images/cyclistLegBack06.png';
import cyclistLegBack07URL from '../images/cyclistLegBack07.png';
import cyclistLegBack08URL from '../images/cyclistLegBack08.png';
import cyclistLegBack09URL from '../images/cyclistLegBack09.png';
import cyclistLegBack10URL from '../images/cyclistLegBack10.png';
import cyclistLegBack11URL from '../images/cyclistLegBack11.png';
import cyclistLegBack12URL from '../images/cyclistLegBack12.png';
import cyclistLegBack13URL from '../images/cyclistLegBack13.png';
import cyclistLegBack14URL from '../images/cyclistLegBack14.png';
import cyclistLegBack15URL from '../images/cyclistLegBack15.png';
import cyclistLegBack16URL from '../images/cyclistLegBack16.png';
import cyclistLegBack17URL from '../images/cyclistLegBack17.png';
import cyclistLegBack18URL from '../images/cyclistLegBack18.png';
import cyclistLegFront01URL from '../images/cyclistLegFront01.png';
import cyclistLegFront02URL from '../images/cyclistLegFront02.png';
import cyclistLegFront03URL from '../images/cyclistLegFront03.png';
import cyclistLegFront04URL from '../images/cyclistLegFront04.png';
import cyclistLegFront05URL from '../images/cyclistLegFront05.png';
import cyclistLegFront06URL from '../images/cyclistLegFront06.png';
import cyclistLegFront07URL from '../images/cyclistLegFront07.png';
import cyclistLegFront08URL from '../images/cyclistLegFront08.png';
import cyclistLegFront09URL from '../images/cyclistLegFront09.png';
import cyclistLegFront10URL from '../images/cyclistLegFront10.png';
import cyclistLegFront11URL from '../images/cyclistLegFront11.png';
import cyclistLegFront12URL from '../images/cyclistLegFront12.png';
import cyclistLegFront13URL from '../images/cyclistLegFront13.png';
import cyclistLegFront14URL from '../images/cyclistLegFront14.png';
import cyclistLegFront15URL from '../images/cyclistLegFront15.png';
import cyclistLegFront16URL from '../images/cyclistLegFront16.png';
import cyclistLegFront17URL from '../images/cyclistLegFront17.png';
import cyclistLegFront18URL from '../images/cyclistLegFront18.png';

import { DotUtils, Matrix3, Vector2 } from 'scenerystack/dot';
import { loadImage } from './loadImage.js';
import { Cyclist } from './Cyclist.js';

const bicycleFrameImage = loadImage( bicycleFrameURL );
const bicycleGearImage = loadImage( bicycleGearURL );
const bicycleSpokesImage = loadImage( bicycleSpokesURL );

const cyclistBackLegImages = [
  loadImage( cyclistLegBack01URL ),
  loadImage( cyclistLegBack02URL ),
  loadImage( cyclistLegBack03URL ),
  loadImage( cyclistLegBack04URL ),
  loadImage( cyclistLegBack05URL ),
  loadImage( cyclistLegBack06URL ),
  loadImage( cyclistLegBack07URL ),
  loadImage( cyclistLegBack08URL ),
  loadImage( cyclistLegBack09URL ),
  loadImage( cyclistLegBack10URL ),
  loadImage( cyclistLegBack11URL ),
  loadImage( cyclistLegBack12URL ),
  loadImage( cyclistLegBack13URL ),
  loadImage( cyclistLegBack14URL ),
  loadImage( cyclistLegBack15URL ),
  loadImage( cyclistLegBack16URL ),
  loadImage( cyclistLegBack17URL ),
  loadImage( cyclistLegBack18URL )
];

const cyclistFrontLegImages = [
  loadImage( cyclistLegFront01URL ),
  loadImage( cyclistLegFront02URL ),
  loadImage( cyclistLegFront03URL ),
  loadImage( cyclistLegFront04URL ),
  loadImage( cyclistLegFront05URL ),
  loadImage( cyclistLegFront06URL ),
  loadImage( cyclistLegFront07URL ),
  loadImage( cyclistLegFront08URL ),
  loadImage( cyclistLegFront09URL ),
  loadImage( cyclistLegFront10URL ),
  loadImage( cyclistLegFront11URL ),
  loadImage( cyclistLegFront12URL ),
  loadImage( cyclistLegFront13URL ),
  loadImage( cyclistLegFront14URL ),
  loadImage( cyclistLegFront15URL ),
  loadImage( cyclistLegFront16URL ),
  loadImage( cyclistLegFront17URL ),
  loadImage( cyclistLegFront18URL )
];

const cyclistTorsoImages = [
  loadImage( cyclistTorsoURL ),
  loadImage( cyclistTorsoTired1URL ),
  loadImage( cyclistTorsoTired2URL ),
  loadImage( cyclistTorsoTired3URL )
];

const GEAR_OFFSET = new Vector2( 12.76, 13.2 );
const FRONT_WHEEL_OFFSET = new Vector2( -76, 22 );
const REAR_WHEEL_OFFSET = new Vector2( 77, 22 );

const NUMBER_OF_LEG_IMAGES = cyclistFrontLegImages.length;
const BICYCLE_SYSTEM_RIGHT_OFFSET = 123;
const BICYCLE_SYSTEM_TOP_OFFSET = -249;
const IMAGE_SCALE = 0.490; // scale factor used to size the images, empirically determined

export type CyclistNodeOptions = NodeOptions;

export class CyclistNode extends Node {
  public constructor( public readonly cyclist: Cyclist, options?: CyclistNodeOptions ) {
    super( options );

    const frameNode = new Image( bicycleFrameImage, {
      right: BICYCLE_SYSTEM_RIGHT_OFFSET,
      top: BICYCLE_SYSTEM_TOP_OFFSET,
      scale: IMAGE_SCALE
    } );
    cyclist.bicycleColorShiftProperty.link( colorShift => {
      frameNode.filters = colorShift === 0 ? [] : [ new HueRotate( colorShift ) ];
    } );

    const gearNode = new Image( bicycleGearImage, {
      center: GEAR_OFFSET,
      scale: IMAGE_SCALE
    } );
    const frontSpokesNode = new Image( bicycleSpokesImage, {
      center: FRONT_WHEEL_OFFSET,
      scale: IMAGE_SCALE
    } );
    const rearSpokesNode = new Image( bicycleSpokesImage, {
      center: REAR_WHEEL_OFFSET,
      scale: IMAGE_SCALE
    } );

    const torsoRootNode = new Node();
    const torsoNodes: Node[] = [];

    // create the torso image nodes
    for ( let i = 0; i < cyclistTorsoImages.length; i++ ) {
      torsoNodes.push( new Image( cyclistTorsoImages[ i ], {
        centerX: frameNode.centerX,
        bottom: frameNode.bottom,
        scale: IMAGE_SCALE
      } ) );
      torsoNodes[ i ].setVisible( false );
      torsoRootNode.addChild( torsoNodes[ i ] );
    }

    const backLegRootNode = new Node();
    const frontLegRootNode = new Node();
    const backLegNodes: Node[] = [];
    const frontLegNodes: Node[] = [];

    for ( let i = 0; i < NUMBER_OF_LEG_IMAGES; i++ ) {

      // back leg image nodes
      backLegNodes.push( new Image( cyclistBackLegImages[ i ], {
        right: BICYCLE_SYSTEM_RIGHT_OFFSET,
        top: BICYCLE_SYSTEM_TOP_OFFSET,
        scale: IMAGE_SCALE
      } ) );
      backLegNodes[ i ].setVisible( false );
      backLegRootNode.addChild( backLegNodes[ i ] );

      // front leg image nodes
      frontLegNodes.push( new Image( cyclistFrontLegImages[ i ], {
        right: BICYCLE_SYSTEM_RIGHT_OFFSET,
        top: BICYCLE_SYSTEM_TOP_OFFSET,
        scale: IMAGE_SCALE
      } ) );
      frontLegNodes[ i ].setVisible( false );
      frontLegRootNode.addChild( frontLegNodes[ i ] );
    }

    // animate legs by setting image visibility based on crank arm angle. also animate the gear by mapping its angle of
    // rotation to the crank arm angle
    let visibleBackLeg = backLegNodes[ 0 ];
    let visibleFrontLeg = frontLegNodes[ 0 ];
    const gearRotationPoint = gearNode.bounds.center;
    cyclist.crankAngleProperty.link( angle => {
      angle = DotUtils.moduloBetweenDown( angle, 0, 2 * Math.PI );

      const i = CyclistNode.mapAngleToImageIndex( angle );
      visibleFrontLeg.setVisible( false );
      visibleBackLeg.setVisible( false );
      visibleFrontLeg = frontLegNodes[ i ];
      visibleBackLeg = backLegNodes[ i ];
      visibleFrontLeg.setVisible( true );
      visibleBackLeg.setVisible( true );

      // Scenery doesn't use the convention in physics where a positive rotation is counter-clockwise, so we have to
      // invert the angle in the following calculation.
      const compensatedAngle = ( 2 * Math.PI - gearNode.getRotation() ) % ( 2 * Math.PI );
      const delta = angle - compensatedAngle;

      gearNode.rotateAround( gearRotationPoint, -delta );
    } );

    let visibleTorso = torsoNodes[ 0 ];
    cyclist.effortProperty.link( effort => {
      visibleTorso.setVisible( false );
      visibleTorso = torsoNodes[ effort ];
      visibleTorso.setVisible( true );
    } );

    const frontWheelRotationPoint = frontSpokesNode.bounds.center;
    const rearWheelRotationPoint = rearSpokesNode.bounds.center;
    cyclist.wheelAngleProperty.link( angle => {
      angle = DotUtils.moduloBetweenDown( angle, 0, 2 * Math.PI );

      // Scenery doesn't use the convention in physics where a positive rotation is counter-clockwise, so we have to
      // invert the angle in the following calculation.
      const compensatedAngle = ( 2 * Math.PI - rearSpokesNode.getRotation() ) % ( 2 * Math.PI );
      const delta = angle - compensatedAngle;
      frontSpokesNode.rotateAround( frontWheelRotationPoint, -delta );
      rearSpokesNode.rotateAround( rearWheelRotationPoint, -delta );
    } );

    const containerNode = new Node( {
      children: [
        backLegRootNode,
        frontSpokesNode,
        rearSpokesNode,
        frameNode,
        gearNode,
        torsoRootNode,
        frontLegRootNode
      ]
    } );
    this.addChild( containerNode );

    cyclist.isPointingRightProperty.link( isPointingRight => {
      containerNode.matrix = isPointingRight ? Matrix3.X_REFLECTION : Matrix3.IDENTITY;
    } );
  }

  public static mapAngleToImageIndex( angle: number ) {
    angle = DotUtils.moduloBetweenDown( angle, 0, 2 * Math.PI );

    return Math.floor( ( angle % ( 2 * Math.PI ) ) / ( 2 * Math.PI / NUMBER_OF_LEG_IMAGES ) );
  }
}