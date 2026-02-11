export const PASSWORD_RULE_MESSAGE = 'Le mot de passe doit contenir au moins 9 caracteres, une majuscule, un chiffre et un caractere special';
export const EMAIL_RULE_MESSAGE = 'Email invalide';

export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{9,}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ValidationResult = {
	valid: boolean;
	message?: string;
};

export function validatePassword(password: string): ValidationResult {
	if (!password || !PASSWORD_REGEX.test(password)) {
		return {valid: false, message: PASSWORD_RULE_MESSAGE};
	}

	return {valid: true};
}

export function validateEmail(email: string): ValidationResult {
	if (!email || !EMAIL_REGEX.test(email)) {
		return {valid: false, message: EMAIL_RULE_MESSAGE};
	}

	return {valid: true};
}

