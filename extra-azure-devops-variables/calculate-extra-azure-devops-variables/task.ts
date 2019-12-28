import tl = require('azure-pipelines-task-lib/task')
import tr = require('azure-pipelines-task-lib/toolrunner')

// ------------------------------------ prerequisites ------------------------------------
if (process.env.SYSTEM_ACCESSTOKEN == null) {
    tl.setResult(tl.TaskResult.Failed, "No access to SYSTEM_ACCESSTOKEN. You must provide access to System.AccessToken. See how: https://docs.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops&tabs=yaml#systemaccesstoken")
    process.exit(-1)
}

let supportedProviders = ["TfsGit", "Git", "GitHub"]
if (!supportedProviders.includes(<string>process.env.BUILD_REPOSITORY_PROVIDER)) {
    tl.setResult(tl.TaskResult.Failed, `This task only supports git based version control systems like: ${supportedProviders.join(', ')}. '${process.env.BUILD_REPOSITORY_PROVIDER}' is not supported.`)
    process.exit(-1)
}

// ------------------------------------ functions ------------------------------------
async function getActiveSprintName(): Promise<string> {
    console.debug("Calculate active sprint")
    console.debug(`Get commit time of ${process.env.BUILD_SOURCEVERSION}`)
    let dateTimeString = tl.execSync("git", `show -s --format=%ci ${process.env.BUILD_SOURCEVERSION}`)
    console.log(`dateTimeString: ${dateTimeString}`)
    let commitTime: Date = new Date(`${dateTimeString}`)
    console.log(`Time of commit: ${commitTime}`)



    return "testValue"
}

async function run() {
    try {
        let extraVariables: { [variable: string]: string } = {}
        extraVariables["EXTRAVARIABLES_ACTIVESPRINT"] = await getActiveSprintName()

        console.log("Variables calculated:")
        console.log(extraVariables)

        for (let variable in extraVariables) {
            tl.setVariable(variable, extraVariables[variable])
        }
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message)
    }
}

run()




// todo
//  - check if process.exit(-1) is necessary running this script inside a task