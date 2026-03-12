
'use strict';
let currentUser = null;   
let loginType   = 'admin';

const BOOKS = [
  { serial:'SC(B)000001', name:'Physics Fundamentals',           author:'H.C. Verma',        category:'Science',              status:'Available', cost:450, date:'2022-01-10' },
  { serial:'SC(B)000002', name:'Organic Chemistry',              author:'Morrison Boyd',      category:'Science',              status:'Issued',    cost:520, date:'2021-06-15' },
  { serial:'EC(B)000001', name:'Microeconomics',                 author:'N.Gregory Mankiw',  category:'Economics',            status:'Available', cost:380, date:'2022-03-20' },
  { serial:'FC(B)000001', name:'The Alchemist',                  author:'Paulo Coelho',       category:'Fiction',              status:'Available', cost:200, date:'2023-01-05' },
  { serial:'PD(B)000001', name:'Atomic Habits',                  author:'James Clear',        category:'Personal Development', status:'Available', cost:350, date:'2023-02-14' },
  { serial:'CH(B)000001', name:'Charlie and the Chocolate Factory', author:'Roald Dahl',     category:'Children',             status:'Issued',    cost:180, date:'2021-08-08' },
];

const MOVIES = [
  { serial:'SC(M)000001', name:'Interstellar',    author:'Christopher Nolan', category:'Science', status:'Available', cost:300, date:'2023-01-01' },
  { serial:'FC(M)000001', name:'The Dark Knight', author:'Christopher Nolan', category:'Fiction', status:'Issued',    cost:250, date:'2022-11-20' },
];

const MEMBERS = [
  { id:'MEM001', fname:'Ravi',  lname:'Sharma', contact:'9876543210', address:'Hyderabad', aadhar:'1234-5678-9012', start:'2024-01-01', end:'2024-12-31', status:'Active',   fine:0  },
  { id:'MEM002', fname:'Priya', lname:'Reddy',  contact:'9123456789', address:'Guntur',    aadhar:'9876-5432-1098', start:'2023-06-01', end:'2024-05-31', status:'Active',   fine:50 },
];

const ISSUES = [
  { serial:'SC(B)000002', name:'Organic Chemistry', type:'Book',  memberId:'MEM001', issueDate:'2024-03-01', returnDate:'2024-03-16' },
  { serial:'FC(M)000001', name:'The Dark Knight',   type:'Movie', memberId:'MEM002', issueDate:'2024-03-05', returnDate:'2024-03-20' },
];

const USERS_DB = [
  { name:'Admin User',   username:'adm',  password:'adm',  active:true, admin:true  },
  { name:'Library User', username:'user', password:'user', active:true, admin:false },
];

function today() {
  return new Date().toISOString().split('T')[0];
}
function addDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}
function daysBetween(a, b) {
  return Math.floor((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24));
}
function allItems() {
  return [...BOOKS, ...MOVIES];
}
function uniqueAuthors() {
  return [...new Set(allItems().map(b => b.author))];
}
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function $(id) { return document.getElementById(id); }

