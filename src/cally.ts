import { getRandomNumberBetween } from "./utils";

type ScenarioRangeCondition = {
    start: number; // Minute of day that the condition applies
    end: number; // Minute of day where the condition stops applying
    callsPerMinute: number;
};

export type Scenario = ScenarioRangeCondition[];

abstract class DayByMinuteSimulation {
    currentMinuteOfDay: number;
  
    constructor(
      // Current minute of the current day
      currentMinuteOfDay: number = 0
    ) {
      this.currentMinuteOfDay = currentMinuteOfDay;
    }
  
    // Runs every minute, should have simulation logic
    abstract tick(): void;
  
    // Returns important conclusions of the simulation
    abstract getSimulationResult(): any;
  
    // Simulates a day and runs tick function every minute
    simulateDay(): void {
      const time = 60 * 24; // minutes in a day
      for (let minute = 0; minute < time; minute++) {
        // console.log(`--- Start Minute ${minute} ---`);
        this.currentMinuteOfDay = minute;
        this.tick();
        // console.log(`--- End Minute ${minute} ---`);
      }
    }
  }
  
class Call {
    startTime: number
    duration: number
    waitingTime: number
  
    constructor(duration: number) {
      this.duration = duration;
      this.startTime = 0;
      this.waitingTime = 0;
    }

    waiting() {
        this.waitingTime++;
    }
    
    arriveTime(startTime: number) {
        this.startTime = startTime;
    }
}
  
class Agent {
    calls: Array<Call>;

    constructor() {
        this.calls = new Array<Call>;
    }

    isFree(currentMinute: number): boolean {
        // first time, agent does not have calls
        if (this.calls.length == 0) {
            return true;
        }

        // get last call to review if it ends
        const call = this.calls[this.calls.length-1]
        if (call.startTime + call.duration < currentMinute) {
            return true;
        }

        // call does not finish yet
        return false
    }

    addCall(call: Call) {
        this.calls.push(call);
    }

}

class CallCenterStats {
    remainingCalls: number;
    finishedCallGroupedByAgent: Map<number,number>;
    finishedCallAtTheEndOfTheDay: number;
    averageCallWaitingTime: number;

    constructor() {
        this.finishedCallGroupedByAgent = new Map<number,number>();
        this.finishedCallAtTheEndOfTheDay = 0;
        this.remainingCalls = 0;
        this.averageCallWaitingTime = 0;
    } 

    generateStats(agents : Array<Agent>, totalCalls: number) {
        this.finishedCallGroupedByAgent = new Map<number,number>();
        this.finishedCallAtTheEndOfTheDay = 0;
        let waitingTime = 0;
        for (let i = 0; i < agents.length; i++) {
            this.finishedCallGroupedByAgent.set(i, agents[i].calls.length)
            this.finishedCallAtTheEndOfTheDay = this.finishedCallAtTheEndOfTheDay + agents[i].calls.length;
            for (let call of agents[i].calls) {
                waitingTime = waitingTime + call.waitingTime;
            }  
        }

        this.remainingCalls = totalCalls -  this.finishedCallAtTheEndOfTheDay;
        this.averageCallWaitingTime = waitingTime / this.finishedCallAtTheEndOfTheDay;
    } 
}

  
// Implement CallCenterSimulation
class CallCenterSimulation extends DayByMinuteSimulation {
    blackFridaySimulator: Scenario;
    callsBySlot: Map<number, Array<Call>>;
    agents: Array<Agent>;
    totalCalls: number;

  
    constructor(blackFridaySimulator: Scenario, agentsAmount: number) {
      super();
      this.blackFridaySimulator = blackFridaySimulator;
      this.createCallsBySlot()
      this.createAgents(agentsAmount)
    }

    // initialize calls group by time slot
    createCallsBySlot() {
       this.totalCalls = 0;
       this.callsBySlot = new Map<number, Array<Call>>();

       for (let i = 0; i < this.blackFridaySimulator.length; i++) {
        var slot = this.blackFridaySimulator[i]
        var calls : Array<Call> = [];
        for (let j = 0; j < slot.callsPerMinute; j++) {
            var call = new Call(getRandomNumberBetween(1, 5))
            calls.push(call)
        }
        this.totalCalls += calls.length;
        this.callsBySlot.set(i, calls)
      }
    }

    createAgents(agentsAmount: number) {
        this.agents = new Array<Agent>();
        for (let i = 0; i < agentsAmount; i++) {
            var agent = new Agent();
            this.agents.push(agent)
        }
    }

    getSlotByCurrentMinute() {
        for (let i = 0; i < this.blackFridaySimulator.length; i++) {
            const slot = this.blackFridaySimulator[i]
            if (slot.start <= this.currentMinuteOfDay && this.currentMinuteOfDay <= slot.end) {
                return i
            }
        }
    }

    getAgentFree(): Agent | null {
        for (let agent of this.agents) {
            if (agent.isFree(this.currentMinuteOfDay)) {
                return agent;
            }
        }     
        return null
    }

    // increase waiting time for all calls enqueued
    waiting(callsBySlot: Array<Call>) {
        for (var call of callsBySlot) {
            call.waiting()
        } 
    }

    tick(): void {
        const slot = this.getSlotByCurrentMinute()
        var calls = this.callsBySlot.get(slot)
        var agent = this.getAgentFree()
        // check if there an agent available
        if (agent == null) {
            console.log("all agents are on call")
            this.waiting(calls);
            return

        }
        // check if all calls were answered 
        if (calls.length == 0) {
            // all calls were answered
            return
        }
        // dequeue call 
        var call = calls.shift();
        call.arriveTime(this.currentMinuteOfDay)
        agent.addCall(call)
    }

    getSimulationResult(): CallCenterStats {
        var stats = new CallCenterStats()
        stats.generateStats(this.agents, this.totalCalls);
        return stats;
    }
  
}

export default CallCenterSimulation;
  