const replace = require('replace-in-file');
const prompt = require('prompt');

const args = process.argv.slice(2);
const project_name = args[0].toLowerCase();
const PROJECT_NAME = args[0].toUpperCase();


const run = async ()=>{
    prompt.start();
    const {ACRONYM, DNS_BASE, REPO_NAME} = await prompt.get([{
      name: 'ACRONYM',
      default: 'mna', 
      message:  'Acronym ? mna ou tjp',
    }, {
        name: 'DNS_BASE',
        default: 'trajectoirespro.beta.gouv.fr', 
        message: 'Base Dns name ? trajectoirespro.beta.gouv.fr ou apprentissage.beta.gouv.fr',
      }, {
        name: 'REPO_NAME',
        required: true,
        message: 'Repository name ? exemple : catalogue ou matcha',
      }]);

    const files = [`./build/**`, `./build/${project_name}/.infra/**`, `./build/${project_name}/.github/**`, `./build/${project_name}/.infra/ansible/roles/setup/files/app/.overrides/**`];
    const ignore = [
        '**/*.lock',
      ];

    try {
       await replace({files,
            from: /ACRONYM_PROJECT/g,
            to: ACRONYM.trim(),
            ignore,
          })
      } catch (error) {
        console.error('Error occurred:', error);
      }
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
    try {
         await replace({files,
            from: /mnaREPOname/g,
            to: REPO_NAME.trim(),
            ignore,
          })
      } catch (error) {
        console.error('Error occurred:', error);
      }
    try {
         await replace({files,
            from: /mnaDNSBASE/g,
            to: DNS_BASE.trim(),
            ignore,
          })
      } catch (error) {
        console.error('Error occurred:', error);
      }
}

run();