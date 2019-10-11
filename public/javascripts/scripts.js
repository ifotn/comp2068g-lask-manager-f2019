// custom client-side javascripts for ui

// delete confirmation popup - attach to any html element with the class of "delete"
$('.delete').on('click', () => {
    return confirm('Are you sure you want to delete this?')
})