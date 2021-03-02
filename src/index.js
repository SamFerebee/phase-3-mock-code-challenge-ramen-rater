// write your code here

let currentRamenId = "x";

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

fetch("http://localhost:3000/ramens")
    .then(resp => resp.json())
    .then(data => data.forEach(makeRamen))


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