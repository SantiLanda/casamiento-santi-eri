function openLocation(url) {
    window.open(url, '_blank');
}

function openEnvelope() {
    const wrapper = document.getElementById('envelope-wrapper');
    const content = document.getElementById('invitation-content');
    const letter = document.querySelector('.center-group');
    if (!wrapper || !content || wrapper.classList.contains('is-opening')) {
        return;
    }
    wrapper.classList.add('is-opening');
    content.classList.add('visible');
    letter.classList.add('showOk');
    content.style.display = 'block';
    // matches the envelope fade-out chain: 0.35s delay + 0.4s transition, plus buffer
    setTimeout(() => {
        wrapper.style.display = 'none';
    }, 3000);
}

function startCounter() {
    const eventDate = new Date('2027-03-20T17:00:00');

    const executeCount = () => {
        const now = new Date();
        const timeDifference = eventDate - now;
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days;
        document.getElementById('hours').innerText = hours;
        document.getElementById('minutes').innerText = minutes;
        document.getElementById('seconds').innerText = seconds;
    }

    executeCount();

    setInterval(executeCount, 1000);
}

function hideSectionById(sectionId, queryParam) {
    const urlParams = new URLSearchParams(window.location.search);
    const section = document.getElementById(sectionId);
    urlParams.forEach((value, key) => {
        if (queryParam[key] === value) {
            section.style.display = 'none';
        }
    });
}

function init() {
    if (!window.location.pathname.endsWith('formulario.html')) {
        startCounter();
        hideSectionById('price', { invitevers: 'beys220120' });
    }
}

function sendForm(value) {
    value.preventDefault();
    const formData = new FormData(value.target);
    const postData = {};
    postData.email = formData.get('email');
    postData.name = formData.get('name');
    postData.age = formData.get('age');
    postData.diet = formData.get('diet');
    postData.extras = [];
    for (let pair of formData.entries()) {
        if (pair[0].startsWith('guest-name-')) {
            const id = pair[0].split('guest-name-')[1];
            const guestName = pair[1];
            const guestAge = formData.get(`guest-age-${id}`);
            postData.extras.push({ name: guestName, age: guestAge });
        }
    }
    const form = document.getElementById('rsvp-form');
    const inst = document.getElementById('rsvp-inst');
    inst.style.display = 'none';
    form.style.display = 'none';
    form.reset();
    const confirmation = document.getElementById('finish');
    confirmation.style.display = 'block';
    confirmation.scrollIntoView({ behavior: 'smooth' });
    sendData(postData).then(res => {
        console.log('enviado', res)
    })
}

async function sendData(data) {
    const response = await fetch(
    "https://script.google.com/macros/s/AKfycby7qevLAYLBwwjAhd7UNm0T9vImMZ7GYMQDpP2GrBeLhSarZffdVr3BiWAzi_0tDX0VTQ/exec",
    {
        method: "POST",
        body: JSON.stringify({
        name: data.name,
        email: data.email,
        age: data.age,
        extras: data.extras,
        diet: data.diet
        })
    });
    return await response.text();
}

function addGuest() {
    const itemList = document.getElementById('item-list');
    const id_num = itemList.children.length + 1;
    const isFirst = !itemList.getElementsByTagName('h3').length;
    if (isFirst) {
        const title = document.createElement('h3');
        title.className = 'printed center';
        title.innerText = 'Grupo';
        itemList.appendChild(title);
    }
    const guestItem = document.createElement('div');
    guestItem.className = 'item-horiz';
    guestItem.innerHTML = `
            <label class="label-name" for="guest-name-${id_num}">Nombre y apellido *</label>
            <input class="input-name" type="text" required name="guest-name-${id_num}" id="guest-name-${id_num}" placeholder="Nombre y apellido" />
            <label class="label-age" for="guest-age-${id_num}">Edad *</label>
            <input class="input-age" type="number" min="0" required name="guest-age-${id_num}" id="guest-age-${id_num}" placeholder="Edad" />
    `;
    const existingRemoveButton = itemList.querySelector('.ghost-button');
    if (existingRemoveButton) {
        itemList.insertBefore(guestItem, existingRemoveButton);
    } else {
        itemList.appendChild(guestItem);
    }
    if (isFirst) {
        const removeButton = document.createElement('button');
        removeButton.className = 'ghost-button printed';
        removeButton.innerHTML = `
            - Eliminar invitado
        `;
        removeButton.style.textDecoration = 'underline';
        removeButton.type = 'button';
        const separator = document.createElement('hr');
        separator.style.borderColor = '#602a2a';
        separator.style.width = '100%';
        removeButton.onclick = () => {
            const itemList = document.getElementById('item-list');
            const items = itemList.getElementsByClassName('item-horiz');
            itemList.removeChild(items[items.length - 1]);
            if (items.length === 0) {
                const title = itemList.getElementsByTagName('h3')[0];
                itemList.removeChild(title);
                itemList.removeChild(removeButton);
                itemList.removeChild(separator);
            }
        }
        itemList.appendChild(removeButton);
        itemList.appendChild(separator);
    }
}

document.addEventListener('DOMContentLoaded', init);