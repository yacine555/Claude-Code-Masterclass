// this page should be used only as a splash page to decide where a user should be navigated to
// when logged in --> to /heists
// when not logged in --> to /login

import { Clock8 } from "lucide-react"

export default function Home() {
  return (
    <div className="center-content">
      <div className="page-content">
        <h1>
          P<Clock8 className="logo" strokeWidth={2.75} />cket Heist
        </h1>
        <div>Tiny missions. Big office mischief.</div>

        <div className="intro-text" style={{ marginTop: '2rem', maxWidth: '600px', textAlign: 'center' }}>
          <p>
            Welcome to Pocket Heist, where the mundane meets the mischievous. Transform your ordinary
            workday into an adventure with bite-sized challenges that bring excitement to the everyday.
          </p>
          <p>
            Plan your next office caper, track your progress, and compete with colleagues in a game
            of harmless pranks and clever tasks. From the coffee machine to the conference room,
            no corner is safe from your playful schemes.
          </p>
        </div>
      </div>
    </div>
  )
}
