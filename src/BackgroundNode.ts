import { Multilink, TReadOnlyProperty } from 'scenerystack/axon';
import { Bounds2, linear } from 'scenerystack/dot';
import { Shape } from 'scenerystack/kite';
import { Image, LinearGradient, Node, Path, Rectangle } from 'scenerystack/scenery';
import tree1URL from '../images/tree1.svg';
import tree2URL from '../images/tree2.svg';
import { loadImage } from './loadImage.js';
import { Pool, TPoolable } from 'scenerystack/phet-core';

const tree1Image = loadImage( tree1URL );
const tree2Image = loadImage( tree2URL );

class TreeImage1 extends Node implements TPoolable {
  public constructor( x: number, y: number, depth: number ) {
    super( {
      children: [
        new Image( tree1Image, {
          y: -125
        } )
      ],
    } );

    this.initialize( x, y, depth );
  }

  public initialize( x: number, y: number, depth: number ): this {
    this.setScaleMagnitude( 200 / depth );
    this.centerX = x;
    this.y = y;

    return this;
  }

  public freeToPool(): void {
    TreeImage1.pool.freeToPool( this );
  }

  public static readonly pool = new Pool( TreeImage1, {
    initialize: TreeImage1.prototype.initialize
  } );
}

class TreeImage2 extends Node implements TPoolable {
  public constructor( x: number, y: number, depth: number ) {
    super( {
      children: [
        new Image( tree2Image, {
          y: -138
        } )
      ],
    } );

    this.initialize( x, y, depth );
  }

  public initialize( x: number, y: number, depth: number ): this {
    this.setScaleMagnitude( 300 / depth );
    this.centerX = x;
    this.y = y;

    return this;
  }

  public freeToPool(): void {
    TreeImage2.pool.freeToPool( this );
  }

  public static readonly pool = new Pool( TreeImage2, {
    initialize: TreeImage2.prototype.initialize
  } );
}

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
    const treeContainer = new Node();

    super( {
      children: [
        grassAndSky,
        roadBackgroundNode,
        roadStripe,
        treeContainer
      ]
    } );

    // TODO: is hash function causing flickering?
    // const hashTreeSquare = ( x: number, y: number ) => {
    //   console.log( x, y );
    //   const seed = ( ( x + 102.516 ) * 73856093 ) ^ ( ( y * 2.1 - 15.2 ) * 19349663 );
    //   return ( Math.abs( seed ) % 100 ) / 100;
    // };
    const hashTreeSquare = ( x: number, y: number ) => {
      let seed = ( x * 73856093 ) ^ ( y * 19349663 );
      seed ^= seed >> 13;
      seed *= 0x85ebca6b;
      seed ^= seed >> 16;
      return ((seed >>> 0) % 100) / 100;  // Force unsigned integer
    };

    const getTreesInViewport = (
      position: number,
      zeroWidth: number, // at the road
      viewportWidth: number,
    ) => {
      const camX = position;
      const camY = -50;

      const gridX = 30;
      const gridY = 30;

      const probabilityOfTree = 0.2;

      const nearY = 4;
      const farY = 700;

      // x: screen space, y: 0 (close) to 1 (far)
      const trees: { x: number; y: number; depth: number; type: number }[] = [];

      for ( let depth = nearY - camY; depth < farY - camY; depth += gridY ) {
        const y = camY + depth;
        const width = linear( camY, 0, 0, zeroWidth, y );

        const padding = 2;

        const minX = Math.floor( -padding + ( camX - width / 2 ) / gridX ) * gridX;
        const maxX = Math.ceil( padding + ( camX + width / 2 ) / gridX ) * gridX;

        for ( let x = minX; x <= maxX; x += gridX ) {
          let hashValue = hashTreeSquare( x, y );

          if ( hashValue < probabilityOfTree ) {
            // renormalize the hash value (so we can use the rest of the probability uniformly)
            hashValue = hashValue / probabilityOfTree;

            const jitteredX = x + 0.8 * ( hashValue - 0.5 ) * gridX;
            const jitteredY = y + 0.8 * ( ( hashValue * 100 ) % 1 ) * gridY;

            const screenX = ( jitteredX - camX ) / width * viewportWidth + viewportWidth / 2;

            const k = 0.01;
            const screenY = 1 - ( 1 / ( 1 + k * ( jitteredY - nearY ) ) );

            trees.push( {
              x: screenX,
              y: screenY,
              depth: depth,
              type: ( hashValue * 1000 ) % 1 > 0.5 ? 1 : 0
            } );
          }
        }
      }

      return trees;
    };

    // TODO: noise texture?
    new Multilink( [ positionProperty, layoutBoundsProperty ], ( position, bounds ) => {
      // 0 bottom, 1 top
      const mapY = ( y: number ) => {
        return bounds.bottom * ( 1 - y ) + bounds.top * y;
      };
      const horizonRatio = 0.67;

      const roadBottomY = mapY( 0.19 );
      const roadCenterLowY = mapY( 0.343 );
      const roadCenterHighY = mapY( 0.35 );
      const roadTopY = mapY( 0.48 );
      const treeStartY = mapY( 0.53 );
      const horizon = mapY( horizonRatio );

      roadBackgroundNode.rectBounds = new Bounds2( bounds.left, roadTopY, bounds.right, roadBottomY );
      roadBackgroundNode.fill = new LinearGradient( 0, roadBottomY, 0, roadTopY )
        .addColorStop( 0, '#555' )

        .addColorStop( 0.1, '#555' )
        .addColorStop( 0.1, '#D6D6D6' )
        .addColorStop( 0.12, '#D6D6D6' )
        .addColorStop( 0.12, '#555' )

        .addColorStop( 0.6, '#777' )

        .addColorStop( 0.92, '#555' )
        .addColorStop( 0.92, '#D6D6D6' )
        .addColorStop( 0.935, '#D6D6D6' )
        .addColorStop( 0.935, '#555' )

        .addColorStop( 1, '#555' );

      grassAndSky.rectBounds = bounds;
      grassAndSky.fill = new LinearGradient( 0, bounds.bottom, 0, bounds.top )
        .addColorStop( 0, '#3F8F3D' )
        .addColorStop( horizonRatio, '#88C57A' )
        .addColorStop( horizonRatio, '#cfecfc' )
        // .addColorStop( 1, '#0099CC' );
        .addColorStop( 1, '#02ace4' );

      const midX = bounds.centerX;

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
      const stripeSpacing = 3;
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

      const trees = getTreesInViewport( position, ( rightSafeX - leftSafeX ), 1.1 * bounds.width );

      // Clear children and move them to the pool
      treeContainer.children.forEach( child => {
        ( child as unknown as TPoolable ).freeToPool();
      } );
      treeContainer.removeAllChildren();

      const children: Node[] = [];

      // TODO: use sprites(!) - maybe this will help with flickering issue with SVG
      // TODO: if we want to increase clarity, could add TREE SHADOWS (just a blurred darkness)
      for ( const tree of trees ) {
        const padding = 200;

        if ( tree.x > bounds.left - padding && tree.x < bounds.right + padding ) {
          const pool = tree.type === 0 ? TreeImage1.pool : TreeImage2.pool;

          children.push( pool.create( tree.x, horizon * tree.y + treeStartY * ( 1 - tree.y ), tree.depth ) );
        }
      }

      children.sort( ( a, b ) => { return a.y - b.y; } );

      treeContainer.children = children;
    } );
  }
}