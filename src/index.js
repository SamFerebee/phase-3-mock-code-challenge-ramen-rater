// write your code here

let currentRamenId = 1;

const makeRamen = data => {
    const theDiv = document.createElement("div");
    theDiv.innerHTML = `<img src = ${data.image} alt = ${data.name} >`
    theDiv.setAttribute("data-id", `${data.id}`)
    theDiv.setAttribute("data-name", `${data.name}`)
    theDiv.setAttribute("data-restaurant", `${data.restaurant}`)
    theDiv.setAttribute("data-rating", `${data.rating}`)
    theDiv.setAttribute("data-comment", `${data.comment}`)
    document.querySelector("div#ramen-menu").append(theDiv);
}

const setInitial = data => {
    currentRamenId = data.id;
    const ramenDiv = document.querySelector("div#ramen-detail");
    ramenDiv.querySelector("img").src = data.image;
    ramenDiv.querySelector("h2.name").innerText = data.name;
    ramenDiv.querySelector("h3.restaurant").innerText = data.restaurant;
    const theForm = document.querySelector("form#ramen-rating");
    theForm.querySelector("label#rating-label").innerText = `Rating: ${data.rating}`;
    theForm.querySelector("label#comment-label").innerText = `Comment: ${data.comment}`;
}

fetch("http://localhost:3000/ramens")
    .then(resp => resp.json())
    .then(data => {
        data.forEach(makeRamen);
        setInitial(data[0]);
    })


document.querySelector("div#ramen-menu").addEventListener("click", event =>{
    event.preventDefault();
    const ramenDiv = document.querySelector("div#ramen-detail");
    const theDiv = event.target.parentElement
    currentRamenId = theDiv.dataset.id;
    ramenDiv.querySelector("img").src = event.target.getAttribute("src");
    ramenDiv.querySelector("h2.name").innerText = theDiv.dataset.name;
    ramenDiv.querySelector("h3.restaurant").innerText = theDiv.dataset.restaurant;
    const theForm = document.querySelector("form#ramen-rating");
    theForm.querySelector("label#rating-label").innerText = `Rating: ${theDiv.dataset.rating}`;
    theForm.querySelector("label#comment-label").innerText = `Comment: ${theDiv.dataset.comment}`;

})

document.querySelector("form#ramen-rating").addEventListener("submit", function(event){
    event.preventDefault();
    const rating = event.target.rating.value;
    const comment = event.target.comment.value;
    const theRating = document.querySelector("form#ramen-rating > label#rating-label");
    const theComment = document.querySelector("form#ramen-rating > label#comment-label");
    if (currentRamenId != "x"){
        fetch(`http://localhost:3000/ramens/${currentRamenId}`,{
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({rating, comment})
        })
            .then(resp => resp.json())
            .then(data => {
                theRating.innerText = `Rating: ${data.rating}`
                theComment.innerText = `Comment: ${data.comment}`
            })
    }
    event.target.reset();
})

document.querySelector("form#new-ramen").addEventListener("submit", function(event){
    event.preventDefault();
    const name = event.target.name.value;
    const restaurant = event.target.restaurant.value;
    const image = event.target.image.value;
    const rating = event.target.rating.value;
    const comment = event.target.desc.value;
    const newRamen = {name, restaurant, image, rating, comment};
    fetch("http://localhost:3000/ramens", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(newRamen)
    })
        .then(resp => resp.json())
        .then(data => makeRamen(data))

    event.target.reset();
})

document.querySelector("button#delete-button").addEventListener("click", function(event){
    const toDelete = document.querySelector(`div[data-id="${currentRamenId}"]`)
    console.log(toDelete)
    if(currentRamenId != "x"){
        fetch(`http://localhost:3000/ramens/${currentRamenId}`,{
            method: "DELETE",
            headers:{
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(toDelete)
        })
        .then(resp => resp.json())
        .then(data => resetInitPic());
    }
    document.querySelector("div#ramen-menu").removeChild(toDelete)
})

const resetInitPic = param => {
    document.querySelector("div#ramen-detail").setInnerHtml = `
    <img class="detail-image" src="./assets/image-placeholder.jpg" alt="Insert Name Here" />
    <h2 class="name">Insert Name Here</h2>
    <h3 class="restaurant">Insert Restaurant Here</h3>
  `
}