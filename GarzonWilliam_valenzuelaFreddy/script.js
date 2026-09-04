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
       Dark mode toggle (sun/moon button)
       ================================================================= */

    var $body = $('body');
    var $toggle = $('#theme-toggle');

    if (localStorage.getItem('theme') === 'dark') {
        $body.addClass('dark');
    }

    $toggle.on('click', function () {
        $body.toggleClass('dark');
        localStorage.setItem('theme', $body.hasClass('dark') ? 'dark' : 'light');
    });


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
        // the sticky navbar slides out of the way while the photo is open
        $('.navbar').addClass('is-hidden');
        $('#modal-close').trigger('focus');
    }

    function closeModal() {
        $modal.removeClass('is-open').attr('aria-hidden', 'true');
        $('body').css('overflow', '');
        $('.navbar').removeClass('is-hidden');

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
       Adaptive panel + form validation.

       Each question that only applies to some reasons carries
       data-show-for="reason1 reason2" in the HTML. When the reason
       changes, the questions that do not apply are hidden AND disabled:
       a disabled field is not submitted and is not :visible, so the
       validation skips it on its own.

       The form has novalidate, so the browser does not block the submit
       and this code is the one that decides. If everything is correct:
       alert "Form submitted successfully!"
       ================================================================= */

    var $form = $('#contact-form');

    // what each desk needs, written under the "Your request" title
    var REASON_HINTS = {
        records: 'Certificates are issued by the registrar office: we need your ID number, your program and your semester.',
        enrollment: 'Course registration is handled by your school. Tell us your program, your semester and the date you need an answer by.',
        scholarship: 'Financial aid needs your academic data and your ID number. Attach any supporting document you already have.',
        housing: 'Student housing needs your ID number, your date of birth and the date you plan to move in.',
        support: 'Describe the problem in detail and attach a screenshot if you can.',
        other: 'Write your request and we will forward it to the right desk.'
    };

    function currentReason() {
        return $('#reason').val();
    }

    // shows the questions of the chosen reason and hides the rest
    function applyReason() {
        var reason = currentReason();

        $('#reason-hint').text(REASON_HINTS[reason] || '');

        $('[data-show-for]').each(function () {
            var $field = $(this);
            var reasons = String($field.attr('data-show-for')).split(' ');
            var applies = $.inArray(reason, reasons) !== -1;

            $field.toggle(applies);
            $field.find('input, select, textarea').prop('disabled', !applies);

            // a question that disappears cannot leave an error behind
            if (!applies) {
                $field.find('.is-invalid').removeClass('is-invalid');
                $field.find('.error-msg').text('');
            }
        });
    }

    // the same thing, but with a short cross fade so the questions do
    // not pop in and out when the student changes the reason.
    // The fade is a CSS transition on .is-swapping (see style.css):
    // even if it does not run, the questions always end up visible.
    var swapTimer = null;

    function updatePanel() {
        var $body = $('#reason-hint, .fields-grid');

        $body.addClass('is-swapping');
        clearTimeout(swapTimer);

        swapTimer = setTimeout(function () {
            applyReason();
            $body.removeClass('is-swapping');
        }, 160);
    }

    $('#reason').on('change', updatePanel);


    /* ---------- the rules, one function per field ----------
       each one returns the error message, or null if the field is fine */

    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var NAME_PATTERN = /^[A-Za-zÁÉÍÓÚÑáéíóúñ' -]+$/;
    var DIGITS_PATTERN = /^[0-9]+$/;

    // a date input gives "2026-09-04": read it as a local date
    function toDate(value) {
        return new Date(value + 'T00:00');
    }

    function today() {
        var date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
    }

    var VALIDATORS = {

        fullname: function () {
            var value = $.trim($('#fullname').val());

            if (value === '') {
                return 'Please write your full name.';
            }
            if (value.length < 3) {
                return 'The name must have at least 3 characters.';
            }
            if (!NAME_PATTERN.test(value)) {
                return 'The name cannot contain numbers or symbols.';
            }
            return null;
        },

        email: function () {
            var value = $.trim($('#email').val());

            if (value === '') {
                return 'Please write your email address.';
            }
            if (!EMAIL_PATTERN.test(value)) {
                return 'Write a valid address, for example name@yachaytech.edu.ec';
            }
            return null;
        },

        // optional: only checked when the student writes something
        phone: function () {
            var value = $.trim($('#phone').val()).replace(/[\s-]/g, '');

            if (value === '') {
                return null;
            }
            if (!DIGITS_PATTERN.test(value) || value.length < 7 || value.length > 15) {
                return 'Write a valid phone number (7 to 15 digits).';
            }
            return null;
        },

        birthdate: function () {
            var value = $('#birthdate').val();

            if (value === '') {
                return 'Please choose your date of birth.';
            }
            if (toDate(value) >= today()) {
                return 'The date of birth must be in the past.';
            }
            return null;
        },

        idnumber: function () {
            var value = $.trim($('#idnumber').val());

            if (value === '') {
                return 'This request needs your ID number.';
            }
            if (!DIGITS_PATTERN.test(value) || value.length !== 10) {
                return 'The ID number must have exactly 10 digits.';
            }
            return null;
        },

        program: function () {
            return $('#program').val() === '' ? 'Choose your degree program.' : null;
        },

        semester: function () {
            var value = $('#semester').val();

            if (value === '') {
                return 'Write your current semester.';
            }
            if (Number(value) < 1 || Number(value) > 10) {
                return 'The semester must be a number between 1 and 10.';
            }
            return null;
        },

        // optional: only checked when the student picks a date
        preferred: function () {
            var value = $('#preferred').val();

            if (value === '') {
                return null;
            }
            if (toDate(value) < today()) {
                return 'The date has to be today or later.';
            }
            return null;
        },

        subject: function () {
            var value = $.trim($('#subject').val());

            if (value === '') {
                return 'Please write a subject.';
            }
            if (value.length < 3) {
                return 'The subject is too short.';
            }
            return null;
        },

        message: function () {
            var value = $.trim($('#message').val());

            if (value === '') {
                return 'Please write your message.';
            }
            if (value.length < 10) {
                return 'The message must have at least 10 characters.';
            }
            return null;
        },

        accept: function () {
            return $('#accept').is(':checked')
                ? null
                : 'You have to accept the processing of your data.';
        }
    };

    // the order is the order in which the questions appear on screen,
    // so the first error found is also the first one of the form
    var FIELDS = [
        'fullname', 'email', 'phone', 'birthdate', 'idnumber',
        'program', 'semester', 'preferred', 'subject', 'message', 'accept'
    ];


    /* ---------- painting the errors ---------- */

    function showError(id, message) {
        $('#' + id).addClass('is-invalid');
        $('#error-' + id).text(message);
    }

    function clearError(id) {
        $('#' + id).removeClass('is-invalid');
        $('#error-' + id).text('');
    }

    function clearAllErrors() {
        $form.find('.is-invalid').removeClass('is-invalid');
        $form.find('.error-msg').text('');
    }

    function validateForm() {
        var errors = [];

        $.each(FIELDS, function (index, id) {
            // hidden by the adaptive panel: this desk does not ask for it
            if (!$('#' + id).is(':visible')) {
                return;
            }

            var message = VALIDATORS[id]();

            if (message) {
                errors.push([id, message]);
            }
        });

        return errors;
    }


    /* ---------- submit ---------- */

    $form.on('submit', function (event) {
        // never let the page reload: this form has no backend
        event.preventDefault();

        clearAllErrors();

        var errors = validateForm();

        if (errors.length > 0) {
            $.each(errors, function (index, error) {
                showError(error[0], error[1]);
            });

            // take the user to the first question that is wrong
            $('#' + errors[0][0]).trigger('focus');
            return;
        }

        alert('Form submitted successfully!');
        this.reset();
        clearAllErrors();
        applyReason();
    });

    // while the user corrects a field, its error message disappears
    $form.on('input change', 'input, select, textarea', function () {
        if ($(this).hasClass('is-invalid')) {
            clearError(this.id);
        }
    });

    // the Clear form button also wipes the errors and goes back to the
    // questions of the default reason (reset() runs after this event)
    $form.on('reset', function () {
        setTimeout(function () {
            clearAllErrors();
            applyReason();
        }, 0);
    });

    // first run, so the page opens showing the right questions
    applyReason();

});
