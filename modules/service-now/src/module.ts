import axios from 'axios';
import * as http from 'https';


/**
 * Gets the information of a chosen table
 * @arg {SecretSelect} `secret` 1 The configured secret to use
 * @arg {CognigyScript} `tableName` 1 The name of the table you want to query
 * @arg {Number} `limit` The limit of the shown results
 * @arg {CognigyScript} `caller_id` 1 The username of the peron that created the ticket
 * @arg {CognigyScript} `assigned_to` 1 The username of the peron that the ticket is currently assigned to
 * @arg {Boolean} `stopOnError` 1 Whether to stop on error or continue
 * @arg {CognigyScript} `store` 1 Where to store the result
 */
async function GETFromTable(input: IFlowInput, args: { secret: CognigySecret, tableName: string, limit?: number, caller_id?: string, assigned_to?: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    /* validate node arguments */
    const { secret, tableName, store, stopOnError, limit, assigned_to, caller_id  } = args;
    if (!secret) throw new Error("Secret not defined.");
    if (!tableName) throw new Error("Table name not defined.");
    if (!store) throw new Error("Context store not defined.");
    if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

    /* validate secrets */
    const { username, password, instance } = secret;
    if (!username) throw new Error("Secret is missing the 'username' field.");
    if (!password) throw new Error("Secret is missing the 'password' field.");
    if (!instance) throw new Error("Secret is missing the 'instance' field.");

    try {
        // TODO: interface
        const options: any = {
            headers: {
                'Accept': 'application/json'
            },
            auth: {
                username,
                password
            },
            params: {
                sysparm_limit: limit,
                caller_id,
                sysparm_query: "ORDERBYDESCnumber",
                sysparm_display_value: true
            }
        }

        if (assigned_to) {
            options.params.assigned_to = assigned_to;
        }

        const response = await axios.get(`${instance}/api/now/table/${tableName}`, options );

       

        // input.actions.output(JSON.stringify(response.data.result), null);
        // input.actions.output(JSON.stringify(response.data.result.length), null);
        input.actions.addToContext(store, response.data.result, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(store, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.GETFromTable = GETFromTable;

/**
 * Inserts a new row into the chosen Service Now table
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `tableName` The name of the table you want to edit
 * @arg {JSON} `data` The data of the row you want to add
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
async function POSTToTable(input: IFlowInput, args: { secret: CognigySecret, tableName: string, data: any, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    /* validate node arguments */
    const { secret, tableName, data, store, stopOnError } = args;
    if (!secret) throw new Error("Secret not defined.");
    if (!tableName) throw new Error("Table name not defined.");
    if (!data) throw new Error("Data to post not defined.");
    if (!store) throw new Error("Context store not defined.");
    if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

    /* validate secrets */
    const { username, password, instance } = secret;
    if (!username) throw new Error("Secret is missing the 'username' field.");
    if (!password) throw new Error("Secret is missing the 'password' field.");
    if (!instance) throw new Error("Secret is missing the 'instance' field.");

    try {
        const response = await axios.post(`${instance}/api/now/table/${tableName}`,
            data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                auth: {
                    username,
                    password
                },
            });

        input.actions.addToContext(store, response.data.result, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(store, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.POSTToTable = POSTToTable;


/**
 * Updates a row from the chosen Service Now table
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `tableName` The name of the table you want to query
 * @arg {JSON} `data` The updated data for the chosen entry
 * @arg {CognigyScript} `sysId` The id of the entry you want to delete
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
async function PatchRecordInTable(input: IFlowInput, args: { secret: CognigySecret, tableName: string, data: any, sysId: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    /* validate node arguments */
    const { secret, tableName, data, sysId, store, stopOnError } = args;
    if (!secret) throw new Error("Secret not defined.");
    if (!tableName) throw new Error("Table name not defined.");
    if (!data) throw new Error("Data to post not defined.");
    if (!sysId) throw new Error("Sys Id not defined.");
    if (!store) throw new Error("Context store not defined.");
    if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

    /* validate secrets */
    const { username, password, instance } = secret;
    if (!username) throw new Error("Secret is missing the 'username' field.");
    if (!password) throw new Error("Secret is missing the 'password' field.");
    if (!instance) throw new Error("Secret is missing the 'instance' field.");

    try {
        const response = await axios.patch(`${instance}/api/now/table/${tableName}/${sysId}`,
            data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                auth: {
                    username,
                    password
                },
            });

        input.actions.addToContext(store, response.data.result, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(store, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.PatchRecordInTable = PatchRecordInTable;


/**
 * Deletes a row from the chosen Service Now table
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `tableName` The name of the table you want to query
 * @arg {CognigyScript} `sysId` The id of the entry you want to delete
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
async function DeleteFromTable(input: IFlowInput, args: { secret: CognigySecret, tableName: string, sysId: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    /* validate node arguments */
    const { secret, tableName, sysId, store, stopOnError } = args;
    if (!secret) throw new Error("Secret not defined.");
    if (!tableName) throw new Error("Table name not defined.");
    if (!sysId) throw new Error("Sys Id not defined.");
    if (!store) throw new Error("Context store not defined.");
    if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

    /* validate secrets */
    const { username, password, instance } = secret;
    if (!username) throw new Error("Secret is missing the 'username' field.");
    if (!password) throw new Error("Secret is missing the 'password' field.");
    if (!instance) throw new Error("Secret is missing the 'instance' field.");

    try {
        const response = await axios.delete(`${instance}/api/now/table/${tableName}/${sysId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            auth: {
                username,
                password
            },
        });

        input.actions.addToContext(store, `succefully deleted entry with id: ${sysId}`, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(store, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.DeleteFromTable = DeleteFromTable;


/**
 * Gets attachments from Service Now
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `limit` How many results you want to show
 * @arg {CognigyScript} `query` A search query, e.g. 'file_name=attachment.doc'
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
async function GETAttachments(input: IFlowInput, args: { secret: CognigySecret, limit?: string, query?: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    /* validate node arguments */
    const { secret, store, stopOnError } = args;
    if (!secret) throw new Error("Secret not defined.");
    if (!store) throw new Error("Context store not defined.");
    if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

    /* validate secrets */
    const { username, password, instance } = secret;
    if (!username) throw new Error("Secret is missing the 'username' field.");
    if (!password) throw new Error("Secret is missing the 'password' field.");
    if (!instance) throw new Error("Secret is missing the 'instance' field.");

    try {
        const response = await axios.get(`${instance}/api/now/attachment`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            auth: {
                username,
                password
            },
            params: {
                sysparm_limit: args.limit,
                sysparm_query: args.query
            }
        });

        input.actions.addToContext(store, response.data.result, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(store, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.GETAttachments = GETAttachments;


/**
 * Gets an attachment by Id
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `sysId` The id of the attachment you want to reach
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
async function GETAttachmentById(input: IFlowInput, args: { secret: CognigySecret, sysId: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    /* validate node arguments */
    const { secret, sysId, store, stopOnError } = args;
    if (!secret) throw new Error("Secret not defined.");
    if (!sysId) throw new Error("Sys Id not defined.");
    if (!store) throw new Error("Context store not defined.");
    if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

    /* validate secrets */
    const { username, password, instance } = secret;
    if (!username) throw new Error("Secret is missing the 'username' field.");
    if (!password) throw new Error("Secret is missing the 'password' field.");
    if (!instance) throw new Error("Secret is missing the 'instance' field.");

    try {
        const response = await axios.get(`${instance}/api/now/attachment/${sysId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            auth: {
                username,
                password
            },
        });

        input.actions.addToContext(store, response.data.result, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(store, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.GETAttachmentById = GETAttachmentById;


/**
 * Posts an attachment to a specific entry in a specific table
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `tableName` The name of the table you want to query
 * @arg {CognigyScript} `tableSysId` The id of the entry in the given table where the attachment will be stored
 * @arg {CognigyScript} `fileName` The full filename, e.g. attachment.docx
 * @arg {CognigyScript} `fileLocation` Where the file is stored now, e.g. AWS S3 bucket etc.

 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
async function POSTAttachment(input: IFlowInput, args: { secret: CognigySecret, tableName: string, tableSysId: string, fileName: string, fileLocation: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    /* validate node arguments */
    const { secret, tableName, tableSysId, fileName, fileLocation, store, stopOnError } = args;
    if (!secret) throw new Error("Secret not defined.");
    if (!tableName) throw new Error("Table name not defined.");
    if (!tableSysId) throw new Error("Table sys Id not defined.");
    if (!fileName) throw new Error("File name not defined.");
    if (!fileLocation) throw new Error("File location not defined.");
    if (!store) throw new Error("Context store not defined.");
    if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

    /* validate secrets */
    const { username, password, instance } = secret;
    if (!username) throw new Error("Secret is missing the 'username' field.");
    if (!password) throw new Error("Secret is missing the 'password' field.");
    if (!instance) throw new Error("Secret is missing the 'instance' field.");

    try {
        const file = await new Promise((resolve) => {
            http.get(fileLocation, (response) => {
                resolve(response);
            });
        });

        const post = await axios.post(`${instance}/api/now/attachment/file`,
            file, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                auth: {
                    username,
                    password
                },
                params: {
                    table_name: tableName,
                    table_sys_id: tableSysId,
                    file_name: fileName
                }
            });

        input.actions.addToContext(store, post.data.result, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(store, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.POSTAttachment = POSTAttachment;


/**
 * Deletes an attachment with specific id
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `sysId` The id of the attachment you want to delete
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
async function DeleteAttachment(input: IFlowInput, args: { secret: CognigySecret, sysId: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    /* validate node arguments */
    const { secret, sysId, store, stopOnError } = args;
    if (!secret) throw new Error("Secret not defined.");
    if (!sysId) throw new Error("Sys Id not defined.");
    if (!store) throw new Error("Context store not defined.");
    if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

    /* validate secrets */
    const { username, password, instance } = secret;
    if (!username) throw new Error("Secret is missing the 'username' field.");
    if (!password) throw new Error("Secret is missing the 'password' field.");
    if (!instance) throw new Error("Secret is missing the 'instance' field.");

    try {
        const response = await axios.delete(`${instance}/api/now/attachment/${sysId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            auth: {
                username,
                password
            },
        });

        input.actions.addToContext(store, `succefully deleted attachment with id: ${sysId}`, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(store, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.DeleteAttachment = DeleteAttachment;