import { HBox, Node, Text, VBox } from 'scenerystack/scenery';
import { Model } from './Model';
import { CyclistNode } from './CyclistNode';
import { TReadOnlyProperty } from 'scenerystack/axon';
import { Bounds2, Dimension2, Range } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { ResetAllButton } from 'scenerystack/scenery-phet';
import { BackgroundNode } from './BackgroundNode.js';

export class View extends Node {
  public constructor(
    public model: Model,
    layoutBoundsProperty: TReadOnlyProperty<Bounds2>
  ) {
    super();

    const backgroundNode = new BackgroundNode( model.positionProperty, layoutBoundsProperty );

    const cyclistNode = new CyclistNode( model.cyclist );
    const cyclistOffset = cyclistNode.bottom;
    cyclistNode.y = -cyclistOffset;

    const accelerationSliderLabel = new Text( 'Acceleration', {
      font: 'bold 20px Arial'
    } );
    const accelerationSlider = new HSlider( model.accelerationProperty, new Range( -3, 3 ), {
      // TODO: use preferred sizes instead
      trackSize: new Dimension2( 200, 5 )
    } );

    accelerationSlider.addMinorTick( -3 );
    accelerationSlider.addMinorTick( 0 );
    accelerationSlider.addMinorTick( 3 );

    const accelerationNode = new VBox( {
      spacing: 10,
      children: [
        accelerationSliderLabel,
        accelerationSlider
      ]
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => model.reset()
    } );

    const controlsNode = new HBox( {
      spacing: 50,
      top: cyclistNode.bottom + 40,
      children: [
        accelerationNode,
        resetAllButton
      ]
    } );

    const containerNode = new Node( {
      children: [
        cyclistNode,
        controlsNode
      ]
    } );

    this.children = [
      backgroundNode,
      containerNode
    ];

    // Center the text and the rectangle dynamically
    layoutBoundsProperty.link( ( bounds ) => {
      const scale = bounds.height / 500;
      containerNode.setScaleMagnitude( bounds.height / 500 );
      containerNode.y = ( bounds.top + 3 * bounds.bottom ) / 4;
      cyclistNode.centerX = bounds.centerX / scale;
      controlsNode.centerX = bounds.centerX / scale;
    } );
  }
}