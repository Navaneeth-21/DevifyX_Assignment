# GDPR Data Export API

A secure, scalable Node.js backend API for GDPR-compliant user data exports.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd gdpr-data-export-api
   
---

### Key Features Implemented
1. **User Authentication**: JWT-based authentication with bcrypt for password hashing.
2. **Data Aggregation**: Collects user data from MongoDB, supporting profile, settings, and activity logs.
3. **Export Request Endpoint**: RESTful endpoint for export requests with rate limiting.
4. **Export Processing**: Asynchronous processing using Bull queue.
5. **Data Packaging**: Exports data as JSON in a ZIP archive.
6. **Email Notification**: Sends secure download links via Nodemailer.
7. **Access Control**: Ensures only the authenticated user can download their data.
8. **Audit Logging**: Logs all export requests and downloads using Winston.

### Bonus Features
- **Admin Dashboard Endpoint**: API to view all export requests.
- **Data Redaction**: Users can exclude specific data categories.
- **Rate Limiting**: Prevents abuse of export functionality.

### Security Measures
- JWT for secure authentication
- Role-based access control (admin vs. user)
- Rate limiting on export requests
- Secure password storage with bcrypt
- Environment variables for sensitive data
- Audit logging for compliance
- Input validation (not fully shown but can be added with `express-validator`)

### Scalability
- Asynchronous processing with Bull queue
- MongoDB for scalable data storage
- Modular code structure for maintainability
- Redis for queue management
- Can be extended to use S3 for file storage

### Testing
- Unit tests for auth and export endpoints
- Integration tests for core workflows
- Jest with Supertest for API testing
- Mocking for external services (email, queue)

### Limitations and Future Improvements
- **Multi-language Support**: Not implemented but can be added using i18n libraries.
- **File Storage**: Uses local storage; can be extended to S3 for production.
- **Input Validation**: Basic validation; can be enhanced with `express-validator`.
- **Email Templates**: Plain text emails; can use HTML templates for better UX.
- **Expiration for Download Links**: Download links are permanent; can add expiration logic.
- **Performance Optimization**: Add caching for frequent queries.

---

### Submission Notes
- **Repository**: Host the code in a private GitHub repository and grant access to reviewers.
- **Form Submission**: Use the provided Google Form (https://forms.gle/LAvLWFmHRLXswwsx5).
- **Documentation**: Include Swagger YAML and Postman collection.
- **Tests**: Ensure tests cover core functionality.
- **Environment**: Provide `.env.example` for easy setup.

This implementation meets all core requirements, includes several bonus features, and follows best practices for security, scalability, and maintainability. Let me know if you need further clarification or additional details!