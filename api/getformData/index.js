const { BlobServiceClient,
    StorageSharedKeyCredential,
    generateBlobSASQueryParameters,
    BlobSASPermissions } = require("@azure/storage-blob");

var moment = require('moment')
var created = moment().format('YYYY-MM-DDTHH:mm:ss')



module.exports = async function (context, req) {
    try {
        // Parse JSON data from the request body


        const formData = req.body;
        const storageAccountName = process.env.BLOB_STORAGE_ACCOUNT;
        const accountKey = process.env.BLOB_STORAGE_KEY;
        const containerName = process.env.BLOB_STORAGE_CONTAINER;


        const sharedKeyCredential = new StorageSharedKeyCredential(storageAccountName, accountKey);
        const permissions = BlobSASPermissions.parse("racwd");  // r: read, a: add, c: create, w: write, d: delete
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 1); // Set expiry time to 1 day from now

        // Function to create text file content
        const createTextFile = (formData) => {
            let textContent = '';
        
            for (const key in formData) {
            if (formData.hasOwnProperty(key)) {
                textContent += `${key}: ${formData[key]}\n`;
            }
            }
        
            return textContent;
        };
        // Generate SAS token for the blob
        const sasToken = generateBlobSASQueryParameters(
            {
                containerName: containerName,
                permissions: permissions,
                startsOn: new Date(),
                expiresOn: expiryDate,
            },
            sharedKeyCredential
        ).toString();

        // Create the text file content
        const textContent = createTextFile(formData);
        

        // Construct the blob URL with SAS token
        const fileName = `${formData.name}-${created}.txt`;

        const blobUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${fileName}?${sasToken}`;
       
        // Upload text file to Azure Blob Storage
        const headers = {
            "x-ms-blob-type": "BlockBlob",
        };
        const result = await fetch(blobUrl, {
            method: 'PUT',
            body: createTextFile(formData),
            headers
        });

        // Process the JSON data as needed
        console.log('Received JSON data:', result);

        // Send a response
        context.res = {
            status: 200,
            body: JSON.stringify({ message: 'Data processed successfully' })
        };
    } catch (error) {
        // Handle errors
        context.res = {
            status: 500,
            body: 'Error processing data: ' + error.message
        };
    }
};

