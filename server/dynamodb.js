function sendDataToDynamoDB(dataDict){
    // Load the AWS SDK for Node.js
    var AWS = require('aws-sdk');
    // Set the region 
    let awsConfig = {
        "region": "us-east-2",
        "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
        "accessKeyId": "nothing",
        "secretAccessKey":"nothing"
    }
    AWS.config.update(awsConfig);

    // Create the DynamoDB service object
    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    // Create JSON object for parameters for putItem
    let jsonItem = processSensorData(dataDict); 

    var params = {
    TableName: 'SampleSchema',
    Item: jsonItem
    };

    // // Call DynamoDB to add the item to the table
    ddb.putItem(params, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data);
    }
    });

    console.log(jsonItem);
}

// Helper function to process data to be ready for DynamoDB
function processSensorData(dictData){
    let processedData = {};
    
    // process dictData to DynamoDB to json
    for (let key in dictData){
        let sensorData = dictData[key];
        let sensorDataList = [];
        for (let i = 0; i < sensorData.length; i++){
            let sensorDataPoint = sensorData[i];
            let sensorDataPointList = [];
            sensorDataPointList.push({"S": sensorDataPoint[0]});
            sensorDataPointList.push({"N": sensorDataPoint[1]});
            sensorDataList.push({"L": sensorDataPointList});
        }
        processedData[key] = {"L": sensorDataList};
    }

    return processedData;
}

module.exports = {sendDataToDynamoDB};