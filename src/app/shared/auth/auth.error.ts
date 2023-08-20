export const authError: any = {
  'auth/invalid-email': {
    code: 'メールアドレスが間違っています',
    message: '正しい形式のメールアドレスを入力してください。',
  },
  'auth/wrong-password': {
    code: 'パスワードが間違っています',
    message: '入力いただいたパスワードが間違っています。',
  },
  'auth/weak-password': {
    code: 'パスワードが短すぎます',
    message: 'パスワードは最低でも6文字以上のものをご利用ください。',
  },
  'auth/user-not-found': {
    code: 'ユーザーが見つかりません',
    message: '入力いただいたユーザ-は存在しません。',
  },
  'auth/email-already-in-use': {
    code: '既存のメールアドレスです',
    message: 'このメールアドレスを利用してすでにユーザーが作成されています。',
  },
};
