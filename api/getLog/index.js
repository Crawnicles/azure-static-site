const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");

module.exports = async function (context, req) {
  const tableName = "FormData";
  const connectionString = process.env["AzureWebJobsStorage"];
  const tableClient = TableClient.fromConnectionString(connectionString, tableName);

  const formData = {
    PartitionKey: "FormEntry",
    RowKey: `${Date.now()}`, // Unique key for each entry
    Username: req.body.username,
    Email: req.body.email
  };

  try {
    await tableClient.createEntity(formData);
    context.res = {
      status: 200,
      body: "Data saved successfully"
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: `Error saving data: ${error.message}`
    };
  }
};
