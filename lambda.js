const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1'
});

const dDBtable = 'vacancies';
const dDB = new AWS.DynamoDB.DocumentClient();
const jobPath = '/jobs';


exports.handler = async (event) => {
  
  let response;
  
  switch (event.httpMethod) {
    case 'POST':
        response = await saveUser(JSON.parse(event.body));
          
      break;
    
    case 'GET':
        
        response = await getJobs();
        
      break;
      
    case 'PUT':
      
        const req = JSON.parse(event.body)
        response = await updateJobs(req.id,req.updateKey,req.updateValue);
      
      break;
    
    case 'DELETE' :
        
        response = await deleteJobs(JSON.parse(event.body).id)
      
      break;
    
    default:
        response = buildResponse(404,'404 Not Found');
      
  }
  
  return response;
};


//delete
async function deleteJobs(id) {
  const params = {
    TableName: dDBtable,
    Key:{
      'id': id
    },
    returnValues : 'ALL_OLD'
  }
  
  return await dDB.delete(params).promise().then(response=>{
    
    const body = {
      Operation: 'DELETE',
      Message : 'SUCCESS',
      Item: response
      
    }
    
    return buildResponse(200,body)
    
  },(error)=>{
      console.log(error);
      return buildResponse(400,error);
  })
}

//put
async function updateJobs(id,updateKey,updateValue) {
  const params = {
    TableName: dDBtable,
    Key:{
      'id':id
    },
    UpdateExpression: `set ${updateKey} = :value`,
    ExpressionAttributeValues : {
      ':value' : updateValue
    },
    returnValues: 'UPDATED_NEW'
  }
  
  return await  dDB.update(params).promise().then(response =>{
    
    const body = {
      Operation: "UPDATE",
      Message: "SUCCESS",
      Item: response
    };
    
    return buildResponse(200,body);
    
  },(error)=>{
      console.log(error);
      return buildResponse(400,error);
  })
}




//get jobs
async function getJobs(){
  const params = {
    TableName: dDBtable
  }
  
  const allJobs = await dDB.scan(params).promise();
  
  const body = {
    jobs: allJobs
  }
  
  return buildResponse(200,body)
}



//post request
async function saveUser(req){
  const params = {
    TableName : dDBtable,
    Item: req
  };
  
  return await dDB.put(params).promise().then(()=>{
    
    const body = {
      Operation: "SAVE",
      Message: "SUCCESS",
      Item: req
    };
    
    return buildResponse(200,body);
    
  },(error)=>{
    
    console.log(error);
    return buildResponse(400,error);
    
  });
}



//response function
function buildResponse(statusCode,body){
  return {
    statusCode: statusCode,
    headers: {
      'Content-Type' : 'application/json',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*"
    },
    body: JSON.stringify(body)
  };
  
}