// custom client-side javascripts for ui

// delete confirmation popup - attach to any html element with the class of "delete"
$('.delete').on('click', () => {
    return confirm('Are you sure you want to delete this?')
})

// compare passwords
function comparePasswords() {
    var pw1 = document.getElementById("password").value
    var pw2 = document.getElementById("confirm").value
    var pwMsg = document.getElementById("pwMsg")

    if (pw1 != pw2) {
        pwMsg.innerText = "Passwords do not match"
        pwMsg.className = "text-danger"
        return false
    }
    else {
        pwMsg.innerText = ""
        pwMsg.className = ""
        return true
    }
}