function setLoginType(type, btn) {
  loginType = type;
  document.querySelectorAll('.tab-switch button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function doLogin() {
  const u = $('loginUser').value.trim();
  const p = $('loginPass').value.trim();
  const alertEl = $('loginAlert');

  if (loginType === 'admin' && u === 'adm' && p === 'adm') {
    currentUser = 'admin';
    alertEl.classList.remove('show');
    launchApp();
  } else if (loginType === 'user' && u === 'user' && p === 'user') {
    currentUser = 'user';
    alertEl.classList.remove('show');
    launchApp();
  } else {
    alertEl.classList.add('show');
  }
}

function doLogout() {
  currentUser = null;
  $('loginUser').value = '';
  $('loginPass').value = '';
  showScreen('logoutScreen');
}

function goHome() {
  showScreen('appScreen');
  renderPage('home');
}

function launchApp() {
  showScreen('appScreen');
  buildTopNav();
  buildSidebar();
  renderPage('home');
}

function buildTopNav() {
  $('topNav').innerHTML = `
    <a onclick="renderPage('home')">🏠 Home</a>
    <a onclick="renderPage('transactions')">Transactions</a>
    <a onclick="renderPage('reports')">Reports</a>
    ${currentUser === 'admin' ? `<a onclick="renderPage('maintenance')">Maintenance</a>` : ''}
    <a class="logout" onclick="doLogout()">Log Out</a>
  `;
}

function buildSidebar() {
  let html = `
    <div class="sidebar-section">
      <div class="sidebar-label">Navigation</div>
      <a onclick="renderPage('home')">🏠 Home</a>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-label">Transactions</div>
      <a onclick="renderPage('bookAvailable')">📖 Book Available?</a>
      <a onclick="renderPage('bookIssue')">📤 Issue Book</a>
      <a onclick="renderPage('returnBook')">📥 Return Book</a>
      <a onclick="renderPage('payFine')">💰 Pay Fine</a>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-label">Reports</div>
      <a onclick="renderPage('masterBooks')">📚 Master Books</a>
      <a onclick="renderPage('masterMovies')">🎬 Master Movies</a>
      <a onclick="renderPage('masterMemberships')">🪪 Memberships</a>
      <a onclick="renderPage('activeIssues')">✅ Active Issues</a>
      <a onclick="renderPage('overdueReturns')">⚠️ Overdue Returns</a>
      <a onclick="renderPage('issueRequests')">📋 Issue Requests</a>
    </div>`;

  if (currentUser === 'admin') {
    html += `
    <div class="sidebar-section">
      <div class="sidebar-label">Maintenance</div>
      <a onclick="renderPage('addMembership')">➕ Add Membership</a>
      <a onclick="renderPage('updateMembership')">✏️ Update Membership</a>
      <a onclick="renderPage('addBook')">➕ Add Book/Movie</a>
      <a onclick="renderPage('updateBook')">✏️ Update Book/Movie</a>
      <a onclick="renderPage('userManagement')">👤 User Management</a>
    </div>`;
  }
  $('sidebar').innerHTML = html;
}

function renderPage(page) {
  const mc = $('mainContent');
  const pages = {
    home:              pageHome,
    transactions:      pageTransactions,
    bookAvailable:     pageBookAvailable,
    bookIssue:         pageBookIssue,
    returnBook:        pageReturnBook,
    payFine:           pagePayFine,
    reports:           pageReports,
    masterBooks:       pageMasterBooks,
    masterMovies:      pageMasterMovies,
    masterMemberships: pageMasterMemberships,
    activeIssues:      pageActiveIssues,
    overdueReturns:    pageOverdueReturns,
    issueRequests:     pageIssueRequests,
    maintenance:       pageMaintenance,
    addMembership:     pageAddMembership,
    updateMembership:  pageUpdateMembership,
    addBook:           pageAddBook,
    updateBook:        pageUpdateBook,
    userManagement:    pageUserManagement,
  };
  mc.innerHTML = (pages[page] || pageHome)();
}

function pageHome() {
  const avail   = allItems().filter(b => b.status === 'Available').length;
  const issued  = ISSUES.length;
  const members = MEMBERS.filter(m => m.status === 'Active').length;
  const overdue = ISSUES.filter(i => i.returnDate < today()).length;

  return `
  <h2 class="page-title">Welcome, ${currentUser === 'admin' ? 'Administrator' : 'Library User'}</h2>
  <div class="stats-grid">
    <div class="stat-card"><div class="stat-num">${BOOKS.length + MOVIES.length}</div><div class="stat-label">Total Items</div></div>
    <div class="stat-card"><div class="stat-num">${avail}</div><div class="stat-label">Available</div></div>
    <div class="stat-card"><div class="stat-num">${issued}</div><div class="stat-label">Active Issues</div></div>
    <div class="stat-card"><div class="stat-num">${members}</div><div class="stat-label">Active Members</div></div>
    <div class="stat-card"><div class="stat-num danger">${overdue}</div><div class="stat-label">Overdue</div></div>
  </div>
  <div class="two-col-grid">
    <div class="card card-clickable" onclick="renderPage('transactions')">
      <div class="card-title">📤 Transactions</div>
      <p class="text-muted" style="font-size:.88rem;">Issue books, return books, pay fines, and check availability.</p>
    </div>
    <div class="card card-clickable" onclick="renderPage('reports')">
      <div class="card-title">📊 Reports</div>
      <p class="text-muted" style="font-size:.88rem;">View master lists, active issues, overdue returns and more.</p>
    </div>
    ${currentUser === 'admin' ? `
    <div class="card card-clickable" onclick="renderPage('maintenance')">
      <div class="card-title">🔧 Maintenance</div>
      <p class="text-muted" style="font-size:.88rem;">Manage memberships, books, movies and user accounts.</p>
    </div>` : ''}
  </div>`;
}

function pageTransactions() {
  const items = [
    ['📖','Book Available?','Check if a book or movie is available.','bookAvailable'],
    ['📤','Issue Book',     'Issue a book or movie to a member.',    'bookIssue'],
    ['📥','Return Book',    'Process the return of an issued item.', 'returnBook'],
    ['💰','Pay Fine',       'Pay overdue fines.',                    'payFine'],
  ];
  return `
  <h2 class="page-title">Transactions</h2>
  <div class="card-grid">
    ${items.map(([icon,title,desc,pg]) => `
    <div class="card card-clickable" onclick="renderPage('${pg}')">
      <div class="card-icon">${icon}</div>
      <div class="card-name">${title}</div>
      <p class="card-desc">${desc}</p>
    </div>`).join('')}
  </div>`;
}

function pageBookAvailable() {
  return `
  <h2 class="page-title">Book Availability</h2>
  <div class="card">
    <div class="card-title">Search for a Book or Movie</div>
    <div id="baAlert" class="alert alert-danger">Please enter a book name or select an author before searching.</div>
    <div class="form-row">
      <div class="form-group">
        <label>Book / Movie Name</label>
        <input type="text" id="baName" placeholder="Enter name..."/>
      </div>
      <div class="form-group">
        <label>Author Name</label>
        <select id="baAuthor">
          <option value="">-- Select Author --</option>
          ${uniqueAuthors().map(a => `<option>${a}</option>`).join('')}
        </select>
      </div>
    </div>
    <button class="btn btn-primary" onclick="doSearchBooks()">Search</button>
  </div>
  <div id="baResults"></div>`;
}

function doSearchBooks() {
  const name   = $('baName').value.trim().toLowerCase();
  const author = $('baAuthor').value.toLowerCase();
  const alertEl = $('baAlert');
  if (!name && !author) { alertEl.classList.add('show'); return; }
  alertEl.classList.remove('show');

  const results = allItems().filter(b =>
    (!name   || b.name.toLowerCase().includes(name)) &&
    (!author || b.author.toLowerCase() === author)
  );

  const div = $('baResults');
  if (!results.length) {
    div.innerHTML = `<div class="card mt-16 text-muted">No results found.</div>`;
    return;
  }
  div.innerHTML = `
  <div class="card mt-16">
    <div class="card-title">Search Results</div>
    <div class="table-wrap">
    <table><thead><tr>
      <th>Serial No</th><th>Name</th><th>Author</th><th>Category</th><th>Available</th><th>Select</th>
    </tr></thead><tbody>
    ${results.map((b, i) => `<tr>
      <td>${b.serial}</td><td>${b.name}</td><td>${b.author}</td><td>${b.category}</td>
      <td><span class="badge badge-${b.status === 'Available' ? 'yes' : 'no'}">${b.status === 'Available' ? 'Yes' : 'No'}</span></td>
      <td>${b.status === 'Available' ? `<input type="radio" name="bookSel" value="${i}"/> Issue` : '—'}</td>
    </tr>`).join('')}
    </tbody></table></div>
    <div class="btn-group">
      <button class="btn btn-gold" onclick="renderPage('bookIssue')">Proceed to Issue</button>
      <button class="btn btn-outline" onclick="showScreen('cancelScreen')">Cancel</button>
    </div>
  </div>`;
}

function pageBookIssue() {
  const t   = today();
  const ret = addDays(t, 15);
  const available = allItems().filter(b => b.status === 'Available');
  return `
  <h2 class="page-title">Issue Book / Movie</h2>
  <div class="card">
    <div class="card-title">Issue Form</div>
    <div id="biAlert" class="alert alert-danger">Please fill all required fields before submitting.</div>
    <div class="form-row">
      <div class="form-group">
        <label>Book / Movie Name *</label>
        <select id="biBook" onchange="biAutoAuthor()">
          <option value="">-- Select --</option>
          ${available.map(b => `<option value="${b.serial}">${b.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Author Name (auto-populated)</label>
        <input type="text" id="biAuthor" readonly/>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Issue Date * (not before today)</label>
        <input type="date" id="biIssueDate" value="${t}" min="${t}"/>
      </div>
      <div class="form-group">
        <label>Return Date (max 15 days from issue)</label>
        <input type="date" id="biReturnDate" value="${ret}" max="${ret}"/>
      </div>
    </div>
    <div class="form-group">
      <label>Member ID *</label>
      <select id="biMember">
        <option value="">-- Select Member --</option>
        ${MEMBERS.filter(m => m.status === 'Active').map(m =>
          `<option value="${m.id}">${m.id} – ${m.fname} ${m.lname}</option>`
        ).join('')}
      </select>
    </div>
    <div class="form-group">
      <label>Remarks (optional)</label>
      <textarea id="biRemarks" placeholder="Any notes..."></textarea>
    </div>
    <div class="btn-group">
      <button class="btn btn-gold"    onclick="submitBookIssue()">Confirm Issue</button>
      <button class="btn btn-outline" onclick="showScreen('cancelScreen')">Cancel</button>
    </div>
  </div>`;
}

function biAutoAuthor() {
  const serial = $('biBook').value;
  const item   = allItems().find(b => b.serial === serial);
  $('biAuthor').value = item ? item.author : '';
  // auto-update max return date based on issue date
  const issueDate = $('biIssueDate').value || today();
  const maxReturn = addDays(issueDate, 15);
  $('biReturnDate').value = maxReturn;
  $('biReturnDate').max   = maxReturn;
}

function submitBookIssue() {
  const book     = $('biBook').value;
  const member   = $('biMember').value;
  const issueDate = $('biIssueDate').value;
  const alertEl  = $('biAlert');
  if (!book || !member || !issueDate) { alertEl.classList.add('show'); return; }
  alertEl.classList.remove('show');
  const item = allItems().find(b => b.serial === book);
  if (item) item.status = 'Issued';
  ISSUES.push({
    serial: book,
    name: item ? item.name : '',
    type: BOOKS.find(b => b.serial === book) ? 'Book' : 'Movie',
    memberId: member,
    issueDate,
    returnDate: $('biReturnDate').value,
  });
  showScreen('confirmScreen');
}
function pageReturnBook() {
  return `
  <h2 class="page-title">Return Book / Movie</h2>
  <div class="card">
    <div class="card-title">Return Form</div>
    <div id="rbAlert" class="alert alert-danger">Please fill all required fields.</div>
    <div class="form-row">
      <div class="form-group">
        <label>Book / Movie Name *</label>
        <select id="rbBook" onchange="rbAutoFill()">
          <option value="">-- Select --</option>
          ${ISSUES.map(i => `<option value="${i.serial}">${i.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Author (auto-populated)</label>
        <input type="text" id="rbAuthor" readonly/>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Serial No *</label>
        <select id="rbSerial">
          <option value="">-- Select --</option>
          ${ISSUES.map(i => `<option value="${i.serial}">${i.serial}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Issue Date (auto-populated)</label>
        <input type="date" id="rbIssueDate" readonly/>
      </div>
    </div>
    <div class="form-group">
      <label>Return Date</label>
      <input type="date" id="rbReturnDate" value="${today()}"/>
    </div>
    <div class="form-group">
      <label>Remarks (optional)</label>
      <textarea id="rbRemarks"></textarea>
    </div>
    <div class="btn-group">
      <button class="btn btn-gold"    onclick="submitReturn()">Confirm Return</button>
      <button class="btn btn-outline" onclick="showScreen('cancelScreen')">Cancel</button>
    </div>
  </div>`;
}

function rbAutoFill() {
  const serial  = $('rbBook').value;
  const issue   = ISSUES.find(i => i.serial === serial);
  const item    = allItems().find(b => b.serial === serial);
  $('rbAuthor').value    = item  ? item.author        : '';
  $('rbIssueDate').value = issue ? issue.issueDate     : '';
  if (issue) $('rbSerial').value = issue.serial;
}

function submitReturn() {
  const book   = $('rbBook').value;
  const serial = $('rbSerial').value;
  const alertEl = $('rbAlert');
  if (!book || !serial) { alertEl.classList.add('show'); return; }
  alertEl.classList.remove('show');
  renderPage('payFine');
}

function pagePayFine() {
  const issue  = ISSUES[0];
  const actual = today();
  const overdueDays = issue ? Math.max(0, daysBetween(issue.returnDate, actual)) : 0;
  const fine   = overdueDays * 2;
  const item   = issue ? allItems().find(b => b.serial === issue.serial) : null;

  return `
  <h2 class="page-title">Pay Fine</h2>
  <div class="card">
    <div class="card-title">Fine Details</div>
    <div id="pfAlert" class="alert alert-danger">Please mark fine as paid before confirming.</div>
    <div class="form-row">
      <div class="form-group"><label>Book Name</label>   <input type="text" value="${issue ? issue.name : ''}"  readonly/></div>
      <div class="form-group"><label>Author</label>      <input type="text" value="${item  ? item.author : ''}" readonly/></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Serial No</label>   <input type="text" value="${issue ? issue.serial    : ''}" readonly/></div>
      <div class="form-group"><label>Issue Date</label>  <input type="date" value="${issue ? issue.issueDate  : ''}" readonly/></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Due Return Date</label>    <input type="date" value="${issue ? issue.returnDate : ''}" readonly/></div>
      <div class="form-group"><label>Actual Return Date</label> <input type="date" id="pfActual" value="${actual}"/></div>
    </div>
    <div class="fine-box">Fine Calculated: <span>₹${fine}</span> (${overdueDays} day${overdueDays !== 1 ? 's' : ''} overdue × ₹2/day)</div>
    <div class="form-group">
      <label class="checkbox-label">
        <input type="checkbox" id="pfPaid" ${fine === 0 ? 'checked' : ''}/>
        Fine Paid
      </label>
    </div>
    <div class="form-group">
      <label>Remarks (optional)</label>
      <textarea id="pfRemarks"></textarea>
    </div>
    <div class="btn-group">
      <button class="btn btn-gold"    onclick="submitFine(${fine})">Confirm</button>
      <button class="btn btn-outline" onclick="showScreen('cancelScreen')">Cancel</button>
    </div>
  </div>`;
}

function submitFine(fine) {
  const paid    = $('pfPaid').checked;
  const alertEl = $('pfAlert');
  if (fine > 0 && !paid) { alertEl.classList.add('show'); return; }
  alertEl.classList.remove('show');
  showScreen('confirmScreen');
}

function pageReports() {
  const items = [
    ['📚','Master List of Books',         'masterBooks'],
    ['🎬','Master List of Movies',        'masterMovies'],
    ['🪪','Master List of Memberships',   'masterMemberships'],
    ['✅','Active Issues',                'activeIssues'],
    ['⚠️','Overdue Returns',              'overdueReturns'],
    ['📋','Issue Requests',               'issueRequests'],
  ];
  return `
  <h2 class="page-title">Reports</h2>
  <div class="card-grid">
    ${items.map(([icon, title, pg]) => `
    <div class="card card-clickable" onclick="renderPage('${pg}')">
      <div class="card-icon">${icon}</div>
      <div class="card-name">${title}</div>
    </div>`).join('')}
  </div>`;
}

function pageMasterBooks() {
  return `
  <h2 class="page-title">Master List of Books</h2>
  <div class="card">
    <div class="table-wrap">
    <table><thead><tr>
      <th>Serial No</th><th>Name</th><th>Author</th><th>Category</th><th>Status</th><th>Cost (₹)</th><th>Date</th>
    </tr></thead><tbody>
    ${BOOKS.map(b => `<tr>
      <td>${b.serial}</td><td>${b.name}</td><td>${b.author}</td><td>${b.category}</td>
      <td><span class="badge badge-${b.status === 'Available' ? 'active' : 'inactive'}">${b.status}</span></td>
      <td>₹${b.cost}</td><td>${b.date}</td>
    </tr>`).join('')}
    </tbody></table></div>
  </div>`;
}

function pageMasterMovies() {
  return `
  <h2 class="page-title">Master List of Movies</h2>
  <div class="card">
    <div class="table-wrap">
    <table><thead><tr>
      <th>Serial No</th><th>Name</th><th>Director</th><th>Category</th><th>Status</th><th>Cost (₹)</th><th>Date</th>
    </tr></thead><tbody>
    ${MOVIES.map(b => `<tr>
      <td>${b.serial}</td><td>${b.name}</td><td>${b.author}</td><td>${b.category}</td>
      <td><span class="badge badge-${b.status === 'Available' ? 'active' : 'inactive'}">${b.status}</span></td>
      <td>₹${b.cost}</td><td>${b.date}</td>
    </tr>`).join('')}
    </tbody></table></div>
  </div>`;
}

function pageMasterMemberships() {
  return `
  <h2 class="page-title">Master List of Memberships</h2>
  <div class="card">
    <div class="table-wrap">
    <table><thead><tr>
      <th>Member ID</th><th>Name</th><th>Contact</th><th>Address</th><th>Start</th><th>End</th><th>Status</th><th>Fine (₹)</th>
    </tr></thead><tbody>
    ${MEMBERS.map(m => `<tr>
      <td>${m.id}</td><td>${m.fname} ${m.lname}</td><td>${m.contact}</td><td>${m.address}</td>
      <td>${m.start}</td><td>${m.end}</td>
      <td><span class="badge badge-${m.status === 'Active' ? 'active' : 'inactive'}">${m.status}</span></td>
      <td>₹${m.fine}</td>
    </tr>`).join('')}
    </tbody></table></div>
  </div>`;
}

function pageActiveIssues() {
  return `
  <h2 class="page-title">Active Issues</h2>
  <div class="card">
    <div class="table-wrap">
    <table><thead><tr>
      <th>Serial No</th><th>Name</th><th>Type</th><th>Member ID</th><th>Issue Date</th><th>Return Date</th>
    </tr></thead><tbody>
    ${ISSUES.map(i => `<tr>
      <td>${i.serial}</td><td>${i.name}</td><td>${i.type}</td><td>${i.memberId}</td>
      <td>${i.issueDate}</td><td>${i.returnDate}</td>
    </tr>`).join('')}
    </tbody></table></div>
  </div>`;
}

function pageOverdueReturns() {
  const overdue = ISSUES.filter(i => i.returnDate < today());
  return `
  <h2 class="page-title">Overdue Returns</h2>
  <div class="card">
    ${overdue.length === 0
      ? `<p class="text-success">✅ No overdue returns currently.</p>`
      : `<div class="table-wrap">
         <table><thead><tr>
           <th>Serial No</th><th>Name</th><th>Member ID</th><th>Issue Date</th><th>Due Return</th><th>Fine (₹)</th>
         </tr></thead><tbody>
         ${overdue.map(i => {
           const days = daysBetween(i.returnDate, today());
           return `<tr>
             <td>${i.serial}</td><td>${i.name}</td><td>${i.memberId}</td>
             <td>${i.issueDate}</td>
             <td class="text-danger">${i.returnDate}</td>
             <td class="text-gold">₹${days * 2}</td>
           </tr>`;
         }).join('')}
         </tbody></table></div>`
    }
  </div>`;
}

function pageIssueRequests() {
  return `
  <h2 class="page-title">Issue Requests</h2>
  <div class="card">
    <div class="table-wrap">
    <table><thead><tr>
      <th>Membership ID</th><th>Name of Book/Movie</th><th>Requested Date</th><th>Fulfilled Date</th>
    </tr></thead><tbody>
      <tr><td>MEM001</td><td>Organic Chemistry</td>  <td>2024-03-01</td><td>2024-03-01</td></tr>
      <tr><td>MEM002</td><td>The Dark Knight</td>     <td>2024-03-05</td><td>2024-03-05</td></tr>
    </tbody></table></div>
  </div>`;
}

function pageMaintenance() {
  const items = [
    ['🪪','Add Membership',         'addMembership'],
    ['✏️','Update Membership',      'updateMembership'],
    ['📚','Add Book / Movie',       'addBook'],
    ['🔄','Update Book / Movie',    'updateBook'],
    ['👤','User Management',        'userManagement'],
  ];
  return `
  <h2 class="page-title">Maintenance</h2>
  <div class="card-grid">
    ${items.map(([icon, title, pg]) => `
    <div class="card card-clickable" onclick="renderPage('${pg}')">
      <div class="card-icon">${icon}</div>
      <div class="card-name">${title}</div>
    </div>`).join('')}
  </div>`;
}

function pageAddMembership() {
  return `
  <h2 class="page-title">Add Membership</h2>
  <div class="card">
    <div class="card-title">New Member Registration</div>
    <div id="amAlert" class="alert alert-danger">All fields are required.</div>
    <div class="form-row">
      <div class="form-group"><label>First Name *</label><input type="text" id="amFirst" placeholder="First name"/></div>
      <div class="form-group"><label>Last Name *</label> <input type="text" id="amLast"  placeholder="Last name"/></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Contact Number *</label><input type="text" id="amContact" placeholder="Mobile number"/></div>
      <div class="form-group"><label>Aadhar Card No *</label><input type="text" id="amAadhar"  placeholder="XXXX-XXXX-XXXX"/></div>
    </div>
    <div class="form-group"><label>Contact Address *</label><input type="text" id="amAddress" placeholder="Full address"/></div>
    <div class="form-row">
      <div class="form-group"><label>Start Date *</label><input type="date" id="amStart" value="${today()}"/></div>
      <div class="form-group"><label>End Date *</label>  <input type="date" id="amEnd"   value="${addDays(today(), 180)}"/></div>
    </div>
    <div class="form-group">
      <label>Membership Duration *</label>
      <div class="radio-group">
        <label><input type="radio" name="amDur" value="6"  checked onchange="amSetDuration(6)"/>  <span>6 Months</span></label>
        <label><input type="radio" name="amDur" value="12"         onchange="amSetDuration(12)"/> <span>1 Year</span></label>
        <label><input type="radio" name="amDur" value="24"         onchange="amSetDuration(24)"/> <span>2 Years</span></label>
      </div>
    </div>
    <div class="btn-group">
      <button class="btn btn-gold"    onclick="submitAddMembership()">Add Member</button>
      <button class="btn btn-outline" onclick="showScreen('cancelScreen')">Cancel</button>
    </div>
  </div>`;
}

function amSetDuration(months) {
  const start = $('amStart').value || today();
  $('amEnd').value = addDays(start, months * 30);
}

function submitAddMembership() {
  const fields  = ['amFirst','amLast','amContact','amAadhar','amAddress','amStart','amEnd'];
  const alertEl = $('amAlert');
  for (const f of fields) { if (!$(f).value) { alertEl.classList.add('show'); return; } }
  alertEl.classList.remove('show');
  MEMBERS.push({
    id:      'MEM' + String(MEMBERS.length + 1).padStart(3, '0'),
    fname:   $('amFirst').value,
    lname:   $('amLast').value,
    contact: $('amContact').value,
    address: $('amAddress').value,
    aadhar:  $('amAadhar').value,
    start:   $('amStart').value,
    end:     $('amEnd').value,
    status:  'Active',
    fine:    0,
  });
  showScreen('confirmScreen');
}

function pageUpdateMembership() {
  return `
  <h2 class="page-title">Update Membership</h2>
  <div class="card">
    <div class="card-title">Extend or Cancel Membership</div>
    <div id="umAlert" class="alert alert-danger">Membership number is required.</div>
    <div class="form-group">
      <label>Membership Number *</label>
      <select id="umId" onchange="umAutoFill()">
        <option value="">-- Select Member --</option>
        ${MEMBERS.map(m => `<option value="${m.id}">${m.id} – ${m.fname} ${m.lname}</option>`).join('')}
      </select>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Start Date</label><input type="date" id="umStart" readonly/></div>
      <div class="form-group"><label>End Date</label>  <input type="date" id="umEnd"   readonly/></div>
    </div>
    <div class="form-group">
      <label>Membership Extension</label>
      <div class="radio-group">
        <label><input type="radio" name="umExt" value="6"  checked/><span>6 Months</span></label>
        <label><input type="radio" name="umExt" value="12"/><span>1 Year</span></label>
        <label><input type="radio" name="umExt" value="24"/><span>2 Years</span></label>
        <label><input type="radio" name="umExt" value="0"/> <span>Cancel Membership</span></label>
      </div>
    </div>
    <div class="btn-group">
      <button class="btn btn-gold"    onclick="submitUpdateMembership()">Update</button>
      <button class="btn btn-outline" onclick="showScreen('cancelScreen')">Cancel</button>
    </div>
  </div>`;
}

function umAutoFill() {
  const id = $('umId').value;
  const m  = MEMBERS.find(x => x.id === id);
  if (m) { $('umStart').value = m.start; $('umEnd').value = m.end; }
}

function submitUpdateMembership() {
  const id      = $('umId').value;
  const alertEl = $('umAlert');
  if (!id) { alertEl.classList.add('show'); return; }
  alertEl.classList.remove('show');
  const ext = document.querySelector('input[name=umExt]:checked').value;
  const m   = MEMBERS.find(x => x.id === id);
  if (m) {
    if (ext === '0') { m.status = 'Inactive'; }
    else { m.end = addDays(m.end, parseInt(ext) * 30); }
  }
  showScreen('confirmScreen');
}

function pageAddBook() {
  return `
  <h2 class="page-title">Add Book / Movie</h2>
  <div class="card">
    <div class="card-title">Add New Item</div>
    <div id="abAlert" class="alert alert-danger">All fields are required.</div>
    <div class="form-group">
      <label>Type *</label>
      <div class="radio-group">
        <label><input type="radio" name="abType" value="Book"  checked/><span>📚 Book</span></label>
        <label><input type="radio" name="abType" value="Movie"/><span>🎬 Movie</span></label>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Name *</label>             <input type="text" id="abName"   placeholder="Book/Movie name"/></div>
      <div class="form-group"><label>Author / Director *</label><input type="text" id="abAuthor" placeholder="Author name"/></div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Category *</label>
        <select id="abCat">
          <option>Science</option><option>Economics</option><option>Fiction</option>
          <option>Children</option><option>Personal Development</option>
        </select>
      </div>
      <div class="form-group"><label>Cost (₹) *</label><input type="number" id="abCost" placeholder="0" min="0"/></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Date of Procurement *</label><input type="date" id="abDate" value="${today()}"/></div>
      <div class="form-group"><label>Quantity / Copies *</label><input type="number" id="abQty" value="1" min="1"/></div>
    </div>
    <div class="btn-group">
      <button class="btn btn-gold"    onclick="submitAddBook()">Add Item</button>
      <button class="btn btn-outline" onclick="showScreen('cancelScreen')">Cancel</button>
    </div>
  </div>`;
}

function submitAddBook() {
  const fields  = ['abName','abAuthor','abCost','abDate','abQty'];
  const alertEl = $('abAlert');
  for (const f of fields) { if (!$(f).value) { alertEl.classList.add('show'); return; } }
  alertEl.classList.remove('show');

  const type   = document.querySelector('input[name=abType]:checked').value;
  const cat    = $('abCat').value;
  const prefix = { Science:'SC', Economics:'EC', Fiction:'FC', Children:'CH', 'Personal Development':'PD' }[cat] || 'XX';
  const code   = type === 'Book' ? 'B' : 'M';
  const list   = type === 'Book' ? BOOKS : MOVIES;
  const serial = `${prefix}(${code})${String(list.length + 1).padStart(6, '0')}`;

  list.push({
    serial, name: $('abName').value, author: $('abAuthor').value,
    category: cat, status: 'Available',
    cost: $('abCost').value, date: $('abDate').value,
  });
  showScreen('confirmScreen');
}

function pageUpdateBook() {
  return `
  <h2 class="page-title">Update Book / Movie</h2>
  <div class="card">
    <div class="card-title">Update Item Status</div>
    <div id="ubAlert" class="alert alert-danger">Please select an item.</div>
    <div class="form-group">
      <label>Type</label>
      <div class="radio-group">
        <label><input type="radio" name="ubType" value="Book"  checked/><span>📚 Book</span></label>
        <label><input type="radio" name="ubType" value="Movie"/><span>🎬 Movie</span></label>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Book / Movie Name *</label>
        <select id="ubName" onchange="ubAutoFill()">
          <option value="">-- Select --</option>
          ${allItems().map(b => `<option value="${b.serial}">${b.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Serial No</label><input type="text" id="ubSerial" readonly/></div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Status *</label>
        <select id="ubStatus">
          <option>Available</option><option>Issued</option>
          <option>Damaged</option><option>Lost</option>
        </select>
      </div>
      <div class="form-group"><label>Date</label><input type="date" id="ubDate" value="${today()}"/></div>
    </div>
    <div class="btn-group">
      <button class="btn btn-gold"    onclick="submitUpdateBook()">Update</button>
      <button class="btn btn-outline" onclick="showScreen('cancelScreen')">Cancel</button>
    </div>
  </div>`;
}

function ubAutoFill() {
  const serial = $('ubName').value;
  const item   = allItems().find(b => b.serial === serial);
  if (item) { $('ubSerial').value = serial; $('ubStatus').value = item.status; }
}

function submitUpdateBook() {
  const serial  = $('ubName').value;
  const alertEl = $('ubAlert');
  if (!serial) { alertEl.classList.add('show'); return; }
  alertEl.classList.remove('show');
  const item = allItems().find(b => b.serial === serial);
  if (item) item.status = $('ubStatus').value;
  showScreen('confirmScreen');
}

function pageUserManagement() {
  return `
  <h2 class="page-title">User Management</h2>
  <div class="card">
    <div class="card-title">Add / Update User</div>
    <div id="umgAlert" class="alert alert-danger">Name is required.</div>
    <div class="form-group">
      <label>Action</label>
      <div class="radio-group">
        <label><input type="radio" name="umgAction" value="new"      checked/><span>New User</span></label>
        <label><input type="radio" name="umgAction" value="existing"/><span>Existing User</span></label>
      </div>
    </div>
    <div class="form-group"><label>Name *</label><input type="text" id="umgName" placeholder="Full name"/></div>
    <div class="form-group">
      <label class="checkbox-label"><input type="checkbox" id="umgActive" checked/> Active</label>
    </div>
    <div class="form-group">
      <label class="checkbox-label"><input type="checkbox" id="umgAdmin"/> Admin</label>
    </div>
    <div class="btn-group">
      <button class="btn btn-gold"    onclick="submitUserManagement()">Save</button>
      <button class="btn btn-outline" onclick="showScreen('cancelScreen')">Cancel</button>
    </div>
  </div>
  <div class="card mt-20">
    <div class="card-title">Existing Users</div>
    <div class="table-wrap">
    <table><thead><tr><th>Name</th><th>Username</th><th>Status</th><th>Admin</th></tr></thead>
    <tbody>
    ${USERS_DB.map(u => `<tr>
      <td>${u.name}</td><td>${u.username}</td>
      <td><span class="badge badge-${u.active ? 'active' : 'inactive'}">${u.active ? 'Active' : 'Inactive'}</span></td>
      <td>${u.admin ? '✅' : '—'}</td>
    </tr>`).join('')}
    </tbody></table></div>
  </div>`;
}

function submitUserManagement() {
  const name    = $('umgName').value.trim();
  const alertEl = $('umgAlert');
  if (!name) { alertEl.classList.add('show'); return; }
  alertEl.classList.remove('show');
  showScreen('confirmScreen');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && $('loginScreen').classList.contains('active')) {
    doLogin();
  }
});