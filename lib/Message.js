const colors = require('colors');


/**
 * Handles all messaging (console logging) inside of commands
 */
class Message{

  constructor(volume){
    if(!volume) volume = 3;
    this.volume = volume;
  }

  /**
   * Checks to see if the command ran has a loud enough volume
   * @param testVolume - The volume to check against
   * @returns {boolean}
   */
  isLoudEnough(testVolume){
    return this.volume >= testVolume;
  }

  /**
   * Send a message that states something good happened
   * @param message - The message to log
   */
  success(message){
    this.send('green',message,1);
  }

  /**
   * Send a message that states that something bad happened
   * @param message - The message to log
   */
  error(message){
    this.send('red',message,1);
  }

  /**
   * Send a message that is is neither good nor bad, just informative
   * @param message - The message to log
   */
  notice(message){
    this.send('cyan',message,3);
  }

  /**
   * Send a message that warns people of a possible issue
   * @param message - The message to log
   */
  warning(message){
    this.send('yellow',message,2);
  }

  /**
   * Sends a message using a specified color and minimum volume
   * @param color - Specify the color of the output. Can use any colors specified in the colors library: https://www.npmjs.com/package/colors
   * @param message - The message to log
   * @param minimumVolume - The minimum volume required to display this message
   */
  send(color,message,minimumVolume = 1){
    if(this.isLoudEnough(minimumVolume)) console.log(colors[color](message));
  }
}

module.exports = Message;