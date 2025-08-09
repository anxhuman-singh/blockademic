# Blockademic - Blockchain Certificate Simulator

Blockademic is a React application that simulates blockchain-style educational certificates with proof-of-work. Users can create tamper-proof certificates that are stored in a MongoDB database.

## Features

- Create blockchain-style educational certificates
- Proof-of-work algorithm for certificate minting
- MongoDB database storage for certificates
- Modern, responsive UI with smooth transitions
- Horizontal scrolling blockchain visualization

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (for production deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd blockademic
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your MongoDB connection string:
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file and add your MongoDB connection string.

4. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variable:

```
MONGODB_URI=your_mongodb_connection_string_here
```

For development, you can use the provided connection string. For production, use your own MongoDB Atlas connection string.

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Fill in the certificate details in the form
3. Select the difficulty level (number of leading zeros in the hash)
4. Click "Mint Certificate" to start the mining process
5. View your minted certificates in the blockchain visualization

## Deployment

For production deployment, you'll need to:

1. Set up a MongoDB Atlas cluster
2. Update the `MONGODB_URI` in your production environment
3. Build the React application:
   ```bash
   npm run build
   ```
4. Deploy the build folder and server.js to your hosting platform

## Technologies Used

- React.js
- Node.js
- Express.js
- MongoDB with Mongoose
- CSS3 with modern styling techniques

## License

This project is licensed under the MIT License.