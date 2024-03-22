export function taskComponent(title, id){
    console.log('hello');
    const div = document.createElement('div');
    div.className = 'task';
    div.id = id;
    div.innerHTML = `
        <h2 class="rendered-task-name">${title}</h2>

        <button class="addImageBTN">Add image</button>
        <div class="addImageContainer">
            <div class="addImageBorder">
                <form class="addImageForm">
                    <label for="addImageInput"></label>
                    <input type="file" name="addImageInput" id="addImageInput" class="addImageInput">
                    <button class="addImageBTN-send">SEND</button>
                </form>
            </div>
        </div>

        <button class="imageBTN">See image</button>
        <div class="imageContainer">
            <div class="imageBorder">
                <img src="images/fire.jpg" class="taskImage">
            </div>
        </div>

        <button class="deleteBTN" id=${id}>Delete</button>
    `;
    return div;
}