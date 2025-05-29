# AWS CDK Learning Note

These are curated notes based on discussions and learnings about AWS CDK.

---

## 🔰 CDK Basics

- **CDK (Cloud Development Kit)** allows you to define AWS infrastructure using programming languages like TypeScript, Python, Java, etc.
- CDK synthesizes your code into a **CloudFormation template** using `cdk synth`.
- You then deploy it to AWS using `cdk deploy`.

---

## 🧱 Constructs vs Resources

- **Constructs**: Code-level building blocks in CDK. Used to define cloud components.
- **Resources**: The actual AWS infrastructure created when CloudFormation runs the CDK template.
- ✅ Use "constructs" when referring to code. Use "resources" when referring to real infrastructure.

---

## 🧰 CDK Construct Levels

- **L1 Constructs**: Low-level. Direct one-to-one mapping to CloudFormation resources. Prefixed with `Cfn*`.
- **L2 Constructs**: High-level. Easier, opinionated constructs (e.g., `s3.Bucket`, `lambda.Function`).
- **L3 Constructs (Patterns)**: Combinations of multiple L2 constructs to form reusable architectures.

---

## 📁 CDK Stacks and Apps

- A **CDK app** can have one or multiple **stacks**.
- Each stack gets its own **CloudFormation template**.
- Use `cdk synth` to inspect the templates.

---

## 🏗️ Stack Instantiation & Constructors

- When you define a CDK **Stack class**, resources are usually created inside the **constructor**.
    - This is because the constructor is where the scope (`this`) is passed and constructs are added to the stack tree.
    
    ```
    export class MyStack extends Stack {
      constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        const bucket = new s3.Bucket(this, 'MyBucket');
      }
    }
    
    ```
    
- This approach ensures resources are tightly scoped to the stack and available during synthesis.

---

## 🔁 Cross-Stack References

- You can **pass constructs or values from one stack to another**.
    - Example: Passing an SQS queue from `InfraStack` to `AppStack`.
    
    ```
    new AppStack(app, 'AppStack', {
      queue: infraStack.queue,
    });
    
    ```
    
- CDK automatically handles **export/import** using CloudFormation’s `!ImportValue`.
- ✅ This enables modular stack designs.
- ⚠️ Too many cross-stack references can cause coupling and hinder parallel deployments. Prefer nested stacks or shared constructs if needed.

---

## 🧪 CDK Synth vs Deploy

- **`cdk synth`**: Converts constructs into a CloudFormation template.
    - Outputs tokens/placeholders (`!Ref`, `!GetAtt`, etc.)
    - No real AWS resources are created yet.
- **`cdk deploy`**: Deploys the stack to AWS. Intrinsic functions are executed here.

---

## 🔁 Intrinsic Functions

- Used in CloudFormation templates (e.g., `!Ref`, `!Sub`, `!GetAtt`).
- Evaluated **at deploy time**, not during `cdk synth`.
- Example: `bucket.bucketName` becomes `!Ref Bucket1234` in the template.

---

## 📦 Logical ID, Physical ID, ARN

- **Logical ID**: Defined in the CloudFormation template. Unique within a stack.
    - e.g., `MyBucket1234A5B6`
- **Physical ID**: The actual name/id AWS assigns after deployment.
    - e.g., `mybucket-prod-9321abcd`
- **ARN**: Amazon Resource Name. Globally unique identifier.
    - e.g., `arn:aws:s3:::mybucket-prod-9321abcd`
- ⚠️ Don’t manually modify Logical IDs in templates unless you know what you're doing.

---

## 🧩 CDK Aspects

- **Aspects** allow you to apply logic across the entire construct tree.
- Use cases:
    - Tagging all resources
    - Validating policies or configs
    - Enforcing compliance rules
- Example:
    
    ```
    Aspects.of(this).add(new Tag('Environment', 'prod'));
    
    ```
    

---

## 🧾 Outputs

- Use `CfnOutput` to surface values like ARNs or URLs after deployment.
- Helpful for debugging or referencing values in other stacks.
    
    ```
    new cdk.CfnOutput(this, 'BucketNameOutput', {
      value: bucket.bucketName,
    });
    
    ```
    

---

## 🧠 Best Practices for Team Communication

- Use clear terms:
    - "Constructs" for CDK code
    - "Resources" for deployed AWS infra
- Example: “We’ll use L2 constructs to define an EventBridge rule and SQS target. Once deployed, these constructs will create the corresponding AWS resources.”

---

Let me know if you'd like to add diagrams, code examples, or expand this into a multi-page Notion guide!