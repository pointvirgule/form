(function () {
  function ContactForm(el) {
    this.element = el;
    this.setup();
  }

  var isEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  // Based upon http://www.wtng.info/wtng-971-ae.html
  var isValidPhoneNumber = /^(\+971 ?)?(2|3|4|50|55|6|7|9)[0-9]{7}$/;
  var MIN_LENGTH = 2;
  var MAX_LENGTH = 200;

  var lengthValidator = function (name, val) {
    if (val.length < MIN_LENGTH) {
      return name + ' too short, should be longer than ' + MIN_LENGTH + ' characters';
    } else if (val.length > MAX_LENGTH) {
      return name + ' too long, should be shorter than ' + MAX_LENGTH + ' characters';
    }
    
    return true;
  };

  var validators = {
    email: function (val) {
      if (isEmail.test(val)) {
        return true;
      }
      return 'wrong email format';
    },
    name: lengthValidator.bind(undefined, 'name'),
    message: lengthValidator.bind(undefined, 'message'),
    phone: function (val) {
      if (isValidPhoneNumber.test(val)) {
        return true;
      }
      return 'wrong phone number';
    }
  }

  ContactForm.prototype = {

    setup: function () {
      if (this.element.tagName.toLowerCase() !== 'form') {
        throw new Error('Contact Form expect a form element')
      }

      this.element.addEventListener('submit', this.onSubmit.bind(this));
      this.fields = {};
      this.errors = {};

      for (field in validators) {
        this.setupField(field);
      }
    },

    setupField: function (name) {
      var el = this.element.querySelector('[name="' + name + '"]');

      if (!el) {
        throw new Error('Contact Form missing field ' + name);
      }

      this.fields[name] = el;
      el.addEventListener('blur', this.validateField.bind(this, el));
    },

    validateField: function (el) {
      var name = el.getAttribute('name');
      var valid = validators[name](el.value);

      this.toggleError(name, valid === true ? '' : valid);

      return valid === true;
    },

    toggleError: function (name, message) {
      var field = this.fields[name];
      var errorEl = this.errors[name];

      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.classList.add('error-message');
        this.errors[name] = errorEl;
        field.parentNode.appendChild(errorEl);
      }

      errorEl.style.height = message.length ? 'auto' : 0;

      errorEl.innerHTML = message;
    },

    onSubmit: function (event) {
      var name;

      for (name in this.fields) {
        if (!this.validateField(this.fields[name])) {
          event.preventDefault();
        }
      }
    }
  };

  window.ContactForm = ContactForm;
})(window);