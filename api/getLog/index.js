module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Check for POST request
    if (req.method === "POST") {
        // Try parsing the JSON data from the request body
        try {
            const data = req.body;

            // Process your data here. For example, log the data to the console.
            context.log("Received data:", data);

            // Respond back with a success message
            context.res = {
                status: 200, /* Defaults to 200 */
                body: "Data processed successfully."
            };
        } catch (error) {
            // Handle any errors that might occur during parsing or processing
            context.res = {
                status: 400,
                body: "Error processing request data."
            };
        }
    } else {
        // If not a POST request, return a 405 Method Not Allowed
        context.res = {
            status: 405,
            body: "Method not allowed. Please send a POST request."
        };
    }
};
