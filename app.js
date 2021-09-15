//Global constants

const employeeList = document.getElementById('employee-list');
const employees = [];
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('close-btn');
const nextBtn = document.getElementById('next');
const previousBtn = document.getElementById('previous');
const wrapper = document.getElementById('wrapper');
const search = document.getElementById('search');;

//Function for fetching employees, pushing those employees to the 'employees' array,
// and calling the displayEmployees function with the returned employees.

function gatherEmployees (url) {
    fetch(url)
        .then(data => data.json())
        .then(data => {
            data.results.forEach(person => employees.push(person));
            displayEmployees(data.results);
        })
}

//function for displaying the relevant information of each employee with html.

function displayEmployees (arr) {
    arr.forEach(person => {
        const index = arr.indexOf(person);
        employeeList.insertAdjacentHTML('beforeend', `
        <li class="employee" value=${index}>
            <img class="avatar" src="${person.picture.large}" alt="Profile Picture">
            <div class="employee-details">
                <h3>${person.name.first} ${person.name.last}</h3>
                <span class="email">${person.email}</span><br>
                <span class ="location">${person.location.city}, ${person.location.state}</span>
            </div>
        </li>
        `);
    });
}

//Calls the gatherEmployees function.

gatherEmployees('https://randomuser.me/api/?nat=us&results=12');


/****
 * Functions for displaying and hiding the overlay (or "modal").
 ****/

//Four Helper functions:

//(1) Parses employee phone number into (xxx) xxx-xxxx format.

function parsePhone (employeeIndex, arr) {
    const rawPhone = arr[employeeIndex].cell;
    const phoneNumbers = rawPhone.replace(/\D/g, "");
    const phone = `(${phoneNumbers.substring(0,3)}) ${phoneNumbers.substring(3,6)}-${phoneNumbers.substring(6,10)}`;
    return phone;
}

//(2) Parses employee address into (Street Number Street Name, City, State Postcode) format.
function parseAddress (employeeIndex, arr){
    const address = `${arr[employeeIndex].location.street.number} 
    ${employees[employeeIndex].location.street.name}, ${employees[employeeIndex].location.city}, 
    ${employees[employeeIndex].location.state} ${employees[employeeIndex].location.postcode}`;
    return address;
}

//(3) Parses employee birthday information into MM/DD/YYYY format.
function parseBday (employeeIndex, arr){
    const bdayRaw = arr[employeeIndex].dob.date.substring(0, 10);
    const bdayNumbers = bdayRaw.replace(/\D/g, "");
    const bday = `Birthday: ${bdayNumbers.substring(6, 8)}/${bdayNumbers.substring(4, 6)}/${bdayNumbers.substring(0,4)}`;
    return bday;
}

//(4) Gathers employee information for the modal display and returns HTML with that information.
//Takes an employee and an array from which that employee is an element as arguments.
//Returns a template literal to display in the modal window with all of the relevant employee information.

function gatherEmployeeInfo (employee, arr) {
    const employeeIndex = employee.value;
    const picture = arr[employeeIndex].picture.large;
    const name = arr[employeeIndex].name.first + ' ' + arr[employeeIndex].name.last;
    const email = arr[employeeIndex].email;
    const location = arr[employeeIndex].location.city;
    const phone = parsePhone (employeeIndex, arr);
    const address = parseAddress (employeeIndex, arr);
    const bday = parseBday(employeeIndex, arr);
    const employeeInfo = `
        <img class="avatar" src="${picture}" alt="Profile Picture">
        <div class="overlay-details">
            <h3>${name}</h3>
            <span class="email">${email}</span><br>
            <span class ="location">${location}</span><br>
        </div>
        <div class="extra-details">
            <span class="phone">${phone}</span><br>
            <span class="address">${address}</span><br>
            <span class="bday">${bday}</span>
        </div>
        `;
    return employeeInfo;
}

/*Main function for displaying overlay upon user selection.
Grays out main page, displays overlay, and inserts HTML from the gatherEmployeeInfo function into the overlay.*/

function displayOverlay (e, arr) {
    const employee = e.target.closest('.employee');
    wrapper.className = 'grayed-out';
    overlay.className = 'displayed';
    const overlayHTML = document.getElementById('overlayHTML');
    overlayHTML.innerHTML = '';
    overlayHTML.value = employee.value;
    const employeeInfo = gatherEmployeeInfo(employee, arr);
    overlayHTML.insertAdjacentHTML('beforeend', employeeInfo );
}

//Calls the displayOverlay function if, and only if, an employee from the list is clicked.

employeeList.addEventListener('click', (e) => {
    if (e.target !== employeeList){
        displayOverlay(e, employees);
    }
});

//When the 'X' button in overlay is clicked, removes 'grayed-out' class from main page and hides overlay.
closeBtn.addEventListener('click', e => {
    if (e.target === closeBtn) {
        wrapper.className = '';
        overlay.className = 'hidden';
    }
});

/*Functions for "Exceeds Expectations*/
//Function for searching through employees by name.
//Starts the matches array as equal to the employees array, but then filters based on user input.
//displays only the matched employees on the main page.
//allows for employees matched to be clicked on for display of modal window.

let matches = employees;

search.addEventListener('keyup', (e) => {
    employeeList.innerHTML = '';
    const searched = e.target.value.toLowerCase();
    matches = employees.filter(employee => (`${employee.name.first.toLowerCase()} ${employee.name.last.toLowerCase()}`
    .includes(searched)));
    displayEmployees(matches);
    employeeList.addEventListener('click', (e) => {
        if (e.target !== employeeList){
            displayOverlay(e, matches);
        }
    });
});

//Functions for next/previous buttons on overlay.

//function that is very similar to displayOverlay function, but doesn't require a target. 
//(Seems redundant but I'm not sure how to get rid of it.)

function btnDisplayOverlay (employee, arr) {
    wrapper.className = 'grayed-out';
    overlay.className = 'displayed';
    const overlayHTML = document.getElementById('overlayHTML');
    overlayHTML.innerHTML = '';
    overlayHTML.value = employee.value;
    const employeeInfo = gatherEmployeeInfo(employee, arr);
    overlayHTML.insertAdjacentHTML('beforeend', employeeInfo );
}

//Listens for a click on the right arrow and displays next employee in the matches array.

nextBtn.addEventListener('click', (e) => {
    let currentIndex = overlayHTML.value;
    if (currentIndex === (matches.length - 1)){
        currentIndex = -1;
    }
    const nextListItem = document.querySelectorAll('li')[currentIndex + 1];
    btnDisplayOverlay(nextListItem, matches);
});

//Listens for a click on the left arrow and displays previous employee in the matches array.

previousBtn.addEventListener('click', (e) => {
    let currentIndex = overlayHTML.value;
    if (currentIndex === matches.length - matches.length){
        currentIndex = matches.length;
    }
    const nextListItem = document.querySelectorAll('li')[currentIndex - 1];
    btnDisplayOverlay(nextListItem, matches);
});





