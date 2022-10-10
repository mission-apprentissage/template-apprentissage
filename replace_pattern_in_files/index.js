const replace = require('replace-in-file');
const path = require("path")

const args = process.argv.slice(2);
const project_name = args[0].toLowerCase();
const PROJECT_NAME = args[0].toUpperCase();


// TODO replace dns repo 
const run = async ()=>{
    const files = [`./build/**`, `./build/${project_name}/.infra/**`, `./build/${project_name}/.github/**`, `./build/${project_name}/.infra/ansible/roles/setup/files/cerfa/.overrides/**`];
    const ignore = [
        '**/*.lock',
      ];

    try {
       await replace({files,
            from: /mnaprojectname/g,
            to: project_name,
            ignore,
          })
      } catch (error) {
        console.error('Error occurred:', error);
      }

    try {
         await replace({files,
            from: /MNAPROJECTNAME/g,
            to: PROJECT_NAME,
            ignore,
          })
      } catch (error) {
        console.error('Error occurred:', error);
      }
}

run();