const employeeList = document.getElementById('employee-list');
const employees = [];
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('close-btn');
const wrapper = document.getElementById('wrapper');



function gatherEmployees () {
    fetch('https://randomuser.me/api/?results=12')
        .then(data => data.json())
        .then(data => {
            data.results.forEach(person => employees.push(person));
            employees.forEach(person => {
                const index = employees.map( e => { return e.name.first; }).indexOf(`${person.name.first}`);
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


gatherEmployees();


employeeList.addEventListener('click', (e) => {
    if (e.target !== employeeList) {
        employeeList.className = 'darken';
        overlay.className='';
        const overlayHTML = document.getElementById('overlayHTML');
        overlayHTML.innerHTML = '';
        const employee = e.target.closest('.employee');
        const employeeIndex = employee.value;
        const picture = employees[employeeIndex].picture.large;
        const name = employees[employeeIndex].name.first + ' ' + employees[employeeIndex].name.last;
        const email = employees[employeeIndex].email;
        const location = employees[employeeIndex].location.city;
        const rawPhone = employees[employeeIndex].cell;
        const phoneNumbers = rawPhone.replace(/\D/g, "");
        const phone = `(${phoneNumbers.substring(0,3)}) ${phoneNumbers.substring(3,6)}-${phoneNumbers.substring(6,10)}`;
        const address = `${employees[employeeIndex].location.street.number} 
            ${employees[employeeIndex].location.street.name}, ${employees[employeeIndex].location.city}, 
            ${employees[employeeIndex].location.state} ${employees[employeeIndex].location.postcode}`;
        const bdayRaw = employees[employeeIndex].dob.date.substring(0, 10);
        const bdayNumbers = bdayRaw.replace(/\D/g, "");
        const bday = `Birthday: ${bdayNumbers.substring(6, 8)}/${bdayNumbers.substring(4, 6)}/${bdayNumbers.substring(0,4)}`;
        overlayHTML.insertAdjacentHTML('beforeend', `
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
        `);
    }
});

closeBtn.addEventListener('click', e => {
    if (e.target === closeBtn) {
        overlay.className = 'hidden';
        employeeList.className = '';
    }
});






