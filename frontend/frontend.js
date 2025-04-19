// frontend.js - โค้ด JavaScript สำหรับฝั่ง Frontend

document.addEventListener('DOMContentLoaded', function() {

     // เพิ่มการเรียกใช้ฟังก์ชันดึงประเภทเอกสาร
    getDocumentTypes();
    
    // ตัวแปรเก็บสถานะการล็อกอิน
    let isLoggedIn = false;
    let currentUser = null;

    // องค์ประกอบหน้าต่างๆ
    const homePage = document.getElementById('homePage');
    const loginPage = document.getElementById('loginPage');
    const registerPage = document.getElementById('registerPage');
    const requestPage = document.getElementById('requestPage');
    const statusPage = document.getElementById('statusPage');

    // ปุ่มและลิงก์ต่างๆ
    const loginBtn = document.getElementById('loginBtn');
    const homeLink = document.getElementById('homeLink');
    const requestLink = document.getElementById('requestLink');
    const statusLink = document.getElementById('statusLink');
    const registerLink = document.getElementById('registerLink');
    const backToLoginLink = document.getElementById('backToLoginLink');
    const startRequestBtn = document.getElementById('startRequestBtn');
    const cancelRequest = document.getElementById('cancelRequest');

    // ฟอร์มต่างๆ
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const documentRequestForm = document.getElementById('documentRequestForm');

    // องค์ประกอบในฟอร์ม
    const purposeSelect = document.getElementById('purpose');
    const otherPurposeDiv = document.getElementById('otherPurposeDiv');
    const deliveryMethodSelect = document.getElementById('deliveryMethod');
    const addressDiv = document.getElementById('addressDiv');

    // Modal
    const requestDetailModal = new bootstrap.Modal(document.getElementById('requestDetailModal'));

    // แสดงหน้าหลัก ซ่อนหน้าอื่นๆ
    function showHome() {
        homePage.style.display = 'block';
        loginPage.style.display = 'none';
        registerPage.style.display = 'none';
        requestPage.style.display = 'none';
        statusPage.style.display = 'none';
    }

    // แสดงหน้าล็อกอิน ซ่อนหน้าอื่นๆ
    function showLogin() {
        homePage.style.display = 'none';
        loginPage.style.display = 'block';
        registerPage.style.display = 'none';
        requestPage.style.display = 'none';
        statusPage.style.display = 'none';
    }

    // แสดงหน้าลงทะเบียน ซ่อนหน้าอื่นๆ
    function showRegister() {
        homePage.style.display = 'none';
        loginPage.style.display = 'none';
        registerPage.style.display = 'block';
        requestPage.style.display = 'none';
        statusPage.style.display = 'none';
    }

    // แสดงหน้าขอเอกสาร ซ่อนหน้าอื่นๆ
    function showRequest() {
        if (!isLoggedIn) {
            showLogin();
            return;
        }
        homePage.style.display = 'none';
        loginPage.style.display = 'none';
        registerPage.style.display = 'none';
        requestPage.style.display = 'block';
        statusPage.style.display = 'none';
    }

    // แสดงหน้าติดตามสถานะ ซ่อนหน้าอื่นๆ
    function showStatus() {
        if (!isLoggedIn) {
            showLogin();
            return;
        }
        homePage.style.display = 'none';
        loginPage.style.display = 'none';
        registerPage.style.display = 'none';
        requestPage.style.display = 'none';
        statusPage.style.display = 'block';
    }

    // เปลี่ยนปุ่มล็อกอินเป็นล็อกเอาท์ หลังจากล็อกอินสำเร็จ
    function updateLoginButton() {
        if (isLoggedIn) {
            loginBtn.textContent = 'ออกจากระบบ';
            loginBtn.classList.remove('btn-light');
            loginBtn.classList.add('btn-outline-light');
        } else {
            loginBtn.textContent = 'เข้าสู่ระบบ';
            loginBtn.classList.remove('btn-outline-light');
            loginBtn.classList.add('btn-light');
        }
    }

   // แทนที่ฟังก์ชัน simulateLogin เดิม ด้วยการเรียกใช้ API จริง
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const studentId = document.getElementById('studentId').value;
    const password = document.getElementById('password').value;
    
    // แสดงการโหลด (อาจเพิ่ม loading spinner ตรงนี้)
    document.getElementById('loadingSpinner').style.display = 'flex';
    
    // ส่งข้อมูลไปยัง API
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentId, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Login response:', data);
        document.getElementById('loadingSpinner').style.display = 'none';
        
        if (data.message === 'เข้าสู่ระบบสำเร็จ') {
            // เก็บ token ไว้ใน localStorage
            localStorage.setItem('authToken', data.token);
            
            // บันทึกข้อมูลผู้ใช้ปัจจุบัน
            isLoggedIn = true;
            currentUser = data.user;
            
            // อัปเดตส่วนแสดงผล
            updateLoginButton();
            showHome();
            
            // แสดงข้อความต้อนรับ
            showAlert(`ยินดีต้อนรับ ${data.user.firstName} ${data.user.lastName}`, 'success');
            
            // รีเซ็ตฟอร์ม
            loginForm.reset();
        } else {
            showAlert(data.message || 'รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง', 'danger');
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        document.getElementById('loadingSpinner').style.display = 'none';
        showAlert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ', 'danger');
    });
});

    // แก้ไขการดึงข้อมูลคำขอเอกสาร
