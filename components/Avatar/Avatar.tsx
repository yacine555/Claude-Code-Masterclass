import styles from "./Avatar.module.css"

interface AvatarProps {
  name: string
}

export default function Avatar({ name }: AvatarProps) {
  const getInitials = (name: string): string => {
    // Find all uppercase letters in the name
    const uppercaseLetters = name.match(/[A-Z]/g)

    // If there are 2 or more uppercase letters (PascalCase), use first 2
    if (uppercaseLetters && uppercaseLetters.length >= 2) {
      return uppercaseLetters.slice(0, 2).join("")
    }

    // Otherwise, use the first letter (uppercased)
    return name.charAt(0).toUpperCase()
  }

  const initials = getInitials(name)

  return (
    <div className={styles.avatar} role="img" aria-label={`Avatar for ${name}`}>
      {initials}
    </div>
  )
}
