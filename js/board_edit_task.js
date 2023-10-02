function deleteSubTask(subTaskID, taskID) {
    tasks[taskID]['subtasks'].splice(subTaskID, 1);
    document.getElementById('subtask-list').innerHTML = ''
    loopThroughSubtasks(tasks[taskID]['subtasks'], taskID)
}

/**
 * Iterates through the users assigned to a task and checks the corresponding checkboxes
 * @param {*} id - The ID of the task to loop through users for 
 */
function loopThroughUsers(id) {
    for (let j = 0; j < tasks[id]['users'].length; j++) {
        const user = tasks[id]['users'][j];
        for (let i = 0; i < contactsAddTask.length; i++) {
            if (document.getElementById('assigned-to-' + i).value == user['userShort']) {
                document.getElementById('assigned-to-' + i).checked = true;
            }
        }
    }
}

/**
 * Fills the task popup form with task data, given the task ID
 * @param {*} id - The ID of the task to be filled in the form 
 */
function fillTheTasks(id) {
    let title = tasks[id]['body_header'];
    let text = tasks[id]['body_content'];
    let category = tasks[id]['category'];
    let date = tasks[id]['date'];
    let prio = tasks[id]['priotity'][0]['priotity'];
    let thisSubtasks = tasks[id]['subtasks'];
    subtasks = tasks[id]['subtasks'];

    checkPrioButton(prio);
    changeColor();
    getValueFromTaskInputs(title, text, category, date);
    loopThroughUsers(id);
    loopThroughSubtasks(thisSubtasks, id);
}

/**
 * Creates a JSON object representing the edited task.
 * @param {*} id - The ID of the task being edited. 
 * @param {*} title - The title of the task. 
 * @param {*} description - The description of the task. 
 * @param {*} assigned_to - An array of users assigned to the task 
 * @param {*} due_date - The due date of the task. 
 * @returns {object} - A JSON object representing the edited task. 
 */
function createEditedTaskJson(id, title, description, assigned_to, due_date) {
    return {
        'split': tasks[id]['split'],
        'category': category,
        'color': selectedColor,
        'body_header': title,
        'body_content': description,
        'progress': '',
        'users': assigned_to,
        'priotity': checkPrioity(),
        'date': due_date,
        'subtasks': subtasks
    }
}

/**
 * Edits an existing task by updating its properties and saves the changes to local storage.
 * @param {*} id - The id of the task to be edited. 
 */
async function editAddTask(id) {
    let title = document.getElementById('title_textfield').value;
    let description = document.getElementById('description_textfield').value;
    category = currentCategory || tasks[id]['category'];
    selectedColor = currentColor || tasks[id]['color'];
    let assigned_to = getAssignedUsers();
    let due_date = document.getElementById('date').value;
    if (!isCategoryValid(category)) return;
    new_task = createEditedTaskJson(id, title, description, assigned_to, due_date);
    tasks[id] = new_task;
    await saveNotes();
    subtasks = [];
    window.location.href = './board.html';
}

/**
 * Loops through an array of subtasks and appends each subtask name to an HTML unordered list element with the ID 'subtask-list'.
 * @param {*} thisSubtasks - An array of subtasks to loop through. 
 */
function loopThroughSubtasks(thisSubtasks, taskID) {
    for (let s = 0; s < thisSubtasks.length; s++) {
        const subtask = thisSubtasks[s];
        document.getElementById('subtask-list').innerHTML += `<li>${subtask['subtaskName']} <img src="./assets/img/empty-trash-32.png" class="delSubtask" onclick="deleteSubTask(${s},${taskID})"></li>`;
    }
}