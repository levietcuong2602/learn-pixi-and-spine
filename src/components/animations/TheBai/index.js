/* eslint-disable arrow-body-style */
import React, { useState, useRef, useEffect } from "react";
// Import just what you need from PixiJS
import { Application, Container, Sprite, filters } from "pixi.js";
import { Spine } from "pixi-spine";

const getRandomInt = (min, max) => {
  return min + Math.floor(Math.random() * max);
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MAX_LIMIT_USED = 15;

const TheBai = ({ onComplete, animation, skins = [] }) => {
  const ref = useRef(null);

  useEffect(() => {
    // On first render create our application
    const app = new Application({
      autoResize: true,
      resolution: devicePixelRatio,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    app.stage.interactive = true;

    // Add app to DOM
    ref.current.appendChild(app.view);

    // Start the PixiJS app
    app.stop();
    let thebai = null;
    let currentSkinIndex = 0;

    let newSkins = skins.map((skin) => {
      if (skin > 15) return getRandomInt(1, 15);

      return skin;
    });
    // load a JSON file and run the `setup` function when it's done
    const loader = app.loader;
    skins.forEach((skin) => {
      if (skin > MAX_LIMIT_USED) {
        loader.add(
          `${skin}`,
          `https://fifafootball.s3.ap-southeast-1.amazonaws.com/all/${skin}.png`
        );
      }
    });
    loader.add("thebai", "images/TheBai/thebai.json").load((_, res) => {
      // instantiate the spine animation
      thebai = new Spine(res.thebai.spineData);
      thebai.update(0);
      thebai.autoUpdate = false;

      // create a container for the spine animation and add the animation to it
      const thebaiCage = new Container();
      thebai.skeleton.setSkinByName(newSkins[currentSkinIndex]);

      thebaiCage.addChild(thebai);
      // eslint-disable-next-line max-len
      // measure the spine animation and position it inside its container to align it to the origin
      const localRect = thebai.getLocalBounds();
      thebai.position.set(-localRect.x, -localRect.y);

      // now we can scale, position and rotate the container as any other display object
      const scale = Math.min(
        (app.screen.width * 0.5) / thebaiCage.width,
        (app.screen.height * 0.5) / thebaiCage.height
      );
      thebaiCage.scale.set(scale, scale);
      thebaiCage.position.set(
        (app.screen.width - thebaiCage.width) * 0.5,
        (app.screen.height - thebaiCage.height) * 0.7
      );

      // add the container to the stage
      app.stage.addChild(thebaiCage);

      // once position and scaled, set the animation to play
      const allAnimations = [
        "top10",
        "top20",
        "top30",
        "top50",
        "top100",
        "top200",
        "all",
      ];

      if (allAnimations.includes(animation.toLowerCase())) {
        thebai.state.setAnimation(0, animation, true);

        thebai.state.addListener({
          complete: async () => {
            console.log("finish animation and stop component");
            currentSkinIndex += 1;
            if (currentSkinIndex >= skins.length) {
              app.stop();
              if (onComplete) onComplete();
            }
            if (!skins[currentSkinIndex]) return;

            thebai.skeleton.setSkinByName(newSkins[currentSkinIndex]);
          },
        });
      }
      app.start();
    });

    app.ticker.add((deta) => {
      // update the spine animation, only needed if diamond.autoupdate is set to false
      thebai.update(0.01666666666667); // HARDCODED FRAMERATE!
    });

    return () => {
      // On unload completely destroy the application and all of it's children
      app.destroy(true, true);
    };
  }, []);
  return <div ref={ref} />;
};

export default TheBai;
