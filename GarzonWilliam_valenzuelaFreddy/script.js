/* =====================================================================
   Web Applications - Workshop 3
   William Garzon & Freddy Valenzuela
   jQuery 3.7.1 - point 4 of the workshop
   ===================================================================== */

$(document).ready(function () {

    /* =================================================================
       4.I - FREDDY VALENZUELA
       Toggle effect: the hero button changes the background colour of
       the page randomly.
       This code is already written, but it only works once the hero
       section exists with a button with id="hero-btn".
       ================================================================= */

    $('#hero-btn').on('click', function () {
        var letters = '0123456789ABCDEF';
        var color = '#';

        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        $('body').css('background-color', color);
    });

    /* ===================== END OF FREDDY'S ZONE ====================== */


    /* =================================================================
       4.II - WILLIAM GARZON
       Image gallery: clicking on a photo enlarges it in a popup modal.
       The modal is shown by adding the class .is-open (see style.css);
       .fadeIn() is NOT used because it would set display:block and the
       photo would stop being centred.
       ================================================================= */

    var $modal = $('#image-modal');
    var $modalImg = $('#modal-img');
    var $modalCaption = $('#modal-caption');
    var $lastClickedImg = null;

    function openModal($img) {
        $lastClickedImg = $img;

        $modalImg.attr('src', $img.attr('src'));
        $modalImg.attr('alt', $img.attr('alt'));
        $modalCaption.text($img.data('caption'));

        $modal.addClass('is-open').attr('aria-hidden', 'false');
        // stop the page behind the modal from scrolling
        $('body').css('overflow', 'hidden');
        $('#modal-close').trigger('focus');
    }

    function closeModal() {
        $modal.removeClass('is-open').attr('aria-hidden', 'true');
        $('body').css('overflow', '');

        // give the keyboard focus back to the photo that was opened
        if ($lastClickedImg) {
            $lastClickedImg.trigger('focus');
        }
    }

    // open: click on any photo of the gallery
    $('.gallery-img').on('click', function () {
        openModal($(this));
    });

    // open: the photos have tabindex="0", so Enter and Space work too
    $('.gallery-img').on('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openModal($(this));
        }
    });

    // close: the X button
    $('#modal-close').on('click', closeModal);

    // close: click on the dark background, but not on the photo itself
    $modal.on('click', function (event) {
        if (event.target === this) {
            closeModal();
        }
    });

    // close: the Escape key
    $(document).on('keydown', function (event) {
        if (event.key === 'Escape' && $modal.hasClass('is-open')) {
            closeModal();
        }
    });


    /* =================================================================
       4.III - WILLIAM GARZON
       Form validation. The form has novalidate, so the browser does
       not block the submit and this function is the one that decides.
       If everything is correct: alert "Form submitted successfully!"
       ================================================================= */

    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var NAME_PATTERN = /^[A-Za-zÁÉÍÓÚÑáéíóúñ' -]+$/;
    var DIGITS_PATTERN = /^[0-9]+$/;

    // paints one field as wrong and writes its message
    function showError(id, message) {
        $('#' + id).addClass('is-invalid');
        $('#error-' + id).text(message);
    }

    // leaves one field clean again
    function clearError(id) {
        $('#' + id).removeClass('is-invalid');
        $('#error-' + id).text('');
    }

    function clearAllErrors() {
        $('#contact-form .is-invalid').removeClass('is-invalid');
        $('#contact-form .error-msg').text('');
    }

    function validateForm() {
        var errors = [];

        // --- full name: required, at least 3 letters, no numbers ---
        var fullname = $.trim($('#fullname').val());

        if (fullname === '') {
            errors.push(['fullname', 'Please write your full name.']);
        } else if (fullname.length < 3) {
            errors.push(['fullname', 'The name must have at least 3 characters.']);
        } else if (!NAME_PATTERN.test(fullname)) {
            errors.push(['fullname', 'The name cannot contain numbers or symbols.']);
        }

        // --- email: required and with a valid format ---
        var email = $.trim($('#email').val());

        if (email === '') {
            errors.push(['email', 'Please write your email address.']);
        } else if (!EMAIL_PATTERN.test(email)) {
            errors.push(['email', 'Write a valid address, for example name@yachaytech.edu.ec']);
        }

        // --- date of birth: required and in the past ---
        var birthdate = $('#birthdate').val();

        if (birthdate === '') {
            errors.push(['birthdate', 'Please choose your date of birth.']);
        } else if (new Date(birthdate) >= new Date()) {
            errors.push(['birthdate', 'The date of birth must be in the past.']);
        }

        // --- national ID: optional, but if written it needs 10 digits ---
        var idnumber = $.trim($('#idnumber').val());

        if (idnumber !== '' && (!DIGITS_PATTERN.test(idnumber) || idnumber.length !== 10)) {
            errors.push(['idnumber', 'The ID number must have exactly 10 digits.']);
        }

        // --- phone: optional, but if written it needs 7 to 15 digits ---
        var phone = $.trim($('#phone').val()).replace(/[\s-]/g, '');

        if (phone !== '' && (!DIGITS_PATTERN.test(phone) || phone.length < 7 || phone.length > 15)) {
            errors.push(['phone', 'Write a valid phone number (7 to 15 digits).']);
        }

        // --- degree program: one option has to be chosen ---
        if ($('#program').val() === '') {
            errors.push(['program', 'Choose your degree program.']);
        }

        // --- semester: whole number between 1 and 10 ---
        var semester = $('#semester').val();

        if (semester === '') {
            errors.push(['semester', 'Write your current semester.']);
        } else if (Number(semester) < 1 || Number(semester) > 10) {
            errors.push(['semester', 'The semester must be a number between 1 and 10.']);
        }

        // --- subject ---
        var subject = $.trim($('#subject').val());

        if (subject === '') {
            errors.push(['subject', 'Please write a subject.']);
        } else if (subject.length < 3) {
            errors.push(['subject', 'The subject is too short.']);
        }

        // --- message: at least 10 characters ---
        var message = $.trim($('#message').val());

        if (message === '') {
            errors.push(['message', 'Please write your message.']);
        } else if (message.length < 10) {
            errors.push(['message', 'The message must have at least 10 characters.']);
        }

        // --- confirmation checkbox ---
        if (!$('#accept').is(':checked')) {
            errors.push(['accept', 'You have to accept the processing of your data.']);
        }

        return errors;
    }

    $('#contact-form').on('submit', function (event) {
        // never let the page reload: this form has no backend
        event.preventDefault();

        clearAllErrors();

        var errors = validateForm();

        if (errors.length > 0) {
            // paint every wrong field
            $.each(errors, function (index, error) {
                showError(error[0], error[1]);
            });

            // and take the user to the first one
            $('#' + errors[0][0]).trigger('focus');
            return;
        }

        alert('Form submitted successfully!');
        this.reset();
        clearAllErrors();
    });

    // while the user corrects a field, its error message disappears
    $('#contact-form').on('input change', 'input, select, textarea', function () {
        if ($(this).hasClass('is-invalid')) {
            clearError(this.id);
        }
    });

    // the Clear form button also wipes the error messages
    $('#contact-form').on('reset', function () {
        clearAllErrors();
    });

});
