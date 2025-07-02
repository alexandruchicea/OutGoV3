# Technical Specifications Document - OutGo App (V1)

## 1. Introduction
*   **Project Name:** OutGo
*   **Document Version:** 1.0
*   **Date:** July 2, 2025
*   **Author(s):** Engineering Team, AI Assistant
*   **Purpose:** This document provides a detailed overview of the technical aspects of the OutGo project, including the technology stack, architecture, design patterns, and key decisions.

## 2. Goals
*   **Technical Goals:**
    *   **Performance:** Deliver a fast user experience with page loads under 3 seconds.
    *   **Scalability:** Build on a serverless architecture that can scale automatically with user demand.
    *   **Security:** Ensure robust data protection through authentication, authorization, and secure coding practices.
    *   **Maintainability:** Write clean, well-documented, and modular code to facilitate future development.
*   **Business Goals:** The technical architecture supports the business goals by providing a reliable and cost-effective platform that can grow quickly without significant re-engineering.

## 3. Development Environment
*   **Operating Systems:** macOS, Windows (with WSL2), Linux.
*   **Programming Languages:** TypeScript, JavaScript, SQL (PostgreSQL).
*   **Frameworks:** Next.js 14+ (with App Router).
*   **Libraries:** React, Tailwind CSS, Supabase.js, Zod (for validation), `react-day-picker`.
*   **Development Tools:** VS Code, Git, Node.js, npm/yarn.

## 4. Technologies Used
*   **Technology Stack:**
    *   **Frontend:** Next.js (React)
    *   **Backend:** Next.js (Server Actions, API Routes)
    *   **Database:** Supabase (PostgreSQL)
    *   **Authentication:** Supabase Auth
    *   **Storage:** Supabase Storage
    *   **Deployment:** Vercel
*   **Technology Selection Rationale:**
    *   **Next.js:** Provides a powerful, full-stack framework with an excellent developer experience. The App Router enables a seamless blend of server-rendered and client-rendered components, optimizing performance.
    *   **Supabase:** Offers a complete Backend-as-a-Service (BaaS) solution that handles the database, authentication, and file storage, significantly reducing development time and infrastructure management overhead. Its use of PostgreSQL and Row Level Security (RLS) is ideal for our data and security model.
    *   **Vercel:** As the creators of Next.js, Vercel offers a best-in-class, Git-native deployment and hosting platform that is optimized for performance and scalability.

## 5. Key Technical Decisions
*   **Next.js App Router:** Chosen over the Pages Router for its support for Server Components, layouts, and improved data-fetching patterns, leading to better performance and code organization.
*   **Server Actions:** Used for all data mutations (create, update, delete). This simplifies the client-side code, reduces the need for API boilerplate, and provides a clear, secure way to interact with the backend.
*   **Supabase for BaaS:** This decision centralizes our backend services, simplifying infrastructure and allowing the team to focus on feature development.
*   **Row Level Security (RLS):** RLS will be the primary mechanism for data authorization. Policies will be written directly in the database, ensuring that data access rules are enforced at the lowest level, regardless of how the data is accessed.

## 6. Design Patterns
*   **Server Components:** Heavily utilized for data fetching and rendering static content to minimize client-side JavaScript.
*   **Singleton Pattern:** Used for creating database and Supabase clients to ensure a single, efficient connection is used throughout the application.
*   **Provider Pattern (React Context):** Used for managing global client-side state, such as the current user's session.

## 7. Technical Constraints
*   **Vendor Lock-in:** The heavy reliance on Supabase and Vercel introduces a degree of vendor lock-in. Migrating to another platform in the future would require significant effort. This is an accepted trade-off for the initial speed of development.
*   **Geolocation API:** The "Near Me" feature is dependent on the user granting location permissions in their browser, which is not guaranteed.

## 8. API Specifications
*   The primary method for client-server communication will be through Next.js Server Actions. This is an internal RPC-style API.
*   A public-facing REST or GraphQL API is out of scope for V1 but may be considered in the future.

## 9. Data Storage
*   **Database:** Supabase-managed PostgreSQL.
*   **Database Schema:**
    *   `profiles`: Stores user data, linked to `auth.users`.
    *   `activities`: Stores details for all recreational activities.
    *   `bookings`: Manages all user bookings.
    *   `reviews`: Stores user ratings and comments for activities.
    *   `favorites`: Manages users' saved activities.
*   **Data Access:** Data will be accessed from server-side components and Server Actions using the `supabase-js` library. RLS policies will enforce access control.

## 10. Security Considerations
*   **Authentication:** Handled by Supabase Auth, which uses JWTs. The session is managed securely via cookies.
*   **Authorization:** Enforced via PostgreSQL's Row Level Security (RLS) policies.
*   **Environment Variables:** All secret keys (Supabase URL, service keys) will be stored in environment variables and will not be exposed to the client-side.
*   **Data Encryption:** Supabase encrypts data both at rest and in transit.

## 11. Performance Considerations
*   **Server-Side Rendering (SSR):** Used for dynamic pages to ensure fast initial loads.
*   **Database Indexing:** Proper indexing will be applied to tables on foreign keys and frequently queried columns.
*   **Image Optimization:** Next.js Image component will be used to automatically optimize and serve images in modern formats like WebP.
*   **Geospatial Queries:** PostGIS will be enabled for efficient location-based queries.

## 12. Scalability Considerations
*   **Serverless Architecture:** Both Vercel and Supabase are built on serverless principles, allowing the application to scale automatically based on traffic without manual intervention.
*   **Database Scaling:** Supabase allows for easy scaling of the underlying PostgreSQL database as needed.

## 13. Open Issues
*   **Payment Gateway Selection:** A provider like Stripe Connect must be selected and its architecture planned. This is the highest priority technical decision remaining.

## 14. Future Considerations
*   **Caching Layer:** For very high-traffic scenarios, a caching layer like Redis could be introduced.
*   **Microservices:** For computationally intensive tasks (e.g., a recommendation engine), dedicated microservices could be developed.
*   **Real-time Features:** Supabase Realtime could be used for features like live availability updates.

## 15. Glossary
*   **BaaS:** Backend-as-a-Service.
*   **RLS:** Row Level Security.
*   **JWT:** JSON Web Token.
*   **RPC:** Remote Procedure Call.