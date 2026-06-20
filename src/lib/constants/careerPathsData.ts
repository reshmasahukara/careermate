export interface Milestone {
  week: number;
  title: string;
  description: string;
  resources: string[];
}

export interface Resource {
  title: string;
  provider: string;
  url: string;
  type: string;
  difficulty: string;
  duration: string;
  skills: string[];
}

export interface CareerPathDetail {
  role: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  durationWeeks: number;
  prerequisites: string[];
  projects: { title: string; description: string }[];
  certifications: string[];
  milestones: Milestone[];
  resources: Resource[];
}

export const CAREER_PATHS_DATA: Record<string, CareerPathDetail> = {
  "Frontend Developer": {
    role: "Frontend Developer",
    category: "Web Development",
    difficulty: "Beginner",
    durationWeeks: 8,
    prerequisites: ["Basic HTML & CSS knowledge", "Basic programming logic"],
    projects: [
      { title: "Portfolio Website", description: "Design and build a responsive personal portfolio using modern CSS and semantic HTML." },
      { title: "Dynamic Task Tracker", description: "Create a reactive tasks application in React fetching from local storage." }
    ],
    certifications: ["Meta Front-End Developer Certificate (Coursera)"],
    milestones: [
      { week: 1, title: "HTML5 & Semantic Web", description: "Master layout tags, accessibility rules, and semantic structure.", resources: ["https://developer.mozilla.org/en-US/docs/Learn"] },
      { week: 2, title: "CSS Flexbox & Grid layouts", description: "Learn responsive design patterns, media queries, and modern layouts.", resources: ["https://www.freecodecamp.org/learn/responsive-web-design/"] },
      { week: 3, title: "JavaScript ES6 Essentials", description: "Understand data types, array methods, fetch API, and promises.", resources: ["https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/"] },
      { week: 4, title: "React Components & Hooks", description: "Understand JSX, state, props, useState, and useEffect hooks.", resources: ["https://www.coursera.org/specializations/user-interface-development"] },
      { week: 5, title: "React State Management", description: "Implement Context API and Redux Toolkit for clean state flow.", resources: ["https://www.udemy.com/course/react-the-complete-guide-incl-redux/"] },
      { week: 6, title: "CSS Frameworks & Tailwind", description: "Integrate tailwind CSS or CSS modules in a Next.js environment.", resources: ["https://developer.mozilla.org/en-US/docs/Web/CSS"] },
      { week: 7, title: "Version Control and Git", description: "Use branching, committing, merging, and pull requests on GitHub.", resources: ["https://www.freecodecamp.org/news/git-and-github-crash-course/"] },
      { week: 8, title: "Deployment & Vercel hosting", description: "Optimize bundle sizes, set up CI/CD pipeline, and host on Vercel.", resources: ["https://developer.mozilla.org/en-US/docs/Learn/Common_questions/How_do_you_host_your_website"] }
    ],
    resources: [
      { title: "MDN Web Development Guide", provider: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Learn", type: "Documentation", difficulty: "Beginner", duration: "Self-paced", skills: ["HTML", "CSS", "JavaScript"] },
      { title: "Responsive Web Design Certification", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/responsive-web-design/", type: "Course", difficulty: "Beginner", duration: "300 Hours", skills: ["HTML", "CSS"] },
      { title: "Meta Front-End Professional Certificate", provider: "Coursera", url: "https://www.coursera.org/professional-certificates/meta-front-end-developer", type: "Certification", difficulty: "Intermediate", duration: "7 Months", skills: ["React", "JavaScript"] }
    ]
  },
  "Backend Developer": {
    role: "Backend Developer",
    category: "Web Development",
    difficulty: "Intermediate",
    durationWeeks: 8,
    prerequisites: ["JavaScript Basics", "SQL Fundamentals"],
    projects: [
      { title: "E-Commerce REST API", description: "Implement complete user authentication, cart management, and payment checkout endpoint using Express." },
      { title: "Real-time Chat Server", description: "Build a persistent messaging engine using Node.js and WebSockets." }
    ],
    certifications: ["IBM Back-End Professional Certificate (Coursera)"],
    milestones: [
      { week: 1, title: "Node.js Architecture", description: "Learn event loops, asynchronous programming, modules, and file system.", resources: ["https://www.freecodecamp.org/news/introduction-to-nodejs/"] },
      { week: 2, title: "Express.js REST APIs", description: "Set up routing, middleware, controllers, and error handling mechanisms.", resources: ["https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/"] },
      { week: 3, title: "Relational Databases & SQL", description: "Learn schema design, queries, joins, indices, and transactions in Postgres.", resources: ["https://www.geeksforgeeks.org/sql-tutorial/"] },
      { week: 4, title: "Object-Relational Mapping (Prisma)", description: "Configure Prisma client, run migrations, and perform database CRUD.", resources: ["https://www.freecodecamp.org/news/learn-prisma-orm/"] },
      { week: 5, title: "Authentication & JWT", description: "Design secure session management, password hashing, and user roles.", resources: ["https://www.udemy.com/course/jwt-authentication-in-node/"] },
      { week: 6, title: "Caching & Redis", description: "Implement distributed caching to accelerate query times.", resources: ["https://developer.mozilla.org/en-US/docs/Glossary/Cache"] },
      { week: 7, title: "Testing (Jest & Supertest)", description: "Write unit tests and endpoint integration tests.", resources: ["https://www.freecodecamp.org/news/how-to-test-express-with-jest/"] },
      { week: 8, title: "API Deployment & Docker", description: "Containerize the application and deploy on PaaS providers.", resources: ["https://www.coursera.org/specializations/docker-kubernetes-deployment"] }
    ],
    resources: [
      { title: "Node.js Guide", provider: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs", type: "Documentation", difficulty: "Intermediate", duration: "20 Hours", skills: ["Node.js", "Express"] },
      { title: "PostgreSQL Tutorial", provider: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/postgresql-tutorial/", type: "Documentation", difficulty: "Beginner", duration: "15 Hours", skills: ["PostgreSQL", "SQL"] },
      { title: "Express, Node, MongoDB Bootcamp", provider: "Udemy", url: "https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/", type: "Course", difficulty: "Intermediate", duration: "42 Hours", skills: ["Express", "Node.js", "MongoDB"] }
    ]
  },
  "Full Stack Developer": {
    role: "Full Stack Developer",
    category: "Web Development",
    difficulty: "Intermediate",
    durationWeeks: 10,
    prerequisites: ["HTML & CSS", "JavaScript ES6 Basics"],
    projects: [
      { title: "Social Blogging Platform", description: "Complete platform with frontend client, API server, database relationships, and rich editor." },
      { title: "SaaS Multi-tenant App", description: "Implement Stripe payments, customer profiles, dynamic content serving, and auth." }
    ],
    certifications: ["IBM Full Stack Software Developer Certificate (Coursera)"],
    milestones: [
      { week: 1, title: "Frontend Layout & Flexbox", description: "Develop modern semantic layout designs using CSS and HTML5.", resources: ["https://developer.mozilla.org/en-US/docs/Learn"] },
      { week: 2, title: "Dynamic React Clients", description: "Build interactive layouts using props, states, and hooks.", resources: ["https://www.freecodecamp.org/learn/front-end-development-libraries/"] },
      { week: 3, title: "API Server Design", description: "Write express routes, middleware, and request parsers.", resources: ["https://www.freecodecamp.org/learn/back-end-development-and-apis/"] },
      { week: 4, title: "Database Schema Integration", description: "Build relationship models in PostgreSQL and execute migrations.", resources: ["https://www.coursera.org/specializations/postgresql-for-everybody"] },
      { week: 5, title: "Next.js App Router Framework", description: "Understand Server/Client components, SSR, and dynamic routes.", resources: ["https://nextjs.org/docs"] },
      { week: 6, title: "NextAuth / Authentication", description: "Set up multi-provider session check using JWT.", resources: ["https://www.udemy.com/course/nextjs-complete-guide/"] },
      { week: 7, title: "State Flow & Context API", description: "Manage global user states, loading indicators, and cache.", resources: ["https://www.freecodecamp.org/news/react-context-api/"] },
      { week: 8, title: "Stripe Subscription Payment", description: "Integrate Stripe billing portals and webhook processing.", resources: ["https://www.udemy.com/course/stripe-payment-integration/"] },
      { week: 9, title: "Form Validation & Error States", description: "Validate incoming payloads with Zod and React Hook Form.", resources: ["https://developer.mozilla.org/en-US/docs/Learn/Forms"] },
      { week: 10, title: "CI/CD & Cloud Hosting", description: "Deploy Next.js on Vercel and synchronize with Neon DB.", resources: ["https://www.coursera.org/learn/cloud-application-deployment"] }
    ],
    resources: [
      { title: "Full Stack Open", provider: "University of Helsinki", url: "https://www.coursera.org/professional-certificates/ibm-full-stack-cloud-developer", type: "Certification", difficulty: "Intermediate", duration: "120 Hours", skills: ["React", "Node.js", "GraphQL"] },
      { title: "The Odin Project Curriculum", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/back-end-development-and-apis/", type: "Course", difficulty: "Beginner", duration: "300 Hours", skills: ["JavaScript", "APIs"] }
    ]
  },
  "Python Developer": {
    role: "Python Developer",
    category: "Web Development",
    difficulty: "Beginner",
    durationWeeks: 6,
    prerequisites: ["Computer operation basics"],
    projects: [
      { title: "Local Analytics Processor", description: "Write Python scripts to parse massive CSV/JSON files, computing custom stats." },
      { title: "Django Resource API", description: "Expose product catalog endpoints with Django REST Framework." }
    ],
    certifications: ["Google IT Automation with Python Professional Certificate (Coursera)"],
    milestones: [
      { week: 1, title: "Python Syntax & Basic Data", description: "Variables, lists, dicts, conditionals, loops, and functions.", resources: ["https://docs.python.org/3/tutorial/"] },
      { week: 2, title: "Object-Oriented Programming (OOP)", description: "Classes, inheritances, encapsulation, and magic methods.", resources: ["https://www.freecodecamp.org/news/python-oop-tutorial/"] },
      { week: 3, title: "File Operations & Exceptions", description: "Handle file readers/writers, JSON parser, and try-except blocks.", resources: ["https://www.geeksforgeeks.org/python-programming-language/"] },
      { week: 4, title: "REST APIs with Flask", description: "Establish lightweight servers, routes, and JSON responses.", resources: ["https://www.udemy.com/course/flask-framework-complete/"] },
      { week: 5, title: "Relational Models with Django ORM", description: "Build data schemas, run migrations, and execute queries.", resources: ["https://www.freecodecamp.org/news/django-framework-course/"] },
      { week: 6, title: "Unit Testing & Poetry packaging", description: "Use PyTest for assertion validations and package dependencies.", resources: ["https://www.hackerrank.com/domains/python"] }
    ],
    resources: [
      { title: "Python Tutorial Docs", provider: "Python Official Documentation", url: "https://docs.python.org/3/", type: "Documentation", difficulty: "Beginner", duration: "Self-paced", skills: ["Python"] },
      { title: "Python for Everybody", provider: "Coursera", url: "https://www.coursera.org/specializations/python", type: "Course", difficulty: "Beginner", duration: "8 Months", skills: ["Python", "Databases"] }
    ]
  },
  "Java Developer": {
    role: "Java Developer",
    category: "Web Development",
    difficulty: "Intermediate",
    durationWeeks: 8,
    prerequisites: ["Object-Oriented programming concepts"],
    projects: [
      { title: "Inventory Management Engine", description: "Console-based or Web REST app managing inventory flows using JDBC." },
      { title: "Spring Boot Microservice", description: "Develop an authenticated customer microservice connected to database." }
    ],
    certifications: ["Oracle Certified Associate Java Programmer (Udemy)"],
    milestones: [
      { week: 1, title: "Java OOP Foundations", description: "Compile variables, classes, methods, JVM parameters, garbage collection.", resources: ["https://docs.oracle.com/javase/tutorial/"] },
      { week: 2, title: "Java Collections Framework", description: "Master Lists, Sets, Maps, and dynamic iterations.", resources: ["https://www.geeksforgeeks.org/java/"] },
      { week: 3, title: "Exceptions & Generics", description: "Write structured catch blocks and customize type safety templates.", resources: ["https://www.freecodecamp.org/news/java-course-for-beginners/"] },
      { week: 4, title: "JDBC Database Operations", description: "Form connection strings, prepare sql templates, and process result sets.", resources: ["https://www.udemy.com/course/java-database-connection-jdbc/"] },
      { week: 5, title: "Spring Boot Architecture", description: "Explain IOC, DI containers, components scanning, application properties.", resources: ["https://www.freecodecamp.org/news/spring-boot-tutorial/"] },
      { week: 6, title: "Spring Boot REST Controller", description: "Build REST mapping endpoints with DTO objects and valid validations.", resources: ["https://www.udemy.com/course/spring-boot-and-spring-framework-tutorial/"] },
      { week: 7, title: "Spring Data JPA & Postgres", description: "Map entities, write repositories, and perform transactions.", resources: ["https://www.coursera.org/learn/spring-mvc-data-jpa"] },
      { week: 8, title: "Spring Security & Unit Testing", description: "Configure basic authorization, mock controllers with JUnit.", resources: ["https://www.hackerrank.com/domains/java"] }
    ],
    resources: [
      { title: "Java Programming Tutorials", provider: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/java/", type: "Documentation", difficulty: "Beginner", duration: "Self-paced", skills: ["Java"] },
      { title: "Spring Boot Introduction", provider: "Udemy", url: "https://www.udemy.com/course/spring-boot-and-spring-framework-tutorial/", type: "Course", difficulty: "Intermediate", duration: "30 Hours", skills: ["Spring Boot", "Java"] }
    ]
  },
  "Mobile App Developer": {
    role: "Mobile App Developer",
    category: "Web Development",
    difficulty: "Intermediate",
    durationWeeks: 8,
    prerequisites: ["JavaScript Basics", "React foundations"],
    projects: [
      { title: "Fitness Tracking Mobile App", description: "Create a cross-platform React Native app with maps, dashboard stats, and local DB." },
      { title: "Weather Forecast Client", description: "Develop an app displaying forecast conditions based on coordinates." }
    ],
    certifications: ["Meta Android/iOS Developer Certificate (Coursera)"],
    milestones: [
      { week: 1, title: "React Native Setup & Flexbox Layout", description: "Establish environment config, build view nodes, compile styles.", resources: ["https://reactnative.dev/docs/getting-started"] },
      { week: 2, title: "Native Event Handlers & Hooks", description: "Store local form variables and coordinate scroll views.", resources: ["https://www.freecodecamp.org/news/react-native-tutorial/"] },
      { week: 3, title: "Navigation Architecture", description: "Implement Stack and Tab structures using React Navigation library.", resources: ["https://www.udemy.com/course/react-native-the-practical-guide/"] },
      { week: 4, title: "Local Storage & SQLite", description: "Write local database schemas and fetch query caches.", resources: ["https://www.geeksforgeeks.org/mobile-app-development-tutorial/"] },
      { week: 5, title: "Consuming REST APIs", description: "Coordinate axios promises and represent state loaders.", resources: ["https://www.coursera.org/specializations/react-native-mobile-app-development"] },
      { week: 6, title: "Accessing Native Hardware Devices", description: "Configure location services, compass sensors, and camera options.", resources: ["https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API"] },
      { week: 7, title: "Push Notification Channels", description: "Establish channel credentials and fetch token identifiers.", resources: ["https://www.udemy.com/course/react-native-advanced/"] },
      { week: 8, title: "Application Store Optimization & Build", description: "Package release configuration bundles for App Store and Play Store.", resources: ["https://www.freecodecamp.org/news/how-to-publish-your-first-mobile-app/"] }
    ],
    resources: [
      { title: "React Native official docs", provider: "React Native Documentation", url: "https://reactnative.dev/docs/getting-started", type: "Documentation", difficulty: "Intermediate", duration: "10 Hours", skills: ["React Native", "JavaScript"] },
      { title: "Mobile App Development Guide", provider: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/mobile-app-development-tutorial/", type: "Documentation", difficulty: "Beginner", duration: "25 Hours", skills: ["Swift", "Kotlin", "React Native"] }
    ]
  },
  "Data Structures & Algorithms": {
    role: "Data Structures & Algorithms",
    category: "Core Skills",
    difficulty: "Intermediate",
    durationWeeks: 8,
    prerequisites: ["Basic logic flow in any programming language (Python, C++, Java)"],
    projects: [
      { title: "Custom Hash Table & Graph Library", description: "Build custom implementations of dynamic lists, HashMaps, and Adjacency Graphs." },
      { title: "Shortest Path Visualization Server", description: "Write Dijkstra's or A* algorithms solving pathfinder simulations." }
    ],
    certifications: ["Algorithms Specialization (Princeton on Coursera)"],
    milestones: [
      { week: 1, title: "Time & Space Complexities", description: "Define Big O notation, verify execution bounds, measure stacks.", resources: ["https://www.geeksforgeeks.org/analysis-of-algorithms-standard-problems-and-solutions/"] },
      { week: 2, title: "Arrays & Linked Lists", description: "Reverse lists, identify loops, evaluate sliding window limits.", resources: ["https://leetcode.com/explore/interview/card/top-interview-questions-easy/"] },
      { week: 3, title: "Hash Tables & Collisions", description: "Explain hashing functions, build chaining buckets, compute load parameters.", resources: ["https://www.hackerrank.com/domains/data-structures"] },
      { week: 4, title: "Recursion & Backtracking", description: "Write recursive calls, solve N-Queens constraints, build decision maps.", resources: ["https://www.codechef.com/practice"] },
      { week: 5, title: "Binary Trees & Searching", description: "Implement Inorder, Preorder, and Postorder searches, balance trees.", resources: ["https://leetcode.com/explore/learn/card/data-structure-binary-tree/"] },
      { week: 6, title: "Sorting Algorithms", description: "Compare MergeSort, QuickSort, and HeapSort run times.", resources: ["https://www.freecodecamp.org/news/data-structures-and-algorithms-bootcamp/"] },
      { week: 7, title: "Graph Traversals (BFS & DFS)", description: "Track node matrices, find connection lists, identify paths.", resources: ["https://leetcode.com/explore/learn/card/graph/"] },
      { week: 8, title: "Dynamic Programming Foundations", description: "Write memoized algorithms, build grid arrays, solve knapsack scenarios.", resources: ["https://www.geeksforgeeks.org/dynamic-programming/"] }
    ],
    resources: [
      { title: "Algorithms Specialization", provider: "Coursera", url: "https://www.coursera.org/specializations/algorithms", type: "Course", difficulty: "Advanced", duration: "4 Months", skills: ["Algorithms", "Complexity"] },
      { title: "LeetCode Practice Tracks", provider: "LeetCode", url: "https://leetcode.com/study-plan/", type: "Practice", difficulty: "Intermediate", duration: "Ongoing", skills: ["DSA", "Problem Solving"] },
      { title: "Data Structures Reference", provider: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/data-structures/", type: "Documentation", difficulty: "Intermediate", duration: "Self-paced", skills: ["Data Structures"] }
    ]
  },
  "Data Analyst": {
    role: "Data Analyst",
    category: "AI & Data",
    difficulty: "Beginner",
    durationWeeks: 6,
    prerequisites: ["Comfort with spreadsheets", "Basic algebraic concepts"],
    projects: [
      { title: "Sales Revenue Dashboard", description: "Clean dynamic records in Python, build interactive visualization charts in PowerBI/Tableau." },
      { title: "SQL Cohort Analysis", description: "Write queries analyzing user monthly retention rates." }
    ],
    certifications: ["Google Data Analytics Professional Certificate (Coursera)"],
    milestones: [
      { week: 1, title: "Spreadsheet Analytics", description: "Use pivot charts, write conditional formulas, trace dependencies.", resources: ["https://www.coursera.org/professional-certificates/google-data-analytics"] },
      { week: 2, title: "SQL Database Queries", description: "Filter columns, aggregate records, write joins, process metrics.", resources: ["https://www.geeksforgeeks.org/sql-tutorial/"] },
      { week: 3, title: "Python Pandas DataFrames", description: "Write code to read spreadsheets, filter entries, clean empty cells.", resources: ["https://www.freecodecamp.org/news/pandas-read-csv/"] },
      { week: 4, title: "Data Visualization (Seaborn)", description: "Compile line plots, box plots, heatmap matrices, and custom graphs.", resources: ["https://www.udemy.com/course/data-analysis-with-pandas/"] },
      { week: 5, title: "Statistical Assertions", description: "Formulate null hypotheses, calculate p-values, measure standard limits.", resources: ["https://www.coursera.org/specializations/statistics-with-python"] },
      { week: 6, title: "Cohort Analysis Report", description: "Assemble data dashboards and deliver dynamic presentation slides.", resources: ["https://www.hackerrank.com/domains/sql"] }
    ],
    resources: [
      { title: "Google Data Analytics", provider: "Coursera", url: "https://www.coursera.org/professional-certificates/google-data-analytics", type: "Certification", difficulty: "Beginner", duration: "6 Months", skills: ["Data Analysis", "SQL", "Tableau"] },
      { title: "SQL Tutorial", provider: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/sql-tutorial/", type: "Documentation", difficulty: "Beginner", duration: "10 Hours", skills: ["SQL", "Databases"] }
    ]
  },
  "Data Scientist": {
    role: "Data Scientist",
    category: "AI & Data",
    difficulty: "Advanced",
    durationWeeks: 8,
    prerequisites: ["Python basics", "Calculus & Linear Algebra"],
    projects: [
      { title: "Real Estate Valuation Modeler", description: "Train multi-variable regression models predicting valuations." },
      { title: "Customer Clustering Analytics", description: "Execute K-Means algorithms segmenting consumer metrics." }
    ],
    certifications: ["IBM Data Science Professional Certificate (Coursera)"],
    milestones: [
      { week: 1, title: "Linear Algebra & Matrices", description: "Define vector spaces, calculate matrix products, identify eigenvalues.", resources: ["https://www.coursera.org/specializations/mathematics-machine-learning"] },
      { week: 2, title: "Data Wrangling with Pandas", description: "Clean records, normalize scales, compute missing column values.", resources: ["https://www.freecodecamp.org/news/python-pandas-tutorial/"] },
      { week: 3, title: "Feature Selection & Outliers", description: "Execute PCA dimensionality reductions, remove record variances.", resources: ["https://www.udemy.com/course/datascience/"] },
      { week: 4, title: "Supervised Learning Models", description: "Fit Decision Trees, Random Forests, and Support Vector Machines.", resources: ["https://www.freecodecamp.org/news/machine-learning-mean-squared-error/"] },
      { week: 5, title: "Unsupervised Clusters (K-Means)", description: "Measure cluster distance paths, evaluate density distributions.", resources: ["https://www.geeksforgeeks.org/clustering-in-machine-learning/"] },
      { week: 6, title: "Model Validations (ROC/AUC)", description: "Plot ROC curves, measure classification precision, compute F1-scores.", resources: ["https://www.udemy.com/course/machinelearning/"] },
      { week: 7, title: "Neural Network Foundations", description: "Write forwarding paths, backpropagation loops, error functions.", resources: ["https://pytorch.org/tutorials/"] },
      { week: 8, title: "A/B Testing Setup", description: "Assemble significance templates, check statistical confidence intervals.", resources: ["https://www.coursera.org/learn/data-science-methodology"] }
    ],
    resources: [
      { title: "IBM Data Science Professional Certificate", provider: "Coursera", url: "https://www.coursera.org/professional-certificates/ibm-data-science", type: "Certification", difficulty: "Intermediate", duration: "10 Months", skills: ["Python", "SQL", "Machine Learning"] },
      { title: "PyTorch Basics", provider: "PyTorch Documentation", url: "https://pytorch.org/tutorials/beginner/basics/intro.html", type: "Documentation", difficulty: "Intermediate", duration: "12 Hours", skills: ["PyTorch", "Python"] }
    ]
  },
  "Machine Learning Engineer": {
    role: "Machine Learning Engineer",
    category: "AI & Data",
    difficulty: "Advanced",
    durationWeeks: 8,
    prerequisites: ["Python programming", "Linear Algebra", "Basic Statistics"],
    projects: [
      { title: "Image Categorization Classifier", description: "Train CNN networks classifying custom category directories." },
      { title: "API Pricing Predictor", description: "Deploy trained prediction structures exposed as active REST interfaces." }
    ],
    certifications: ["Machine Learning Specialization (Stanford on Coursera)"],
    milestones: [
      { week: 1, title: "Supervised Regression & Cost Functions", description: "Calculate gradient descent metrics, adjust model weights.", resources: ["https://www.coursera.org/specializations/machine-learning-introduction"] },
      { week: 2, title: "Classification & Logic Trees", description: "Write logic arrays, tune decision tree splits.", resources: ["https://www.freecodecamp.org/news/machine-learning-classification-guide/"] },
      { week: 3, title: "Feature Scale Adjustments", description: "Run StandardScaler models, convert categorical variables.", resources: ["https://scikit-learn.org/stable/user_guide.html"] },
      { week: 4, title: "Gradient Boosted Models (XGBoost)", description: "Fit ensembles, optimize tree counts, configure learning paces.", resources: ["https://www.udemy.com/course/machinelearning/"] },
      { week: 5, title: "Neural Networks with PyTorch", description: "Write training loops, check loss indexes, execute backpropagation.", resources: ["https://pytorch.org/tutorials/"] },
      { week: 6, title: "CNN Image Classifiers", description: "Assemble convolutional layers, max pooling boundaries.", resources: ["https://www.tensorflow.org/tutorials"] },
      { week: 7, title: "Hyperparameter Search Tuning", description: "Utilize GridSearch frameworks, set cross validation counts.", resources: ["https://scikit-learn.org/stable/modules/grid_search.html"] },
      { week: 8, title: "Model Exporting & Serialization", description: "Use ONNX formats, deploy endpoint files to local servers.", resources: ["https://www.udemy.com/course/deployment-of-machine-learning-models/"] }
    ],
    resources: [
      { title: "Machine Learning Specialization", provider: "Coursera", url: "https://www.coursera.org/specializations/machine-learning-introduction", type: "Course", difficulty: "Intermediate", duration: "2 Months", skills: ["Math", "Python", "ML"] },
      { title: "Scikit-Learn User Guide", provider: "Scikit-Learn Documentation", url: "https://scikit-learn.org/stable/user_guide.html", type: "Documentation", difficulty: "Intermediate", duration: "Self-paced", skills: ["Scikit-Learn"] },
      { title: "TensorFlow Tutorials", provider: "TensorFlow Documentation", url: "https://www.tensorflow.org/tutorials", type: "Documentation", difficulty: "Intermediate", duration: "20 Hours", skills: ["TensorFlow", "Keras"] }
    ]
  },
  "AI/ML Engineer": {
    role: "AI/ML Engineer",
    category: "AI & Data",
    difficulty: "Advanced",
    durationWeeks: 8,
    prerequisites: ["Python programming", "Deep Learning Foundations"],
    projects: [
      { title: "Image Generation Transformer", description: "Train GAN or Autoencoder structures generating custom sample models." },
      { title: "Predictive Analytics API", description: "Package model files into Docker environments exposed via FastAPI." }
    ],
    certifications: ["Deep Learning Specialization (Coursera)"],
    milestones: [
      { week: 1, title: "Deep Neural Networks", description: "Write weight matrices, coordinate activation functions.", resources: ["https://www.coursera.org/specializations/deep-learning"] },
      { week: 2, title: "PyTorch Modeling", description: "Form custom module subclasses, run data loaders.", resources: ["https://pytorch.org/tutorials/"] },
      { week: 3, title: "CNN Architectures", description: "Examine ResNet, VGG architectures, build pooling maps.", resources: ["https://www.tensorflow.org/tutorials/images/cnn"] },
      { week: 4, title: "RNN & LSTM Networks", description: "Design sequence models, manage cell states.", resources: ["https://pytorch.org/tutorials/beginner/nlp/sequence_models_tutorial.html"] },
      { week: 5, title: "Transformer Self-Attention", description: "Write multi-head self-attention mechanisms, embed sequence vectors.", resources: ["https://huggingface.co/learn/nlp-course/chapter1/1"] },
      { week: 6, title: "API Model Server Routing", description: "Coordinate request threads, build schema models in FastAPI.", resources: ["https://www.freecodecamp.org/news/fastapi-quickstart/"] },
      { week: 7, title: "Containerizing Models (Docker)", description: "Write Dockerfiles, copy files, expose ports.", resources: ["https://www.udemy.com/course/docker-kubernetes-bootcamp/"] },
      { week: 8, title: "Monitoring Model Performance", description: "Monitor query latency, watch output variance parameters.", resources: ["https://www.coursera.org/learn/machine-learning-operations-mlops-fundamentals"] }
    ],
    resources: [
      { title: "Deep Learning Specialization", provider: "Coursera", url: "https://www.coursera.org/specializations/deep-learning", type: "Course", difficulty: "Advanced", duration: "5 Months", skills: ["PyTorch", "Deep Learning"] },
      { title: "PyTorch Reference Guide", provider: "PyTorch Documentation", url: "https://pytorch.org/", type: "Documentation", difficulty: "Advanced", duration: "Self-paced", skills: ["PyTorch", "Python"] }
    ]
  },
  "Generative AI Engineer": {
    role: "Generative AI Engineer",
    category: "AI & Data",
    difficulty: "Advanced",
    durationWeeks: 6,
    prerequisites: ["Python programming", "REST API usage"],
    projects: [
      { title: "Retrieval-Augmented Generation (RAG)", description: "Build a document Q&A engine connecting LangChain, VectorDB, and OpenAI." },
      { title: "Autonomous Text Summarizer", description: "Build client apps optimizing context lengths using prompt engineering." }
    ],
    certifications: ["Generative AI Professional (DeepLearning.AI on Coursera)"],
    milestones: [
      { week: 1, title: "Prompt Engineering & Tokenizer limits", description: "Optimize prompt contexts, analyze token costs.", resources: ["https://platform.openai.com/docs/guides/prompt-engineering"] },
      { week: 2, title: "OpenAI Completion APIs", description: "Manage temperature settings, parse json response objects.", resources: ["https://platform.openai.com/docs/api-reference"] },
      { week: 3, title: "Vector DB Embeddings (Pinecone)", description: "Calculate cosine similarities, compile query vectors.", resources: ["https://www.freecodecamp.org/news/vector-search-tutorial/"] },
      { week: 4, title: "LangChain Orchestration chains", description: "Coordinate prompt models, combine action chains.", resources: ["https://python.langchain.com/docs/get_started/introduction"] },
      { week: 5, title: "LlamaIndex RAG Pipelines", description: "Parse documents, index nodes, parse retriever results.", resources: ["https://www.udemy.com/course/generative-ai-bootcamp/"] },
      { week: 6, title: "Fine-tuning LLM templates", description: "Assemble training files, upload datasets, analyze validation logs.", resources: ["https://huggingface.co/docs/transformers/training"] }
    ],
    resources: [
      { title: "OpenAI Quickstart Guide", provider: "OpenAI Documentation", url: "https://platform.openai.com/docs/quickstart", type: "Documentation", difficulty: "Intermediate", duration: "5 Hours", skills: ["OpenAI API", "GPT"] },
      { title: "LangChain Setup Guides", provider: "LangChain Documentation", url: "https://python.langchain.com/docs/get_started/introduction", type: "Documentation", difficulty: "Intermediate", duration: "8 Hours", skills: ["LangChain", "Python"] },
      { title: "Hugging Face Model Hub Tutorials", provider: "Hugging Face", url: "https://huggingface.co/learn", type: "Documentation", difficulty: "Advanced", duration: "Self-paced", skills: ["Transformers", "Hugging Face"] }
    ]
  },
  "Agentic AI Developer": {
    role: "Agentic AI Developer",
    category: "AI & Data",
    difficulty: "Advanced",
    durationWeeks: 6,
    prerequisites: ["Generative AI basics", "LangChain concepts"],
    projects: [
      { title: "Automated Software Developer Agent", description: "Design multi-agent setups using CrewAI to write, compile, and test code." },
      { title: "Dynamic Task Manager Agent", description: "Implement LangGraph flowcharts defining custom routing loops and state memory." }
    ],
    certifications: ["AI Agent Development Course (Coursera)"],
    milestones: [
      { week: 1, title: "AI Agent Concepts & Tool Calling", description: "Bind Python functions as executable tools, configure JSON schemas.", resources: ["https://platform.openai.com/docs/guides/function-calling"] },
      { week: 2, title: "LangGraph Statecharts", description: "Map node operations, trace transition pathways, build cyclic routes.", resources: ["https://python.langchain.com/docs/langgraph"] },
      { week: 3, title: "CrewAI Orchestrations", description: "Establish tasks, coordinate roles, distribute agent jobs.", resources: ["https://docs.crewai.com/"] },
      { week: 4, title: "Agent Memory Architectures", description: "Implement vector databases, session memories, and user histories.", resources: ["https://www.udemy.com/course/agentic-ai-architectures/"] },
      { week: 5, title: "Autogen Multi-agent frameworks", description: "Configure message routines, build conversable agent structures.", resources: ["https://microsoft.github.io/autogen/"] },
      { week: 6, title: "Agent Evaluation & Security", description: "Validate agent loop counts, mitigate prompt injections.", resources: ["https://www.coursera.org/specializations/ai-agentic-developer"] }
    ],
    resources: [
      { title: "OpenAI Function Calling Docs", provider: "OpenAI Documentation", url: "https://platform.openai.com/docs/guides/function-calling", type: "Documentation", difficulty: "Advanced", duration: "4 Hours", skills: ["OpenAI API", "JSON Schema"] },
      { title: "LangGraph Concepts", provider: "LangChain Documentation", url: "https://python.langchain.com/docs/langgraph", type: "Documentation", difficulty: "Advanced", duration: "10 Hours", skills: ["LangGraph", "State Management"] }
    ]
  },
  "NLP Engineer": {
    role: "NLP Engineer",
    category: "AI & Data",
    difficulty: "Advanced",
    durationWeeks: 8,
    prerequisites: ["Python programming", "Machine Learning models"],
    projects: [
      { title: "Medical Record Named Entity Recognition (NER)", description: "Train spaCy pipelines tagging diagnostic classifications." },
      { title: "Sentiment Classification Service", description: "Train Transformer models parsing text statements." }
    ],
    certifications: ["NLP Specialization (Stanford on Coursera)"],
    milestones: [
      { week: 1, title: "Text Preprocessing & Regex", description: "Execute stemming, lemmatization, token extraction.", resources: ["https://www.geeksforgeeks.org/natural-language-processing-overview/"] },
      { week: 2, title: "Vector Word Embeddings", description: "Examine Word2Vec, GloVe vector representations.", resources: ["https://pytorch.org/tutorials/beginner/nlp/word_embeddings_tutorial.html"] },
      { week: 3, title: "spaCy NER Models", description: "Define custom tags, evaluate matching thresholds.", resources: ["https://spacy.io/usage/spacy-101"] },
      { week: 4, title: "Seq2Seq Models & Attention", description: "Examine encoder-decoder networks, calculate attention weights.", resources: ["https://pytorch.org/tutorials/intermediate/seq2seq_translation_tutorial.html"] },
      { week: 5, title: "Hugging Face Transformers", description: "Fetch model pipelines, tokenize string data inputs.", resources: ["https://huggingface.co/learn/nlp-course/"] },
      { week: 6, title: "BERT Classification Models", description: "Fine-tune pre-trained BERT networks, measure confusion matrices.", resources: ["https://huggingface.co/docs/transformers/model_doc/bert"] },
      { week: 7, title: "Parameter-Efficient Fine-Tuning (PEFT)", description: "Optimize adapters, apply LoRA modifications.", resources: ["https://huggingface.co/docs/peft/index"] },
      { week: 8, title: "NLP Pipeline Optimization", description: "Quantize weights, evaluate prompt inputs.", resources: ["https://www.coursera.org/specializations/natural-language-processing"] }
    ],
    resources: [
      { title: "Hugging Face NLP Course", provider: "Hugging Face", url: "https://huggingface.co/learn/nlp-course/", type: "Course", difficulty: "Advanced", duration: "40 Hours", skills: ["Transformers", "Hugging Face"] },
      { title: "spaCy 101 Guide", provider: "spaCy Documentation", url: "https://spacy.io/usage/spacy-101", type: "Documentation", difficulty: "Intermediate", duration: "6 Hours", skills: ["spaCy", "Python"] }
    ]
  },
  "Cybersecurity Analyst": {
    role: "Cybersecurity Analyst",
    category: "Cloud & Security",
    difficulty: "Beginner",
    durationWeeks: 6,
    prerequisites: ["Computer operation basics", "Basic networking concepts"],
    projects: [
      { title: "Local Firewall Configurator", description: "Setup iptables and run nmap audits analyzing local host port status." },
      { title: "Vulnerability Scan Audit", description: "Audit networks using OpenVAS, producing remediation logs." }
    ],
    certifications: ["Google Cybersecurity Professional Certificate (Coursera)"],
    milestones: [
      { week: 1, title: "Network Communication Protocols", description: "Examine OSI layers, TCP/IP handshakes, routing tables.", resources: ["https://tryhackme.com/module/network-fundamentals"] },
      { week: 2, title: "Linux Shell Scripting", description: "Navigate file systems, grep logs, customize permissions.", resources: ["https://www.freecodecamp.org/news/bash-scripting-tutorial/"] },
      { week: 3, title: "Penetration Testing (Nmap)", description: "Scan networks, categorize host operating systems.", resources: ["https://academy.hackthebox.com/"] },
      { week: 4, title: "Security Information & Event Management (SIEM)", description: "Collect events, set up alert channels.", resources: ["https://www.coursera.org/professional-certificates/google-cybersecurity"] },
      { week: 5, title: "Web Application Attacks (OWASP)", description: "Execute SQL injections, exploit cross-site scripts.", resources: ["https://owasp.org/www-project-top-ten/"] },
      { week: 6, title: "Incident Response logs", description: "Assemble threat logs, formulate mitigation plans.", resources: ["https://www.udemy.com/course/cybersecurity/"] }
    ],
    resources: [
      { title: "TryHackMe Security Path", provider: "TryHackMe", url: "https://tryhackme.com/", type: "Practice", difficulty: "Beginner", duration: "Ongoing", skills: ["Networking", "Linux"] },
      { title: "Hack The Box Academy", provider: "Hack The Box", url: "https://academy.hackthebox.com/", type: "Practice", difficulty: "Intermediate", duration: "Ongoing", skills: ["Ethical Hacking"] },
      { title: "OWASP Security Standards", provider: "OWASP Documentation", url: "https://owasp.org/www-project-top-ten/", type: "Documentation", difficulty: "Beginner", duration: "Self-paced", skills: ["Web Security"] }
    ]
  },
  "Cloud Engineer": {
    role: "Cloud Engineer",
    category: "Cloud & Security",
    difficulty: "Intermediate",
    durationWeeks: 8,
    prerequisites: ["Basic system admin skills", "Networking foundations"],
    projects: [
      { title: "AWS Static Host Pipeline", description: "Deploy portfolio pages using S3 buckets, CloudFront CDN, and Route53 DNS." },
      { title: "Terraform Multi-tier VPC", description: "Write config scripts detailing complete network load balancers." }
    ],
    certifications: ["AWS Certified Solutions Architect - Associate (AWS)"],
    milestones: [
      { week: 1, title: "Cloud Architecture Foundations", description: "Explain server scalability, storage buckets, CDN regions.", resources: ["https://explore.skillbuilder.aws/"] },
      { week: 2, title: "Compute & Auto Scaling (EC2)", description: "Set up EC2 VM instances, configure security rule lists.", resources: ["https://learn.microsoft.com/en-us/training/azure/"] },
      { week: 3, title: "Identity Access Management (IAM)", description: "Formulate user groups, restrict role privileges.", resources: ["https://www.cloudskillsboost.google/"] },
      { week: 4, title: "Virtual Private Networks (VPC)", description: "Divide subnets, route gateways, check flow records.", resources: ["https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/"] },
      { week: 5, title: "Cloud Databases (RDS)", description: "Provision managed relational databases, enable failovers.", resources: ["https://explore.skillbuilder.aws/"] },
      { week: 6, title: "Infrastructure as Code (Terraform)", description: "Declare configurations, construct dependency chains.", resources: ["https://www.freecodecamp.org/news/terraform-course-for-beginners/"] },
      { week: 7, title: "Serverless Computing (Lambda)", description: "Deploy trigger actions, connect API gateways.", resources: ["https://www.coursera.org/specializations/aws-fundamentals"] },
      { week: 8, title: "Cloud Billing & Budget Alerts", description: "Monitor billing details, configure budget warnings.", resources: ["https://explore.skillbuilder.aws/"] }
    ],
    resources: [
      { title: "AWS Skill Builder Catalog", provider: "AWS Skill Builder", url: "https://explore.skillbuilder.aws/", type: "Course", difficulty: "Intermediate", duration: "Self-paced", skills: ["AWS", "Cloud"] },
      { title: "Azure Learning Paths", provider: "Microsoft Learn", url: "https://learn.microsoft.com/en-us/training/azure/", type: "Course", difficulty: "Beginner", duration: "25 Hours", skills: ["Azure"] },
      { title: "GCP Skills Boost", provider: "Google Cloud Skills Boost", url: "https://www.cloudskillsboost.google/", type: "Practice", difficulty: "Intermediate", duration: "Ongoing", skills: ["GCP"] }
    ]
  },
  "DevOps Engineer": {
    role: "DevOps Engineer",
    category: "Cloud & Security",
    difficulty: "Advanced",
    durationWeeks: 8,
    prerequisites: ["Linux CLI", "Cloud Computing foundations"],
    projects: [
      { title: "GitHub Actions CI/CD Pipeline", description: "Create actions building, testing, and shipping container images to registry." },
      { title: "Kubernetes Local Deploy", description: "Assemble local clusters deploying high-availability services." }
    ],
    certifications: ["Certified Kubernetes Administrator (CKA)"],
    milestones: [
      { week: 1, title: "Containerization (Docker)", description: "Write Dockerfiles, build cache targets, construct container volumes.", resources: ["https://www.freecodecamp.org/news/docker-course-for-beginners/"] },
      { week: 2, title: "Docker Compose environments", description: "Coordinate multi-container setups, network database bridges.", resources: ["https://www.udemy.com/course/docker-mastery/"] },
      { week: 3, title: "GitHub Actions Automations", description: "Declare actions schedules, write job structures, secrets managers.", resources: ["https://www.freecodecamp.org/news/github-actions-tutorial/"] },
      { week: 4, title: "Infrastructure Config (Ansible)", description: "Write playbook scripts, automate system packages.", resources: ["https://www.geeksforgeeks.org/ansible-tutorial/"] },
      { week: 5, title: "Kubernetes Pods & Services", description: "Declare pod definitions, establish node balances.", resources: ["https://learn.microsoft.com/en-us/training/modules/intro-to-kubernetes/"] },
      { week: 6, title: "Kubernetes Deployments & Config", description: "Configure stateful sets, manage persistent volumes.", resources: ["https://www.udemy.com/course/certified-kubernetes-administrator/"] },
      { week: 7, title: "Monitoring (Prometheus & Grafana)", description: "Track CPU parameters, establish alarm rules.", resources: ["https://www.coursera.org/learn/devops-codereview-ci-cd"] },
      { week: 8, title: "Log Forwarders (ELK Stack)", description: "Examine error logs, construct search indices.", resources: ["https://www.udemy.com/course/devops-bootcamp/"] }
    ],
    resources: [
      { title: "Docker Crash Course", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/news/docker-course-for-beginners/", type: "Course", difficulty: "Intermediate", duration: "4 Hours", skills: ["Docker", "Containers"] },
      { title: "Kubernetes Introduction", provider: "Microsoft Learn", url: "https://learn.microsoft.com/en-us/training/modules/intro-to-kubernetes/", type: "Course", difficulty: "Advanced", duration: "10 Hours", skills: ["Kubernetes", "DevOps"] }
    ]
  },
  "UI/UX Designer": {
    role: "UI/UX Designer",
    category: "Design & Product",
    difficulty: "Beginner",
    durationWeeks: 6,
    prerequisites: ["Basic visual aesthetics", "No programming required"],
    projects: [
      { title: "Figma High-Fidelity Prototype", description: "Design a complete responsive mobile mockup with click paths." },
      { title: "User Persona Research Document", description: "Conduct research interviews, compiling target personas and user journey maps." }
    ],
    certifications: ["Google UX Design Professional Certificate (Coursera)"],
    milestones: [
      { week: 1, title: "Design Thinking Framework", description: "Empathize, Define, Ideate, Prototype, and Test design cycles.", resources: ["https://www.coursera.org/professional-certificates/google-ux-design"] },
      { week: 2, title: "Wireframing & Typography rules", description: "Build low-fidelity wireframes, configure scale layouts.", resources: ["https://developer.mozilla.org/en-US/docs/Web/Accessibility/Cognitive"] },
      { week: 3, title: "Figma Component Assets", description: "Design reusable buttons, input structures, and set layout constraints.", resources: ["https://www.udemy.com/course/figma-ux-ui-design-user-experience-tutorial/"] },
      { week: 4, title: "Interactive Prototyping", description: "Configure transition paths, build overlay modals.", resources: ["https://www.freecodecamp.org/news/ui-ux-design-tutorial/"] },
      { week: 5, title: "Accessibility Standards (WCAG)", description: "Validate contrast levels, verify text readability scales.", resources: ["https://developer.mozilla.org/en-US/docs/Web/Accessibility"] },
      { week: 6, title: "Usability Testing Methods", description: "Execute test cycles, assemble feedback summaries.", resources: ["https://www.coursera.org/learn/ux-design-process"] }
    ],
    resources: [
      { title: "Google UX Design Professional Certificate", provider: "Coursera", url: "https://www.coursera.org/professional-certificates/google-ux-design", type: "Certification", difficulty: "Beginner", duration: "6 Months", skills: ["UX Research", "Figma"] },
      { title: "MDN Accessibility Guides", provider: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility", type: "Documentation", difficulty: "Beginner", duration: "12 Hours", skills: ["Accessibility", "WCAG"] }
    ]
  },
  "Product Manager": {
    role: "Product Manager",
    category: "Design & Product",
    difficulty: "Intermediate",
    durationWeeks: 6,
    prerequisites: ["Basic understanding of business operations and software delivery"],
    projects: [
      { title: "Product Requirement Document (PRD)", description: "Write a PRD specifying feature scope, user stories, and telemetry metrics." },
      { title: "Product Roadmap presentation", description: "Assemble a slide deck detailing product goals and timelines." }
    ],
    certifications: ["Brand and Product Management (IE Business School on Coursera)"],
    milestones: [
      { week: 1, title: "Product Lifecycle stages", description: "Understand market needs, identify target user opportunities.", resources: ["https://www.coursera.org/specializations/product-management"] },
      { week: 2, title: "Writing User Stories & PRDs", description: "Format requirements, define criteria parameters.", resources: ["https://www.udemy.com/course/become-a-product-manager-key-skills-get-the-job/"] },
      { week: 3, title: "Agile & Scrum Methodologies", description: "Set sprint plans, run retrospectives.", resources: ["https://www.geeksforgeeks.org/agile-development-tutorial/"] },
      { week: 4, title: "Telemetry & Product Metrics (KPIs)", description: "Define conversion rates, analyze retention counts.", resources: ["https://www.coursera.org/learn/real-world-product-management"] },
      { week: 5, title: "Prioritization Frameworks (RICE)", description: "Score tasks using Reach, Impact, Confidence, and Effort.", resources: ["https://www.freecodecamp.org/news/what-is-rice-scoring-product-management-prioritization/"] },
      { week: 6, title: "Product Roadmap Tools", description: "Build milestones, define release phases.", resources: ["https://www.udemy.com/course/product-management-roadmaps/"] }
    ],
    resources: [
      { title: "Product Management Specialization", provider: "Coursera", url: "https://www.coursera.org/specializations/product-management", type: "Course", difficulty: "Intermediate", duration: "5 Months", skills: ["Product Management", "Agile"] },
      { title: "Product Requirements Guide", provider: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/product-requirements-document-prd/", type: "Documentation", difficulty: "Beginner", duration: "5 Hours", skills: ["PRD", "User Stories"] }
    ]
  },
  "Digital Marketing Specialist": {
    role: "Digital Marketing Specialist",
    category: "Marketing",
    difficulty: "Beginner",
    durationWeeks: 6,
    prerequisites: ["Basic social media literacy", "No coding required"],
    projects: [
      { title: "Google Ads Mock Campaign", description: "Build campaign budgets, write ad copy, set keyword targets." },
      { title: "Inbound SEO Content Plan", description: "Perform keyword research, design content calendar targets." }
    ],
    certifications: ["Google Digital Marketing & E-commerce Certificate (Coursera)"],
    milestones: [
      { week: 1, title: "Inbound Marketing Foundations", description: "Understand buyers, design conversion pathways.", resources: ["https://academy.hubspot.com/courses/inbound"] },
      { week: 2, title: "Search Engine Optimization (SEO)", description: "Perform keyword research, verify semantic tag targets.", resources: ["https://developer.mozilla.org/en-US/docs/Glossary/SEO"] },
      { week: 3, title: "Pay-Per-Click Advertising (PPC)", description: "Configure campaign dashboards, calculate click-through rates.", resources: ["https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce"] },
      { week: 4, title: "Email Campaign Automations", description: "Format message templates, analyze bounce indicators.", resources: ["https://academy.hubspot.com/courses/email-marketing"] },
      { week: 5, title: "Social Media Strategy", description: "Design engagement parameters, coordinate post schedules.", resources: ["https://www.udemy.com/course/digital-marketing-masterclass/"] },
      { week: 6, title: "Marketing Analytics (Google Analytics)", description: "Read conversion tracking stats, compile session logs.", resources: ["https://www.coursera.org/learn/digital-marketing-analytics"] }
    ],
    resources: [
      { title: "HubSpot Inbound Marketing Certification", provider: "HubSpot Academy", url: "https://academy.hubspot.com/courses/inbound", type: "Certification", difficulty: "Beginner", duration: "5 Hours", skills: ["Inbound", "SEO"] },
      { title: "Google Digital Marketing Certificate", provider: "Coursera", url: "https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce", type: "Certification", difficulty: "Beginner", duration: "6 Months", skills: ["PPC", "E-commerce"] }
    ]
  }
};
