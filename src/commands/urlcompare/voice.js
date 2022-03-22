const { flags } = require("@oclif/command");
//const json = require("../../../../twilio-cli-core/src/services/output-formats/json");
const { TwilioClientCommand } = require("@twilio/cli-core").baseCommands;
const chalk = require("chalk");

class VoiceUrlTest extends TwilioClientCommand {
  async run() {
    await super.run();
    const fullData = await this.twilioClient.incomingPhoneNumbers.list();
    this.outputComparison(fullData, this.flags.properties);
  }
  outputComparison(fullData, properties, options) {
    const dataArray = fullData.constructor === Array ? fullData : [fullData];
    
    if (dataArray.length === 0) {
      this.logger.info("No results");
      return;
    }
    
    const limitedData = properties
      ? this.getLimitedData(dataArray, properties)
      : null;

    process.stdout.write(chalk.bold(`\nURL Comparison Results\n\n`));
    const testResults = [];
    //Loop through data and compare voiceUrl to voiceFallbackUrl
    limitedData.forEach((element) => {
      if ((element.voiceUrl == undefined) || element.voiceFallbackUrl == undefined) {
        testResults.push(`SID: ${element.sid} for Phone Number ${element.phoneNumber} has an undefined Voice or Voice Fallback URL`);
      } else if (element.voiceUrl === element.voiceFallbackUrl) {
          
        process.stdout.write(chalk.bold(`URL Test Failed`));
        process.stdout.write(
          `\n\nSID: ${element.sid} for Phone Number ${element.phoneNumber} has the same URL configured for Voice and Voice Fallback\n\n`
        );
        process.stdout.write(
          `VoiceURL: ${element.voiceUrl}\nVoiceFallbackURL: ${element.voiceFallbackUrl}\n\n`
        );

      }
    });
    process.stdout.write(chalk.bold(`URL Tests Passed\n\n`));
    testResults.forEach((member) => {
      process.stdout.write(`${ member }\n`);
    })
    //process.stdout.write(JSON.stringify(testResults, null, 2));
    process.stdout.write(`\n\n`);
  }
}

VoiceUrlTest.description =
  "Tests configured Voice URLs for duplicate values";


  
VoiceUrlTest.flags = {
  properties: flags.string({
    default: "sid, phoneNumber, voiceUrl, voiceFallbackUrl",
    description: "lists URLs",
  }),
};

module.exports = VoiceUrlTest;
