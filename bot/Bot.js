import JassBot from './JassBot.js';


let numberOfBotsToStartFromCommandLine = process.argv[2];
let defaultNumberOfBotsToStartFromCommandLine = 4;

let nameOfBotToStartFromCommandLine = process.argv[3];
let nameOfBot = 'JassBot';

let numberOfBotsToStart = defaultNumberOfBotsToStartFromCommandLine;
if(!isNaN(numberOfBotsToStartFromCommandLine) && numberOfBotsToStartFromCommandLine>0 && numberOfBotsToStartFromCommandLine< defaultNumberOfBotsToStartFromCommandLine){
    numberOfBotsToStart = numberOfBotsToStartFromCommandLine;
}

if(nameOfBotToStartFromCommandLine) {
    nameOfBot = nameOfBotToStartFromCommandLine;
}

for (let i = 1; i <= numberOfBotsToStart; i++){
    let jassBot = JassBot.create(nameOfBot);
}

