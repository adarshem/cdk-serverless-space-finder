# Serverless App – Space Finder API

This project is a serverless application built with the AWS Cloud Development Kit (CDK). It uses AWS services such as Lambda, API Gateway, Cognito, and DynamoDB to build a fully managed, secure, and scalable backend.

---

## 🔧 What This App Does

* Provides RESTful APIs for managing spaces (GET/PUT endpoints)
* Uses **AWS Lambda** to run backend logic without managing servers
* Uses **API Gateway** to expose and secure the APIs
* Uses **Cognito** for user authentication (sign up, sign in)
* Uses **DynamoDB** as the backend database

---

## 🧠 Key Concepts

### ✅ What is a Lambda Function?

> A Lambda function is a small piece of code that runs in the cloud **only when needed** — no servers to manage, and you only pay when it runs.

**Use case:** When someone calls an API, Lambda runs code to handle the request.

### ✅ What is API Gateway?

> API Gateway is like a **front door** for your backend. It handles HTTP requests, routes them to Lambda (or other services), and handles security.

**Use case:** When someone accesses `/spaces`, API Gateway forwards the request to a Lambda function that talks to the database.

### ✅ What is Cognito?

> AWS Cognito handles **user authentication** (login/signup). It can generate **JWT tokens** that API Gateway uses to control access.

**Use case:** Protect API routes so only logged-in users can access them.

### ✅ What is DynamoDB?

> DynamoDB is a fast and scalable **NoSQL database**. It stores data in flexible JSON-like items.

**Use case:** Store space listings, user info, bookings, etc.

---

## 🚀 How It Works (Flow)

```text
Client (Web or Mobile)
   ↓
Cognito User Pool (Login)
   ↓ JWT
API Gateway (validates JWT)
   ↓
Lambda (business logic)
   ↓
DynamoDB (stores/fetches data)
```

---

## 📦 Project Structure

```bash
src/
├── infra/                 # CDK infrastructure stacks
│   ├── stacks/
│   │   └── AuthStack.ts   # Cognito user + identity pools
│   └── ...
├── services/             # Lambda function source code
└── app.ts                # CDK app entry point
```

---

## 📜 CDK Concepts Used

* `RestApi`, `Method`, `LambdaIntegration` from `aws-apigateway`
* `Function`, `NodejsFunction` from `aws-lambda`
* `UserPool`, `IdentityPool` from `aws-cognito`
* `Table` from `aws-dynamodb`

---

## 🛡️ Security

* Authenticated access enforced with **Cognito User Pools**
* Lambda roles scoped with least privilege (DynamoDB read/write, EventBridge, etc.)
* Identity Pool configured with authenticated and unauthenticated roles

---

## 🧪 Useful Commands

```bash
npm install           # install dependencies
cdk bootstrap         # one-time setup for your AWS account
cdk synth             # synthesize CloudFormation template
cdk deploy            # deploy to AWS
```

---
