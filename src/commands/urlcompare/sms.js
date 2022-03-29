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

    process.stdout.write(chalk.bold(`\nURL Comparison Results\n\n`));
    const testResults = [];
    
    //Loop through data and compare smsUrl to smsFallbackUrl
    limitedData.forEach((element) => {
        
      if ((element.smsUrl == undefined) || element.smsFallbackUrl == undefined) {
        testResults.push(`SID: ${element.sid} for Phone Number ${element.phoneNumber} has an undefined SMS or SMS Fallback URL`);
        
      }
      // This collects blank URLs
      else if ((element.smsUrl == '') || element.smsFallbackUrl == '') {
        testResults.push(`SID: ${element.sid} for Phone Number ${element.phoneNumber} has a blank SMS or SMS Fallback URL`);
      }
        // Tests for same URL and also for trailing slashes but same URL
      else if ((element.smsUrl === element.smsFallbackUrl) || (element.smsUrl === `${ element.smsFallbackUrl }/`) || (`${element.smsUrl}/` === element.smsFallbackUrl)) {
            
        process.stdout.write(chalk.bold(`URL Tests Failed`));
        process.stdout.write(
          `\n\nSID: ${element.sid} for Phone Number ${element.phoneNumber} has the same URL configured for SMS and SMS Fallback\n\n`
        );
        process.stdout.write(
          `SMS URL: ${element.smsUrl}\nSMS FallbackURL: ${element.smsFallbackUrl}\n\n`
        );
          
      }
      else {
        testResults.push(`SID: ${element.sid} for Phone Number ${element.phoneNumber} has unique SMS and SMS Fallback URLs\n\n`)
      }
    }
    );
    if (testResults.length > 0) { 
    process.stdout.write(chalk.bold(`URL Tests Passed\n\n`));
    testResults.forEach((member) => {
      process.stdout.write(`${member}\n`);
    })
  }
    //process.stdout.write(JSON.stringify(testResults, null, 2));
    process.stdout.write(`\n\n`);
  }
}

SmsUrlTest.description =
  "Tests configured SMS URL for duplicate values";



SmsUrlTest.flags = {
  properties: flags.string({
    default: "sid, phoneNumber, smsUrl, smsFallbackUrl",
    description: "lists URLs",
  }),
};

module.exports = SmsUrlTest;
