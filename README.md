# poll

Simple poll manager system for Twitch and Kick. 

### Config

```
https://poll.igor.ovh/?channel=igor_ovh
    &service=twitch
    &allowList=igor_ovh,igor
```

- `channel` - channel to which bot will connect (**just your channel name**),
- `service` - service which script will be using (`twitch` or `kick`),
- `allowList` - list of users (seperated by `,`), which will be allowed to use command without being moderator (**moderator usernames do not have to be here, they will can use these commands anyway, this is like extra users list**),

You don't have to use every parameter, values shown there are deafult and if you dont use some paramater the default value will be used.  
So the URL can be even this: `https://poll.igor.ovh/?channel=igor_ovh`

### Commands

Only moderator can use these commands.

- `!quickvote <answers>` - it displays quick poll with no names.  
  - `[answers]` is amount of answers (max 12, default 2).  
  - Aliases: `!qvote` `!quickpoll`, `!qpoll`,  

- `!skipvote` - it skips current poll.  
  - Aliases: `!svote`, `!skippoll`, `!spoll`,  

- `!customvote [time]` - it is creator for polls, examples are below. After this command firstly type **question**, and then **answers** to this question, **just in chat without any commands**.
  - `[time]` is how much time poll will be displayed (in seconds).  
  - Aliases: `!cpoll`, `!cvote`, `!custompoll`, `!cpoll`,  

- `!canclecustomvote` - it cancels creator for polls.
  - Aliases: `!ccvote`, `!cancelcustompoll`, `!ccpoll`.

### Examples

#### `!qvote`
![qvote](https://github.com/igorovh/poll/assets/37638480/2cdf550a-a686-48c1-814f-0e99526ec0c6)

#### `!cvote`

![cpoll](https://github.com/igorovh/poll/assets/37638480/1cab9f62-068d-44b5-9173-7b9537409f08)

### Building / Development

Add latest version of [tmi.js](https://tmijs.com/) as `src/js/twitch/tmi.js`.

### StreamElements

Change `src` to URL with your config.  
Then copy this script and follow the video.
```html
<iframe src="https://poll.igor.ovh/" frameborder="0" width="100%" height="100%">
```

https://github.com/igorovh/poll/assets/37638480/a20b083c-6efe-4702-b151-738259573033
