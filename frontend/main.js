document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');
    
    const validateNom = () => {
        const nom = document.getElementById('nom').value.trim();
        const nomError = document.getElementById('nomError');
        
        if (nom.length < 3) {
            nomError.style.display = 'block';
            return false;
        } else {
            nomError.style.display = 'none';
            return true;
        }
    };
    
    const validateDate = () => {
        const dateNaissance = document.getElementById('dateNaissance').value.trim();
        const dateError = document.getElementById('dateError');
        
        const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
        const match = dateNaissance.match(dateRegex);
        
        if (!match) {
            dateError.style.display = 'block';
            return false;
        }
        
        const annee = parseInt(match[1], 10);
        const mois = parseInt(match[2], 10);
        const jour = parseInt(match[3], 10);
        
        if (mois < 1 || mois > 12) {
            dateError.style.display = 'block';
            return false;
        }
        
        const date = new Date(annee, mois - 1, jour);
        if (date.getFullYear() !== annee || date.getMonth() !== mois - 1 || date.getDate() !== jour) {
            dateError.style.display = 'block';
            return false;
        }
        
        dateError.style.display = 'none';
        return true;
    };
    
    const validateTelephone = () => {
        const telephone = document.getElementById('telephone').value.trim();
        const telephoneError = document.getElementById('telephoneError');
        
        if (!/^[2-5]\d{7}$/.test(telephone)) {
            telephoneError.style.display = 'block';
            return false;
        } else {
            telephoneError.style.display = 'none';
            return true;
        }
    };
    
    document.getElementById('nom').addEventListener('input', validateNom);
    document.getElementById('dateNaissance').addEventListener('input', validateDate);
    document.getElementById('telephone').addEventListener('input', validateTelephone);
    
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        console.log('Form submission intercepted');
        
        const isNomValid = validateNom();
        const isDateValid = validateDate();
        const isTelephoneValid = validateTelephone();
        
        if (isNomValid && isDateValid && isTelephoneValid) {
            const formData = {
                nom: document.getElementById('nom').value.trim(),
                date_naissance: document.getElementById('dateNaissance').value.trim(),
                telephone: document.getElementById('telephone').value.trim()
            };
            
            console.log('Validation passed, sending data:', formData);
            sendFormData(formData);
        } else {
            console.log('Validation failed');
            return false; 
        }
        
        return false;
    });
    
    function sendFormData(data) {
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Envoi en cours...';
        
        const apiUrl = 'http://127.0.0.1:8000/api-auth/register';
        
        console.log('Starting fetch to:', apiUrl);
        
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            console.log('Received response:', response.status);
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw { status: response.status, errors: errorData.errors || { global: errorData.error || 'Erreur serveur' } };
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            
            successMessage.style.display = 'block';
            successMessage.textContent = data.message || 'Formulaire soumis avec succès!';
            
            form.reset();
            
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 7000);
        })
        .catch(error => {
            console.error('Error:', error);
            
            if (error.errors) {
                document.querySelectorAll('.error').forEach(el => el.style.display = 'none');
                
                if (error.errors.nom) {
                    const nomError = document.getElementById('nomError');
                    nomError.textContent = error.errors.nom;
                    nomError.style.display = 'block';
                }
                
                if (error.errors.dateNaissance) {
                    const dateError = document.getElementById('dateError');
                    dateError.textContent = error.errors.dateNaissance;
                    dateError.style.display = 'block';
                }
                
                if (error.errors.telephone) {
                    const telephoneError = document.getElementById('telephoneError');
                    telephoneError.textContent = error.errors.telephone;
                    telephoneError.style.display = 'block';
                }
                
                if (error.errors.global) {
                    successMessage.style.display = 'block';
                    successMessage.style.backgroundColor = '#f8d7da';
                    successMessage.style.color = '#721c24';
                    successMessage.textContent = error.errors.global;
                }
            } else {
                successMessage.style.display = 'block';
                successMessage.style.backgroundColor = '#f8d7da';
                successMessage.style.color = '#721c24';
                successMessage.textContent = 'Erreur lors de l\'envoi du formulaire. Veuillez réessayer.';
            }
            
            if (successMessage.style.display === 'block') {
                setTimeout(() => {
                    successMessage.style.display = 'none';
                    successMessage.style.backgroundColor = '#d4edda';
                    successMessage.style.color = '#155724';
                }, 5000);
            }
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Soumettre';
            console.log('Request completed');
        });
    }
});