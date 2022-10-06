/* eslint-disable arrow-body-style */
import React, { useRef, useEffect } from "react";
// Import just what you need from PixiJS
import { Application, Container } from "pixi.js";
import { Spine } from "pixi-spine";

const BoxPlatium = ({ onComplete, totalRepeat }) => {
  const ref = useRef(null);
  useEffect(() => {
    // On first render create our application
    const app = new Application({
      autoResize: true,
      resolution: devicePixelRatio,
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Add app to DOM
    ref.current.appendChild(app.view);
    // Start the PixiJS app
    app.stop();
    let skeleton = null;
    let animationIndex = 1;

    // load a JSON file and run the `setup` function when it's done
    app.loader
      .add("skeleton", "images/BoxPlatium/skeleton.json")
      .load((_, res) => {
        console.log("platium");
        // instantiate the spine animation
        skeleton = new Spine(res.skeleton.spineData);
        skeleton.skeleton.setToSetupPose();
        skeleton.update(0);
        skeleton.autoUpdate = false;

        // create a container for the spine animation and add the animation to it
        const skeletonCage = new Container();
        skeletonCage.addChild(skeleton);

        // eslint-disable-next-line max-len
        // measure the spine animation and position it inside its container to align it to the origin
        const localRect = skeleton.getLocalBounds();
        skeleton.position.set(-localRect.x, -localRect.y);

        // now we can scale, position and rotate the container as any other display object
        const scale = Math.min(
          (app.screen.width * 0.7) / skeletonCage.width,
          (app.screen.height * 0.2) / skeletonCage.height
        );
        skeletonCage.scale.set(scale, scale);
        skeletonCage.position.set(
          (app.screen.width - skeletonCage.width) * 0.5,
          (app.screen.height - skeletonCage.height) * 0.7
        );

        // add the container to the stage
        app.stage.addChild(skeletonCage);

        // once position and scaled, set the animation to play
        skeleton.state.setAnimation(0, "animation", true);
        skeleton.state.addListener({
          complete: () => {
            console.log("finish animation and stop component");
            animationIndex++;
            if (animationIndex > totalRepeat) {
              app.stop();

              if (onComplete) onComplete();
            }
          },
        });
        app.start();
      });

    app.ticker.add(() => {
      // update the spine animation, only needed if skeleton.autoupdate is set to false
      skeleton.update(0.01666666666667); // HARDCODED FRAMERATE!
    });

    return () => {
      // On unload completely destroy the application and all of it's children
      app.destroy(true, true);
    };
  }, []);
  return <div ref={ref} />;
};

export default BoxPlatium;
