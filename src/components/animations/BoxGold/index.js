/* eslint-disable arrow-body-style */
import React, { useRef, useEffect } from "react";
// Import just what you need from PixiJS
import { Application, Container } from "pixi.js";
import { Spine } from "pixi-spine";

const BoxGold = ({ onComplete, totalRepeat }) => {
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
    let god = null;
    let animationIndex = 1;

    // load a JSON file and run the `setup` function when it's done
    app.loader.add("god", "images/BoxGold/god.json").load((_, res) => {
      // instantiate the spine animation
      god = new Spine(res.god.spineData);
      god.skeleton.setToSetupPose();
      god.update(0);
      god.autoUpdate = false;

      // create a container for the spine animation and add the animation to it
      const godCage = new Container();
      godCage.addChild(god);

      // eslint-disable-next-line max-len
      // measure the spine animation and position it inside its container to align it to the origin
      const localRect = god.getLocalBounds();
      god.position.set(-localRect.x, -localRect.y);

      // now we can scale, position and rotate the container as any other display object
      const scale = Math.min(
        (app.screen.width * 0.7) / godCage.width,
        (app.screen.height * 0.2) / godCage.height
      );
      godCage.scale.set(scale, scale);
      godCage.position.set(
        (app.screen.width - godCage.width) * 0.5,
        (app.screen.height - godCage.height) * 0.7
      );

      // add the container to the stage
      app.stage.addChild(godCage);

      // once position and scaled, set the animation to play
      god.state.setAnimation(0, "animation", true);
      god.state.addListener({
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
      // update the spine animation, only needed if gold.autoupdate is set to false
      god.update(0.01666666666667); // HARDCODED FRAMERATE!
    });

    return () => {
      // On unload completely destroy the application and all of it's children
      app.destroy(true, true);
    };
  }, []);
  return <div ref={ref} />;
};

export default BoxGold;
