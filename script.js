/* =====================================================================
   Web Applications - Workshop 3
   William Garzon & Freddy Valenzuela
   jQuery 3.7.1 - point 4 of the workshop
   ===================================================================== */

$(document).ready(function () {

    /* =================================================================
       4.I - FREDDY VALENZUELA
       Toggle effect: the "View Campus" button of the hero paints the
       page with a random colour of Yachay.

       The colours are not generated at random out of the 16 million
       possible ones: they are picked from the six of the university,
       and each one has a light and a dark version so the text keeps
       its contrast in both themes.
       ================================================================= */

    var YACHAY_LIGHT = [
        '#fecaca',  // red
        '#fde68a',  // yellow
        '#bae6fd',  // sky blue
        '#bbf7d0',  // green
        '#99f6e4',  // turquoise
        '#e7d3b8'   // light brown
    ];

    var YACHAY_DARK = [
        '#7f1d1d',  // red
        '#78350f',  // yellow
        '#0c4a6e',  // sky blue
        '#14532d',  // green
        '#134e4a',  // turquoise
        '#5b4636'   // light brown
    ];

    // remembering the last one avoids repeating a colour twice in a
    // row, which looks like the button did nothing
    var lastColour = -1;

    $('#hero-btn').on('click', function () {
        var index = Math.floor(Math.random() * YACHAY_LIGHT.length);

        while (index === lastColour) {
            index = Math.floor(Math.random() * YACHAY_LIGHT.length);
        }

        lastColour = index;

        var palette = $('body').hasClass('dark') ? YACHAY_DARK : YACHAY_LIGHT;
        $('body').css('background-color', palette[index]);

        // and it takes you to the gallery, which is where the new colour
        // is actually visible (the hero has its own background).
        // scrollIntoView respects the scroll-margin-top of style.css, so
        // the sticky navbar does not cover the title
        document.getElementById('gallery').scrollIntoView();
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

        // the hero button paints the body with an inline colour, and an
        // inline style beats the theme: swap it for the version of the
        // theme we just switched to
        if (lastColour >= 0) {
            var palette = $body.hasClass('dark') ? YACHAY_DARK : YACHAY_LIGHT;
            $body.css('background-color', palette[lastColour]);
        }
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

       Every question that only applies to some requests carries
       data-show-for="request1 request2" in the HTML. When the request
       changes, the questions that do not apply are hidden AND disabled:
       a disabled field is not submitted and is not :visible, so the
       validation skips it on its own.

       The form has novalidate, so the browser does not block the submit
       and this code is the one that decides. If everything is correct:
       alert "Form submitted successfully!"
       ================================================================= */

    var $form = $('#contact-form');

    /* ---------- the words of each request ----------
       hint: the sentence under the title
       labels: the questions that are worded differently per request
       placeholder: the example inside the message box */

    var REASONS = {

        map: {
            hint: 'Tell us what the map gets wrong and we will move or rename the pin. A photo of the place helps a lot.',
            labels: {
                place: 'Which place is wrong on the map?',
                message: 'Explain the correction:'
            },
            placeholder: 'The entrance to Aulas B is on the north side, not where the map shows it...'
        },

        tour: {
            hint: 'Guided tours run from Monday to Friday, in two slots. Tell us when you want to come and how many people you are.',
            labels: {
                message: 'Anything we should know about your group?'
            },
            placeholder: 'We are a school group and two of the students use a wheelchair...'
        },

        booking: {
            hint: 'Spaces are booked by the campus office. Give us the date, the hours and how many people will attend.',
            labels: {
                message: 'What is the space for?'
            },
            placeholder: 'A talk about renewable energy, open to every student of the campus...'
        },

        incident: {
            hint: 'Report something broken or unsafe inside a building. Say where it is as precisely as you can.',
            labels: {
                place: 'In which building?',
                message: 'Describe the damage:'
            },
            placeholder: 'The light of the corridor has been flickering for a week and now it does not turn on...'
        },

        photo: {
            hint: 'Send us a photo of the campus for the gallery. We only publish photos with the permission of whoever took them.',
            labels: {
                place: 'Which place does the photo show?',
                message: 'Tell us about the photo:'
            },
            placeholder: 'Taken at sunrise from the sports field, with the fog still over the buildings...'
        },

        building: {
            hint: 'Ask anything about a building of the campus: opening hours, how to get there or who is in charge of it.',
            labels: {
                place: 'Which building do you want to know about?',
                message: 'Your question:'
            },
            placeholder: 'Is the library open on Saturdays during the exam weeks?'
        },

        route: {
            hint: 'Tell us the two points and the barrier you found. We answer with an accessible route and pass the report to the campus office.',
            labels: {
                message: 'Describe the barrier:'
            },
            placeholder: 'The only way from the residences to Aulas B is a staircase with no ramp next to it...'
        },

        lost: {
            hint: 'Lost something on campus, or found something that is not yours? Describe it and we will match both reports.',
            labels: {
                place: 'Where did it happen?',
                message: 'Anything else that helps to identify it?'
            },
            placeholder: 'It has a physics book inside and a sticker of the university on the front pocket...'
        },

        other: {
            hint: 'Write your request and we will forward it to the right desk of the campus.',
            labels: {
                message: 'Your message:'
            },
            placeholder: 'Describe your request in detail...'
        }
    };

    // the wording used when the chosen request does not change it
    var DEFAULT_LABELS = {
        place: 'Place on campus:',
        message: 'Message:'
    };

    function currentReason() {
        return $('#reason').val();
    }

    // shows the questions of the chosen request and hides the rest
    function applyReason() {
        var reason = currentReason();
        var config = REASONS[reason] || {};
        var labels = config.labels || {};

        $('#reason-hint').text(config.hint || '');
        $('#message').attr('placeholder', config.placeholder || '');

        // the same box is asked with different words in each request
        $.each(DEFAULT_LABELS, function (id, fallback) {
            $('label[for="' + id + '"]').text(labels[id] || fallback);
        });

        // the photo is the whole point of the gallery request
        $('#attachment-note').text(reason === 'photo' ? '(required)' : '(optional)');

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
    // not pop in and out when the student changes the request.
    // The fade is a CSS transition on .is-swapping (see style.css):
    // even if it does not run, the questions always end up visible.
    var swapTimer = null;

    function updatePanel() {
        var $panel = $('#reason-hint, .fields-grid');

        $panel.addClass('is-swapping');
        clearTimeout(swapTimer);

        swapTimer = setTimeout(function () {
            applyReason();
            $panel.removeClass('is-swapping');
        }, 160);
    }

    $('#reason').on('change', updatePanel);


    /* ---------- small helpers ---------- */

    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var NAME_PATTERN = /^[A-Za-zÁÉÍÓÚÑáéíóúñ' -]+$/;
    var DIGITS_PATTERN = /^[0-9]+$/;

    function value(id) {
        return $.trim($('#' + id).val());
    }

    // a date input gives "2026-09-04": read it as a local date
    function toDate(text) {
        return new Date(text + 'T00:00');
    }

    function today() {
        var date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
    }

    function isChecked(id) {
        return $('#' + id).is(':checked');
    }

    // a whole number inside a range
    function checkNumber(id, min, max, empty, range) {
        var text = value(id);

        if (text === '') {
            return empty;
        }
        if (Number(text) < min || Number(text) > max) {
            return range;
        }
        return null;
    }


    /* ---------- the rules, one function per field ----------
       each one returns the error message, or null if the field is fine */

    var VALIDATORS = {

        /* --- asked in every request --- */

        fullname: function () {
            var text = value('fullname');

            if (text === '') {
                return 'Please write your full name.';
            }
            if (text.length < 3) {
                return 'The name must have at least 3 characters.';
            }
            if (!NAME_PATTERN.test(text)) {
                return 'The name cannot contain numbers or symbols.';
            }
            return null;
        },

        email: function () {
            var text = value('email');

            if (text === '') {
                return 'Please write your email address.';
            }
            if (!EMAIL_PATTERN.test(text)) {
                return 'Write a valid address, for example name@yachaytech.edu.ec';
            }
            return null;
        },

        // optional: only checked when the student writes something
        phone: function () {
            var text = value('phone').replace(/[\s-]/g, '');

            if (text === '') {
                return null;
            }
            if (!DIGITS_PATTERN.test(text) || text.length < 7 || text.length > 15) {
                return 'Write a valid phone number (7 to 15 digits).';
            }
            return null;
        },

        place: function () {
            return value('place') === '' ? 'Choose a place on campus.' : null;
        },

        message: function () {
            var text = value('message');

            if (text === '') {
                return 'Please write your message.';
            }
            if (text.length < 10) {
                return 'The message must have at least 10 characters.';
            }
            return null;
        },

        // a photo is optional everywhere, except when the request IS
        // sending a photo for the gallery
        attachment: function () {
            if (currentReason() !== 'photo') {
                return null;
            }
            return $('#attachment').val() === '' ? 'Choose the photo you want to send.' : null;
        },

        accept: function () {
            return isChecked('accept')
                ? null
                : 'You have to accept the processing of your data.';
        },

        /* --- A. something wrong on the map --- */

        'map-issue': function () {
            return value('map-issue') === '' ? 'Tell us what is wrong with it.' : null;
        },

        'map-fix': function () {
            var text = value('map-fix');

            if (text === '') {
                return 'Write what the map should say instead.';
            }
            if (text.length < 3) {
                return 'That is too short to be a correction.';
            }
            return null;
        },

        /* --- B. guided campus tour --- */

        'visit-date': function () {
            var text = value('visit-date');

            if (text === '') {
                return 'Choose the date of the visit.';
            }

            var date = toDate(text);
            var day = date.getDay();

            if (date <= today()) {
                return 'Choose a date after today.';
            }
            if (day === 0 || day === 6) {
                return 'Guided tours only run from Monday to Friday.';
            }
            return null;
        },

        'visit-time': function () {
            return value('visit-time') === '' ? 'Choose a time slot.' : null;
        },

        'group-size': function () {
            return checkNumber('group-size', 1, 40,
                'Say how many people are coming.',
                'A guided tour takes between 1 and 40 people.');
        },

        'group-type': function () {
            return value('group-type') === '' ? 'Tell us what kind of group you are.' : null;
        },

        // a group of checkboxes: the id is on the box that holds them
        'tour-stops': function () {
            return $('input[name="stops"]:checked').length === 0
                ? 'Choose at least one place for the tour.'
                : null;
        },

        /* --- C. reserve a space --- */

        'space-type': function () {
            return value('space-type') === '' ? 'Choose the space you need.' : null;
        },

        'booking-date': function () {
            var text = value('booking-date');

            if (text === '') {
                return 'Choose the date of the booking.';
            }
            if (toDate(text) < today()) {
                return 'The date cannot be in the past.';
            }
            return null;
        },

        'start-time': function () {
            return value('start-time') === '' ? 'Say at what time it starts.' : null;
        },

        'end-time': function () {
            var end = value('end-time');
            var start = value('start-time');

            if (end === '') {
                return 'Say until what time.';
            }
            // "HH:MM" in 24 hour format compares correctly as text
            if (start !== '' && end <= start) {
                return 'The end has to be later than the start.';
            }
            return null;
        },

        attendees: function () {
            return checkNumber('attendees', 1, 500,
                'Say how many people will attend.',
                'Write a number between 1 and 500.');
        },

        /* --- D. maintenance issue --- */

        'floor-room': function () {
            return value('floor-room') === ''
                ? 'Say the floor or the room number.'
                : null;
        },

        'issue-type': function () {
            return value('issue-type') === '' ? 'Choose the type of issue.' : null;
        },

        'noticed-date': function () {
            var text = value('noticed-date');

            if (text === '') {
                return 'Say when you noticed it.';
            }
            if (toDate(text) > today()) {
                return 'You cannot notice something in the future.';
            }
            return null;
        },

        /* --- E. a photo for the gallery --- */

        'photo-date': function () {
            var text = value('photo-date');

            if (text === '') {
                return 'Say when you took the photo.';
            }
            if (toDate(text) > today()) {
                return 'The date cannot be in the future.';
            }
            return null;
        },

        'photo-consent': function () {
            return isChecked('photo-consent')
                ? null
                : 'We can only publish the photo with your permission.';
        },

        /* --- F. question about a building --- */

        'info-type': function () {
            return value('info-type') === '' ? 'Choose what you want to know.' : null;
        },

        /* --- G. accessible route --- */

        'route-from': function () {
            return value('route-from') === '' ? 'Choose the starting point.' : null;
        },

        'route-to': function () {
            var to = value('route-to');

            if (to === '') {
                return 'Choose the destination.';
            }
            if (to === value('route-from')) {
                return 'The destination has to be a different place.';
            }
            return null;
        },

        barrier: function () {
            return value('barrier') === '' ? 'Tell us which barrier you found.' : null;
        },

        /* --- H. lost and found --- */

        'lost-date': function () {
            var text = value('lost-date');

            if (text === '') {
                return 'Say on which day it happened.';
            }
            if (toDate(text) > today()) {
                return 'The date cannot be in the future.';
            }
            return null;
        },

        object: function () {
            var text = value('object');

            if (text === '') {
                return 'Describe the object.';
            }
            if (text.length < 3) {
                return 'That description is too short.';
            }
            return null;
        },

        /* --- anything else --- */

        subject: function () {
            var text = value('subject');

            if (text === '') {
                return 'Please write a subject.';
            }
            if (text.length < 3) {
                return 'The subject is too short.';
            }
            return null;
        }
    };

    // in the same order as the questions on screen, so the first error
    // found is also the first one the student sees
    var FIELDS = [
        'fullname', 'email', 'phone', 'place',
        'map-issue', 'map-fix',
        'visit-date', 'visit-time', 'group-size', 'group-type', 'tour-stops',
        'space-type', 'booking-date', 'start-time', 'end-time', 'attendees',
        'floor-room', 'issue-type', 'noticed-date',
        'photo-date', 'photo-consent',
        'info-type',
        'route-from', 'route-to', 'barrier',
        'lost-date', 'object',
        'subject', 'message', 'attachment', 'accept'
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
            // hidden by the panel: this request does not ask for it
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

    // while the user corrects something, its error message disappears
    $form.on('input change', 'input, select, textarea', function () {
        var $control = $(this);

        if ($control.hasClass('is-invalid')) {
            clearError(this.id);
        }

        // a control inside a group: the error belongs to the whole group
        var $group = $control.closest('.check-row.is-invalid');

        if ($group.length) {
            clearError($group.attr('id'));
        }
    });

    // two errors depend on another field, so they go stale when it changes
    $('#start-time').on('change', function () {
        clearError('end-time');
    });

    $('#route-from').on('change', function () {
        clearError('route-to');
    });

    // the Clear form button also wipes the errors and goes back to the
    // questions of the first request (reset() runs after this event)
    $form.on('reset', function () {
        setTimeout(function () {
            clearAllErrors();
            applyReason();
        }, 0);
    });

    // first run, so the page opens showing the right questions
    applyReason();

});
