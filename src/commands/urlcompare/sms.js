const { flags } = require("@oclif/command");
//const json = require("../../../../twilio-cli-core/src/services/output-formats/json");
const { TwilioClientCommand } = require("@twilio/cli-core").baseCommands;
const chalk = require("chalk");

class SmsUrlTest extends TwilioClientCommand {
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

    process.stdout.write(chalk.bold(`\nURL Validation Results\n\n`));

    //Loop through data and compare smsUrl to smsFallbackUrl
    limitedData.forEach((element) => {
        if (element.smsUrl === element.smsFallbackUrl) {
            if (element.smsUrl == undefined) {
                return;
          }
        process.stdout.write(chalk.bold(`URL Test Failed`));
        process.stdout.write(
          `\n\nSID: ${element.sid} for Phone Number ${element.phoneNumber} has the same URL configured for SMS and SMS Fallback\n\n`
        );
        process.stdout.write(
          `VoiceURL: ${element.smsUrl}\nVoiceFallbackURL: ${element.smsFallbackUrl}\n\n`
        );

      }
    });
  }
}

SmsUrlTest.description =
  "Tests configured SMS URL for duplicate values";

// Flags are not currently implemented for this plugin

// SmsUrlTest.flags = {
//   properties: flags.string({
//     default: "sid, phoneNumber, voiceUrl, voiceFallbackUrl",
//     description: "lists URLs",
//   }),
// };

module.exports = SmsUrlTest;
