const inputfield = document.getElementById('input-el');
const submit = document.getElementById('submit');
const apiURL =  'https://notes-search.pockethost.io/api/collections/notes/records?perPage=100';
const newDiv = document.createElement('div');
newDiv.setAttribute('class','new-div');
const mainDiv = document.querySelector('.main');
let count = 0;

const fuseOptions = {
    keys: ['Subjects'],
    threshold: 0.5
};

const fuse = new Fuse([], fuseOptions);

async function notesSearch(searchTerm){
    const loadingDiv = document.createElement('div');
    if(count === 0){
        loadingDiv.innerHTML = `<div class="lds-ellipsis"><div></div><div></div><div></div><div>`;
        mainDiv.appendChild(loadingDiv);
        count++;
    }
    const newTerm = searchTerm.toLowerCase();
    const apiResponse = await fetch(apiURL).then((resp)=>{return resp.json()}).then(data => {return data});
    
    fuse.setCollection(apiResponse.items);

    
    const results = fuse.search(newTerm);
    // const matchingAnswers = results.map(el => el.item.notes);
    // console.log(`Search results for "${searchTerm}":`,matchingAnswers);
    if (results.length === 0){
        newDiv.innerHTML = `<h1>No Results Founds!!</h1>`;
    }else{
        results.forEach(element => {
            const notesDiv = document.createElement('div');
            notesDiv.classList.add('notes-div');
            notesDiv.setAttribute('onclick',`redirect('${element.item.notes}')`);
            notesDiv.innerHTML = `<h3>${element.item.Title}</h3>`;
            newDiv.appendChild(notesDiv);
        });
    }
    
    loadingDiv.innerHTML = '';
    mainDiv.removeChild(loadingDiv);
    count = 0;
    
}
submit.addEventListener('click', () =>{
    const searchTerm = inputfield.value;
    newDiv.innerHTML = '';
    notesSearch(searchTerm)
    document.body.appendChild(newDiv)
    console.log('button')
    
})

function redirect(url) {
    window.open(url, '_blank');
}
