module.exports = async function (context, req) {
    try {
        // Parse JSON data from the request body
        const jsonData = req.body;

        // Process the JSON data as needed
        console.log('Received JSON data:', jsonData);

        // Send a response
        context.res = {
            status: 200,
            body: 'Data received successfully'
        };
    } catch (error) {
        // Handle errors
        context.res = {
            status: 500,
            body: 'Error processing data: ' + error.message
        };
    }
};