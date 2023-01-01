// interface User {
//   name?: string | null,
//   nickname?: string | null,
//   firstname?: string | null,
//   lastname?: string | null,
//   email?: string | null,
// }

export default (user) => {
  const { name = '', nickname = '', firstname = '', lastname = '', email = '' } = user
  if (nickname) return nickname
  if (name) return name
  if (lastname && firstname) return `${firstname} ${lastname}`
  if (firstname || lastname) return firstname || lastname
  if (email) return email
  return '-'
}
