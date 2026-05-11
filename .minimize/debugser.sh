#!/bin/bash
cd scripts/server
cat Random.js \
WebRTC.js \
Item.js \
Universe.js \
SpaceObject.js \
Orb.js \
Planet.js \
SpaceStation.js \
Bullet.js \
GameBody.js \
SpaceShip.js \
Asteroid.js \
equipment/Weapon.js \
equipment/MovingShotWpn.js \
equipment/InstantShotWpn.js \
equipment/Engine.js \
equipment/Other.js \
equipment/RepairBot.js \
Controller.js \
Player.js \
NPC.js \
AsteroidController.js \
Enemy.js \
server.js > ../../src/worker/server.min.js
cd ../..
