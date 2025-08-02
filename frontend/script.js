console.log("Hello from Nandni - UI tested!");
const form = document.getElementById('ticketForm');
const ticketDisplay = document.getElementById('ticketDisplay');

document.addEventListener('DOMContentLoaded', () => {
  const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
  tickets.forEach(displayTicket);
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const subject = document.getElementById('subject').value.trim();
  const category = document.getElementById('category').value;
  const description = document.getElementById('description').value.trim();

  if (subject.length < 5 || description.length < 10) {
    alert('Please fill valid subject and description.');
    return;
  }

  const ticket = { subject, category, description, status: 'Open' };

  displayTicket(ticket);

  const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
  tickets.push(ticket);
  localStorage.setItem('tickets', JSON.stringify(tickets));

  form.reset();
});

function displayTicket(ticket) {
  const ticketHTML = `
    <li>
      <strong>${ticket.subject}</strong> <br />
      <em>Category:</em> ${ticket.category} <br />
      <p>${ticket.description}</p>
      <span>Status: <strong>${ticket.status}</strong></span>
    </li>
  `;
  ticketDisplay.innerHTML += ticketHTML;
}
