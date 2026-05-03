document.addEventListener('DOMContentLoaded', () => {
    // Nav update logic
    function updateNav() {
        const user = localStorage.getItem('felinoo_user');
        const authButtons = document.querySelector('.auth-buttons');
        const userMenu = document.getElementById('userMenu');
        const navUsername = document.getElementById('navUsername');
        
        if (user && authButtons && userMenu) {
            authButtons.style.display = 'none';
            userMenu.style.display = 'inline-block';
            if (navUsername) navUsername.textContent = user;
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

    // Logout logic
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('felinoo_user');
            window.location.reload();
        });
    }

    // Adopt buttons logic
    const adoptButtons = document.querySelectorAll('.adopt-btn');
    if (adoptButtons.length > 0) {
        adoptButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const catName = e.target.getAttribute('data-cat-name');
                const user = localStorage.getItem('felinoo_user');
                
                if (user) {
                    Swal.fire({
                        title: '¡Proceso Iniciado!',
                        text: `¡Felicidades ${user}! Hemos iniciado tu proceso de adopción para ${catName}. Nos pondremos en contacto contigo muy pronto.`,
                        icon: 'success',
                        confirmButtonColor: '#AED4BD'
                    });
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

        rehomeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('catName').value;
            const finalOwnerName = ownerName.value || 'Amigo/a';

            Swal.fire({
                title: '¡Solicitud Recibida!',
                text: `Hola ${finalOwnerName}, hemos recibido los datos de ${name}. Tu solicitud se encuentra EN ESPERA y será revisada por nuestro equipo. Nos pondremos en contacto contigo pronto.`,
                icon: 'info',
                confirmButtonColor: '#AED4BD',
                confirmButtonText: 'Entendido'
            });
            rehomeForm.reset();
            step2.style.display = 'none';
            step1.style.display = 'block';
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
        const user = localStorage.getItem('felinoo_user');
        
        if (user && donorNameInput) {
            donorNameInput.value = user;
        }

        donationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const selectedAmount = document.querySelector('input[name="amount"]:checked').value;
            let finalAmount = selectedAmount;
            
            if (selectedAmount === 'custom') {
                finalAmount = document.getElementById('customAmount').value;
            }
            
            const name = donorNameInput.value;
            const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
            
            let paymentText = 'PayPal';
            if (paymentMethod === 'card') {
                const cardNum = cardNumber ? cardNumber.value : '';
                const last4 = cardNum.slice(-4) || '****';
                paymentText = `Tarjeta terminada en ${last4}`;
            }
            
            Swal.fire({
                title: 'Procesando Donación...',
                html: `Conectando de forma segura con ${paymentMethod === 'card' ? 'el banco' : 'PayPal'}...`,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            setTimeout(() => {
                Swal.fire({
                    title: '¡Donación Exitosa!',
                    text: `¡Mil gracias ${name} por tu donación de $${finalAmount}! Este dinero irá directamente al cuidado y rescate de nuestros gatitos.`,
                    icon: 'success',
                    confirmButtonColor: '#AED4BD'
                });
                
                donationForm.reset();
                customAmountGroup.style.display = 'none';
                customAmountInput.required = false;
                
                // Reset to default payment
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

                if (user && donorNameInput) donorNameInput.value = user; // keep it filled
            }, 2000);
        });
    }

    // Auth Forms Logic
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            
            // Save mock session
            localStorage.setItem('felinoo_user', username);
            
            Swal.fire({
                title: '¡Bienvenido de vuelta!',
                text: `Hola ${username}, has iniciado sesión correctamente.`,
                icon: 'success',
                confirmButtonColor: '#AED4BD'
            }).then(() => {
                window.location.href = '/';
            });
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullname = document.getElementById('fullname').value.split(' ')[0]; // Gets first name
            
            Swal.fire({
                title: '¡Registro exitoso!',
                text: `Bienvenido a la familia Felinoo, ${fullname}. Tu cuenta ha sido creada.`,
                icon: 'success',
                confirmButtonColor: '#AED4BD'
            }).then(() => {
                window.location.href = '/login';
            });
        });
    }
});
