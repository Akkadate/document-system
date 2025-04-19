// frontend.js - โค้ด JavaScript สำหรับฝั่ง Frontend

document.addEventListener('DOMContentLoaded', function() {

     // เพิ่มการเรียกใช้ฟังก์ชันดึงประเภทเอกสาร
    getDocumentTypes();

    // ตรวจสอบว่ามี token ใน localStorage หรือไม่ เพื่อการล็อกอินอัตโนมัติ
    const token = localStorage.getItem('authToken');
    if (token) {
        // ดึงข้อมูลผู้ใช้
        fetch('/api/user/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                // ถ้ามีปัญหา เช่น token หมดอายุ ให้ลบออก
                localStorage.removeItem('authToken');
                throw new Error('Invalid token');
            }
            return response.json();
        })
        .then(data => {
            // ล็อกอินสำเร็จ
            isLoggedIn = true;
            currentUser = data.user;
            updateLoginButton();
        })
        .catch(error => {
            console.error('Auto login error:', error);
            // กรณีมีข้อผิดพลาด ลบ token และให้ล็อกอินใหม่
            localStorage.removeItem('authToken');
        });
    }
    
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


            // เพิ่มฟังก์ชันล็อกเอาท์ที่สมบูรณ์
        loginBtn.addEventListener('click', function() {
            if (isLoggedIn) {
                // ล็อกเอาท์
                localStorage.removeItem('authToken');
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

                    // แสดงรายละเอียดคำขอเอกสาร
               function showRequestDetails(requestId) {
                   // แสดงการโหลด
                   document.getElementById('loadingSpinner').style.display = 'flex';
                   
                   // เรียกใช้ API เพื่อดึงข้อมูลรายละเอียดคำขอ
                   authenticatedFetch(`/api/documents/requests/${requestId}`)
                       .then(response => response.json())
                       .then(data => {
                           document.getElementById('loadingSpinner').style.display = 'none';
                           
                           // แสดงข้อมูลบนหน้าต่าง modal
                           document.getElementById('modalRequestId').textContent = data.request_id;
                           document.getElementById('modalRequestDate').textContent = new Date(data.request_date).toLocaleDateString('th-TH');
                           document.getElementById('modalDocumentType').textContent = data.document_name;
                           document.getElementById('modalCopies').textContent = data.copies;
                           document.getElementById('modalPurpose').textContent = data.purpose;
                           
                           // แสดงวิธีการรับเอกสาร
                           let deliveryMethodText = '';
                           if (data.delivery_method === 'pickup') {
                               deliveryMethodText = 'รับด้วยตนเองที่มหาวิทยาลัย';
                               document.getElementById('modalAddressDiv').style.display = 'none';
                           } else if (data.delivery_method === 'mail') {
                               deliveryMethodText = 'จัดส่งทางไปรษณีย์';
                               document.getElementById('modalAddressDiv').style.display = 'block';
                               document.getElementById('modalAddress').textContent = `${data.address} ${data.district} ${data.province} ${data.postal_code}`;
                           }
                           document.getElementById('modalDeliveryMethod').textContent = deliveryMethodText;
                           
                           // แสดงสถานะปัจจุบัน
                           const modalStatus = document.getElementById('modalStatus');
                           modalStatus.textContent = getStatusText(data.status);
                           modalStatus.className = `badge ${getStatusClass(data.status)}`;
                           
                           // แสดงประวัติการดำเนินการ
                           const timelineContainer = document.getElementById('modalTimeline');
                           timelineContainer.innerHTML = '';
                           
                           if (data.history && data.history.length > 0) {
                               data.history.forEach(item => {
                                   const stepElement = document.createElement('div');
                                   stepElement.className = `progress-step ${item.status === data.status ? 'active' : 'completed'}`;
                                   
                                   const dateTime = new Date(item.created_at).toLocaleString('th-TH');
                                   
                                   stepElement.innerHTML = `
                                       <h6>${getStatusText(item.status)}</h6>
                                       <p class="text-muted">${dateTime}</p>
                                       ${item.comment ? `<p>${item.comment}</p>` : ''}
                                   `;
                                   
                                   timelineContainer.appendChild(stepElement);
                               });
                           } else {
                               timelineContainer.innerHTML = '<p>ไม่มีข้อมูลประวัติการดำเนินการ</p>';
                           }
                           
                           // แสดง modal
                           const requestDetailModal = new bootstrap.Modal(document.getElementById('requestDetailModal'));
                           requestDetailModal.show();
                       })
                       .catch(error => {
                           console.error('Error fetching request details:', error);
                           document.getElementById('loadingSpinner').style.display = 'none';
                           showAlert('เกิดข้อผิดพลาดในการดึงข้อมูลรายละเอียดคำขอ', 'danger');
                       });
               }

               // ฟังก์ชันช่วยแปลงสถานะเป็นข้อความภาษาไทย
               function getStatusText(status) {
                   switch (status) {
                       case 'pending':
                           return 'รอดำเนินการ';
                       case 'processing':
                           return 'กำลังดำเนินการ';
                       case 'completed':
                           return 'เสร็จสิ้น';
                       case 'rejected':
                           return 'ถูกปฏิเสธ';
                       default:
                           return 'ไม่ทราบสถานะ';
                   }
               }
               
               // ฟังก์ชันช่วยแปลงสถานะเป็น CSS class สำหรับ badge
               function getStatusClass(status) {
                   switch (status) {
                       case 'pending':
                           return 'bg-secondary';
                       case 'processing':
                           return 'bg-warning text-dark';
                       case 'completed':
                           return 'bg-success';
                       case 'rejected':
                           return 'bg-danger';
                       default:
                           return 'bg-secondary';
                   }
               }
               // เพิ่มการจัดการการพิมพ์รายละเอียดคำขอ
               document.getElementById('printRequestDetail').addEventListener('click', function() {
                   const printContents = document.querySelector('#requestDetailModal .modal-body').innerHTML;
                   const originalContents = document.body.innerHTML;
                   
                   document.body.innerHTML = `
                       <div class="container mt-4">
                           <h3 class="text-center mb-4">รายละเอียดคำขอเอกสาร</h3>
                           ${printContents}
                       </div>
                   `;
                   
                   window.print();
                   
                   document.body.innerHTML = originalContents;
                   
                   // จำเป็นต้องสร้าง modal ใหม่หลังจากแทนที่ HTML ทั้งหมด
                   const requestDetailModal = new bootstrap.Modal(document.getElementById('requestDetailModal'));
                   requestDetailModal.show();
               });
               
               // เพิ่มการจัดการคู่มือการใช้งาน
               document.getElementById('viewGuideBtn').addEventListener('click', function() {
                   const userGuideModal = new bootstrap.Modal(document.getElementById('userGuideModal'));
                   userGuideModal.show();
               });
               
               document.getElementById('printGuide').addEventListener('click', function() {
                   const printContents = document.querySelector('#userGuideModal .modal-body').innerHTML;
                   const originalContents = document.body.innerHTML;
                   
                   document.body.innerHTML = `
                       <div class="container mt-4">
                           <h3 class="text-center mb-4">คู่มือการใช้งานระบบขอเอกสารทางการศึกษาออนไลน์</h3>
                           ${printContents}
                       </div>
                   `;
                   
                   window.print();
                   
                   document.body.innerHTML = originalContents;
                   
                   // จำเป็นต้องสร้าง modal ใหม่หลังจากแทนที่ HTML ทั้งหมด
                   const userGuideModal = new bootstrap.Modal(document.getElementById('userGuideModal'));
                   userGuideModal.show();
               });

               // อัปเดตฟังก์ชัน เพิ่มการจัดการค่าธรรมเนียม
               document.getElementById('documentType').addEventListener('change', updateFeeCalculation);
               document.getElementById('copies').addEventListener('change', updateFeeCalculation);
               document.getElementById('deliveryMethod').addEventListener('change', updateFeeCalculation);
               
               // อัปเดตการคำนวณค่าธรรมเนียม
               function updateFeeCalculation() {
                   const documentType = document.getElementById('documentType').value;
                   const copies = parseInt(document.getElementById('copies').value) || 0;
                   const deliveryMethod = document.getElementById('deliveryMethod').value;
                   
                   let documentFee = 0;
                   let deliveryFee = 0;
                   
                   // กำหนดค่าธรรมเนียมตามประเภทเอกสาร
                   if (documentType === 'studentCertificate' || documentType === '1') {
                       documentFee = 50 * copies;
                   } else if (documentType === 'transcript' || documentType === '2') {
                       documentFee = 100 * copies;
                   } else if (documentType === 'graduationCertificate' || documentType === '3') {
                       documentFee = 100 * copies;
                   }
                   
                   // ค่าจัดส่ง
                   if (deliveryMethod === 'mail') {
                       deliveryFee = 50; // สมมติค่าจัดส่ง 50 บาท
                       document.getElementById('deliveryFeeSection').style.display = 'flex';
                   } else {
                       document.getElementById('deliveryFeeSection').style.display = 'none';
                   }
                   
                   // แสดงค่าธรรมเนียม
                   document.getElementById('documentFee').textContent = `${documentFee.toFixed(2)} บาท`;
                   document.getElementById('deliveryFee').textContent = `${deliveryFee.toFixed(2)} บาท`;
                   document.getElementById('totalFee').textContent = `${(documentFee + deliveryFee).toFixed(2)} บาท`;
               }
// ตัวแปรและฟังก์ชันสำหรับหน้าผู้ดูแลระบบ
let isAdmin = false;
let adminRequests = [];
const adminPage = document.getElementById('adminPage');

// แสดงหน้าผู้ดูแลระบบ
function showAdminPage() {
    if (!isLoggedIn) {
        showLogin();
        showAlert('กรุณาเข้าสู่ระบบ', 'warning');
        return;
    }
    
    if (!isAdmin) {
        showHome();
        showAlert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้', 'danger');
        return;
    }
    
    homePage.style.display = 'none';
    loginPage.style.display = 'none';
    registerPage.style.display = 'none';
    requestPage.style.display = 'none';
    statusPage.style.display = 'none';
    document.getElementById('paymentPage').style.display = 'none';
    adminPage.style.display = 'block';
    
    // โหลดข้อมูลคำขอทั้งหมด
    loadAdminRequests();
}

// เพิ่มเมนู Admin ในกรณีที่เป็นผู้ดูแลระบบ
function updateNavbarForAdmin() {
    const navbarNav = document.querySelector('#navbarNav .navbar-nav');
    
    // ตรวจสอบว่ามีเมนู Admin อยู่แล้วหรือไม่
    if (!document.getElementById('adminLink') && isAdmin) {
        const adminNavItem = document.createElement('li');
        adminNavItem.className = 'nav-item';
        adminNavItem.innerHTML = `
            <a class="nav-link" href="#" id="adminLink">
                <i class="fas fa-user-shield me-1"></i>จัดการระบบ
            </a>
        `;
        navbarNav.appendChild(adminNavItem);
        
        // เพิ่ม Event Listener
        document.getElementById('adminLink').addEventListener('click', (e) => {
            e.preventDefault();
            showAdminPage();
        });
    }
}

// ตรวจสอบว่าผู้ใช้เป็นผู้ดูแลระบบหรือไม่
function checkAdminStatus() {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    fetch('/api/user/profile', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        isAdmin = data.user.is_admin || false;
        updateNavbarForAdmin();
    })
    .catch(error => {
        console.error('Error checking admin status:', error);
    });
}

// โหลดข้อมูลคำขอสำหรับผู้ดูแลระบบ
function loadAdminRequests() {
    document.getElementById('loadingSpinner').style.display = 'flex';
    
    authenticatedFetch('/api/admin/requests')
        .then(response => response.json())
        .then(data => {
            document.getElementById('loadingSpinner').style.display = 'none';
            adminRequests = data;
            
            // นับจำนวนคำขอรอดำเนินการ
            const pendingCount = adminRequests.filter(req => req.status === 'pending').length;
            document.getElementById('pendingRequestCount').textContent = pendingCount;
            
            // แสดงข้อมูลในตาราง
            updateAdminTables();
        })
        .catch(error => {
            document.getElementById('loadingSpinner').style.display = 'none';
            console.error('Error loading admin requests:', error);
            showAlert('เกิดข้อผิดพลาดในการโหลดข้อมูลคำขอ', 'danger');
        });
}

// อัปเดตตารางข้อมูลในแต่ละแท็บ
function updateAdminTables() {
    // แท็บคำขอรอดำเนินการ
    const pendingRequests = adminRequests.filter(req => req.status === 'pending');
    updateAdminTable('pendingRequestsTable', pendingRequests);
    
    // แท็บกำลังดำเนินการ
    const processingRequests = adminRequests.filter(req => req.status === 'processing');
    updateAdminTable('processingRequestsTable', processingRequests);
    
    // แท็บเสร็จสิ้นแล้ว
    const completedRequests = adminRequests.filter(req => req.status === 'completed');
    updateAdminTable('completedRequestsTable', completedRequests);
    
    // แท็บถูกปฏิเสธ
    const rejectedRequests = adminRequests.filter(req => req.status === 'rejected');
    updateAdminTable('rejectedRequestsTable', rejectedRequests);
    
    // แท็บทั้งหมด
    updateAdminTable('allRequestsTable', adminRequests);
}

// อัปเดตข้อมูลในตาราง
function updateAdminTable(tableId, requests) {
    const tableBody = document.getElementById(tableId);
    tableBody.innerHTML = '';
    
    if (requests.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="6" class="text-center">ไม่มีคำขอเอกสาร</td>`;
        tableBody.appendChild(row);
        return;
    }
    
    requests.forEach(request => {
        const row = document.createElement('tr');
        
        // กำหนดสีของ badge ตามสถานะ
        const statusClass = getStatusClass(request.status);
        const statusText = getStatusText(request.status);
        
        // คอลัมน์ที่แสดงขึ้นอยู่กับประเภทตาราง
        if (tableId === 'pendingRequestsTable') {
            row.innerHTML = `
                <td>${request.request_id}</td>
                <td>${new Date(request.request_date).toLocaleDateString('th-TH')}</td>
                <td>${request.document_name}</td>
                <td>${request.first_name} ${request.last_name}</td>
                <td><span class="badge bg-info">รอชำระเงิน</span></td>
                <td>
                    <button class="btn btn-sm btn-info admin-view-details" data-id="${request.request_id}">
                        <i class="fas fa-eye me-1"></i>รายละเอียด
                    </button>
                    <button class="btn btn-sm btn-warning admin-update-status" data-id="${request.request_id}">
                        <i class="fas fa-edit me-1"></i>อัปเดตสถานะ
                    </button>
                </td>
            `;
        } else if (tableId === 'processingRequestsTable') {
            // ค้นหาวันที่เริ่มดำเนินการ
            const processingHistory = request.history?.find(h => h.status === 'processing');
            const processingDate = processingHistory ? new Date(processingHistory.created_at).toLocaleDateString('th-TH') : '-';
            
            row.innerHTML = `
                <td>${request.request_id}</td>
                <td>${new Date(request.request_date).toLocaleDateString('th-TH')}</td>
                <td>${request.document_name}</td>
                <td>${request.first_name} ${request.last_name}</td>
                <td>${processingDate}</td>
                <td>
                    <button class="btn btn-sm btn-info admin-view-details" data-id="${request.request_id}">
                        <i class="fas fa-eye me-1"></i>รายละเอียด
                    </button>
                    <button class="btn btn-sm btn-success admin-update-status" data-id="${request.request_id}">
                        <i class="fas fa-check-circle me-1"></i>ทำเสร็จแล้ว
                    </button>
                </td>
            `;
        } else if (tableId === 'completedRequestsTable') {
            // ค้นหาวันที่เสร็จสิ้น
            const completedHistory = request.history?.find(h => h.status === 'completed');
            const completedDate = completedHistory ? new Date(completedHistory.created_at).toLocaleDateString('th-TH') : '-';
            
            const deliveryMethod = request.delivery_method === 'pickup' ? 'รับด้วยตนเอง' : 'จัดส่งทางไปรษณีย์';
            
            row.innerHTML = `
                <td>${request.request_id}</td>
                <td>${new Date(request.request_date).toLocaleDateString('th-TH')}</td>
                <td>${request.document_name}</td>
                <td>${request.first_name} ${request.last_name}</td>
                <td>${completedDate}</td>
                <td>${deliveryMethod}</td>
                <td>
                    <button class="btn btn-sm btn-info admin-view-details" data-id="${request.request_id}">
                        <i class="fas fa-eye me-1"></i>รายละเอียด
                    </button>
                </td>
            `;
        } else if (tableId === 'rejectedRequestsTable') {
            // ค้นหาข้อมูลการปฏิเสธ
            const rejectedHistory = request.history?.find(h => h.status === 'rejected');
            const rejectedReason = rejectedHistory ? rejectedHistory.comment : '-';
            
            row.innerHTML = `
                <td>${request.request_id}</td>
                <td>${new Date(request.request_date).toLocaleDateString('th-TH')}</td>
                <td>${request.document_name}</td>
                <td>${request.first_name} ${request.last_name}</td>
                <td>${rejectedReason}</td>
                <td>
                    <button class="btn btn-sm btn-info admin-view-details" data-id="${request.request_id}">
                        <i class="fas fa-eye me-1"></i>รายละเอียด
                    </button>
                </td>
            `;
        } else if (tableId === 'allRequestsTable') {
            row.innerHTML = `
                <td>${request.request_id}</td>
                <td>${new Date(request.request_date).toLocaleDateString('th-TH')}</td>
                <td>${request.document_name}</td>
                <td>${request.first_name} ${request.last_name}</td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn btn-sm btn-info admin-view-details" data-id="${request.request_id}">
                        <i class="fas fa-eye me-1"></i>รายละเอียด
                    </button>
                    ${request.status !== 'completed' && request.status !== 'rejected' ? `
                    <button class="btn btn-sm btn-warning admin-update-status" data-id="${request.request_id}">
                        <i class="fas fa-edit me-1"></i>อัปเดตสถานะ
                    </button>
                    ` : ''}
                </td>
            `;
        }
        
        tableBody.appendChild(row);
    });
    
    // เพิ่ม Event Listener สำหรับปุ่มต่างๆ
    document.querySelectorAll('.admin-view-details').forEach(button => {
        button.addEventListener('click', function() {
            const requestId = this.getAttribute('data-id');
            showAdminRequestDetails(requestId);
        });
    });
    
    document.querySelectorAll('.admin-update-status').forEach(button => {
        button.addEventListener('click', function() {
            const requestId = this.getAttribute('data-id');
            showUpdateStatusModal(requestId);
        });
    });
}

// แสดง Modal รายละเอียดคำขอสำหรับผู้ดูแลระบบ
function showAdminRequestDetails(requestId) {
    // ค้นหาข้อมูลคำขอจาก ID
    const request = adminRequests.find(req => req.request_id === requestId);
    if (!request) {
        showAlert('ไม่พบข้อมูลคำขอ', 'danger');
        return;
    }
    
    // แสดงข้อมูลบนหน้าต่าง modal
    document.getElementById('adminModalRequestId').textContent = request.request_id;
    document.getElementById('adminModalRequestDate').textContent = new Date(request.request_date).toLocaleDateString('th-TH');
    document.getElementById('adminModalDocumentType').textContent = request.document_name;
    document.getElementById('adminModalCopies').textContent = request.copies;
    document.getElementById('adminModalPurpose').textContent = request.purpose;
    
    // ข้อมูลนักศึกษา
    document.getElementById('adminModalStudentId').textContent = request.student_id;
    document.getElementById('adminModalStudentName').textContent = `${request.first_name} ${request.last_name}`;
    document.getElementById('adminModalStudentEmail').textContent = request.email;
    document.getElementById('adminModalStudentPhone').textContent = request.phone || '-';
    document.getElementById('adminModalStudentFaculty').textContent = request.faculty || '-';
    
    // แสดงสถานะปัจจุบัน
    const adminModalStatus = document.getElementById('adminModalStatus');
    adminModalStatus.textContent = getStatusText(request.status);
    adminModalStatus.className = `badge ${getStatusClass(request.status)}`;
    
    // แสดงวิธีการรับเอกสาร
    let deliveryMethodText = '';
    if (request.delivery_method === 'pickup') {
        deliveryMethodText = 'รับด้วยตนเองที่มหาวิทยาลัย';
        document.getElementById('adminModalAddressDiv').style.display = 'none';
    } else if (request.delivery_method === 'mail') {
        deliveryMethodText = 'จัดส่งทางไปรษณีย์';
        document.getElementById('adminModalAddressDiv').style.display = 'block';
        document.getElementById('adminModalAddress').textContent = `${request.address} ${request.district} ${request.province} ${request.postal_code}`;
    }
    document.getElementById('adminModalDeliveryMethod').textContent = deliveryMethodText;
    
    // ข้อมูลการชำระเงิน (สมมติว่ามีการชำระเงินแล้ว)
    document.getElementById('adminModalPaymentStatus').textContent = 'ชำระเงินแล้ว';
    document.getElementById('adminModalPaymentStatus').className = 'badge bg-success';
    document.getElementById('adminModalPaymentMethod').textContent = 'โอนเงินผ่านธนาคาร';
    document.getElementById('adminModalPaymentAmount').textContent = calculateTotalFee(request);
    document.getElementById('adminModalPaymentDate').textContent = new Date().toLocaleDateString('th-TH');
    
    // แสดงประวัติการดำเนินการ
    const timelineContainer = document.getElementById('adminModalTimeline');
    timelineContainer.innerHTML = '';
    
    if (request.history && request.history.length > 0) {
        request.history.forEach(item => {
            const stepElement = document.createElement('div');
            stepElement.className = `progress-step ${item.status === request.status ? 'active' : 'completed'}`;
            
            const dateTime = new Date(item.created_at).toLocaleString('th-TH');
            
            stepElement.innerHTML = `
                <h6>${getStatusText(item.status)}</h6>
                <p class="text-muted">${dateTime}</p>
                ${item.comment ? `<p>${item.comment}</p>` : ''}
            `;
            
            timelineContainer.appendChild(stepElement);
        });
    } else {
        timelineContainer.innerHTML = '<p>ไม่มีข้อมูลประวัติการดำเนินการ</p>';
    }
    
    // สร้างลิงก์ดูไฟล์แนบ
    document.getElementById('adminModalIdCardLink').href = `/uploads/${request.id_card_file}`;
    
    // ซ่อน/แสดงส่วนของหลักฐานการชำระเงิน
    document.getElementById('adminModalSlipSection').style.display = 'none'; // สมมติว่ายังไม่มีไฟล์
    
    // Event Listener สำหรับปุ่มอัปเดตสถานะ
    document.getElementById('adminUpdateStatusBtn').addEventListener('click', function() {
        showUpdateStatusModal(request.request_id);
        
        // ปิด Modal รายละเอียด
        const adminRequestDetailModal = bootstrap.Modal.getInstance(document.getElementById('adminRequestDetailModal'));
        adminRequestDetailModal.hide();
    });
    
    // แสดง modal
    const adminRequestDetailModal = new bootstrap.Modal(document.getElementById('adminRequestDetailModal'));
    adminRequestDetailModal.show();
}

// แสดง Modal อัปเดตสถานะคำขอ
function showUpdateStatusModal(requestId) {
    // ค้นหาข้อมูลคำขอจาก ID
    const request = adminRequests.find(req => req.request_id === requestId);
    if (!request) {
        showAlert('ไม่พบข้อมูลคำขอ', 'danger');
        return;
    }
    
    // แสดงข้อมูลบนหน้าต่าง modal
    document.getElementById('updateRequestId').value = request.request_id;
    document.getElementById('updateModalRequestId').textContent = request.request_id;
    document.getElementById('updateModalDocumentType').textContent = request.document_name;
    document.getElementById('updateModalStudent').textContent = `${request.first_name} ${request.last_name}`;
    
    const updateModalCurrentStatus = document.getElementById('updateModalCurrentStatus');
    updateModalCurrentStatus.textContent = getStatusText(request.status);
    updateModalCurrentStatus.className = `badge ${getStatusClass(request.status)}`;
    
    // ตั้งค่าตัวเลือกสถานะที่สามารถเลือกได้
    const newStatusSelect = document.getElementById('newStatus');
    
    // ลบตัวเลือกเดิมทั้งหมด
    newStatusSelect.innerHTML = '<option value="" selected disabled>เลือกสถานะ</option>';
    
    // เพิ่มตัวเลือกตามสถานะปัจจุบัน
    if (request.status === 'pending') {
        newStatusSelect.innerHTML += `
            <option value="processing">กำลังดำเนินการ</option>
            <option value="rejected">ปฏิเสธคำขอ</option>
        `;
    } else if (request.status === 'processing') {
        newStatusSelect.innerHTML += `
            <option value="completed">เสร็จสิ้น</option>
            <option value="rejected">ปฏิเสธคำขอ</option>
        `;
    }
    
    // รีเซ็ตฟอร์ม
    document.getElementById('statusComment').value = '';
    
    // แสดง modal
    const updateStatusModal = new bootstrap.Modal(document.getElementById('updateStatusModal'));
    updateStatusModal.show();
}

// คำนวณค่าธรรมเนียมทั้งหมด
function calculateTotalFee(request) {
    let documentFee = 0;
    
    // กำหนดค่าธรรมเนียมตามประเภทเอกสาร
    if (request.document_type_id === 1 || request.document_name.includes('นักศึกษา')) {
        documentFee = 50 * request.copies;
    } else {
        documentFee = 100 * request.copies;
    }
    
    // ค่าจัดส่ง
    const deliveryFee = request.delivery_method === 'mail' ? 50 : 0;
    
    return `${(documentFee + deliveryFee).toFixed(2)} บาท`;
}

// บันทึกการอัปเดตสถานะ
document.getElementById('saveStatusBtn').addEventListener('click', function() {
    const requestId = document.getElementById('updateRequestId').value;
    const newStatus = document.getElementById('newStatus').value;
    const comment = document.getElementById('statusComment').value;
    
    if (!newStatus) {
        showAlert('กรุณาเลือกสถานะ', 'warning');
        return;
    }
    
    if (newStatus === 'rejected' && !comment) {
        showAlert('กรุณาระบุเหตุผลในการปฏิเสธคำขอ', 'warning');
        return;
    }
    
    // แสดงการโหลด
    document.getElementById('loadingSpinner').style.display = 'flex';
    
    // ส่งคำขออัปเดตสถานะไปยัง API
    authenticatedFetch(`/api/admin/requests/${requestId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: newStatus,
            comment: comment
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('loadingSpinner').style.display = 'none';
        
        if (data.message) {
            // ปิด Modal
            const updateStatusModal = bootstrap.Modal.getInstance(document.getElementById('updateStatusModal'));
            updateStatusModal.hide();
            
            // โหลดข้อมูลใหม่
            loadAdminRequests();
            
            showAlert(`อัปเดตสถานะสำเร็จ: ${getStatusText(newStatus)}`, 'success');
        } else {
            showAlert('เกิดข้อผิดพลาดในการอัปเดตสถานะ', 'danger');
        }
    })
    .catch(error => {
        console.error('Error updating status:', error);
        document.getElementById('loadingSpinner').style.display = 'none';
        showAlert('เกิดข้อผิดพลาดในการอัปเดตสถานะ', 'danger');
    });
});

// อัปเดตฟังก์ชันตรวจสอบสถานะผู้ใช้หลังจากล็อกอิน
document.addEventListener('DOMContentLoaded', function() {
    // เพิ่มการเรียกใช้ฟังก์ชันตรวจสอบสถานะผู้ดูแลระบบ
    const token = localStorage.getItem('authToken');
    if (token) {
        checkAdminStatus();
    }
});

// อัปเดตฟังก์ชัน updateLoginButton
function updateLoginButton() {
    if (isLoggedIn) {
        loginBtn.textContent = 'ออกจากระบบ';
        loginBtn.classList.remove('btn-light');
        loginBtn.classList.add('btn-outline-light');
        
        // ตรวจสอบสถานะผู้ดูแลระบบเมื่อล็อกอินสำเร็จ
        checkAdminStatus();
    } else {
        loginBtn.textContent = 'เข้าสู่ระบบ';
        loginBtn.classList.remove('btn-outline-light');
        loginBtn.classList.add('btn-light');
        
        isAdmin = false;
        
        // ลบเมนูผู้ดูแลระบบ
        const adminLink = document.getElementById('adminLink');
        if (adminLink) {
            adminLink.parentElement.remove();
        }
    }
}

// อัปเดตฟังก์ชันการค้นหาคำขอ
document.getElementById('pendingSearchInput').addEventListener('keyup', function() {
    filterRequests('pendingRequestsTable', this.value, adminRequests.filter(req => req.status === 'pending'));
});

document.getElementById('processingSearchInput').addEventListener('keyup', function() {
    filterRequests('processingRequestsTable', this.value, adminRequests.filter(req => req.status === 'processing'));
});

document.getElementById('completedSearchInput').addEventListener('keyup', function() {
    filterRequests('completedRequestsTable', this.value, adminRequests.filter(req => req.status === 'completed'));
});

document.getElementById('rejectedSearchInput').addEventListener('keyup', function() {
    filterRequests('rejectedRequestsTable', this.value, adminRequests.filter(req => req.status === 'rejected'));
});

document.getElementById('allSearchInput').addEventListener('keyup', function() {
    filterRequests('allRequestsTable', this.value, adminRequests);
});

// ฟังก์ชันกรองข้อมูลคำขอตามคำค้นหา
function filterRequests(tableId, searchText, requests) {
    if (!searchText) {
        // ถ้าไม่มีคำค้นหา แสดงข้อมูลทั้งหมด
        updateAdminTable(tableId, requests);
        return;
    }
    
    searchText = searchText.toLowerCase();
    
    // กรองข้อมูลตามคำค้นหา
    const filteredRequests = requests.filter(req => 
        req.request_id.toLowerCase().includes(searchText) ||
        req.document_name.toLowerCase().includes(searchText) ||
        req.first_name.toLowerCase().includes(searchText) ||
        req.last_name.toLowerCase().includes(searchText) ||
        `${req.first_name} ${req.last_name}`.toLowerCase().includes(searchText)
    );
    
    // อัปเดตตาราง
    updateAdminTable(tableId, filteredRequests);
}

// เพิ่มการจัดการการพิมพ์รายละเอียดคำขอสำหรับผู้ดูแลระบบ
document.getElementById('adminPrintRequestBtn').addEventListener('click', function() {
    const printContents = document.querySelector('#adminRequestDetailModal .modal-body').innerHTML;
    const originalContents = document.body.innerHTML;
    
    document.body.innerHTML = `
        <div class="container mt-4">
            <h3 class="text-center mb-4">รายละเอียดคำขอเอกสาร</h3>
            ${printContents}
        </div>
    `;
    
    window.print();
    
    document.body.innerHTML = originalContents;
    
    // จำเป็นต้องสร้าง modal และเพิ่ม event listener ใหม่หลังจากแทนที่ HTML ทั้งหมด
    const adminRequestDetailModal = new bootstrap.Modal(document.getElementById('adminRequestDetailModal'));
    adminRequestDetailModal.show();
    
    // เพิ่ม event listener ใหม่
    document.getElementById('adminUpdateStatusBtn').addEventListener('click', function() {
        const requestId = document.getElementById('adminModalRequestId').textContent;
        showUpdateStatusModal(requestId);
        
        // ปิด Modal รายละเอียด
        adminRequestDetailModal.hide();
    });
    
    document.getElementById('adminPrintRequestBtn').addEventListener('click', function() {
        // ฟังก์ชันพิมพ์
    });
});
          // แสดงหน้าหลักเมื่อโหลดเว็บเสร็จ
          showHome();
});
