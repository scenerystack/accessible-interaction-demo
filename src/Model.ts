import { NumberProperty } from 'scenerystack/axon';
import { Cyclist } from './Cyclist.js';

export class Model {

  public readonly positionProperty = new NumberProperty( 300 );
  public readonly velocityProperty = new NumberProperty( 0 );
  public readonly accelerationProperty = new NumberProperty( 0 );

  public readonly cyclist = new Cyclist();

  public constructor() {
    this.velocityProperty.link( velocity => {
      if ( Math.abs( velocity ) > 1e-5 ) {
        this.cyclist.isPointingRightProperty.value = velocity > 0;
      }
    } );
  }

  public step( dt: number ): void {
    // Do not allow the app to run too fast, or for it to run a ton when
    // finally made visible.
    dt = Math.min( dt, 1 );

    const velocity = this.velocityProperty.value;
    const acceleration = this.accelerationProperty.value;

    const isBraking = velocity * acceleration < 0;

    this.positionProperty.value += velocity * dt;
    this.velocityProperty.value += acceleration * dt;

    this.cyclist.wheelAngleProperty.value += Math.abs( velocity * dt );

    // If acceleration is in the opposite direction, it is braking and we will not "pedal"
    this.cyclist.crankAngleProperty.value += isBraking ? 0 : 5 * Math.abs( acceleration ) * dt;

    const accelerationEffort = isBraking ? 0 : Math.abs( acceleration );

    if ( accelerationEffort <= 0.5 ) {
      this.cyclist.effortProperty.value = 0;
    }
    else if ( accelerationEffort <= 1.5 ) {
      this.cyclist.effortProperty.value = 1;
    }
    else if ( accelerationEffort <= 2.5 ) {
      this.cyclist.effortProperty.value = 2;
    }
    else {
      this.cyclist.effortProperty.value = 3;
    }
  }

  public stop(): void {
    this.velocityProperty.value = 0;
    this.accelerationProperty.value = 0;
  }

  public reset(): void {
    this.positionProperty.reset();
    this.velocityProperty.reset();
    this.accelerationProperty.reset();

    this.cyclist.wheelAngleProperty.reset();
    this.cyclist.crankAngleProperty.reset();
    this.cyclist.isPointingRightProperty.reset();

    this.step( 0 );
  }
};