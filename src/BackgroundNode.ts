import { TReadOnlyProperty } from "scenerystack/axon";
import { Bounds2 } from "scenerystack/dot";
import { LinearGradient, Node, Rectangle } from "scenerystack/scenery";

export class BackgroundNode extends Node {
  public constructor(
    public readonly positionProperty: TReadOnlyProperty<number>,
    public readonly layoutBoundsProperty: TReadOnlyProperty<Bounds2>
  ) {
    // NOTE: the location in the middle doesn't move when resizing

    const roadBackgroundNode = new Rectangle( {} );
    const grassNode = new Rectangle( {} );

    super( {
      children: [
        grassNode,
        roadBackgroundNode,
      ]
    } );

    layoutBoundsProperty.link( bounds => {
      // 0 bottom, 1 top
      const mapY = ( y: number ) => {
        return bounds.bottom * ( 1 - y ) + bounds.top * y;
      };

      const bottom = mapY( 0 );
      const roadBottomY = mapY( 0.2 );
      // const roadCenterY = mapY( 0.28 );
      const roadTopY = mapY( 0.4 );

      roadBackgroundNode.rectBounds = new Bounds2( bounds.left, roadTopY, bounds.right, roadBottomY );
      roadBackgroundNode.fill = new LinearGradient( 0, roadBottomY, 0, roadTopY )
        .addColorStop( 0, '#333' )
        .addColorStop( 0.4, '#444' )
        .addColorStop( 1, '#333' );

      grassNode.rectBounds = new Bounds2( bounds.left, roadBottomY, bounds.right, bottom );
      grassNode.fill = new LinearGradient( 0, bottom, 0, roadBottomY )
        .addColorStop( 0, '#268b07' )
        .addColorStop( 1, '#136d15' );
    } );
  }
}