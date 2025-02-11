import { Multilink, TReadOnlyProperty } from "scenerystack/axon";
import { Bounds2 } from "scenerystack/dot";
import { Shape } from "scenerystack/kite";
import { LinearGradient, Node, Path, Rectangle } from "scenerystack/scenery";

export class BackgroundNode extends Node {
  public constructor(
    public readonly positionProperty: TReadOnlyProperty<number>,
    public readonly layoutBoundsProperty: TReadOnlyProperty<Bounds2>
  ) {
    // NOTE: the location in the middle doesn't move when resizing

    const roadBackgroundNode = new Rectangle( {} );
    const grassAndSky = new Rectangle( {} );
    const roadStripe = new Path( null, {
      fill: '#FFC72C'
    } );

    super( {
      children: [
        grassAndSky,
        roadBackgroundNode,
        roadStripe
      ]
    } );

    // TODO: noise texture?
    new Multilink( [ positionProperty, layoutBoundsProperty ], ( position, bounds ) => {
      // 0 bottom, 1 top
      const mapY = ( y: number ) => {
        return bounds.bottom * ( 1 - y ) + bounds.top * y;
      };

      const roadBottomY = mapY( 0.19 );
      const roadCenterLowY = mapY( 0.33 );
      const roadCenterHighY = mapY( 0.34 );
      const roadTopY = mapY( 0.48 );

      roadBackgroundNode.rectBounds = new Bounds2( bounds.left, roadTopY, bounds.right, roadBottomY );
      roadBackgroundNode.fill = new LinearGradient( 0, roadBottomY, 0, roadTopY )
        .addColorStop( 0, '#555' )

        .addColorStop( 0.1, '#555' )
        .addColorStop( 0.1, '#D6D6D6' )
        .addColorStop( 0.12, '#D6D6D6' )
        .addColorStop( 0.12, '#555' )

        .addColorStop( 0.4, '#777' )

        .addColorStop( 0.92, '#555' )
        .addColorStop( 0.92, '#D6D6D6' )
        .addColorStop( 0.935, '#D6D6D6' )
        .addColorStop( 0.935, '#555' )

        .addColorStop( 1, '#555' );

      grassAndSky.rectBounds = bounds;
      grassAndSky.fill = new LinearGradient( 0, bounds.bottom, 0, bounds.top )
        .addColorStop( 0, '#3F8F3D' )
        .addColorStop( 0.67, '#88C57A' )
        .addColorStop( 0.67, '#cfecfc' )
        .addColorStop( 1, '#02ace4' );

      const midX = bounds.centerX;

      {
        const roadStripShape = new Shape();
        const addStripe = ( x0: number, x1: number ) => {
          const skew = 0.003;
          roadStripShape.moveTo( x0 * ( 1 + skew ) + midX, roadCenterLowY );
          roadStripShape.lineTo( x1 * ( 1 + skew ) + midX, roadCenterLowY );
          roadStripShape.lineTo( x1 * ( 1 - skew ) + midX, roadCenterHighY );
          roadStripShape.lineTo( x0 * ( 1 - skew ) + midX, roadCenterHighY );
          roadStripShape.close();
        };

        const stripeLength = 1;
        const stripeSpacing = 2.5;
        const scale = bounds.height * 0.08;

        const mapRoadX = ( x: number ) => {
          return ( x - position ) * scale;
        };
        const inverseMapRoadX = ( x: number ) => {
          return x / scale + position;
        };

        const leftSafeX = inverseMapRoadX( -0.6 * bounds.width );
        const rightSafeX = inverseMapRoadX( 0.6 * bounds.width );

        // e.g. to add a stripe between -1 and 1, do addStripe( mapRoadX( -1 ), mapRoadX( 1 ) );

        // Add stripes every stripeSpacing that are stripeLength long, between leftSafeX and rightSafeX
        for ( let x = Math.ceil( leftSafeX / stripeSpacing ) * stripeSpacing; x < rightSafeX; x += stripeSpacing ) {
          addStripe( mapRoadX( x ), mapRoadX( x + stripeLength ) );
        }

        roadStripShape.makeImmutable();
        roadStripe.shape = roadStripShape;
      }
    } );
  }
}