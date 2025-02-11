import { Font, HBox, Node, Text, VBox } from 'scenerystack/scenery';
import { Model } from './Model';
import { CyclistNode } from './CyclistNode';
import { TReadOnlyProperty } from 'scenerystack/axon';
import { Bounds2, Dimension2, Range } from 'scenerystack/dot';
import { HSlider, Panel, TextPushButton, VerticalAquaRadioButtonGroup } from 'scenerystack/sun';
import { BackgroundNode } from './BackgroundNode.js';

export class View extends Node {
  public constructor(
    public model: Model,
    layoutBoundsProperty: TReadOnlyProperty<Bounds2>
  ) {
    super( {
      tagName: 'div',
      labelTagName: 'h1',
      labelContent: 'Accessible Interaction Demo'
    } );

    const descriptionNode = new Node();

    descriptionNode.tagName = 'p';
    descriptionNode.innerContent = 'There is a cyclist on a road. You can control the acceleration of the cyclist using a slider. There is a stop button to stop the cyclist.';

    const backgroundNode = new BackgroundNode( model.positionProperty, layoutBoundsProperty );

    const cyclistNode = new CyclistNode( model.cyclist );
    const cyclistOffset = cyclistNode.bottom;
    cyclistNode.y = -cyclistOffset;

    cyclistNode.mutate( {
      tagName: 'p',
      labelTagName: 'h2',
      labelContent: 'Cyclist'
    } );

    cyclistNode.innerContent = 'Dynamic content here'; // TODO

    const accelerationSliderLabel = new Text( 'Acceleration', {
      font: 'bold 18px Arial'
    } );
    const accelerationSlider = new HSlider( model.accelerationProperty, new Range( -3, 3 ), {
      // TODO: use preferred sizes instead
      trackSize: new Dimension2( 200, 5 ),
      thumbTouchAreaYDilation: 7,
      accessibleName: 'Acceleration',
      helpText: 'Adjust the acceleration of the cyclist'
    } );

    accelerationSlider.addMinorTick( -3 );
    accelerationSlider.addMinorTick( 0 );
    accelerationSlider.addMinorTick( 3 );

    const stopButton = new TextPushButton( 'Stop', {
      font: Font.fromCSS( '20px Arial' ),
      listener: () => model.stop(),
      accessibleName: 'Stop',
      helpText: 'Stop all motion of the cyclist'
    } );

    const bicycleColorLabelNode = new Text( 'Bicycle Color', {
      font: 'bold 18px Arial'
    } );

    const bicycleColorTextOptions = {
      font: '18px Arial'
    };
    const bicycleColorRadioButtonGroup = new VerticalAquaRadioButtonGroup( model.cyclist.bicycleColorShiftProperty, [
      {
        value: 0,
        createNode: () => new Text( 'Blue', bicycleColorTextOptions )
      },
      {
        value: 4,
        createNode: () => new Text( 'Green', bicycleColorTextOptions )
      },
      {
        value: 2.3,
        createNode: () => new Text( 'Red', bicycleColorTextOptions )
      }
    ], {
      labelTagName: 'h3',
      accessibleName: 'Bicycle Color',
      touchAreaXDilation: 20,
      helpText: 'Change the color of the bicycle'
    } );

    const controlsNode = new Panel( new HBox( {
      tagName: 'div',
      labelTagName: 'h2',
      labelContent: 'Controls',
      spacing: 30,
      align: 'top',
      children: [
        new VBox( {
          spacing: 7,
          children: [
            accelerationSliderLabel,
            accelerationSlider,
            stopButton
          ]
        } ),
        new VBox( {
          spacing: 7,
          children: [
            bicycleColorLabelNode,
            bicycleColorRadioButtonGroup
          ]
        } )
      ]
    } ), {
      top: cyclistNode.bottom + 7,
      xMargin: 20
    } );

    const containerNode = new Node( {
      children: [
        cyclistNode,
        controlsNode
      ]
    } );

    this.children = [
      descriptionNode,
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