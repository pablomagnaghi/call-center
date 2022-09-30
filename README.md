# call-center

A Call Center is a company that atends calls for other companies.
We want to know how "Cally", our call center, will perform in different scenarios.
      
We know that for different time frames there will be a fixed amount of calls per minute.


Write a system that simulates the environment.

An example of an scenario we can simulate is a "Black Friday", lots of incoming calls per minute
- Between 00:00 and 08:00 (0m - 480m): 5 new customer's calls the Call Center every minute
- Between 08:00 and 12:00 (481m - 720m): 10 new customer's calls the Call Center every minute
- Between 12:00 and 15:00 (721m - 900m): 8 new customer's calls the Call Center every minute
- Between 15:00 and 22:00 (901m - 1320m): 12 new customer's calls the Call Center every minute
- Between 22:00 and 23:59 (1321m - 1439m): 5 new customer's calls the Call Center every minute

Notes:
- Calls last between 1-5 minutes (randomnly)
- The amount of Agents is fixed
- The strategy to use for call assignation should be as fair as possible for all the agents (load balancing the work).

Some important information to gather for "Cally":
- Remaining calls at the end of the day
- Finished calls grouped by Agent
- Finished calls at the end of the day
- Avarage call waiting time
     
Input of the simulation should be:
- The Scenario
- The Agents

Extra:
- Change how calls are assigned to Agents to balance work load between all the agents
- Average Idle time of Agents.
- Time of day with more waiting calls
- Certain percentage of reincident calls that needs to be attended by the same agent
- Reincident calls with priority

# to generate js files
` % tsc -p . `
# to run after js generation
` % npm start `
    