const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay');

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})

overlay.addEventListener('click', (event) => {
  if (!event.target.closest('.modal-body')) {
      const modals = document.querySelectorAll('.modal.active')
      modals.forEach(modal => {
          closeModal(modal)
      })
  }
})

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal')
        closeModal(modal)
    })
})

function openModal(modal){
  if (modal == null) return
  modal.classList.add('active')
  overlay.classList.add('active')
  document.getElementById('asideWrapper').classList.add('modal-open')
  document.getElementById('mainWrapper').classList.add('modal-open')
}

function closeModal(modal){
  if (modal == null) return
  modal.classList.remove('active')
  overlay.classList.remove('active')
  document.getElementById('asideWrapper').classList.remove('modal-open')
  document.getElementById('mainWrapper').classList.remove('modal-open')

  // Clear the modal form fields
  const modalInputs = modal.querySelectorAll('input');
  modalInputs.forEach(input => {
      input.value = '';
  });
}

// Modified event listener for the close button in the modal header
const closeButton = document.querySelectorAll('[data-close-button]');
closeButton.forEach(button => {
  button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      closeModal(modal);
  });
});

let currentlySelectedElement = null;
let ids = ["toastmasters", "photography", "computer"];
let names = ["Toastmasters", "Photography", "Computer"];
let logos = ["toastmasters.png", "photography.png", "computer.png"];
let mottos = ["Where Leaders Made!", "Capturing Moments, Framing Memories!", "Exploring Bytes, Expanding Minds!"];
let categories = [["Communicative", "Public Speaking"], ["Creative", "Media"], ["Academic", "Technology"]];
let members = ["17", "21", "15"];
let locations = ["KFUPM mall, room 112", "Building 59, room 101", "Building 63, room 331"];
let meetings = ["every Sunday & Wednesday 7:15 PM", "every Tuesday at 9:30 PM", "Every Sunday & Tuesday at 8:00 PM"];


function myMouseoverHandler(event) {
    event.currentTarget.style.backgroundColor = "rgba(233,234,232,255)";
 }
 
 function myMouseoutHandler(event) {
    event.currentTarget.style.backgroundColor = "white";
 }
 


function myClickHandler(event) {
    if (currentlySelectedElement) {
        currentlySelectedElement.style.backgroundColor = "white";
        currentlySelectedElement.addEventListener("mouseout", myMouseoutHandler);
    }

    event.currentTarget.style.backgroundColor = "rgba(223, 224, 220, 1)";
    event.currentTarget.removeEventListener("mouseout", myMouseoutHandler);
    currentlySelectedElement = event.currentTarget;

    let index = ids.indexOf(event.currentTarget.id);


    document.getElementById("clubLogo").src = logos[index];
    document.getElementById("clubName1").textContent = names[index] + " Club";
    document.getElementById("clubName2").textContent = names[index];
    document.getElementById("clubMotto").textContent = mottos[index];
    document.getElementById("categories").innerHTML = ""; 
    categories[index].forEach(category => {
        document.getElementById("categories").innerHTML += `<div>${category}</div>`;
    });
    document.getElementById("members").textContent = `${members[index]} members`;
    document.getElementById("location").textContent = `Location: ${locations[index]}`;
    document.getElementById("times").textContent = `Meeting times: ${meetings[index]}`;
}

 
 let elements = document.getElementsByClassName("clubs");
 console.log(elements);
 for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener("mouseover", myMouseoverHandler);
    elements[i].addEventListener("mouseout", myMouseoutHandler);
    elements[i].addEventListener("click", myClickHandler);
 }

 if (elements.length > 0) {
    elements[0].click();
}

const main2 = document.getElementById('main2');

main2.addEventListener('wheel', function(event) {
  event.preventDefault(); 
  if (event.deltaY > 0) {
    main2.scrollTop += 100; 
  } else {
    main2.scrollTop -= 100; 
  }
}, { passive: false });

document.body.addEventListener('wheel', function(event) {
    if (!event.target.closest('#main2')) {
      return; 
    }
    event.preventDefault();
  }, { passive: false });


  const sendButton = document.getElementById('sendButton');
  const messageInput = document.querySelector('#messageInput input');
  
  
  function sendMessage() {
    const messageText = messageInput.value.trim();
    
    if (messageText !== '') {
        const now = new Date();
        const dateFormatted = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
        const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const currentTime = `${dateFormatted}, ${timeFormatted}`;
        
        const newMessage = `
            <div class="sentMessage">
                <div class="timeSent">${currentTime}</div>
                <div class="sentMessageBody">${messageText}</div>
            </div>`;
        
        main2.insertAdjacentHTML('beforeend', newMessage);
        
        main2.scrollTop = main2.scrollHeight;
        
        messageInput.value = '';
    }
}

