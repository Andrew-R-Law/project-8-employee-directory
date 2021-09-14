//Global constants

const employeeList = document.getElementById('employee-list');
const employees = [];
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('close-btn');
const wrapper = document.getElementById('wrapper');


//Function for fetching employees and displaying relevant information them to the main page

function gatherEmployees (url) {
    fetch(url)
        .then(data => data.json())
        .then(data => {
            data.results.forEach(person => employees.push(person));
            employees.forEach(person => {
                const index = employees.map( e => { return e.name.first + ' ' + e.name.last; }).indexOf(`${person.name.first} ${person.name.last}`);
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
        })
}

//Calls the above function

gatherEmployees('https://randomuser.me/api/?results=12');

/****
 * Functions for displaying and hiding the overlay (or "modal").
 ****/

//Four Helper functions:

//(1) Parses employee phone number into (xxx) xxx-xxxx format.

function parsePhone (employeeIndex) {
    const rawPhone = employees[employeeIndex].cell;
    const phoneNumbers = rawPhone.replace(/\D/g, "");
    const phone = `(${phoneNumbers.substring(0,3)}) ${phoneNumbers.substring(3,6)}-${phoneNumbers.substring(6,10)}`;
    return phone;
}

//(2) Parses employee address into (Street Number Street Name, City, State Postcode) format.
function parseAddress (employeeIndex){
    const address = `${employees[employeeIndex].location.street.number} 
    ${employees[employeeIndex].location.street.name}, ${employees[employeeIndex].location.city}, 
    ${employees[employeeIndex].location.state} ${employees[employeeIndex].location.postcode}`;
    return address;
}

//(3) Parses employee birthday information into MM/DD/YYYY format.
function parseBday (employeeIndex){
    const bdayRaw = employees[employeeIndex].dob.date.substring(0, 10);
    const bdayNumbers = bdayRaw.replace(/\D/g, "");
    const bday = `Birthday: ${bdayNumbers.substring(6, 8)}/${bdayNumbers.substring(4, 6)}/${bdayNumbers.substring(0,4)}`;
    return bday;
}

//(4) Gathers employee information for the modal display and returns that HTML with that information.

function gatherEmployeeInfo (employee) {
    const employeeIndex = employee.value;
    const picture = employees[employeeIndex].picture.large;
    const name = employees[employeeIndex].name.first + ' ' + employees[employeeIndex].name.last;
    const email = employees[employeeIndex].email;
    const location = employees[employeeIndex].location.city;
    const phone = parsePhone (employeeIndex);
    const address = parseAddress (employeeIndex);
    const bday = parseBday(employeeIndex);
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

/*Main function for displaying overlay.
Grays out main page, displays overlay, and inserts HTML from the gatherEmployeeInfo function into the overlay.*/

function displayOverlay (e) {
    wrapper.className = 'grayed-out';
    overlay.className = 'displayed';
    const overlayHTML = document.getElementById('overlayHTML');
    overlayHTML.innerHTML = '';
    const employee = e.target.closest('.employee');
    const employeeInfo = gatherEmployeeInfo(employee);
    overlayHTML.insertAdjacentHTML('beforeend', employeeInfo );
}

//Calls the displayOverlay function if, and only if, an employee from the list is clicked.

employeeList.addEventListener('click', (e) => {
    if (e.target !== employeeList){
        displayOverlay(e);
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







