var AWS = require('aws-sdk');
// Set the AWS config
let awsConfig = {
    "region": "us-east-2",
    "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
}
AWS.config.update(awsConfig);
var credentials = new AWS.SharedIniFileCredentials({profile: 'formula'});
AWS.config.credentials = credentials;

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB();

var dbDC = new AWS.DynamoDB.DocumentClient();


// dataObj: maps sensor data to list of data
// list of data: array of dict with keys [time, val]
function sendDataToDynamoDB(dataObj){

    // Create JSON object for parameters for putItem
    let jsonItem = processSensorData(dataObj); 

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


function createNewSessionItem(availableSensors) {
    let sessionDetails = {
        Date : "2020-01-01",
        'Session Name' : "test entry 11.15",
        ID : "999999"
    };
    // create {sensor_name : []} for each sensor in sessionDetails  
    for (let i = 0; i < availableSensors.length; i++) {
        let sensorName = availableSensors[i];
        sessionDetails[sensorName] = [];
    }
    // add inital to sessionDetails
    dbDC.put({
        TableName: 'SampleSchema',
        Item: sessionDetails
    }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });
    
}

// dataObj: maps sensor data to list of data
// list of data: array of dict with keys [time, val]
function updateSessionItem(dataObj) {

    // for every sensor in dataObj append to item in dynamoDB
    for (let sensorName in Object.keys(dataObj)) {
        let sensorData = dataObj[sensorName];

        let updateExpression = "set " + sensorName + " = list_append(if_not_exists(" + sensorName + ", :empty_list), :sensorData)";
        let expressionAttributeValues = {
            ":sensorData": sensorDataList,
            ":empty_list": []
        };
        dbDC.update({
            TableName: 'SampleSchema',
            Key: {
                ID: "999999",
                'Session Name': "test entry 11.15"
            },
            ReturnValues: 'ALL_NEW',
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues
        }, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log(data);
            }
        });
    }
}


// Helper function to process data to be ready for DynamoDB
function processSensorData(dictData){
    let processedData = {};
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

module.exports = {sendDataToDynamoDB, createNewSessionItem};