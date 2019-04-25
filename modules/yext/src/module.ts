const axios = require('axios');


/**
 * Gets the information of a chosen table
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {Select[Locations,Events,Products,Assets,Entities,Folders,Menus,Bios]} `entity` The entity you want to get from Yext
 * @arg {CognigyScript} `api_version` The version you want to use, e.g. 20190424 (a date)
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
async function GetEntity(input: IFlowInput, args: { secret: CognigySecret, entity: string, api_version: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.api_key) return Promise.reject("Secret not defined or invalid.");
    if (!args.entity) return Promise.reject("No entity defined.");
    if (!args.api_version) return Promise.reject("No version defined.");


    return new Promise((resolve, reject) => {
        let result = {};
        
        input.actions.output(args.entity.toLowerCase(), null)

        axios.get(`https://api.yext.com/v2/accounts/me/${args.entity.toLowerCase()}?api_key=${args.secret.api_key}&v=${args.api_version}`, {
            headers: {
                'Allow': 'application/json'
            }
        })
            .then((response) => {
                result = response.data
                input.context.getFullContext()[args.store] = result
                resolve(input)
            })
            .catch((error) => {
                if (args.stopOnError) { reject(error.message); return; }
                else result = { "error": error.message };
                resolve(input)
            })
    });
}

module.exports.GetEntity = GetEntity;

