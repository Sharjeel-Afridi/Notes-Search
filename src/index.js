const inputfield = document.getElementById('input-el');
const submit = document.getElementById('submit');
const apiURL =  'https://notes-search.pockethost.io/api/collections/notes/records?perPage=100';
const newDiv = document.createElement('div');
newDiv.setAttribute('class','new-div');
const totalResults = document.createElement('div');
totalResults.classList.add('total-div');
const mainDiv = document.querySelector('.main');
let count = 0;

const fuseOptions = {
    keys: ['Subjects'],
    threshold: 0.5,
    distance: 800,
};

const fuse = new Fuse([], fuseOptions);

async function notesSearch(searchTerm){
    const loadingDiv = document.createElement('div');
    loadingDiv.setAttribute('id','loading-div');
    if(count === 0 && !mainDiv.contains(loadingDiv)){
        loadingDiv.innerHTML = `<div class="lds-ellipsis"><div></div><div></div><div></div><div>`;
        mainDiv.appendChild(loadingDiv);
        count++;
    }
    const newTerm = searchTerm.toLowerCase();
    const apiResponse = await fetch(apiURL).then((resp)=>{return resp.json()}).then(data => {return data});
    
    fuse.setCollection(apiResponse.items);

    
    const results = fuse.search(newTerm);
    const sortedResults = results.sort();

    
    totalResults.innerHTML = `<span class="total-results">Total Results: ${results.length}</span>`
    body.insertBefore(totalResults, newDiv);

    if (sortedResults.length === 0){
        newDiv.innerHTML = `<h1>No Results Founds!!</h1>`;
    }else{
        sortedResults.forEach(element => {
            const notesDiv = document.createElement('div');
            notesDiv.classList.add('notes-div');
            notesDiv.setAttribute('onclick',`redirect('${element.item.notes}')`);
            
            const titleSpan = document.createElement('span');
            titleSpan.classList.add('title');
            titleSpan.textContent = element.item.Title;

            
            const yearSpan = document.createElement('span');
            yearSpan.classList.add('year');
            yearSpan.textContent = `Year: ${element.item.year}`;

            
            notesDiv.appendChild(titleSpan);
            notesDiv.appendChild(yearSpan);
            newDiv.appendChild(notesDiv);
        });
    }
    
    loadingDiv.innerHTML = '';
    newDiv.scrollIntoView({ behavior: 'smooth' });
    mainDiv.removeChild(document.getElementById('loading-div'));
    count = 0;
    
}
inputfield.addEventListener("keypress", (event) => {
    if(event.key === 'Enter'){
        submit.click()
    }
})

submit.addEventListener('click', () =>{
    const searchTerm = inputfield.value;
    newDiv.innerHTML = '';
    totalResults.innerHTML = '';
    notesSearch(searchTerm)
    document.body.appendChild(newDiv)
    console.log('button')
    
})

function redirect(url) {
    window.open(url, '_blank');
}
const toggleBtn = document.getElementById('toggle-btn');
const body = document.body;

toggleBtn.addEventListener('click', function () {
    console.log('toggle');
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        toggleBtn.innerHTML = `<img src="./sun.png">`;
    } else {
        toggleBtn.innerHTML = `<img src="./moon.png">`;
    }
});
