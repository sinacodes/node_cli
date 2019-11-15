import arg from "arg";
import inquirer from "inquirer";

import { createProject } from './main';

function parseArgs(rawArgs) {
    
    const args = arg({
            "--git": Boolean,
            "--yes": Boolean,
            "--install": Boolean
        },
        {
          argv: rawArgs.slice(2),
        }
    );

    return {
        git: args["--git"] || false,
        skipPrompts: args["--yes"] || false,
        template: args._[0],
        runInstall: args["--install"] || false,
        
    };
};

async function promptMissingOpt(options) {
    const defaultTemplate = "JavaScript";

    if (options.skipPrompts) {
        return {
            ...options,
            template: options.template || defaultTemplate,
        };
    }

    const questions = [];

    if (!options.template) {
        questions.push({
            type: "list",
            name: "template",
            message: "Please choose which project template to use",
            choices: ["JavaScript", "TypeScript"],
            default: defaultTemplate,
        });
    }

    if (!options.git) {
        questions.push({
            type: "confirm",
            name: "git",
            message: "Initialize a git repository?",
            default: false,
        });
    }

    const answers = await inquirer.prompt(questions);

    return {
        ...options,
        template: options.template || answers.template,
        git: options.git || answers.git,
    };
};

export async function cli(args) {
    let options = parseArgs(args);
    options = await promptMissingOpt(options);
    await createProject(options);
}