function getDocumentRequests() {
    // แสดงการโหลด
    document.getElementById('loadingSpinner').style.display = 'flex';
    
    authenticatedFetch('/api/documents/requests')
        .then(response => response.json())
        .then(data => {
            document.getElementById('loadingSpinner').style.display = 'none';
            
            // แปลงข้อมูลที่ได้รับมาให้ตรงกับรูปแบบที่ต้องการ
            const requests = data.map(request => {
                // แปลงสถานะเป็นภาษาไทย
                let statusThai = 'รอดำเนินการ';
                if (request.status === 'processing') statusThai = 'กำลังดำเนินการ';
                else if (request.status === 'completed') statusThai = 'เสร็จสิ้น';
                else if (request.status === 'rejected') statusThai = 'ถูกปฏิเสธ';
                
                // แปลงวันที่เป็นรูปแบบไทย
                const requestDate = new Date(request.request_date).toLocaleDateString('th-TH');
                
                return {
                    requestId: request.request_id,
                    documentType: request.document_type_id,
                    documentTypeThai: request.document_name,
                    requestDate: requestDate,
                    status: request.status,
                    statusThai: statusThai
                };
            });
            
            updateRequestsTable(requests);
        })
        .catch(error => {
            console.error('Error fetching requests:', error);
            document.getElementById('loadingSpinner').style.display = 'none';
            showAlert('เกิดข้อผิดพลาดในการดึงข้อมูลคำขอเอกสาร', 'danger');
        });
}

