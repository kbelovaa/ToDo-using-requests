const $form = document.getElementById('form');
const $content = document.getElementById('content');
const $list = document.getElementById('list');

$form.addEventListener('submit', function(event) {
    event.preventDefault();

    const userName = document.getElementById('user').value;
    const $todo = document.getElementById('todo');

    if ($todo.value != '') {
        createTask(userName, $todo.value);
        $todo.value = '';
    } else {
        getTasks(userName).then((data) => displayToDoList(data));
    }
}); 

$list.addEventListener('click', function(event) {
    const target = event.target;
    const userName = document.getElementById('user').value;

    getTasks(userName).then((data) => {
        const object = data.find(obj => obj.text === target.innerHTML);
        if (object.status === 'complete') {
            deleteTask(userName, object);
        } else {
            target.classList = 'complete';
            const text = object.text;
            const id = object.id;
            changeTaskStatus(userName, text, id);
        }
    });
});

async function getTasks(userName) {
    try {
        const response = await fetch(`https://jsfeajax.herokuapp.com/${userName}/todo`);
        const result = await response.json();
        return await result;
    } catch (error) {
        console.log('Ошибка:', error);
    }
}

async function createTask(userName, todo) {
    try {
        const response = await fetch(`https://jsfeajax.herokuapp.com/${userName}/todo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({"text": todo})
        });
        const result = await response.json();
        displayToDoList(result);
    } catch (error) {
        console.log('Ошибка:', error);
    }
}

async function changeTaskStatus(userName, text, id) {
    try {
        const response = await fetch(`https://jsfeajax.herokuapp.com/${userName}/todo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                "text": text,
                "id": id, 
                "status": "complete"})
        });
    } catch (error) {
        console.log('Ошибка:', error);
    }
}

async function deleteTask(userName, object) {
    try {
        const response = await fetch(`https://jsfeajax.herokuapp.com/${userName}/todo/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(object)
        });
        const result = await response.json();
        displayToDoList(result);
    } catch (error) {
        console.log('Ошибка:', error);
    }
}

function displayToDoList(result) {
    $list.innerHTML = '';

    result.forEach(task => {
        const $li = document.createElement('li');
        $li.innerHTML = task.text;
        if (task.status === 'complete') {
            $li.className = 'complete';
        }
        $list.insertBefore($li, $list.firstChild);
    });

    if (result.length != 0) {
        $content.innerHTML = '';
        $content.classList.remove('content');
    } else {
        $content.innerHTML = 'There are no events yet';
        $content.classList.add('content');
    }
}
