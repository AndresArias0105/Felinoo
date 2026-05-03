document.addEventListener('DOMContentLoaded', () => {
    const rehomeForm = document.getElementById('rehomeForm');
    const catsGrid = document.getElementById('catsGrid');

    if (rehomeForm) {
        rehomeForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evitar que la página recargue

            // Obtener valores del formulario
            const name = document.getElementById('catName').value;
            const age = document.getElementById('catAge').value;
            const desc = document.getElementById('catDesc').value;
            const photoInput = document.getElementById('catPhotoURL').value;
            
            // Usar una imagen por defecto si no se proporciona una
            const photoURL = photoInput.trim() !== '' ? photoInput : 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

            // Crear una nueva tarjeta (simulación local)
            const newCard = document.createElement('div');
            newCard.classList.add('cat-card');
            
            newCard.innerHTML = `
                <img src="${photoURL}" alt="${name}">
                <div class="cat-info">
                    <h3>${name}</h3>
                    <p class="cat-age">${age}</p>
                    <p class="cat-desc">${desc}</p>
                    <button class="btn btn-primary btn-full" onclick="alert('¡Gracias por tu interés en ${name}! Por favor regístrate para iniciar el proceso.')">Adoptar a ${name}</button>
                </div>
            `;

            // Agregar la tarjeta al principio de la cuadrícula
            catsGrid.insertBefore(newCard, catsGrid.firstChild);

            // Mostrar mensaje de éxito y resetear formulario
            alert(`¡${name} ha sido puesto en adopción exitosamente! Aparecerá en la lista de disponibles.`);
            rehomeForm.reset();
            
            // Hacer scroll hacia la sección de adopción para ver el nuevo gatito
            if(document.getElementById('adopt')) {
                document.getElementById('adopt').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Donation Form Logic
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

    if (donationForm) {
        donationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const selectedAmount = document.querySelector('input[name="amount"]:checked').value;
            let finalAmount = selectedAmount;
            
            if (selectedAmount === 'custom') {
                finalAmount = document.getElementById('customAmount').value;
            }
            
            const name = document.getElementById('donorName').value;
            const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
            
            const paymentText = paymentMethod === 'card' ? 'Tarjeta de Crédito/Débito' : 'PayPal';
            
            alert(`¡Gracias ${name} por tu generosa donación de $${finalAmount}!\nSerás redirigido a la plataforma de pago (${paymentText}).`);
            
            donationForm.reset();
            // Reset custom amount visibility
            customAmountGroup.style.display = 'none';
            customAmountInput.required = false;
            // Set default amount back to 20
            const defaultRadio = document.querySelector('input[name="amount"][value="20"]');
            if (defaultRadio) defaultRadio.checked = true;
        });
    }
});
