const axios = require('axios');

const analyzeReport = async (data) => {
  try {
    const response = await axios.post(`${process.env.AI_SERVICE_URL}/analyze`, data);
    return response.data;
  } catch (error) {
    console.error(`AI Analysis Error: ${error.message}`);
    return null;
  }
};

const categorize = async (data) => {
  try {
    const response = await axios.post(`${process.env.AI_SERVICE_URL}/categorize`, data);
    return response.data;
  } catch (error) {
    console.error(`AI Categorize Error: ${error.message}`);
    return null;
  }
};

const checkDuplicate = async (data) => {
  try {
    const response = await axios.post(`${process.env.AI_SERVICE_URL}/check-duplicate`, data);
    return response.data;
  } catch (error) {
    console.error(`AI Check Duplicate Error: ${error.message}`);
    return null;
  }
};

const estimateDemand = async (data) => {
  try {
    const response = await axios.post(`${process.env.AI_SERVICE_URL}/estimate-demand`, data);
    return response.data;
  } catch (error) {
    console.error(`AI Estimate Demand Error: ${error.message}`);
    return null;
  }
};

module.exports = { analyzeReport, categorize, checkDuplicate, estimateDemand };
