const customerPart = document.getElementById('customer-part');
const driverPart = document.getElementById('driver-part');
const customerOption = document.querySelector('.box-2 .bottom-box.customers');
const driverOption = document.querySelector('.box-2 .bottom-box:nth-child(2)');

customerOption.addEventListener('click', () => {
  customerPart.classList.add('active');
  driverPart.classList.remove('active');
  customerOption.classList.add('active');
  driverOption.classList.remove('active');
  // customerPart.scrollIntoView({ behavior: 'smooth' });  // Smooth scroll to customer part
});

driverOption.addEventListener('click', () => {
  driverPart.classList.add('active');
  customerPart.classList.remove('active');
  driverOption.classList.add('active');
  customerOption.classList.remove('active');
  // driverPart.scrollIntoView({ behavior: 'smooth' });  // Smooth scroll to driver part
});
