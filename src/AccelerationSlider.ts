import { NumberProperty } from "scenerystack/axon";
import { Range } from "scenerystack/dot";
import { HSlider, HSliderOptions } from "scenerystack/sun";

export class AccelerationSlider extends HSlider {
  public constructor(
    accelerationProperty: NumberProperty,
    providedOptions?: HSliderOptions
  ) {
    super( accelerationProperty, new Range( -3, 3 ), providedOptions );

    this.addMinorTick( -3 );
    this.addMinorTick( 0 );
    this.addMinorTick( 3 );
  }
}