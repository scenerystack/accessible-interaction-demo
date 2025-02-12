import { BooleanProperty, NumberProperty } from 'scenerystack/axon';

export const BLUE_COLOR_SHIFT = 0;
export const GREEN_COLOR_SHIFT = 4;
export const RED_COLOR_SHIFT = 2.3;

export class Cyclist {
  public readonly isPointingRightProperty = new BooleanProperty( true );
  public readonly wheelAngleProperty = new NumberProperty( 0 );
  public readonly crankAngleProperty = new NumberProperty( 0 );
  public readonly effortProperty = new NumberProperty( 0 ); // 0 to 3
  public readonly bicycleColorShiftProperty = new NumberProperty( 0 );

  public toggleToNextColorShift(): void {
    const currentShift = this.bicycleColorShiftProperty.value;

    if ( currentShift === BLUE_COLOR_SHIFT ) {
      this.bicycleColorShiftProperty.value = GREEN_COLOR_SHIFT;
    }
    else if ( currentShift === GREEN_COLOR_SHIFT ) {
      this.bicycleColorShiftProperty.value = RED_COLOR_SHIFT;
    }
    else {
      this.bicycleColorShiftProperty.value = BLUE_COLOR_SHIFT;
    }
  }
}