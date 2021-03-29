'use strict';

const account1 = {
  owner: 'Helen Noir',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Anna Dark',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Kate Middle',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Irina Klein',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  // slice method create a copy of the array
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
          i + 1
        } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
console.log(accounts);

const updateUI = function (acc) {
   // display movements
   displayMovements(currentAccount.movements);

   // display balance
   calcDisplayBalance(currentAccount);

   // display summary
   calcDisplaySummary(currentAccount);
};

// accumulator = snowball
const calcDisplayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = balance;
  labelBalance.textContent = `${balance}€`;
};

// acc stands for account
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.
  filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
  .filter(mov => mov < 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`; //Math.absolute removes - sign

  const interest = acc.movements
  .filter(mov => mov > 0)
  .map(deposit => (deposit * acc.interestRate) / 100)
  .filter((int, i, arr) => {
    return int >= 1;
  })
  .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (event) {
  event.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value);

  if(currentAccount?.pin === Number(inputLoginPin.value)) {
    // display ui and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    // field loses it's focus
    inputLoginPin.blur(); 

    // update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 && 
    receiverAcc &&
    currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
      // transfering money
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);

      // update UI
      updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (event) {
event.preventDefault(); // will not reload the page

if (
  inputCloseUsername.value === currentAccount.username && 
  Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    // delete account (splice mutates array, removes exactly 1 element)
    accounts.splice(index, 1);

    // hide Ui
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});


btnLoan.addEventListener('click', function (e) { 
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add movement
    currentAccount.movement.push(amount);
    // update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  // each time on click it will change from sorted to not-sorted
  sorted = !sorted;
});