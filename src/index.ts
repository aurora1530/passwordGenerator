export type PasswordOptions = {
  length: number;
  includeCharacters: IncludeCharacter;
  excludeMistakableCharacters?: boolean;
};

export type IncludeCharacter = {
  lowercase: boolean;
  uppercase: boolean;
  number: boolean;
  symbol: boolean;
};

export type Characters = {
  lowercase: string;
  uppercase: string;
  number: string;
  symbol: string;
};

export const defaultCharacters: Characters = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  number: '0123456789',
  symbol: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};
export const mistakableCharacters: Characters = {
  lowercase: 'lo',
  uppercase: 'IO',
  number: '10',
  symbol: `"',.:;^_|~`,
};

function generatePassword(length: number, useCharacters: string[]): string {
  const charTypeNum = useCharacters.length;
  if (charTypeNum > length) length = charTypeNum;
  const chars = useCharacters.join('');
  let password = '';
  while (true) {
    password = '';
    for (let i = 0; i < length; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }

    // すべての文字種が含まれているかチェック
    if (
      useCharacters.every((chars) =>
        chars.split('').some((char) => password.includes(char))
      )
    ) {
      break;
    }
  }

  return password;
}

export default function createPassword(options: PasswordOptions): string {
  const includeCharacters: Characters = {
    lowercase: options.includeCharacters.lowercase ? defaultCharacters.lowercase : '',
    uppercase: options.includeCharacters.uppercase ? defaultCharacters.uppercase : '',
    number: options.includeCharacters.number ? defaultCharacters.number : '',
    symbol: options.includeCharacters.symbol ? defaultCharacters.symbol : '',
  };

  if (options.excludeMistakableCharacters) {
    Object.keys(mistakableCharacters).forEach((key) => {
      mistakableCharacters[key as keyof Characters].split('').forEach((char) => {
        includeCharacters[key as keyof Characters] = includeCharacters[
          key as keyof Characters
        ].replace(char, '');
      });
    });
  }

  const password = generatePassword(
    options.length,
    Object.values(includeCharacters).filter(Boolean)
  );

  return password;
}