// เพิ่มฟังก์ชันสำหรับการส่งคำขอที่ต้องการการยืนยันตัวตน
function authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        showLogin();
        showAlert('กรุณาเข้าสู่ระบบ', 'warning');
        return Promise.reject('ไม่มี token');
    }
    
    // เพิ่ม token ในส่วน headers
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };
    
    return fetch(url, {
        ...options,
        headers
    });
}

    // แสดงข้อความแจ้งเตือน
    function showAlert(message, type = 'success') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        const container = document.querySelector('.container');
        container.insertBefore(alertDiv, container.firstChild);
        
        // ตั้งเวลาลบข้อความแจ้งเตือน
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    // อัปเดตตารางข้อมูลคำขอเอกสาร
    function updateRequestsTable(requests) {
        const tableBody = document.getElementById('requestsTableBody');
        tableBody.innerHTML = '';
        
        if (requests.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" class="text-center">ไม่มีคำขอเอกสาร</td>`;
            tableBody.appendChild(row);
            return;
        }
        
        requests.forEach(request => {
            const row = document.createElement('tr');
            
            // กำหนดสีของ badge ตามสถานะ
            let badgeClass = 'bg-secondary';
            if (request.status === 'processing') {
                badgeClass = 'bg-warning';
            } else if (request.status === 'completed') {
                badgeClass = 'bg-success';
            } else if (request.status === 'rejected') {
                badgeClass = 'bg-danger';
            }
            
            row.innerHTML = `
                <td>${request.requestId}</td>
                <td>${request.documentTypeThai}</td>
                <td>${request.requestDate}</td>
                <td><span class="badge ${badgeClass} status-badge">${request.statusThai}</span></td>
                <td>
                    <button class="btn btn-sm btn-info view-details" data-id="${request.requestId}">ดูรายละเอียด</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // เพิ่ม event listener สำหรับปุ่มดูรายละเอียด
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', function() {
                const requestId = this.getAttribute('data-id');
                showRequestDetails(requestId);
            });
        });
    }

    // แสดงรายละเอียดคำขอเอกสาร
    function showRequestDetails(requestId) {
        // ในโปรเจคจริง ควรดึงข้อมูลรายละเอียดจาก API
        document.getElementById('modalRequestId').textContent = requestId;
        
        // จำลองข้อมูลรายละเอียดคำขอ
        if (requestId === 'DOC20250419-001') {
            document.getElementById('modalRequestDate').textContent = '19/04/2025';
            document.getElementById('modalDocumentType').textContent = 'ใบรับรองการเป็นนักศึกษา';
            document.getElementById('modalCopies').textContent = '1';
            document.getElementById('modalPurpose').textContent = 'สมัครงาน';
            document.getElementById('modalDeliveryMethod').textContent = 'รับด้วยตนเองที่มหาวิทยาลัย';
            document.getElementById('modalAddressDiv').style.display = 'none';
        } else {
            document.getElementById('modalRequestDate').textContent = '10/04/2025';
            document.getElementById('modalDocumentType').textContent = 'ใบแสดงผลการเรียน';
            document.getElementById('modalCopies').textContent = '2';
            document.getElementById('modalPurpose').textContent = 'สมัครเรียนต่อ';
            document.getElementById('modalDeliveryMethod').textContent = 'จัดส่งทางไปรษณีย์';
            document.getElementById('modalAddressDiv').style.display = 'block';
            document.getElementById('modalAddress').textContent = '123 ถนนตัวอย่าง ตำบลตัวอย่าง อำเภอเมือง จังหวัดตัวอย่าง 10000';
        }
        
        requestDetailModal.show();
    }

    // Event Listeners

    // ลิงก์นำทางไปหน้าต่างๆ
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showHome();
    });

    requestLink.addEventListener('click', (e) => {
        e.preventDefault();
        showRequest();
    });

   // อัปเดตส่วนติดตามสถานะเพื่อเรียกใช้ API
statusLink.addEventListener('click', (e) => {
    e.preventDefault();
    showStatus();
    
    // โหลดข้อมูลคำขอเอกสาร
    if (isLoggedIn) {
        getDocumentRequests();
    }
});
    

    // ปุ่มล็อกอิน/ล็อกเอาท์
    loginBtn.addEventListener('click', function() {
        if (isLoggedIn) {
            // ล็อกเอาท์
            isLoggedIn = false;
            currentUser = null;
            updateLoginButton();
            showHome();
            showAlert('ออกจากระบบเรียบร้อยแล้ว', 'info');
        } else {
            // แสดงหน้าล็อกอิน
            showLogin();
        }
    });

    // ลิงก์ลงทะเบียน
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        showRegister();
    });

    // ลิงก์กลับไปหน้าล็อกอิน
    backToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLogin();
    });

    // ปุ่มเริ่มขอเอกสาร
    startRequestBtn.addEventListener('click', () => {
        showRequest();
    });

    // ปุ่มยกเลิกคำขอ
    cancelRequest.addEventListener('click', () => {
        document.getElementById('documentRequestForm').reset();
        showHome();
    });

    // ฟอร์มล็อกอิน
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const studentId = document.getElementById('studentId').value;
        const password = document.getElementById('password').value;
        
        // แสดงการโหลด (ในโปรเจคจริงควรมีการแสดง loading)
        
        simulateLogin(studentId, password)
            .then(user => {
                isLoggedIn = true;
                currentUser = user;
                updateLoginButton();
                showHome();
                showAlert(`ยินดีต้อนรับ ${user.firstName} ${user.lastName}`, 'success');
                loginForm.reset();
            })
            .catch(error => {
                showAlert(error, 'danger');
            });
    });

   // ในไฟล์ frontend.js
// ตรวจสอบข้อมูลก่อนส่งไปยัง API
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const userData = {
    studentId: document.getElementById('regStudentId').value,
    password: document.getElementById('regPassword').value,
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    faculty: document.getElementById('faculty').value
  };
  
  console.log('Sending registration data:', userData); // เพิ่มการล็อกในฝั่ง Frontend
  
  // ส่งข้อมูลไปยัง API
  fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Registration response:', data);
    if (data.message === 'ลงทะเบียนสำเร็จ') {
      showAlert('ลงทะเบียนสำเร็จ กรุณาเข้าสู่ระบบ', 'success');
      showLogin();
      registerForm.reset();
    } else {
      showAlert(data.message || 'เกิดข้อผิดพลาดในการลงทะเบียน', 'danger');
    }
  })
  .catch(error => {
    console.error('Registration error:', error);
    showAlert('เกิดข้อผิดพลาดในการลงทะเบียน', 'danger');
  });
});

// แก้ไขส่วนการขอเอกสาร
documentRequestForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // ตรวจสอบว่ามีการล็อกอินหรือไม่
    if (!isLoggedIn) {
        showLogin();
        showAlert('กรุณาเข้าสู่ระบบก่อนขอเอกสาร', 'warning');
        return;
    }
    
    // สร้าง FormData เพื่อส่งข้อมูลรวมถึงไฟล์
    const formData = new FormData();
    formData.append('documentType', document.getElementById('documentType').value);
    formData.append('copies', document.getElementById('copies').value);
    
    const purpose = document.getElementById('purpose').value;
    formData.append('purpose', purpose);
    
    if (purpose === 'other') {
        formData.append('otherPurpose', document.getElementById('otherPurpose').value);
    }
    
    const deliveryMethod = document.getElementById('deliveryMethod').value;
    formData.append('deliveryMethod', deliveryMethod);
    
    if (deliveryMethod === 'mail') {
        formData.append('address', document.getElementById('address').value);
        formData.append('district', document.getElementById('district').value);
        formData.append('province', document.getElementById('province').value);
        formData.append('postalCode', document.getElementById('postalCode').value);
    }
    
    const idCardFile = document.getElementById('idCardFile').files[0];
    if (idCardFile) {
        formData.append('idCard', idCardFile);
    }
    
    // แสดงการโหลด
    document.getElementById('loadingSpinner').style.display = 'flex';
    
    // ส่งข้อมูลไปยัง API
    const token = localStorage.getItem('authToken');
    
    fetch('/api/documents/request', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('loadingSpinner').style.display = 'none';
        
        if (data.requestId) {
            showHome();
            showAlert(`ส่งคำขอเอกสารสำเร็จ เลขที่คำขอ: ${data.requestId}`, 'success');
            documentRequestForm.reset();
        } else {
            showAlert(data.message || 'เกิดข้อผิดพลาดในการส่งคำขอเอกสาร', 'danger');
        }
    })
    .catch(error => {
        console.error('Document request error:', error);
        document.getElementById('loadingSpinner').style.display = 'none';
        showAlert('เกิดข้อผิดพลาดในการส่งคำขอเอกสาร', 'danger');
    });
});

// เพิ่มฟังก์ชันสำหรับดึงข้อมูลประเภทเอกสาร
function getDocumentTypes() {
    fetch('/api/document-types')
        .then(response => response.json())
        .then(data => {
            // อัปเดตตัวเลือกในฟอร์มขอเอกสาร
            const documentTypeSelect = document.getElementById('documentType');
            // ล้างตัวเลือกเดิม แต่เก็บตัวเลือกแรก (default)
            const defaultOption = documentTypeSelect.options[0];
            documentTypeSelect.innerHTML = '';
            documentTypeSelect.appendChild(defaultOption);
            
            // เพิ่มตัวเลือกใหม่จาก API
            data.forEach(type => {
                const option = document.createElement('option');
                option.value = type.id;
                option.textContent = type.name;
                documentTypeSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching document types:', error);
        });
}

    

    // เมื่อเลือกวัตถุประสงค์ "อื่นๆ"
    purposeSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            otherPurposeDiv.style.display = 'block';
            document.getElementById('otherPurpose').setAttribute('required', '');
        } else {
            otherPurposeDiv.style.display = 'none';
            document.getElementById('otherPurpose').removeAttribute('required');
        }
    });

    // เมื่อเลือกวิธีการรับเอกสาร "จัดส่งทางไปรษณีย์"
    deliveryMethodSelect.addEventListener('change', function() {
        if (this.value === 'mail') {
            addressDiv.style.display = 'block';
            document.getElementById('address').setAttribute('required', '');
            document.getElementById('district').setAttribute('required', '');
            document.getElementById('province').setAttribute('required', '');
            document.getElementById('postalCode').setAttribute('required', '');
        } else {
            addressDiv.style.display = 'none';
            document.getElementById('address').removeAttribute('required');
            document.getElementById('district').removeAttribute('required');
            document.getElementById('province').removeAttribute('required');
            document.getElementById('postalCode').removeAttribute('required');
        }
    });

    // แสดงหน้าหลักเมื่อโหลดเว็บเสร็จ
    showHome();
});
