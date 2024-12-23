document.addEventListener('DOMContentLoaded', function(){

    document.querySelectorAll('.menu').forEach(function(button){
        button.addEventListener('click', function(event){
            event.stopPropagation()
            expandMenu(this)
        })
    })

})

window.addEventListener('click', function(event){
    document.querySelectorAll('.select').forEach(function(menu){
        if(menu.style.display === 'block'){
            menu.style.display = 'none'
        }
    })
})

document.getElementById('hamburger-menu').addEventListener('click', function () {
    const sidebar = document.querySelector('.sidebar-container');
    sidebar.classList.toggle('active');
});


function expandMenu(buttonElement) {
    const menuId = buttonElement.getAttribute('data-menuid')
    const menuContent = document.getElementById(menuId)

    if (menuContent.style.display == 'none'|| menuContent.style.display === ''){
        menuContent.style.display = 'block'
    }
    else {
        menuContent.style.display = 'none'
    }
}


function setupModal(modalId, isEdit, buttonElement) {
    var modal = document.getElementById(modalId);

    console.log(document.getElementById(modalId))
    console.log(modalId)

    modal.style.display = "block";

    if(isEdit){
        console.log('In edit mode')

        var taskId = buttonElement.getAttribute('data-task-id')
        var taskName = buttonElement.getAttribute('data-task-name')
        var description = buttonElement.getAttribute('data-task-description')
        var dueDate = buttonElement.getAttribute('data-due-date')
        var parsedDate = new Date(dueDate)

        var timezoneOffset = parsedDate.getTimezoneOffset() * 60000; // Convert offset to milliseconds
        var adjustedDate = new Date(parsedDate.getTime() - timezoneOffset);

        var formattedDate = adjustedDate.toISOString().slice(0, 10);
        
        console.log('Due Date:', dueDate)
        console.log('Parsed Date:',parsedDate)
        console.log('Formatted Date:', formattedDate)

        // console.log(taskName)
        // console.log(description)

        // console.log('code population start')
        var formInternalHTML = `
            <div class="form-group">
                <input 
                    type="text" 
                    name="task_name" 
                    maxlength="200" 
                    class="task-name-class" 
                    placeholder="Task Name" 
                    required="" 
                    id="id_task_name" 
                    value="${taskName}">
            </div>

            <div class="form-group">
                <textarea 
                    name="description" 
                    cols="40" 
                    rows="10" 
                    class="description-class" 
                    placeholder="Description" 
                    id="id_description">${description}</textarea>
            </div>

            <div class="form-group">
                <input 
                    type="date" 
                    name="due_date" 
                    class="due-date-class" 
                    placeholder="Due Date" 
                    id="id_due_date" 
                    value="${formattedDate}">
            </div>

           
            <button 
                type="submit" 
                id="editTask" 
                class="submit-btn"
                value="${taskId}">
                Edit Task
            </button>
            
        `

        $('#editFormDiv').html(formInternalHTML)

    }
    else {
        console.log('In Add mode')
    }

    var span = modal.getElementsByClassName("close")[0];

    span.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function updateTaskStatus(checkbox) {
    taskId = checkbox.id.replace("task_", "")
    var csrftoken = getCookie('csrftoken');
    var checkbox = document.getElementById('task_' + taskId);
    var completed = checkbox.checked ? 'True' : 'False';

    // jQuery AJAX request
    $.ajax({
        url: '/update-task-status/',
        type: 'POST',
        data: {
            'task_id': taskId,
            'completed': completed,
            'csrfmiddlewaretoken': csrftoken
        },
        success: function(response) {
            // Handle successful response
            console.log("Task status updated.");
            window.location.reload(true)
        },
        error: function(error) {
            // Handle error
            console.error("Error updating task status.");
        }
    });

}


$(document).ready(function(){
    $('#addTask').click(function(){
        $.ajax({
            type: 'POST',
            url: '/add-task/',
            data: {
                'task_name': $('#id_task_name').val(),
                'description': $('#id_description').val(),
                'due_date': $('#id_due_date').val(),
                'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
            },
            success: function(response){
                console.log(response.message)
            },
            error: function(response){
                console.log(response.error)
            }

        })
    })
})

$(document).ready(function(){
    $('#editInternal').on('submit', function(e){
        e.preventDefault()

        var formData = $(this).serialize()
        var taskId = $('#editTask').val()

        $.ajax({
            type: 'POST',
            url: '/edit-task/' + taskId + '/',
            data: formData,
            success: function(response){
                console.log("Successfully updated")
                window.location.reload(true)
            },
            error: function(response){
                alert("Error updating the task, please try again.")
            }

        })
    })
})

function deleteTask(buttonElement){

    if(!window.confirm('Are you sure you wnat to delete the task?')){
        return
    }

    var csrfToken = buttonElement.getAttribute('data-csrf')
    var taskId = buttonElement.getAttribute('data-task-id')
    
    $.ajax({
        type: 'POST',
        url: '/delete-task/' + taskId + '/',
        data: {
            'csrfmiddlewaretoken': csrfToken
        },
        success: function(response){
            console.log('successfully deleted')
            window.location.reload()
        },
        error: function(response){
            console.log(response.error)
        }
    })


}


function logOut(buttonElement){

    if(!window.confirm('Are you sure you wnat to logout?')){
        return
    }

    var csrfToken = buttonElement.getAttribute('data-csrf')
    
    $.ajax({
        type: 'POST',
        url: '/logout/',
        data: {
            'csrfmiddlewaretoken': csrfToken
        },
        success: function(response){
            console.log('successfully deleted')
            window.location.reload()
        },
        error: function(response){
            console.log(response.error)
        }
    })
}