sendButton.addEventListener('click', sendMessage);
  
  messageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      sendMessage(); 
    }
  });

  function createNewClub() {
    const newClubName = document.getElementById('newClubName').value.trim();
    const newClubId = document.getElementById('newClubId').value.trim();
    const newClubMotto = document.getElementById('newClubMotto').value.trim();
    const newClubLocation = document.getElementById('newClubLocation').value.trim();
    const newClubCategories = document.getElementById('newClubCategory').value.trim();
    const newClubMeetingTimes = document.getElementById('newClubMeetingTimes').value.trim();
    const newClubLogo = document.getElementById('newClubLogo').files[0];

    if (newClubName !== '' && newClubId !== '' && newClubLocation !== '' && newClubMeetingTimes !== '') {
        // Update the arrays with the new club information
        ids.push(newClubId);
        names.push(newClubName);
        mottos.push(newClubMotto);
        members.push('1'); // Initially, the new club has 1 member
        locations.push(newClubLocation);
        meetings.push(newClubMeetingTimes);
        // Split the categories by comma and add them as an array
        categories.push(newClubCategories.split(','));

        // Upload the club logo and update the logo path
        const reader = new FileReader();
        reader.onload = function(event) {
            logos.push(event.target.result);
            
            // Update the UI with the new club information
            updateUIWithNewClub();
        };
        reader.readAsDataURL(newClubLogo);

        // Clear the modal form fields
        document.getElementById('newClubName').value = '';
        document.getElementById('newClubId').value = '';
        document.getElementById('newClubMotto').value = '';
        document.getElementById('newClubLocation').value = '';
        document.getElementById('newClubCategory').value = '';
        document.getElementById('newClubMeetingTimes').value = '';
        document.getElementById('newClubLogo').value = '';

        // Close the modal
        closeModal(document.querySelector('.modal.active'));
    }
}

// Event listener for the submit button in the modal form
const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', createNewClub);

function updateUIWithNewClub() {
  // This is a basic implementation, you may adjust it according to your UI structure
  const newClubIndex = ids.length - 1;
  const newClubElement = document.createElement('div');
  newClubElement.classList.add('clubs');
  newClubElement.id = ids[newClubIndex];
  newClubElement.innerHTML = `
      <i class='bx bx-group'></i>
      <div>${names[newClubIndex]} Club</div>
  `;

  newClubElement.addEventListener('mouseover', myMouseoverHandler);
  newClubElement.addEventListener('mouseout', myMouseoutHandler);
  newClubElement.addEventListener('click', myClickHandler);

  // Append the new club element to the navigation section
  const nav2 = document.getElementById('nav2');
  nav2.appendChild(newClubElement);

  // Automatically select the newly added club
  newClubElement.click();
}

const categoriesContainer = document.getElementById('categories');

let isDown = false;
let startX;
let scrollLeft;

categoriesContainer.addEventListener('mousedown', (e) => {
  isDown = true;
  startX = e.pageX - categoriesContainer.offsetLeft;
  scrollLeft = categoriesContainer.scrollLeft;
});

categoriesContainer.addEventListener('mouseleave', () => {
  isDown = false;
});

categoriesContainer.addEventListener('mouseup', () => {
  isDown = false;
});

categoriesContainer.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - categoriesContainer.offsetLeft;
  const walk = (x - startX) * 1; 
  categoriesContainer.scrollLeft = scrollLeft - walk;
});

const searchInput = document.querySelector('#search input');
    const messages = document.querySelectorAll('.sentMessage, .receivedMessage');
    const initialDisplayProperties = Array.from(messages).map(message => ({
        element: message,
        display: window.getComputedStyle(message).getPropertyValue('display')
    }));

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        messages.forEach((message, index) => {
            const messageBody = message.querySelector('.sentMessageBody, .receivedMessageBody');
            const messageText = messageBody.textContent.toLowerCase();
            
            if (messageText.includes(searchTerm)) {
                message.style.display = initialDisplayProperties[index].display; // Show the message if it matches the search
            } else {
                message.style.display = 'none'; // Hide the message if it doesn't match the search
            }
        });
    });

    // Function to clear the search input and show all messages
    function clearSearch() {
        searchInput.value = ''; // Clear the search input
        messages.forEach((message, index) => {
            message.style.display = initialDisplayProperties[index].display; // Restore the initial display property
        });
    }

    // Add event listener to clear search input
    document.querySelector('#header2').addEventListener('click', function(event) {
        if (event.target.classList.contains('bx-search')) {
            clearSearch();
        }
    });

