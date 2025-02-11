import { BooleanProperty, NumberProperty } from 'scenerystack/axon';

export class Cyclist {
  public readonly isPointingRightProperty = new BooleanProperty( true );
  public readonly wheelAngleProperty = new NumberProperty( 0 );
  public readonly crankAngleProperty = new NumberProperty( 0 );
  public readonly effortProperty = new NumberProperty( 0 ); // 0 to 3
  public readonly bicycleColorShiftProperty = new NumberProperty( 0 );
}