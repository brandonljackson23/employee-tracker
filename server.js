const inquirer = require('inquirer');
const consoleTable = require('console.table');
const connection = require('./db/database');

// Display main menu
const mainMenu = () => {
  inquirer.prompt(
      {
          type: "list",
          name: "main_menu",
          message: "What would you like to do?",
          choices: [
              "View all employees",
              "Add an employee",
              "Update an employee's role",
              "View all roles",
              "Add a role",
              "View all departments",
              "Add a department",
              "Exit"
          ]
      }
  )
  .then(response => {
      if (response.main_menu === "View all employees") {
          return viewEmployees()
      } else if (response.main_menu === "Add an employee") {
          return createEmployee();
      } else if (response.main_menu === "Update an employee's role") {
          return updateEmployee();
      } else if (response.main_menu === "View all roles") {
          return viewRoles();
      } else if (response.main_menu === "Add a role") {
          return createRole();
      } else if (response.main_menu === "View all departments") {
          return viewDepartments();
      } else if (response.main_menu === "Add a department") {
          return createDepartment();
      } else if (response.main_menu === "Exit") {
          return exitMenu();
      }
  })
};

console.log(
  `
   _______________________________________________________
  |                                                       |
  |                                                       |
  |     _____                 _                           |
  |    | ____|_ __ ____ _ ___| | ___  _   _  ___  ___     |
  |    |  _| | '_ ' _  | '_  | |/ _  | | | |/ _ |/ _ |    |
  |    | |___| | | | | | |_) | | (_) | |_| |  __/  __/    |
  |    |_____|_| |_| |_| ,__/|_|____/|___, |____|____|    |
  |                    |_|           |_____/              |
  |        __  __                                         |
  |       |   /  | __ _ _ ___  __ _  __ _  ___ _ __       |
  |       | | /| |/ _' | '_  |/ _' |/ _' |/ _ | '__|      |
  |       | |  | | (_) | | | | (_) | (_) |  __/ |         |
  |       |_|  |_|___,_|_| |_|___,_|___, |____|_|         |
  |                                 |____/                |
  |                                                       |
  |_______________________________________________________|
  
  `
  );
  
  mainMenu();