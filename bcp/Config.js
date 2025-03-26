var Config = {};

//base:
Config.debug = false;
Config.framerate = 60;
Config.backgroundColor = '#fff';

//piece:
Config.colors = ["#0000FF", "#E4080A"];
		
Config.initiallyVisiblePixels = .033;//part of shape initiallty visible, relative to viewport height
		
Config.margin_vert = 64;//margin top and bottom. Absolute value.
		
Config.division_offset = -25;//offset in pixels for division in background
Config.division_angle = -1;// -0.5;//in degrees, angle of division, 0 : vertical, >0 : /, <0 : \
		
Config.acceleration_factor = .99;//accelerate by factor every frame after mouseup
Config.threshold_release_speed = 15;//threshold for speed after mouseup above which diff acceleration is used
Config.acceleration_factor_above_threshold = .8;//accelerate by factor every frame after mouseup

//shapes all fit in 280x280, centered (but not snug!)
//from deepsadness, added xys (all points on shape, except control points for curves. Useful for approx bounds)
Config.shapeDefs = [
	{path:"Ar/xlIEggHITfAHMgAHAjSg", name:"triangleTR3", xys:[-76.7,-112.5,-47.9,-113.2,76.8,-112.5,76.1,113.3]},
	{path:"At5xgIT9gSMALmAjcMgjTAAJg", name:"keystone4", xys:[-88.9,-112,38.8,-113.8,113,113,-112.9,113.9]},
	{path:"ArIRfIBXzIIn2jbISLsjMAREAjPg", name:"dented5", xys:[-71.2,111.9,-62.5,-10.5,-112.7,-32.4,3.6,-112.7,112.8,112.8]},
	{path:"Ao/iPIlDrHIXGkTIAWUoIIZOnMgjlAAEg", name:"hourglass6", xys:[-57.5,-14.3,-89.8,-85.4,58,-112.9,60.2,19.1,113.9,112.6,-113.8,113]},
	{path:"Aq7JnIhX7QIYDgFIg1EpIFmeqMghDAAJg", name:"skewedhourglass6", xys:[-69.9,61.5,-78.6,-112.9,75.3,-113.4,70,-83.7,105.8,112.5,-105.7,113.4]},
	{path:"AwHRuMABcgjbIPYGAIPXmFMAAEAjlg", name:"m5", xys:[-103.1,113.4,-93.9,-113.3,4.5,-74.9,102.8,-113.8,103.2,113.9]},
	{path:"AxvQuIAA+CMAjfgEXMAAAAjXg", name:"sloped4", xys:[-113.5,107,-113.5,-85.2,113.6,-113.1,113.6,113.2]},
	{path:"AtuRFIja0GITXuyIK6BOIEAMXIk+WBg", name:"skewed6", xys:[-87.8,109.3,-109.6,-19.3,14.3,-113.9,84.1,-106.1,109.7,-27,77.9,113.9]},
	{path:"AFVQyI3AA2MAAIgjPMAjPgAIMAAAAjfg", name:"square5", xys:[34.1,107.4,-113.1,112.8,-112.3,-112.7,113.2,-113.5,113.2,113.6]},
	{path:"AvjxnISoAAICTR6IMQRNMgjPAAIg", name:"hat5", xys:[-99.5,-112.7,19.7,-112.7,34.4,1.9,112.8,112,-112.7,112.8]},
	{path:"AwHR5MAGggj2INGEFIFojxMAHBAjng", name:"mountain5", xys:[-103.1,114.5,-61.5,-114.9,22.3,-88.8,58.3,-112.9,103.2,115]},
	{path:"AjtReQmrgqjfk8Qjgk9ADowQACjQB4jCQBxi1DIiPQDBiJDshMQDwhMDoAEQD7AFCnA9QC0BCBqCMQDbEgg1K/QgwKDniDnQj7B4lTAAQhnAAhwgLg", name:"irregularoval", xys:[-23.7,111.8,-88.7,76,-110.8,-11.7,-98.6,-51.9,-67.3,-84.3,-24.4,-105.6,22.8,-112.8,64.6,-106.2,93.2,-85.6,109.8,13.5,56.8,100.9,-2.2,112.9,-23.7,111.8]},
	{path:"ABPx9MAQmAjnMgjpAAUg", name:"triangle3", xys:[7.9,-114.9,114.1,113,-114,115]},
	{path:"Am4QVQjLhXieicQidiehWjLQhZjSAAjnQAAjmBZjSQBWjLCdieQCeidDLhWQDShZDmAAQDnAADSBZQDLBWCeCdQCcCeBXDLQBZDSAADmQAADnhZDSQhXDLicCeQieCcjLBXQjSBZjnAAQjmAAjShZg", name:"circle", xys:[104.5,44.1,80.2,80.2,44.1,104.5,0,113.4,-44,104.5]},
	{path:"ABpRaQj0gYjahzQjhh3ijjHQijjHhIj1QhFjqAYj2QAZj2BzjaQB2jiDHijIZAejQjHCjj1BHQivA0i0AAQg/AAhBgHg", name:"halfcircle", xys:[10.5,111.4,-35.7,97.5,-74.5,65.7,-98,21.3,-102.5,-26.7,-88.5,-73.1,-56.8,-112,103.2,83.5,58.8,106.9,23.3,112.1,10.5,111.4]},
	{path:"Ap9R1MgF6gjpITnAAIMIZnIg/KCg", name:"tailwing5", xys:[-63.7,114.1,-101.5,-114,24,-114,101.6,49.9,95.3,114.1]},
	{path:"AxvQGMABqgh1MAh1ABqMgBqAh1g", name:"rotated4", xys:[-113.5,103,-102.9,-113.5,113.6,-102.9,103,113.6]},
	{path:"Ap+G4ImE4sMAgFAAAMgAKAjpg", name:"kite4", xys:[-63.8,44,-102.6,-114,102.7,-114,101.7,114.1]}
];
