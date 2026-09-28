# refillrx
# RefillRx 💊

A full-stack prescription refill tracker where patients manage their medications and request refills, and pharmacy staff process those requests from approval through shipping.

⚠️ Demo project only. RefillRx uses fake data and is not intended for real medical use. It does not provide medical advice.

# Why I built this

I work on pharmacy e-commerce systems professionally. RefillRx shows how I would design a similar workflow from scratch using a modern stack, with role-based access control and an audit trail for every status change.

# Features
## For patients
Sign in with Google
Add, edit, and remove prescriptions (medication, dosage, frequency, refills remaining, pharmacy)
Dashboard highlighting medications that are running low, based on days' supply
Request a refill with one click and track its status

## For pharmacy staff
Queue of incoming refill requests with search and filters
Move requests through each stage: Requested → Approved → Packed → Shipped → Delivered
Full status history showing who changed each request and when

# Planned
 Shipping labels and tracking via EasyPost (test mode)
 PDF and Excel export of medication history
 Microsoft and Apple sign-in
 AI-powered plain-language explanations of medication instructions
 Email refill reminders
 Automated tests, Docker, CI/CD with GitHub Actions, and AWS deployment


# Tech stack
Layer	Technology
Frontend	React, TypeScript, Vite
Backend	Node.js, Express, TypeScript
Database	PostgreSQL, Prisma
Authentication	Google OAuth 2.0, JWT (httpOnly cookies)
Validation	Zod


# Database design
users: account details and role (patient or staff)
prescriptions: medications belonging to a patient
refill_requests: refill orders with their current status
status_history: audit trail of every status change

# Live demo

Coming soon

# Screenshots

Coming soon

# Running locally
bash
# Clone the repository
git clone https://github.com/NehaPrajapati1/refillrx.git
cd refillrx

# Start the backend
cd server
npm install
cp .env.example .env   # then fill in your values
npm run dev

# In a second terminal, start the frontend
cd client
npm install
npm run dev

# Author

Neha Prajapati, Full Stack Developer, Winnipeg, Canada [Linkedin]:https://www.linkedin.com/in/neha-p-439a47213

