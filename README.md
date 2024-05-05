# Cluster Management

Cluster Management is a project designed to help users manage clusters of machines efficiently. With this system, users can create clusters, add machines to clusters, perform various operations on machines, and manage tags associated with machines.

## Features

- **Cluster Creation**: Users can create clusters to organize machines logically.
- **Machine Management**: Add, delete, update, and view details of machines within clusters.
- **Tag Management**: Add, remove, and manage tags associated with machines for easier organization.
- **Operations**: Perform actions like start, stop, reboot, and more on groups of machines using tags.
- **Swagger Documentation**: API endpoints are documented using Swagger for easy reference.

## Technologies Used

- **Node.js**: Backend server environment.
- **Express.js**: Web framework for Node.js.
- **Sequelize**: Promise-based Node.js ORM for database interaction.
- **PostgreSQL**: Relational database for storing cluster and machine data.
- **Swagger**: API documentation tool.
- **Git**: Version control system for collaborative development.

## Getting Started

To get started with Cluster Management, follow these steps:

1. **Clone the Repository**: Clone the Cluster Management repository to your local machine using Git.

2. **Install Dependencies**: Navigate to the project directory and install the required dependencies using npm.

3. **Set Up Environment Variables**: Create a `.env` file in the root directory and configure environment variables such as database connection details.

4. **Database Setup**: Set up a PostgreSQL database and ensure it matches the configuration specified in the `.env` file.

5. **Run Migrations**: Run database migrations to create the necessary tables in the database.

6. **Start the Server**: Start the Node.js server to run the application.

7. **Explore the API**: Access the API documentation using Swagger UI by visiting `http://localhost:3000/api-docs` in your web browser.

## Contributing

Contributions are welcome! If you'd like to contribute to Cluster Management, please follow these guidelines:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/my-feature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/my-feature`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License.
