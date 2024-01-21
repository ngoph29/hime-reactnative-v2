'use strict';

import React, { Component } from 'react';

import {StyleSheet} from 'react-native';

import {
  ViroARScene,
  ViroNode,
  Viro3DObject,
  ViroARImageMarker,
  ViroARTrackingTargets,
  ViroSpotLight,
  ViroQuad,
} from '@viro-community/react-viro';

var createReactClass = require('create-react-class');


var ARScreen = createReactClass({
  getInitialState() {
    return {
      texture: "white",
    }
  },

  render: function() {
    return (
      <ViroARScene>
        <ViroARImageMarker target={"logo"} onAnchorFound={this._onAnchorFound} pauseUpdates={this.state.pauseUpdates}>
          <ViroNode scale={[0, 0, 0]} transformBehaviors={["billboardY"]}/>

          <Viro3DObject
            scale={[0, 0, 0]}
            source={require('../res/an sac menh chi bao.obj')}
            resources={[require('../res/an sac menh chi bao.mtl'),
                        ]}
            type="OBJ"
            materials={this.state.texture}/>

          <ViroSpotLight
            innerAngle={5}
            outerAngle={25}
            direction={[0,-1,0]}
            position={[0, 5, 1]}
            color="#ffffff"
            castsShadow={true}
            shadowMapSize={2048}
            shadowNearZ={2}
            shadowFarZ={7}
            shadowOpacity={.7} />

          <ViroQuad
            rotation={[-90, 0, 0]}
            position={[0, -0.001, 0]}
            width={2.5} height={2.5}
            arShadowReceiver={true} />

        </ViroARImageMarker>
      </ViroARScene>
    );
  },
  _onAnchorFound() {
    this.setState({
      animateCar: true,
    })
  },
  _toggleButtons() {
    this.setState({
      animName: (this.state.animName == "scaleUp" ? "scaleDown" : "scaleUp"),
      playAnim: true
    })
  },
});

ViroARTrackingTargets.createTargets({
  logo : {
    source : require('../res/an sac menh chi bao.png'),
    orientation : "Up",
    physicalWidth : 0.165 // real world width in meters
  }
});



module.exports = ARScreen;

