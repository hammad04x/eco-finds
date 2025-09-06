const validate = {
    isEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    isStrongPassword: (password) => {
        return password.length >= 6;
    },
    isNumericId: (id) => {
        return /^\d+$/.test(id);
    },
    isValidString: (str) => {
        return typeof str === 'string' && str.trim().length > 0;
    },
};

module.exports = validate;