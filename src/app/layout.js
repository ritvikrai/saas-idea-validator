import './globals.css'

export const metadata = {
  title: 'SaaS Idea Validator',
  description: 'AI-powered market research for your SaaS ideas',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
