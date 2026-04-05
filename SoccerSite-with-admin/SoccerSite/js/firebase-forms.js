// ============================================================
// ACADEMY FC — FIREBASE FORMS
// Handles: Registration form → Firestore
//          Contact form      → Firestore
// This file is included on register.html and contact.html
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // REGISTRATION FORM
  // ============================================================
  const regForm = document.getElementById('registrationForm');
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = regForm.querySelector('button[type="submit"]') ||
                  regForm.querySelector('.btn-primary');
      const originalText = btn ? btn.innerHTML : '';
      if (btn) {
        btn.disabled   = true;
        btn.innerHTML  = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
      }

      try {
        const data = {
          playerName:   getValue('playerName'),
          dob:          getValue('dob'),
          ageGroup:     getValue('ageGroup'),
          position:     getValue('position'),
          parentName:   getValue('parentName'),
          email:        getValue('email'),
          phone:        getValue('phone'),
          previousClub: getValue('previousClub'),
          medicalNotes: getValue('medicalNotes'),
          howHeard:     getValue('howHeard'),
          status:       'new',
          submittedAt:  firebase.firestore.FieldValue.serverTimestamp(),
        };

        await db.collection('registrations').add(data);

        // Show success message
        regForm.innerHTML = `
          <div style="text-align:center;padding:48px 24px;">
            <div style="font-size:3rem;color:#28a745;margin-bottom:16px;">
              <i class="fas fa-check-circle"></i>
            </div>
            <h3 style="font-family:'Montserrat',sans-serif;color:#011d6e;margin-bottom:8px;">
              Registration Received!
            </h3>
            <p style="color:#6c757d;max-width:400px;margin:0 auto;">
              Thank you! A member of our team will be in touch with you shortly
              about the next steps for <strong>${data.playerName}</strong>.
            </p>
          </div>`;
      } catch (err) {
        console.error('Registration error:', err);
        if (btn) {
          btn.disabled  = false;
          btn.innerHTML = originalText;
        }
        showFormError(regForm, 'Something went wrong. Please try again or contact us directly.');
      }
    });
  }

  // ============================================================
  // CONTACT FORM
  // ============================================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]') ||
                  contactForm.querySelector('.btn-primary');
      const originalText = btn ? btn.innerHTML : '';
      if (btn) {
        btn.disabled  = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      }

      try {
        const data = {
          contactName:    getValue('contactName'),
          contactEmail:   getValue('contactEmail'),
          contactPhone:   getValue('contactPhone'),
          contactSubject: getValue('contactSubject'),
          contactMessage: getValue('contactMessage'),
          status:         'unread',
          receivedAt:     firebase.firestore.FieldValue.serverTimestamp(),
        };

        await db.collection('messages').add(data);

        // Show success message
        contactForm.innerHTML = `
          <div style="text-align:center;padding:48px 24px;">
            <div style="font-size:3rem;color:#28a745;margin-bottom:16px;">
              <i class="fas fa-envelope-open-text"></i>
            </div>
            <h3 style="font-family:'Montserrat',sans-serif;color:#011d6e;margin-bottom:8px;">
              Message Sent!
            </h3>
            <p style="color:#6c757d;max-width:400px;margin:0 auto;">
              Thank you, <strong>${data.contactName}</strong>! We've received your message
              and will get back to you as soon as possible.
            </p>
          </div>`;
      } catch (err) {
        console.error('Contact form error:', err);
        if (btn) {
          btn.disabled  = false;
          btn.innerHTML = originalText;
        }
        showFormError(contactForm, 'Something went wrong. Please try again or call us directly.');
      }
    });
  }

  // ---- HELPERS ----
  function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function showFormError(form, msg) {
    let err = form.querySelector('.firebase-error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'firebase-error';
      err.style.cssText = 'color:#dc3545;margin-top:12px;font-size:0.9rem;font-weight:500;';
      form.appendChild(err);
    }
    err.textContent = msg;
  }

});
