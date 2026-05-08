document.addEventListener('DOMContentLoaded', async () => {
    // 1. Fetch Session from API (No more localStorage)
    let currentUser = null;
    let currentUserId = null;
    
    try {
        const res = await fetch('/api/users/session', { credentials: 'same-origin' });
        if (res.ok) {
            const data = await res.json();
            currentUser = data.username;
            currentUserId = data.user_id;
        }
    } catch (e) {
        console.error("No se pudo verificar la sesión", e);
    }

    // Nav update logic
    function updateNav() {
        const authButtons = document.querySelector('.auth-buttons');
        const userMenu = document.getElementById('userMenu');
        const navUsername = document.getElementById('navUsername');
        
        if (currentUser && authButtons && userMenu) {
            authButtons.style.display = 'none';
            userMenu.style.display = 'inline-block';
            if (navUsername) navUsername.textContent = currentUser;
        }
    }
    
    updateNav();

    // Dropdown toggle
    const userDropdownBtn = document.getElementById('userDropdownBtn');
    if (userDropdownBtn) {
        userDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('userMenu').classList.toggle('show');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        const userMenu = document.getElementById('userMenu');
        if (userMenu && userMenu.classList.contains('show')) {
            userMenu.classList.remove('show');
        }
    });

    // 2. Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const header = document.querySelector('header');
    
    if (menuToggle && header) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            header.classList.toggle('mobile-nav-active');
        });

        // Close menu when clicking links
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                header.classList.remove('mobile-nav-active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!header.contains(e.target) && header.classList.contains('mobile-nav-active')) {
                header.classList.remove('mobile-nav-active');
            }
        });
    }

    // Logout logic
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await fetch('/api/users/logout', { method: 'POST', credentials: 'same-origin' });
                window.location.reload();
            } catch (err) {
                console.error(err);
            }
        });
    }

    // Adopt buttons logic
    function attachAdoptButtonsListeners() {
        const adoptButtons = document.querySelectorAll('.adopt-btn');
        if (adoptButtons.length > 0) {
            adoptButtons.forEach(btn => {
                // Remove existing listener to avoid duplicates
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                newBtn.addEventListener('click', async (e) => {
                    const catName = e.target.getAttribute('data-cat-name');
                    const catId = e.target.getAttribute('data-cat-id');
                    
                    if (currentUser && currentUserId) {
                        try {
                            const res = await fetch('/api/adoptions/solicitud', {
                                method: 'POST',
                                credentials: 'same-origin',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id_user: currentUserId, id_cat: catId })
                            });
                            const data = await res.json();
                            if (res.ok) {
                                Swal.fire({
                                    title: '¡Proceso Iniciado!',
                                    text: `¡Felicidades ${currentUser}! Hemos iniciado tu proceso de adopción para ${catName}. Nos pondremos en contacto contigo muy pronto.`,
                                    icon: 'success',
                                    confirmButtonColor: '#AED4BD'
                                });
                            } else {
                                Swal.fire('Error', data.message || 'Error al solicitar adopción', 'error');
                            }
                        } catch (error) {
                            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
                        }
                    } else {
                        Swal.fire({
                            title: 'Inicia sesión',
                            text: `¡Gracias por tu interés en ${catName}! Por favor inicia sesión o regístrate para poder adoptar.`,
                            icon: 'info',
                            showCancelButton: true,
                            confirmButtonText: 'Iniciar Sesión',
                            cancelButtonText: 'Cancelar',
                            confirmButtonColor: '#AED4BD'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = '/login';
                            }
                        });
                    }
                });
            });
        }
    }

    async function loadAdoptableCats() {
        const catsGrid = document.getElementById('catsGrid');
        if (!catsGrid) return;
        
        catsGrid.innerHTML = '<p style="text-align:center; width:100%;">Cargando michis disponibles...</p>';
        
        try {
            const resCats = await fetch('/api/cats', { credentials: 'same-origin' });
            const dataCats = await resCats.json();
            
            let allAdoptables = [];
            
            if (dataCats.gatos) {
                const disponibles = dataCats.gatos.filter(g => g.estado === 'disponible');
                allAdoptables = disponibles.map(g => ({
                    id: g.id_cat,
                    name: g.name,
                    age: g.age + (g.age === 1 ? ' año' : ' años'),
                    desc: g.description,
                    img: g.img_url,
                    type: 'cat'
                }));
            }
            
            catsGrid.innerHTML = '';
            
            if (allAdoptables.length === 0) {
                catsGrid.innerHTML = '<p style="text-align:center; width:100%;">En este momento no hay gatitos disponibles para adopción. ¡Vuelve pronto!</p>';
                return;
            }
            
            allAdoptables.forEach(cat => {
                const card = document.createElement('div');
                card.className = 'cat-card';
                card.innerHTML = `
                    <img src="${cat.img || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80'}" alt="${cat.name}">
                    <div class="cat-info">
                        <h3>${cat.name}</h3>
                        <p class="cat-age">${cat.age}</p>
                        <p class="cat-desc">${cat.desc}</p>
                        <button class="btn btn-primary btn-full adopt-btn" data-cat-name="${cat.name}" data-cat-id="${cat.id}" data-cat-type="${cat.type}">Adoptar a ${cat.name}</button>
                    </div>
                `;
                catsGrid.appendChild(card);
            });
            
            attachAdoptButtonsListeners();
            
        } catch (error) {
            console.error(error);
            catsGrid.innerHTML = '<p style="text-align:center; width:100%; color:red;">Error al cargar los gatitos.</p>';
        }
    }

    loadAdoptableCats();

    const rehomeForm = document.getElementById('rehomeForm');
    const catsGrid = document.getElementById('catsGrid');

    if (rehomeForm) {
        const step1 = document.getElementById('step1');
        const step2 = document.getElementById('step2');
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const ownerName = document.getElementById('ownerName');
        const ownerPhone = document.getElementById('ownerPhone');
        const ownerEmail = document.getElementById('ownerEmail');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (ownerName.checkValidity() && ownerPhone.checkValidity() && ownerEmail.checkValidity()) {
                    step1.style.display = 'none';
                    step2.style.display = 'block';
                } else {
                    rehomeForm.reportValidity();
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                step2.style.display = 'none';
                step1.style.display = 'block';
            });
        }

        rehomeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const catName = document.getElementById('catName').value;
            const catAge = document.getElementById('catAge') ? document.getElementById('catAge').value : 0;
            const catDescription = document.getElementById('catDescription') ? document.getElementById('catDescription').value : '';
            const finalOwnerName = ownerName.value || 'Amigo/a';
            const catPhotoFile = document.getElementById('catPhotoFile') ? document.getElementById('catPhotoFile').files[0] : null;

            if (!currentUserId) {
                Swal.fire('Error', 'Debes iniciar sesión para dar en adopción', 'error');
                return;
            }
            
            if (!catPhotoFile) {
                Swal.fire('Error', 'Debes subir una foto del gatito', 'error');
                return;
            }

            const formData = new FormData();
            formData.append('id_user', currentUserId);
            formData.append('cat_name', catName);
            formData.append('cat_age', catAge);
            formData.append('cat_description', catDescription);
            formData.append('foto-gato', catPhotoFile);

            Swal.fire({
                title: 'Subiendo información...',
                text: 'Estamos enviando la foto de forma segura',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                const res = await fetch('/api/rehomes/solicitud', {
                    method: 'POST',
                    credentials: 'same-origin',
                    body: formData
                });
                const data = await res.json();
                if (res.ok) {
                    Swal.fire({
                        title: '¡Solicitud Recibida!',
                        text: `Hola ${finalOwnerName}, hemos recibido los datos de ${catName}. Tu solicitud se encuentra EN ESPERA y será revisada por nuestro equipo. Nos pondremos en contacto contigo pronto.`,
                        icon: 'info',
                        confirmButtonColor: '#AED4BD',
                        confirmButtonText: 'Entendido'
                    });
                    rehomeForm.reset();
                    step2.style.display = 'none';
                    step1.style.display = 'block';
                } else {
                    Swal.fire('Error', data.message || 'Error al procesar la solicitud', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
            }
        });
    }

    const donationForm = document.getElementById('donationForm');
    const amountRadios = document.querySelectorAll('input[name="amount"]');
    const customAmountGroup = document.getElementById('customAmountGroup');
    const customAmountInput = document.getElementById('customAmount');

    if (amountRadios.length > 0) {
        amountRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'custom') {
                    customAmountGroup.style.display = 'block';
                    customAmountInput.required = true;
                } else {
                    customAmountGroup.style.display = 'none';
                    customAmountInput.required = false;
                }
            });
        });
    }

    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const cardDetailsGroup = document.getElementById('cardDetailsGroup');
    const paypalDetailsGroup = document.getElementById('paypalDetailsGroup');
    const cardNumber = document.getElementById('cardNumber');
    const cardExpiry = document.getElementById('cardExpiry');
    const cardCvc = document.getElementById('cardCvc');
    const paypalEmail = document.getElementById('paypalEmail');

    if (paymentRadios.length > 0) {
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'card') {
                    if (cardDetailsGroup) cardDetailsGroup.style.display = 'block';
                    if (paypalDetailsGroup) paypalDetailsGroup.style.display = 'none';
                    if (cardNumber) cardNumber.required = true;
                    if (cardExpiry) cardExpiry.required = true;
                    if (cardCvc) cardCvc.required = true;
                    if (paypalEmail) paypalEmail.required = false;
                } else {
                    if (cardDetailsGroup) cardDetailsGroup.style.display = 'none';
                    if (paypalDetailsGroup) paypalDetailsGroup.style.display = 'block';
                    if (cardNumber) cardNumber.required = false;
                    if (cardExpiry) cardExpiry.required = false;
                    if (cardCvc) cardCvc.required = false;
                    if (paypalEmail) paypalEmail.required = true;
                }
            });
        });
    }

    if (donationForm) {
        const donorNameInput = document.getElementById('donorName');
        
        if (currentUser && donorNameInput) {
            donorNameInput.value = currentUser;
        }

        donationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!currentUserId) {
                Swal.fire({
                    title: 'Inicia sesión',
                    text: '¡Muchas gracias por tu intención de apoyar! Por favor, inicia sesión o regístrate para poder realizar una donación.',
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Iniciar Sesión',
                    cancelButtonText: 'Más tarde',
                    confirmButtonColor: '#AED4BD'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/login';
                    }
                });
                return;
            }
            
            const selectedAmount = document.querySelector('input[name="amount"]:checked').value;
            let finalAmount = selectedAmount;
            
            if (selectedAmount === 'custom') {
                finalAmount = document.getElementById('customAmount').value;
            }
            
            const name = donorNameInput.value;
            const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
            
            Swal.fire({
                title: 'Procesando Donación...',
                html: `Conectando de forma segura con ${paymentMethod === 'card' ? 'el banco' : 'PayPal'}...`,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                const res = await fetch('/api/donations', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_user: currentUserId || null, amount: finalAmount, payment_method: paymentMethod })
                });
                const data = await res.json();
                if (res.ok) {
                    Swal.fire({
                        title: '¡Donación Exitosa!',
                        text: `¡Mil gracias ${name} por tu donación de $${finalAmount}! Este dinero irá directamente al cuidado y rescate de nuestros gatitos.`,
                        icon: 'success',
                        confirmButtonColor: '#AED4BD'
                    });
                    
                    donationForm.reset();
                    customAmountGroup.style.display = 'none';
                    customAmountInput.required = false;
                    
                    if (cardDetailsGroup) cardDetailsGroup.style.display = 'block';
                    if (paypalDetailsGroup) paypalDetailsGroup.style.display = 'none';
                    if (cardNumber) cardNumber.required = true;
                    if (cardExpiry) cardExpiry.required = true;
                    if (cardCvc) cardCvc.required = true;
                    if (paypalEmail) paypalEmail.required = false;

                    const defaultRadio = document.querySelector('input[name="amount"][value="20"]');
                    if (defaultRadio) defaultRadio.checked = true;
                    const defaultPayment = document.querySelector('input[name="payment"][value="card"]');
                    if (defaultPayment) defaultPayment.checked = true;

                    if (currentUser && donorNameInput) donorNameInput.value = currentUser; 
                } else {
                    Swal.fire('Error', data.message || 'Error al procesar la donación', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
            }
        });
    }

    // Auth Forms Logic
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password') ? document.getElementById('password').value : '123456'; 
            
            try {
                const res = await fetch('/api/users/login', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                
                if (res.ok) {
                    Swal.fire({
                        title: '¡Bienvenido de vuelta!',
                        text: `Hola ${username}, has iniciado sesión correctamente.`,
                        icon: 'success',
                        confirmButtonColor: '#AED4BD'
                    }).then(() => {
                        if (data.usuario && (data.usuario.role === 'admin' || data.usuario.rol === 'admin')) {
                            window.location.href = '/admin';
                        } else {
                            window.location.href = '/';
                        }
                    });
                } else {
                    Swal.fire('Error', data.message || 'Credenciales inválidas', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullname = document.getElementById('fullname').value;
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            
            try {
                const res = await fetch('/api/users/registro', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullname, username, email, phone, password })
                });
                const data = await res.json();
                
                if (res.ok) {
                    Swal.fire({
                        title: '¡Registro exitoso!',
                        text: `Bienvenido a la familia Felinoo, ${fullname.split(' ')[0]}. Tu cuenta ha sido creada.`,
                        icon: 'success',
                        confirmButtonColor: '#AED4BD'
                    }).then(() => {
                        window.location.href = '/login';
                    });
                } else {
                    Swal.fire('Error', data.message || 'Error al registrar', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
            }
        });
    }
});
