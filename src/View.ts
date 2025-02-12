import { Font, HBox, Node, Text, VBox } from 'scenerystack/scenery';
import { Model } from './Model';
import { CyclistNode } from './CyclistNode';
import { Multilink, TReadOnlyProperty } from 'scenerystack/axon';
import { Bounds2, Dimension2, DotUtils, Range } from 'scenerystack/dot';
import { HSlider, Panel, TextPushButton, VerticalAquaRadioButtonGroup } from 'scenerystack/sun';
import { BackgroundNode } from './BackgroundNode.js';
import { BLUE_COLOR_SHIFT, GREEN_COLOR_SHIFT, RED_COLOR_SHIFT } from './Cyclist.js';

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

    model.cyclist.isPointingRightProperty.lazyLink( isPointingRight => {
      cyclistNode.alertDescriptionUtterance( `The cyclist is now pointing to the ${isPointingRight ? 'right' : 'left'}` );
    } );

    cyclistNode.mutate( {
      tagName: 'p',
      labelTagName: 'h2',
      labelContent: 'Cyclist'
    } );

    new Multilink( [
      model.cyclist.isPointingRightProperty,
      model.cyclist.bicycleColorShiftProperty,
      model.cyclist.effortProperty,
      model.velocityProperty,
      model.accelerationProperty
    ], ( isPointingRight, bicycleColorShift, effort, velocity, acceleration ) => {

      const color = {
        [ BLUE_COLOR_SHIFT ]: 'blue',
        [ GREEN_COLOR_SHIFT ]: 'green',
        [ RED_COLOR_SHIFT ]: 'red'
      }[ bicycleColorShift ];

      const direction = isPointingRight ? 'right' : 'left';

      const braking = velocity * acceleration < 0;

      const effortString = braking ? 'braking' : Math.abs( acceleration ) < 1e-5 ? 'coasting' : {
        0: 'pedaling lightly',
        1: 'pedaling moderately',
        2: 'pedaling hard',
        3: 'pedaling very hard'
      }[ effort ];

      let velocityString: string;
      const speed = Math.abs( velocity );

      if ( speed < 1e-5 ) {
        velocityString = 'stationary';
      }
      else if ( speed < 5 ) {
        velocityString = 'moving slowly';
      }
      else if ( speed < 13 ) {
        velocityString = 'moving at a moderate speed';
      }
      else if ( speed < 25 ) {
        velocityString = 'moving quickly';
      }
      else {
        velocityString = 'moving very quickly';
      }

      cyclistNode.innerContent = `The cyclist is on a ${color} bicycle pointing to the ${direction}. ${speed > 1e-5 ? `The cyclist is ${effortString}. ` : ''}The cyclist is ${velocityString}`;
    } );

    const accelerationSliderLabel = new Text( 'Acceleration', {
      font: 'bold 18px Arial'
    } );
    const accelerationSlider = new HSlider( model.accelerationProperty, new Range( -3, 3 ), {
      // TODO: use preferred sizes instead
      trackSize: new Dimension2( 200, 5 ),
      thumbTouchAreaYDilation: 7,
      accessibleName: 'Acceleration',
      helpText: 'Adjust the acceleration of the cyclist',
      pdomCreateAriaValueText: value => `${DotUtils.toFixed( value / 2, 1 )} meters per second squared`
    } );

    accelerationSlider.addMinorTick( -3 );
    accelerationSlider.addMinorTick( 0 );
    accelerationSlider.addMinorTick( 3 );

    const stopButton = new TextPushButton( 'Stop', {
      font: Font.fromCSS( '20px Arial' ),
      listener: () => {
        model.stop();

        stopButton.alertDescriptionUtterance( 'The cyclist has stopped' );
      },
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
        value: BLUE_COLOR_SHIFT,
        createNode: () => new Text( 'Blue', bicycleColorTextOptions )
      },
      {
        value: GREEN_COLOR_SHIFT,
        createNode: () => new Text( 'Green', bicycleColorTextOptions )
      },
      {
        value: RED_COLOR_SHIFT,
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