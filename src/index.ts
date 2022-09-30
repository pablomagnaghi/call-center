import CallCenterSimulation, { Scenario } from "./cally";

const blackFridayScenario: Scenario = [
  { start: 0, end: 480, callsPerMinute: 5 },
  { start: 481, end: 720, callsPerMinute: 10 },
  { start: 721, end: 900, callsPerMinute: 8 },
  { start: 901, end: 1320, callsPerMinute: 12 },
  { start: 1321, end: 1439, callsPerMinute: 5 }
];

const agentsAmount = 5

const simulation = new CallCenterSimulation(blackFridayScenario, agentsAmount); // pass scenario and agents amount
simulation.simulateDay();
console.log(simulation.getSimulationResult());
